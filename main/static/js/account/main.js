$('document').ready(function () {
    console.log('loading scripts');
    new_pass()
})
function new_pass() {
    $('#chpass_btn').on('click', function () {
        let label = $('#chpass_label');
        $.ajax({
            type: "POST",
            headers: { 'X-CSRFToken': token },
            url: chpass_url,
            data: {
                "old_password": $('#id_old_password').val(),
                "new_password1": $('#id_new_password1').val(),
                "new_password2": $('#id_new_password2').val(),
            },
            success: (e) => {
                if (e['result'] == 'failed') { label.css('color', 'red'); label.html("Unable to verify!") }
                else {
                    $('#chpass_modal').modal('hide'); alert('Your password have been changed!')
                }
            }
        })
    });
}
function chpass_purge() {
    let label = $('#chpass_label');
    label.css('color', 'black');
    label.html('Change password:')
    $('#id_old_password').val('');
    $('#id_new_password1').val('');
    $('#id_new_password2').val('');
}

