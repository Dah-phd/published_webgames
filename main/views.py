from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.contrib.auth import logout, authenticate, login
from django.contrib.auth.views import PasswordChangeForm, PasswordResetForm
from django.contrib.auth.models import User
from django.contrib import messages
from main.forms import new_user
from django.middleware.csrf import get_token
from js_games.models import python, tetris, minesweeper
from django.contrib.auth import update_session_auth_hash


def lagout_view(request):
    logout(request)
    messages.success(
        request, "You have been logged out!")
    return redirect('games')


def register(request):
    form = new_user()
    if request.method == 'POST':
        form = new_user(request.POST)
        if form.is_valid():
            form.save()
            messages.success(
                request, f'{form.cleaned_data["username"]} was created!')
            return redirect('login')
    return render(request, 'main/register.html', {'form': form})


def profile(request):
    if (request.user.id):
        data = {
            'python': python.objects.filter(user__pk=request.user.id).order_by('-score')[:10],
            'minesweeper': minesweeper.objects.filter(user__pk=request.user.id).order_by('score')[:10],
            'tetris': tetris.objects.filter(user__pk=request.user.id).order_by('-score')[:10],
        }
        return render(request, 'main/profile.html', data)
    else:
        return redirect('login')


def modal_login(request):
    if request.method == 'POST':
        user = authenticate(
            request, username=request.POST['username'], password=request.POST['password'])
        if user is not None:
            login(request, user)
            return JsonResponse({'token': get_token(request), 'result': request.POST['username']})
        else:
            return JsonResponse({'result': 'failed'})
    else:
        return redirect('games')


def password_change(request):
    if request.method == 'POST':
        form = PasswordChangeForm(request.user, request.POST)
        if form.is_valid():
            user = form.save()
            update_session_auth_hash(request, user)
            return JsonResponse({'result': 'done', 'token': get_token(request)})
        else:
            return JsonResponse({'result': 'failed', 'token': get_token(request)})
    return redirect("profile")


def pass_reset(request):
    if request.user.is_authenticated:
        return redirect('games')
    elif request.method == 'POST':
        form = PasswordResetForm(request.POST)
        if form.is_valid():
            form.save(request=request)
            return JsonResponse({'result': 'done'})
        else:
            return JsonResponse({'result': 'failed'})
