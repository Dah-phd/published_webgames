from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User


class python(models.Model):
    date = models.DateField(auto_now_add=True)
    user = models.ForeignKey(User, default=4, on_delete=models.CASCADE)
    nick = models.CharField(max_length=20, default='user')
    score = models.IntegerField()


class minesweeper(models.Model):
    date = models.DateField(auto_now_add=True)
    user = models.ForeignKey(User, default=4, on_delete=models.CASCADE)
    nick = models.CharField(max_length=20, default='user')
    score = models.IntegerField()


class tetris(models.Model):
    date = models.DateField(auto_now_add=True)
    user = models.ForeignKey(User, default=4, on_delete=models.CASCADE)
    nick = models.CharField(max_length=20, default='user')
    score = models.IntegerField()
