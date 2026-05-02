"""
WSGI config for whitehacker project.
"""

import os
from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'whitehacker.settings')
application = get_wsgi_application()