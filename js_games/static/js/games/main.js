window.onload = function () {
    window.addEventListener("keydown", function (e) {
        if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(e.code) > -1) { e.preventDefault(); if (e.key == ' ') { e.target.value = e.target.value += ' ' } }
    }, false);

    let target;
    let snake = document.getElementById('python');
    let mine = document.getElementById('mine');
    let tetris = document.getElementById('tetris');
    window.score_modal = false;
    restore_score_during_login();

    snake.onclick = () => { clean(target); target = new python_game('root', 'score'); snake.blur() };
    mine.onclick = () => { clean(target); target = new minesweeper('root', 'score'); mine.blur() };
    tetris.onclick = () => { clean(target); target = new tetris_game('root', 'score'); tetris.blur() };
}
function clean(target) {
    if (target !== undefined) {
        target.kill(-9);
    }
}
function send_score(score, log, game) {
    window.score_modal = true;
    $('#modal_label').html("Your score is " + score.toString());
    let modal = $('#score_modal');
    let nick = $('#nick');
    nick.val('');
    modal.modal('show');
    $('#send').one('click', function () {
        $.ajax({
            type: "POST",
            headers: { 'X-CSRFToken': token },
            url: send_url,
            data: {
                'game': game,
                'nick': nick.val(),
                'score': score,
                'log': JSON.stringify(log)
            },
            success: () => { alert('Score saved!') },
            failure: () => { alert('error') }
        });
        modal.modal('hide')
    });
}
function auth_view() {
    $('#login').on('click', function () {
        let label = $('#login_label');
        $.ajax({
            type: "POST",
            headers: { 'X-CSRFToken': token },
            url: login_url,
            data: {
                'username': $('#id_username').val(),
                'password': $('#id_password').val()
            },
            success: (e) => {
                if (e['result'] == 'failed') { label.css('color', 'red'); label.html("Incorrect name or password!") }
                else {
                    $('#modal_login').modal('hide'); $('#login_btn').hide();
                    let prof = $('#nametag');
                    prof.html(e['result']);
                    token = e['token'];
                    prof.show();
                    $('#out_link').show();
                    $('#register').hide();
                }
            },
        })
    });
}
function restore_score_during_login() {
    $('#modal_login').on('hidden.bs.modal', function () {
        res_data();
        if (window.score_modal) { $('#score_modal').show(); }
    })
    $('#score_modal').on('hidden.bs.modal', function () {
        window.score_modal = false;
    })
}
function res_data() {
    let label = $('#login_label');
    label.css('color', 'black');
    label.html('Login');
    $('#id_username').val('');
    $('#id_password').val('');
}