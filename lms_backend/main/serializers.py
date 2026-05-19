from rest_framework import serializers
from .models import CourseCategory, Course, CustomUser, Enrollment, ContactUs, HeroImage, Module, ModuleProgress, Testimonial

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = '__all__'
        extra_kwargs = {
            'password': {'write_only': True},
        }

    def create(self, validated_data):
        user = CustomUser.objects.create_user(**validated_data)
        return user

class CourseCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseCategory
        fields = '__all__'


class ModuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Module
        fields = ['id', 'title', 'duration', 'video_url', 'created_at', 'updated_at']

# UPDATED COURSE SERIALIZER WITH NESTED DATA
class CourseSerializer(serializers.ModelSerializer):
    # Extra read-only fields for display purposes
    category_name = serializers.CharField(source='category.title', read_only=True)
    teacher_name = serializers.CharField(source='teacher.get_full_name', read_only=True)
    teacher_username = serializers.CharField(source='teacher.username', read_only=True)

    # Nested modules for both create and display
    modules = ModuleSerializer(many=True)

    class Meta:
        model = Course
        fields = [
            'id', 'title', 'description', 'category', 'teacher',
            'category_name', 'teacher_name', 'teacher_username',
            'price', 'duration', 'rating', 'total_enrolled', 'image_url', 'intro_url',
            'modules', 'created_at', 'updated_at'
        ]

    def create(self, validated_data):
        # Extract modules from validated data
        modules_data = validated_data.pop('modules', [])
        # Create course instance
        course = Course.objects.create(**validated_data)
        # Create modules linked to the course
        for module_data in modules_data:
            Module.objects.create(course=course, **module_data)
        return course

    def update(self, instance, validated_data):
        # Extract modules from validated data
        modules_data = validated_data.pop('modules', [])

        # Update course fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Clear old modules and recreate them (you can customize this logic)
        instance.modules.all().delete()
        for module_data in modules_data:
            Module.objects.create(course=instance, **module_data)

        return instance


class TeacherSerializer(serializers.ModelSerializer):
    full_name = serializers.ReadOnlyField()
    total_courses = serializers.SerializerMethodField()
    total_students = serializers.SerializerMethodField()

    class Meta:
        model = CustomUser
        fields = '__all__'
        
    def get_total_courses(self, obj):
        return obj.courses_taught.count()
    
    def get_total_students(self, obj):
        return Enrollment.objects.filter(
            course__teacher=obj, 
            status=Enrollment.Status.APPROVED
        ).count()

class EnrollmentCreateSerializer(serializers.Serializer):
    course_id = serializers.IntegerField()
    transaction_number = serializers.CharField(
        max_length=100,
        required=False,
        allow_blank=True
    )

    def validate(self, data):
        course_id = data.get('course_id')
        transaction_number = data.get('transaction_number')
        
        try:
            course = Course.objects.get(id=course_id)
            # Treat price == 0.00 as free course
            is_free = course.price == 0
            if not is_free and not transaction_number:
                raise serializers.ValidationError(
                    "Transaction number is required for paid courses."
                )
        except Course.DoesNotExist:
            raise serializers.ValidationError("Invalid course ID.")
        
        return data

    def create(self, validated_data):
        # Return validated data for view to handle creation
        return validated_data

class EnrollmentSerializer(serializers.ModelSerializer):
    course = CourseSerializer()

    class Meta:
        model = Enrollment
        fields = ['id', 'course', 'status', 'enrolled_on']
        
        
        
        
class ContactUsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactUs
        fields = ['id', 'name', 'email', 'message', 'created_at']
        read_only_fields = ['created_at']
        
class HeroImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = HeroImage
        fields = '__all__'
        
class TestimonialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Testimonial
        fields = ['id', 'quote', 'author', 'source_title']
        
        
class ModuleProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = ModuleProgress
        fields = ['id', 'user', 'module', 'watched_duration', 'completed', 'updated_at']
        read_only_fields = ['user', 'updated_at']