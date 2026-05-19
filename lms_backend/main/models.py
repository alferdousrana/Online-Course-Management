from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings

        
class CustomUser(AbstractUser):

    # Define roles using a class for better readability and to avoid magic strings
    class Role(models.TextChoices):
        STUDENT = 'STUDENT', 'Student'
        TEACHER = 'TEACHER', 'Teacher'
        ADMIN = 'ADMIN', 'Admin'
    
    qualification = models.CharField(max_length=200, blank=True)
    mobile_no = models.CharField(max_length=20, blank=True)
    address = models.TextField(blank=True)
    
    role = models.CharField(max_length=50, choices=Role.choices, default=Role.STUDENT)
    
    interested_categories = models.TextField(
        blank=True, 
        help_text="For students: comma-separated list of interests. For teachers: subjects taught."
    )

    skills = models.TextField(blank=True, help_text="Comma-separated list of skills.")
    bio = models.TextField(blank=True)
    image_url = models.TextField(blank=True, null=True, help_text="URL of the user's facebook profile image")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"

    def __str__(self):
        return self.username
    class Meta:
        verbose_name_plural = "1.Users"

   
# Course Category Model
class CourseCategory(models.Model):
    title = models.CharField(max_length=150)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    def __str__(self):
        return self.title
    
    class Meta:
        verbose_name_plural = "2.Course Categories"
    
    
    # Course Model
class Course(models.Model):
    category = models.ForeignKey(CourseCategory, on_delete=models.CASCADE)
    teacher = models.ForeignKey(
        CustomUser, on_delete=models.CASCADE, related_name='courses_taught', limit_choices_to={'role': CustomUser.Role.TEACHER})
    title = models.CharField(max_length=150)
    description = models.TextField()
    duration = models.CharField(max_length=100, blank=True, null=True)
    total_enrolled = models.PositiveIntegerField(default=0)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    rating = models.FloatField(default=0.0)
    image_url = models.TextField(blank=True, null=True)
    intro_url = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name_plural = "3.Course" 
        
    def __str__(self):
        return self.title
     
    
    
class Module(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="modules")
    title = models.CharField(max_length=150)
    duration = models.CharField(max_length=100)
    video_url = models.URLField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} ({self.course.title})"

    class Meta:
        verbose_name_plural = "4.Modules"
        
        
class Enrollment(models.Model):
    class Status(models.TextChoices):
        PENDING = 'PENDING', 'Pending'
        APPROVED = 'APPROVED', 'Approved'
        REJECTED = 'REJECTED', 'Rejected'

    student = models.ForeignKey(
        CustomUser,
        on_delete=models.CASCADE,
        limit_choices_to={'role': CustomUser.Role.STUDENT}
    )
    course = models.ForeignKey(Course, related_name='enrollment_set', on_delete=models.CASCADE)
    transaction_number = models.CharField(max_length=100, blank=True, default='')  # Allow blank
    status = models.CharField(
        max_length=10,
        choices=Status.choices,
        default=Status.PENDING
    )
    enrolled_on = models.DateTimeField(auto_now_add=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('student', 'course')
        verbose_name_plural = "5.Enrollments"

    def __str__(self):
        return f"{self.student.username} - {self.course.title} ({self.status})"
    
            
class ContactUs(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Contact from {self.name} ({self.email})"
    
    class Meta:
        verbose_name_plural = "6.Contact Us"
        
class HeroImage(models.Model):
    title = models.CharField(max_length=100)
    image_url = models.TextField(help_text="Image size should be 1920x500 upload anywhere on the internet then share the link here.")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.title
    
    class Meta:
        verbose_name_plural = "7.Hero Images"
        
# Testimonial model to store student testimonials
class Testimonial(models.Model):
    quote = models.TextField()
    author = models.CharField(max_length=100)
    source_title = models.CharField(max_length=100, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.author} - {self.quote[:50]}"
    
    class Meta:
        verbose_name_plural = "8.Testimonials"
        
class ModuleProgress(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    module = models.ForeignKey(Module, on_delete=models.CASCADE, related_name='progresses')
    watched_duration = models.PositiveIntegerField(default=0)  # in seconds
    completed = models.BooleanField(default=False)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('user', 'module')
        verbose_name_plural = "9. Module Progress"

    def __str__(self):
        return f"{self.user.username} - {self.module.title} - {'Completed' if self.completed else 'Incomplete'}"
    