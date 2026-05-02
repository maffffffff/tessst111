from django.shortcuts import render, redirect
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import Group
from django.contrib import messages
from .models import Expert, HelpRequest, Testimonial
from .forms import RegisterForm, HelpRequestForm

def home(request):
    experts = Expert.objects.filter(is_available=True)[:4]
    testimonials = Testimonial.objects.all()[:3]
    context = {
        'experts': experts,
        'testimonials': testimonials,
    }
    return render(request, 'home.html', context)

def experts(request):
    experts = Expert.objects.all()
    return render(request, 'experts.html', {'experts': experts})

@login_required
def request_help(request):
    expert_id = request.GET.get('expert')
    if request.method == 'POST':
        form = HelpRequestForm(request.POST)
        if form.is_valid():
            help_request = form.save(commit=False)
            help_request.user = request.user
            help_request.save()
            messages.success(request, 'Ваш запрос отправлен! Эксперт получит ваше сообщение.')
            return redirect('home')
    else:
        initial = {}
        if expert_id:
            try:
                initial['expert'] = Expert.objects.get(pk=expert_id)
            except Expert.DoesNotExist:
                initial = {}
        form = HelpRequestForm(initial=initial)
    return render(request, 'contact.html', {'form': form})

def register(request):
    if request.method == 'POST':
        form = RegisterForm(request.POST)
        if form.is_valid():
            user = form.save()
            if form.cleaned_data.get('is_expert'):
                expert_group, _ = Group.objects.get_or_create(name='Experts')
                user.groups.add(expert_group)
                Expert.objects.create(
                    user=user,
                    specialty=form.cleaned_data.get('specialty') or 'web_security',
                    experience=form.cleaned_data.get('experience') or 0,
                    bio=form.cleaned_data.get('bio') or 'Опытный эксперт по кибербезопасности.',
                )
            login(request, user)
            messages.success(request, 'Регистрация успешна!')
            return redirect('home')
    else:
        form = RegisterForm()
    return render(request, 'register.html', {'form': form})

@login_required
def expert_dashboard(request):
    if not request.user.groups.filter(name='Experts').exists():
        return redirect('home')
    help_requests = HelpRequest.objects.filter(expert__user=request.user).order_by('-created_at')
    return render(request, 'expert_dashboard.html', {'help_requests': help_requests})

def login_view(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(request, username=username, password=password)
        if user:
            login(request, user)
            messages.success(request, 'Вы успешно вошли в систему!')
            return redirect('home')
        messages.error(request, 'Неверное имя пользователя или пароль')
    return render(request, 'login.html')


def expert_login_view(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(request, username=username, password=password)
        if user and user.groups.filter(name='Experts').exists():
            login(request, user)
            messages.success(request, 'Вы вошли как специалист.')
            return redirect('expert_dashboard')
        if user:
            messages.error(request, 'Доступ разрешён только для специалистов.')
        else:
            messages.error(request, 'Неверное имя пользователя или пароль')
    return render(request, 'expert_login.html')


def logout_view(request):
    logout(request)
    messages.info(request, 'Вы вышли из системы')
    return redirect('home')

def contact(request):
    return render(request, 'contact.html', {'show_contact': True})