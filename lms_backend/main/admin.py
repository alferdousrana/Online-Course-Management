from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from . import models
from django.utils.html import mark_safe
import datetime
from django.db.models import Sum, Count
from django.contrib import messages


# Registering the models in the admin site
admin.site.site_header = "Learn with Rana Admin"
admin.site.site_title = "Learn with Rana Admin Portal"
admin.site.index_title = "Welcome to the Learn with Rana Admin Portal"


class ModuleInline(admin.TabularInline):  # or use admin.StackedInline for detailed view
    model = models.Module
    extra = 1 

class CourseCategoryAdmin(admin.ModelAdmin):
    list_display = ('title', 'description')
    search_fields = ('title',)
    list_filter = ('title',)

admin.site.register(models.CourseCategory, CourseCategoryAdmin)

class CourseAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'teacher','total_enrolled', 'price', 'total_modules',  'duration')
    search_fields = ('title', 'category__title', 'teacher__username')
    list_filter = ('category', 'teacher')
    inlines = [ModuleInline]
    
    def total_modules(self, obj):
        return obj.modules.count()
    total_modules.short_description = 'Modules Count'
    
admin.site.register(models.Course, CourseAdmin)

class ModuleAdmin(admin.ModelAdmin):
    list_display = ('course', 'title', 'duration', 'created_at')
    search_fields = ('title', 'course__title')
    list_filter = ('course',)
admin.site.register(models.Module, ModuleAdmin)

class CustomUserAdmin(UserAdmin):
    # Add your custom fields to the admin display
    model = models.CustomUser
    list_display = ('full_name','username', 'email', 'role', 'mobile_no', 'is_active' )
    
     # Filter by role (STUDENT, TEACHER, ADMIN)
    list_filter = ('role', 'is_active', 'is_staff')
    
    # Add custom fields to the fieldsets for editing in the admin
    fieldsets = UserAdmin.fieldsets + (
            ('Custom Info', {'fields': ('role', 'qualification', 'mobile_no', 'address', 'skills', 'interested_categories', 'bio', 'image_url')}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
            ('Custom Info', {'fields': ('role', 'qualification', 'mobile_no', 'address', 'skills', 'interested_categories', 'bio', 'image_url')}),
    )
    
admin.site.register(models.CustomUser, CustomUserAdmin)


class EnrollmentAdmin(admin.ModelAdmin):
    list_display = ('course', 'teacher_name', 'student', 'transaction_number', 'status', 'enrolled_on', 'course_price')  # Added teacher_name
    list_filter = ('status', 'course', 'course__teacher')  # Added course__teacher to filter by teacher
    search_fields = ('student__username', 'course__title', 'transaction_number', 'course__teacher__username')  # Added teacher search
    actions = ['approve_enrollments', 'reject_enrollments', 'generate_teacher_sales_report']  # Added sales report action

    # Custom method to display teacher name
    def teacher_name(self, obj):
        return obj.course.teacher.full_name if obj.course.teacher else "No Teacher"
    teacher_name.short_description = "Teacher"
    teacher_name.admin_order_field = 'course__teacher__username'  # Enable sorting by teacher

    # Custom method to display course price
    def course_price(self, obj):
        return f"{obj.course.price:.2f} Tk" if obj.course.price else "Free"
    course_price.short_description = "Course Price"
    course_price.admin_order_field = 'course__price'  # Enable sorting by price

    def approve_enrollments(self, request, queryset):
        updated = queryset.update(status='APPROVED')
        self.message_user(request, f"{updated} enrollment(s) approved.")

    def reject_enrollments(self, request, queryset):
        updated = queryset.update(status='REJECTED')
        self.message_user(request, f"{updated} enrollment(s) rejected.")

    # Custom action to generate teacher sales report
    def generate_teacher_sales_report(self, request, queryset):
        # Get unique teachers from selected enrollments
        teachers = models.CustomUser.objects.filter(
            id__in=queryset.values_list('course__teacher__id', flat=True).distinct()
        )
        
        for teacher in teachers:
            # Filter enrollments for this teacher with status APPROVED
            teacher_enrollments = queryset.filter(
                course__teacher=teacher, status='APPROVED'
            )
            # Aggregate total enrollments and total sales
            stats = teacher_enrollments.aggregate(
                total_enrollments=Count('id'),
                total_sales=Sum('course__price')
            )
            total_enrollments = stats['total_enrollments'] or 0
            total_sales = stats['total_sales'] or 0.00
            # Display message for each teacher
            self.message_user(
                request,
                f"Teacher {teacher.full_name}: {total_enrollments} course(s) sold, Total Sales: {total_sales:.2f} Tk",
                level=messages.INFO
            )
    generate_teacher_sales_report.short_description = "Generate Teacher Sales Report"

    approve_enrollments.short_description = "Approve selected enrollments"
    reject_enrollments.short_description = "Reject selected enrollments"

admin.site.register(models.Enrollment, EnrollmentAdmin)

class ContactUsAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'created_at')
    search_fields = ('name', 'email')
    list_filter = ('created_at',)

admin.site.register(models.ContactUs, ContactUsAdmin)

class HeroImageAdmin(admin.ModelAdmin):
    list_display = ('image_preview', 'title', 'image_url', 'created_at')  # Added image_preview
    search_fields = ('title', 'image_url')
    list_filter = ('created_at',)

    # Custom method to display image preview
    def image_preview(self, obj):
        if obj.image_url:
            return mark_safe(
                f'<img src="{obj.image_url}" alt="{obj.title}" style="width: 250px; height: 80px; object-fit: cover;" />'
            )
        return "No Image"
    
    image_preview.short_description = 'Image Preview'  # Column header in admin panel

admin.site.register(models.HeroImage, HeroImageAdmin)

class TestimonialAdmin(admin.ModelAdmin):
    list_display = ('author', 'quote', 'source_title', 'created_at')
    search_fields = ('author', 'quote')
    
admin.site.register(models.Testimonial, TestimonialAdmin)


@admin.register(models.ModuleProgress)
class ModuleProgressAdmin(admin.ModelAdmin):
    # 1. Replace 'watched_duration' with the name of your new method
    list_display = ('user', 'formatted_watched_time', 'completed', 'module', 'updated_at')
    
    list_filter = ('completed', 'updated_at')
    search_fields = ('user__username', 'module__title')

    # 2. Define the custom method
    @admin.display(description='Watched Time') # This sets the column header text
    def formatted_watched_time(self, obj):
        """
        Takes the 'watched_duration' in seconds and converts it to a 
        human-readable HH:MM:SS format.
        """
        # The 'obj' is the ModuleProgress instance for the current row.
        seconds = obj.watched_duration
        
        # Use timedelta for a clean and robust conversion
        return str(datetime.timedelta(seconds=seconds))
