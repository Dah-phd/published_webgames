from django.shortcuts import render, redirect
from django.http import JsonResponse
from js_games import forms, models


def games(request):
    if request.method == "POST":
        if request.POST['game'] == 'python':
            score = models.python.objects.order_by('-score')
        elif request.POST['game'] == 'minesweeper':
            score = models.minesweeper.objects.order_by('score')
        elif request.POST['game'] == 'tetris':
            score = models.tetris.objects.order_by('-score')
        return render(request, 'js_games/games.html', {'game': request.POST['game'], 'scores': score})
    return render(request, 'js_games/games.html')


def save_score(request):
    err = False
    if request.POST['game'] == 'python':
        score = forms.py_score(request.POST)
    elif request.POST['game'] == 'minesweeper':
        score = forms.mines_score(request.POST)
    elif request.POST['game'] == 'tetris':
        score = forms.tet_score(request.POST)
    if score.is_valid():
        log = score.log(request.POST['log'])
        if log == True:
            if (request.user.id):
                score.instance.user = request.user
            score.save()
        else:
            err = True
    return JsonResponse({'status': err})
