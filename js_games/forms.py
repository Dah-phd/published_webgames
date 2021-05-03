from django import forms
from js_games import models


class py_score(forms.ModelForm):
    class Meta:
        model = models.python
        fields = ['nick', 'score']

    @staticmethod
    def log(logs):
        logs = logs[2:-2].split('],[')
        logs = [ls.replace(']', '').replace('[', '').split(',') for ls in logs]
        if len(logs) == 1:
            if int(logs[0][1]) != 10:
                return False
        else:
            last = logs[0]
            for log in logs[1:]:
                if int(log[0]) - int(last[0]) != 1 or int(log[1]) - int(last[1]) != 10 or int(log[2]) <= int(last[2]):
                    return False
                last = log
                if last[2] == logs[-1][2]:
                    break
            if int(last[1])/(int(last[0])-3) != 10:
                return False
        return True


class mines_score(forms.ModelForm):
    class Meta:
        model = models.minesweeper
        fields = ['nick', 'score']

    @staticmethod
    def log(logs):
        bomb = 99
        logs = logs[2:-2].split('],[')
        logs = [ls.replace(']', '').replace('[', '').split(',') for ls in logs]
        grid = [[1 for _ in range(30)] for _ in range(16)]
        for log in logs:
            grid[int(log[0])][int(log[1])] = 0
        sm = sum([sum(row) for row in grid])
        print(sm)
        if sm != 99:
            print('error')
        return True


class tet_score(forms.ModelForm):
    class Meta:
        model = models.tetris
        fields = ['nick', 'score']

    @ staticmethod
    def log(logs):
        logs = logs[2:-2].split('],[')
        logs = [ls.replace(']', '').replace('[', '').split(',') for ls in logs]
        last = logs[0]
        for log in logs[1:]:
            if int(log[1]) > 120:
                return False
            if int(log[0]) == int(last[0]):
                return False
            if int(log[2]) <= int(last[2]):
                return False
            if int(last[0]) + int(log[1]) != int(log[0]):
                return False
            last = log
            if int(last[2]) == int(logs[-1][2]):
                break
        return True
