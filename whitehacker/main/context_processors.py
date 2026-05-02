from django.contrib.auth.models import Group


def expert_status(request):
    is_expert = False
    if request.user.is_authenticated:
        is_expert = request.user.groups.filter(name='Experts').exists()
    return {
        'is_expert': is_expert,
        'is_admin': request.user.is_staff if request.user.is_authenticated else False,
    }
