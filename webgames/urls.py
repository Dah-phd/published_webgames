"""webgames URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from js_games.views import games, save_score
from main.views import register, profile, lagout_view, modal_login, password_change, pass_reset
from django.contrib.auth.views import LoginView, PasswordResetConfirmView, PasswordResetView


urlpatterns = [
    path('admin/', admin.site.urls),
    path('register/', register, name='register'),
    path('login/', LoginView.as_view(template_name='main/login.html',
         redirect_authenticated_user=True), name='login'),
    path('login_api/', modal_login, name='modal_login'),
    path('logout', lagout_view, name='logout'),
    path('score_api/', save_score, name='save_score'),
    path('profile/', profile, name='profile'),
    path('profile/chpass', password_change, name='chpass'),
    path('pass_recovery/', pass_reset, name='recovery'),
    path('recovery/<uidb64>/<token>',
         PasswordResetConfirmView.as_view(template_name='main/reset.html', success_url='../../login'), name="password_reset_confirm"),
    path('', games, name='games'),
]
