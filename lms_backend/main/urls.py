from django.urls import path
from .views import (
    ContactUsCreateView, EnrollCourseView, EnrollmentDeleteView, UserList, UserDetail, TeacherListView, 
    TeacherDetailView, UserProfileView, UserProfileUpdateView, TeacherCourseListView, 
    StudentEnrolledCoursesView, TeacherCourseListByIdView, CourseCategoryListView, 
    CourseCreateAPIView, CourseListView, CoursesByCategoryView, CourseDetailView, 
    LatestCoursesView, CourseUpdateAPIView, CourseDeleteAPIView, ChangePasswordView, 
    FreeCoursesView, PopularTeachersView, HeroImageView, EnrollmentStatusView, TestimonialViewSet, UpdateModuleProgressView, ModuleProgressListView, api_overview, ResetPasswordView, RelatedCoursesView, RecommendedCoursesView, initialize_payment, payment_success, payment_fail, payment_cancel
)

urlpatterns = [
    path('', api_overview, name='api-overview'),
    path('users/', UserList.as_view(), name='user-list'),
    path('users/<int:pk>/', UserDetail.as_view(), name='user-detail'),
    path('teachers/', TeacherListView.as_view(), name='teacher-list'),
    path('teachers/<int:pk>/', TeacherDetailView.as_view(), name='teacher-detail'),
    path("users/profile/", UserProfileView.as_view(), name="user-profile"),
    path("users/profile/update/", UserProfileUpdateView.as_view(), name="user-profile-update"),
    path('teachers/my-courses/', TeacherCourseListView.as_view(), name='teacher-my-courses'),
    path('students/my-courses/', StudentEnrolledCoursesView.as_view(), name='student-my-courses'),
    path('teachers/<int:pk>/courses/', TeacherCourseListByIdView.as_view(), name='teacher-courses-by-id'),
    path('categories/', CourseCategoryListView.as_view(), name='category-list'),
    path('courses/create/', CourseCreateAPIView.as_view(), name='course-create'),
    path('courses/', CourseListView.as_view(), name='course-list'),
    path('courses/category/<int:category_id>/', CoursesByCategoryView.as_view(), name='courses-by-category'),
    path('courses/<int:pk>/', CourseDetailView.as_view(), name='course-detail'),
    path('courses/latest/', LatestCoursesView.as_view(), name='latest-courses'),
    path('courses/<int:pk>/related/', RelatedCoursesView.as_view(), name='related-courses'),
    path("recommended-courses/", RecommendedCoursesView.as_view(), name="recommended-courses"),
    path('courses/<int:pk>/update/', CourseUpdateAPIView.as_view(), name='course-update'),
    path('courses/<int:pk>/delete/', CourseDeleteAPIView.as_view(), name='course-delete'),
    path('users/change-password/', ChangePasswordView.as_view(), name='change-password'),
    path('courses/free/', FreeCoursesView.as_view(), name='free-courses'),
    path('teachers/popular/', PopularTeachersView.as_view(), name='popular-teachers'),
    path('contact/', ContactUsCreateView.as_view(), name='contact-us'),
    path('hero-image/', HeroImageView.as_view(), name='hero-image'),
    path('enroll/', EnrollCourseView.as_view(), name='enroll-course'),
    path('enroll-status/<int:course_id>/', EnrollmentStatusView.as_view(), name='enroll-status'),
    path('enrollments/<int:pk>/delete/', EnrollmentDeleteView.as_view(), name='enrollment-delete'),
    path('testimonials/', TestimonialViewSet.as_view(), name='testimonial-list'),
    
    path('module-progress/', ModuleProgressListView.as_view(), name='module-progress-list'),
    path('module-progress/<int:module_id>/', UpdateModuleProgressView.as_view(), name='module-progress-update'),
    
    path('api/reset-password/', ResetPasswordView.as_view(), name='reset-password'),
    path('payment/init/', initialize_payment, name='initialize-payment'),
    path('payment/success/', payment_success),
    path('payment/fail/', payment_fail),
    path('payment/cancel/', payment_cancel),
    
    
]