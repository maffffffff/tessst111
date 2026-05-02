from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('experts/', views.experts, name='experts'),
    path('contact/', views.contact, name='contact'),
    path('register/', views.register, name='register'),
    path('login/', views.login_view, name='login'),
    path('expert-login/', views.expert_login_view, name='expert_login'),
    path('logout/', views.logout_view, name='logout'),
    path('request-help/', views.request_help, name='request_help'),
    path('expert/requests/', views.expert_dashboard, name='expert_dashboard'),
    path('admin/dashboard/', views.admin_dashboard, name='admin_dashboard'),
    path('admin/experts/', views.admin_experts, name='admin_experts'),
    path('admin/experts/add/', views.admin_expert_create, name='admin_expert_add'),
    path('admin/experts/<int:expert_id>/edit/', views.admin_expert_edit, name='admin_expert_edit'),
    path('admin/experts/<int:expert_id>/delete/', views.admin_expert_delete, name='admin_expert_delete'),
    path('admin/requests/', views.admin_help_requests, name='admin_help_requests'),
]