# Generated by Django 3.2 on 2021-04-29 06:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('js_games', '0002_auto_20210427_0634'),
    ]

    operations = [
        migrations.AlterField(
            model_name='minesweeper',
            name='nick',
            field=models.CharField(default='user', max_length=20),
        ),
        migrations.AlterField(
            model_name='python',
            name='nick',
            field=models.CharField(default='user', max_length=20),
        ),
        migrations.AlterField(
            model_name='tetris',
            name='nick',
            field=models.CharField(default='user', max_length=20),
        ),
    ]