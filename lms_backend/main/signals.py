# signals.py

from django.db.models.signals import post_save, pre_save, post_delete
from django.dispatch import receiver
from django.db.models import F
from .models import Enrollment, ModuleProgress

# ======================= OPTION 1: Store previous status =======================
@receiver(pre_save, sender=Enrollment, dispatch_uid="store_previous_enrollment_status")
def store_previous_enrollment_status(sender, instance, **kwargs):
    if instance.pk:  # Only for existing instances
        try:
            old_instance = Enrollment.objects.get(pk=instance.pk)
            instance._previous_status = old_instance.status
        except Enrollment.DoesNotExist:
            instance._previous_status = None
    else:
        instance._previous_status = None

# ====================== OPTION 2: Auto update total_enrolled ======================
@receiver(post_save, sender=Enrollment, dispatch_uid="update_course_enrollment_count")
def update_course_enrollment_count(sender, instance, created, **kwargs):
    if created:
        if instance.status == instance.Status.APPROVED:
            instance.course.total_enrolled += 1
            instance.course.save(update_fields=['total_enrolled'])
    else:
        previous_status = getattr(instance, '_previous_status', None)
        current_status = instance.status

        if previous_status != instance.Status.APPROVED and current_status == instance.Status.APPROVED:
            instance.course.total_enrolled += 1
            instance.course.save(update_fields=['total_enrolled'])

        elif previous_status == instance.Status.APPROVED and current_status in [
            instance.Status.REJECTED,
            instance.Status.PENDING
        ]:
            instance.course.total_enrolled = max(0, instance.course.total_enrolled - 1)
            instance.course.save(update_fields=['total_enrolled'])

# ====================== OPTION 3: Delete ModuleProgress on unenroll ======================
@receiver(post_delete, sender=Enrollment, dispatch_uid="delete_module_progress_on_unenroll")
def delete_related_progress(sender, instance, **kwargs):
    ModuleProgress.objects.filter(
        user=instance.student,
        module__course=instance.course
    ).delete()