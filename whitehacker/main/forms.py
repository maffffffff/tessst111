from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from .models import Expert, HelpRequest

class RegisterForm(UserCreationForm):
    email = forms.EmailField(required=True)
    first_name = forms.CharField(max_length=30)
    last_name = forms.CharField(max_length=30)
    is_expert = forms.BooleanField(required=False, label='Я эксперт / помощник')
    specialty = forms.ChoiceField(choices=Expert.SPECIALTIES, required=False)
    experience = forms.IntegerField(required=False, min_value=0, label='Опыт работы (лет)')
    bio = forms.CharField(widget=forms.Textarea(attrs={'rows': 4}), required=False, label='О себе')

    class Meta:
        model = User
        fields = ['username', 'first_name', 'last_name', 'email', 'password1', 'password2', 'is_expert', 'specialty', 'experience', 'bio']

class HelpRequestForm(forms.ModelForm):
    class Meta:
        model = HelpRequest
        fields = ['title', 'description', 'urgency', 'expert']
        widgets = {
            'description': forms.Textarea(attrs={'rows': 5}),
        }