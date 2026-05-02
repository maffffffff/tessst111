from django.db import models
from django.contrib.auth.models import User

class Expert(models.Model):
    SPECIALTIES = [
        ('ethical_hacking', 'Этичный хакинг'),
        ('pentest', 'Пентест'),
        ('forensics', 'Цифровая криминалистика'),
        ('malware', 'Анализ вредоносного ПО'),
        ('network', 'Сетевая безопасность'),
        ('web_security', 'Веб-безопасность'),
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    specialty = models.CharField(max_length=50, choices=SPECIALTIES, blank=True, null=True)
    experience = models.IntegerField(verbose_name='Опыт работы (лет)', blank=True, null=True)
    bio = models.TextField(verbose_name='О себе', blank=True)
    photo = models.ImageField(upload_to='experts/', blank=True, null=True)
    rating = models.DecimalField(max_digits=3, decimal_places=1, default=5.0)
    is_available = models.BooleanField(default=True)
    
    def __str__(self):
        return f"{self.user.get_full_name()} - {self.get_specialty_display()}"

class HelpRequest(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Ожидает'),
        ('in_progress', 'В работе'),
        ('resolved', 'Решено'),
        ('closed', 'Закрыто'),
    ]
    
    URGENCY = [
        ('low', 'Низкая'),
        ('medium', 'Средняя'),
        ('high', 'Высокая'),
        ('critical', 'Критическая'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    expert = models.ForeignKey(Expert, on_delete=models.SET_NULL, null=True, blank=True)
    title = models.CharField(max_length=200)
    description = models.TextField()
    urgency = models.CharField(max_length=10, choices=URGENCY)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.title} - {self.get_status_display()}"

class Testimonial(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    expert = models.ForeignKey(Expert, on_delete=models.CASCADE)
    text = models.TextField()
    rating = models.IntegerField(choices=[(i, i) for i in range(1, 6)])
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Отзыв от {self.user.username}"