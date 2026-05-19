from django.shortcuts import render, redirect
import requests
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.authentication import TokenAuthentication
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics, permissions
from .models import CustomUser, Course, Enrollment, CourseCategory, ContactUs, HeroImage, Testimonial, Module, ModuleProgress
from .serializers import CustomUserSerializer, EnrollmentCreateSerializer, TeacherSerializer, CourseSerializer, EnrollmentSerializer, CourseCategorySerializer, ContactUsSerializer, HeroImageSerializer, TestimonialSerializer, ModuleProgressSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import ListAPIView
from django.shortcuts import get_object_or_404
from rest_framework.exceptions import PermissionDenied
from django.db.models import Count, Q
import logging
from django.db.models import Sum
from django.utils.timezone import now
from datetime import datetime

logger = logging.getLogger(__name__)


def api_overview(request):
    # সব পরিসংখ্যান
    total_users = CustomUser.objects.count()
    total_teachers = CustomUser.objects.filter(role=CustomUser.Role.TEACHER).count()
    total_students = CustomUser.objects.filter(role=CustomUser.Role.STUDENT).count()
    total_pending_enrollments = Enrollment.objects.filter(status=Enrollment.Status.PENDING).count()
    total_approved_enrollments = Enrollment.objects.filter(status=Enrollment.Status.APPROVED).count()
    total_courses = Course.objects.count()
    total_course_categories = CourseCategory.objects.count()
    total_modules = Module.objects.count()

    # ✅ Total Turnover (approved + paid enrollments only)
    total_turnover = Course.objects.filter(
        enrollment_set__status=Enrollment.Status.APPROVED,
        price__gt=0
    ).aggregate(total=Sum('price'))['total'] or 0

    # ✅ Current Month Turnover
    today = now().date()
    first_day = today.replace(day=1)

    current_month_turnover = Course.objects.filter(
        enrollment_set__status=Enrollment.Status.APPROVED,
        enrollment_set__created_at__date__gte=first_day,
        price__gt=0
    ).aggregate(total=Sum('price'))['total'] or 0

    context = {
        'total_users': total_users,
        'total_teachers': total_teachers,
        'total_students': total_students,
        'total_pending_enrollments': total_pending_enrollments,
        'total_approved_enrollments': total_approved_enrollments,
        'total_courses': total_courses,
        'total_course_categories': total_course_categories,
        'total_modules': total_modules,

        # ✅ নতুন context ডেটা
        'total_turnover': total_turnover,
        'current_month_turnover': current_month_turnover,
    }

    return render(request, 'api_overview.html', context)


class UserList(generics.ListCreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes = [permissions.AllowAny]

class UserDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes = [permissions.IsAuthenticated]
    
class TeacherListView(generics.ListAPIView):
    queryset = CustomUser.objects.filter(role=CustomUser.Role.TEACHER)
    serializer_class = TeacherSerializer
    permission_classes = [permissions.AllowAny]

class TeacherDetailView(generics.RetrieveAPIView):
    queryset = CustomUser.objects.filter(role=CustomUser.Role.TEACHER)
    serializer_class = TeacherSerializer
    permission_classes = [permissions.AllowAny]
    
class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        print("Request User:", request.user)
        serializer = CustomUserSerializer(request.user)
        return Response(serializer.data)
    
class UserProfileUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        user = request.user
        serializer = CustomUserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
    
    
class TeacherCourseListView(generics.ListAPIView):
    serializer_class = CourseSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == CustomUser.Role.TEACHER:
            return Course.objects.filter(teacher=user)
        return Course.objects.none()
    
class StudentEnrolledCoursesView(generics.ListAPIView):
    serializer_class = EnrollmentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == CustomUser.Role.STUDENT:
            return Enrollment.objects.filter(student=user).select_related('course')
        return Enrollment.objects.none()

    
class TeacherCourseListByIdView(generics.ListAPIView):
    serializer_class = CourseSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        teacher_id = self.kwargs['pk']
        return Course.objects.filter(teacher__id=teacher_id)
    
    
class CourseCategoryListView(generics.ListAPIView):
    queryset = CourseCategory.objects.all()
    serializer_class = CourseCategorySerializer
    permission_classes = [permissions.AllowAny]
    
class CourseCreateAPIView(generics.CreateAPIView):
    serializer_class = CourseSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        if not serializer.validated_data.get('teacher'):
            serializer.save(teacher=self.request.user)
        else:
            serializer.save()
            
            
# NEW VIEWS ADDED FOR COURSE LISTING
class CourseListView(generics.ListAPIView):
    """
    View to list all courses
    URL: /api/courses/
    """
    queryset = Course.objects.all().select_related('category', 'teacher').order_by('-created_at')
    serializer_class = CourseSerializer
    permission_classes = [permissions.AllowAny]

class CoursesByCategoryView(generics.ListAPIView):
    """
    View to list courses by specific category
    URL: /api/courses/category/<category_id>/
    """
    serializer_class = CourseSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        category_id = self.kwargs['category_id']
        return Course.objects.filter(category__id=category_id).select_related('category', 'teacher')
 
 
    
class CourseDetailView(generics.RetrieveAPIView):
    """
    View to retrieve a single course detail
    URL: /api/courses/<int:pk>/
    """
    queryset = Course.objects.all().select_related('teacher', 'category')
    serializer_class = CourseSerializer
    permission_classes = [permissions.AllowAny]
    
    
class LatestCoursesView(ListAPIView):
    serializer_class = CourseSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return Course.objects.order_by('-created_at')[:8]
    
    
class RelatedCoursesView(ListAPIView):
    serializer_class = CourseSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        course_id = self.kwargs.get('pk')
        try:
            course = Course.objects.get(pk=course_id)
        except Course.DoesNotExist:
            return Course.objects.none()
        return Course.objects.filter(category=course.category).exclude(id=course.id)[:8]
    
class RecommendedCoursesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        if user.role != "STUDENT" or not user.interested_categories:
            return Response([])

        interests = [kw.strip() for kw in user.interested_categories.split(",") if kw.strip()]
        if not interests:
            return Response([])

        q_objects = Q()
        for keyword in interests:
            q_objects |= Q(title__icontains=keyword)

        recommended_courses = Course.objects.filter(q_objects).exclude(
            enrollment_set__student=user
        ).distinct()

        serializer = CourseSerializer(recommended_courses, many=True)
        return Response(serializer.data)
    
    
    
class CourseUpdateAPIView(generics.UpdateAPIView):
    """Course update করতে"""
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        obj = get_object_or_404(Course, pk=self.kwargs['pk'])
        # শুধু course এর teacher update করতে পারবে
        if obj.teacher != self.request.user:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("You can only update your own courses.")
        return obj
    
class CourseDeleteAPIView(generics.DestroyAPIView):
    queryset = Course.objects.all()
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        obj = get_object_or_404(Course, pk=self.kwargs["pk"])
        if obj.teacher != self.request.user:
            raise PermissionDenied("You can only delete your own courses.")
        return obj
    
    
class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        user = request.user
        current_password = request.data.get("currentPassword")
        new_password = request.data.get("newPassword")

        if not user.check_password(current_password):
            return Response({"error": "Current password is incorrect."}, status=status.HTTP_400_BAD_REQUEST)

        if len(new_password) < 6:
            return Response({"error": "New password must be at least 6 characters long."}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save()
        return Response({"message": "Password changed successfully."}, status=status.HTTP_200_OK)


class FreeCoursesView(generics.ListAPIView):
    """
    View to list all free courses (price = 0)
    URL: /api/courses/free/
    """
    serializer_class = CourseSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return Course.objects.filter(price=0).select_related('category', 'teacher')
    
class PopularTeachersView(generics.ListAPIView):
    """
    View to list top 5 popular teachers (by number of courses)
    URL: /api/teachers/popular/
    """
    serializer_class = TeacherSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return CustomUser.objects.filter(role=CustomUser.Role.TEACHER)\
            .annotate(course_count=Count('courses_taught'))\
            .order_by('-course_count')[:4]
            
class ContactUsCreateView(generics.CreateAPIView):
    queryset = ContactUs.objects.all()
    serializer_class = ContactUsSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    
class HeroImageView(generics.ListAPIView):
    """
    View to list all hero images
    URL: /api/hero-images/
    """
    queryset = HeroImage.objects.all()
    serializer_class = HeroImageSerializer
    permission_classes = [permissions.AllowAny]
    
class EnrollCourseView(generics.CreateAPIView):
    serializer_class = EnrollmentCreateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        # Restrict to students only
        if request.user.role != CustomUser.Role.STUDENT:
            return Response(
                {"detail": "Only students can enroll in courses."},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user = request.user
        course_id = serializer.validated_data['course_id']
        transaction_number = serializer.validated_data.get('transaction_number', '')

        course = get_object_or_404(Course, id=course_id)

        # Check for duplicate enrollment
        if Enrollment.objects.filter(student=user, course=course).exists():
            return Response(
                {"detail": "You are already enrolled or have applied for this course."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # Free course (price == 0)
            if course.price == 0:
                enrollment = Enrollment.objects.create(
                    student=user,
                    course=course,
                    transaction_number="FREE",
                    status=Enrollment.Status.APPROVED
                )
                return Response(
                    {"detail": "Successfully enrolled in free course."},
                    status=status.HTTP_201_CREATED
                )

            # Paid course
            enrollment = Enrollment.objects.create(
                student=user,
                course=course,
                transaction_number=transaction_number,
                status=Enrollment.Status.PENDING
            )
            return Response(
                {"detail": "Enrollment request submitted. Awaiting approval."},
                status=status.HTTP_201_CREATED
            )
        except Exception as e:
            # Log the error for debugging
            print(f"Enrollment error: {str(e)}")
            return Response(
                {"detail": "An error occurred during enrollment. Please try again."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
            
            
            
class CourseDeleteAPIView(generics.DestroyAPIView):
    queryset = Course.objects.all()
    permission_classes = [IsAuthenticated]

    def get_object(self):
        obj = get_object_or_404(Course, pk=self.kwargs["pk"])
        if obj.teacher != self.request.user:
            raise PermissionDenied("You can only delete your own courses.")
        return obj
    
class EnrollmentStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, course_id):
        user = request.user
        if user.role != CustomUser.Role.STUDENT:
            return Response({"status": None}, status=200)
        
        try:
            enrollment = Enrollment.objects.get(student=user, course_id=course_id)
            return Response({"status": enrollment.status}, status=200)
        except Enrollment.DoesNotExist:
            return Response({"status": None}, status=200)
        
class EnrollmentDeleteView(generics.DestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]
    queryset = Enrollment.objects.all()

    def get_object(self):
        enrollment_id = self.kwargs["pk"]
        enrollment = get_object_or_404(Enrollment, id=enrollment_id)
        # Only the student who owns the enrollment can delete it
        if enrollment.student != self.request.user or self.request.user.role != CustomUser.Role.STUDENT:
            raise PermissionDenied("You are not authorized to delete this enrollment.")
        return enrollment

    def destroy(self, request, *args, **kwargs):
        enrollment = self.get_object()
        self.perform_destroy(enrollment)
        return Response({"detail": "Enrollment deleted successfully."}, status=status.HTTP_200_OK)
    
    
class TestimonialViewSet(generics.ListAPIView):
    queryset = Testimonial.objects.all()
    serializer_class = TestimonialSerializer
    permission_classes = [permissions.AllowAny]
    
# Set up logging
logger = logging.getLogger(__name__)

class ModuleProgressListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if request.user.role != 'STUDENT':
            return Response({'error': 'Only students can view module progress.'}, status=status.HTTP_403_FORBIDDEN)

        progress = ModuleProgress.objects.filter(user=request.user)
        serializer = ModuleProgressSerializer(progress, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class UpdateModuleProgressView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, module_id):
        if request.user.role != 'STUDENT':
            return Response({'error': 'Only students can update module progress.'}, status=status.HTTP_403_FORBIDDEN)

        try:
            module = Module.objects.get(id=module_id)
        except Module.DoesNotExist:
            logger.error(f"Module with id {module_id} not found")
            return Response({'error': 'Module not found.'}, status=status.HTTP_404_NOT_FOUND)

        # Get the new chunk of time from the frontend
        watched_chunk = int(request.data.get('watched_duration', 0))
        logger.info(f"Received request for module {module_id} with watched_chunk: {watched_chunk}")
        
        # Get or create the progress object for this user and module
        progress, created = ModuleProgress.objects.get_or_create(user=request.user, module=module)

        # --- MARKER: THIS IS THE CORRECTED LOGIC ---
        # Add the new chunk of time to the existing total duration
        progress.watched_duration += watched_chunk

        # Now, check if the *new total* meets the completion threshold (60 seconds)
        # We also check 'not progress.completed' to avoid re-running this if it's already done
        if not progress.completed and progress.watched_duration >= 60:
            progress.completed = True
        # --- END OF CORRECTED LOGIC ---

        try:
            progress.save()
            logger.info(f"Progress saved: watched_duration={progress.watched_duration}, completed={progress.completed}")
        except Exception as e:
            logger.error(f"Failed to save progress: {str(e)}")
            return Response({'error': 'Failed to save progress.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Your response format is good. No changes needed here.
        return Response({
            'message': 'Progress updated successfully.',
            'completed': progress.completed,
            'watched_duration': progress.watched_duration
        }, status=status.HTTP_200_OK)
        
        
class ResetPasswordView(APIView):
    permission_classes = [permissions.AllowAny]
    def post(self, request):
        username = request.data.get('username')
        email = request.data.get('email')
        new_password = request.data.get('new_password')

        # Check if username and email are provided
        if not username or not email or not new_password:
            return Response(
                {"error": "Username, email, and new password are required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # Check if user exists with given username and email
            user = CustomUser.objects.get(username=username, email=email)
        except CustomUser.DoesNotExist:
            return Response(
                {"error": "Invalid username or email."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Update user's password
        user.set_password(new_password)
        user.save()

        return Response(
            {"message": "Password reset successful. Please login with your new password."},
            status=status.HTTP_200_OK
        )



@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def initialize_payment(request):
    print("Payment init request data:", request.data)
    user = request.user
    course_id = request.data.get('course_id')
    course_title = request.data.get('course_title')
    amount = request.data.get('amount')

    if not course_id or not course_title or not amount:
        return Response({"error": "Missing required fields."}, status=400)

    post_data = {
        "store_id": settings.SSLCOMMERZ_STORE_ID,
        "store_passwd": settings.SSLCOMMERZ_STORE_PASSWORD,
        "total_amount": amount,
        "currency": "BDT",
        "tran_id" : f"{user.id},{course_id},LMS2025", # Example: "530,30,LMS2025"
        "success_url": "http://127.0.0.1:8000/api/payment/success/",
        "fail_url": "http://127.0.0.1:8000/api/payment/fail/",
        "cancel_url": "http://127.0.0.1:8000/api/payment/cancel/",

        # ✅ Customer Information (All required)
        "cus_name": user.full_name,
        "cus_email": user.email,
        "cus_add1": "Dhaka",
        "cus_add2": "Bangladesh",
        "cus_city": "Dhaka",
        "cus_state": "Dhaka",
        "cus_postcode": "1207",
        "cus_country": "Bangladesh",
        "cus_phone": user.mobile_no,
        "cus_fax": "",

        # ✅ Product Info
        "product_name": course_title,
        "product_category": "Online Course",
        "product_profile": "general",

        # ✅ Optional (but recommended for digital goods)
        "shipping_method": "NO",
        "num_of_item": 1,
    }


    url = "https://sandbox.sslcommerz.com/gwprocess/v4/api.php" if settings.SSLCOMMERZ_SANDBOX else "https://securepay.sslcommerz.com/gwprocess/v4/api.php"

    response = requests.post(url, data=post_data)

    try:
        data = response.json()
    except ValueError:
        # print("SSLCommerz returned non-JSON:", response.text)
        return Response({"error": "Invalid response from payment gateway."}, status=400)

    # print("SSLCommerz response data:", data)

    if data.get('status') == 'SUCCESS':
        return Response({"payment_url": data['GatewayPageURL']})
    else:
        return Response({"error": "Payment initialization failed", "details": data}, status=400)


@csrf_exempt
@api_view(['POST'])
@permission_classes([])
@authentication_classes([])
def payment_success(request):
    # print("Payment Success Received:", request.data)

    tran_id = request.data.get('tran_id')  # উদাহরণ: "530LMS2024"

    # tran_id থেকে user_id + course_id আলাদা করি
    try:
        parts = tran_id.split(",")
        user_id = int(parts[0])
        course_id = int(parts[1])
    except (IndexError, ValueError):
        # print("❌ tran_id থেকে ID বের করতে সমস্যা হয়েছে")
        return Response({"error": "Invalid tran_id format"}, status=400)

    user = CustomUser.objects.filter(id=user_id).first()
    course = Course.objects.filter(id=course_id).first()

    if user and course:
        already_enrolled = Enrollment.objects.filter(student=user, course=course).exists()
        if not already_enrolled:
            Enrollment.objects.create(
                student=user,
                course=course,
                transaction_number=tran_id,
                status=Enrollment.Status.APPROVED  # পেমেন্ট হয়ে গেছে, তাই APPROVED করলাম
            )
            print(f"✅ {user} enrolled to {course.title}")
        else:
            print("ℹ️ Already enrolled")
    else:
        print("⚠️ User বা Course পাওয়া যায়নি।")

    # ✅ Updated payment_success view
    return redirect(f"http://localhost:3000/dashboard/courses/?enrolled={'1' if not already_enrolled else '0'}")



@csrf_exempt
@api_view(['POST'])
def payment_fail(request):
    return redirect('http://localhost:3000/payment/fail')


@csrf_exempt
@api_view(['POST'])
def payment_cancel(request):
    return redirect('http://localhost:3000/payment/cancel')

