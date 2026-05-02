from django.contrib import admin
from .models import Expert, HelpRequest, Testimonial

@admin.register(Expert)
class ExpertAdmin(admin.ModelAdmin):
    list_display = ['user', 'specialty', 'experience', 'rating', 'is_available']
    list_filter = ['specialty', 'is_available']
    search_fields = ['user__username', 'user__first_name', 'user__last_name']

@admin.register(HelpRequest)
class HelpRequestAdmin(admin.ModelAdmin):
    list_display = ['title', 'user', 'expert', 'urgency', 'status', 'created_at']
    list_filter = ['status', 'urgency']
    search_fields = ['title', 'description']

@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    list_display = ['user', 'expert', 'rating', 'created_at']