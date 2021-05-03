$('document').ready(function () {
    console.log('loading scripts');
    new_pass();
    $('#loading').hide();
})
function new_pass() {
    $('#reset_btn').on('click', function () {
        let label = $('#reset_label');
        let btn = $('#loading');
        btn.show();
        $.ajax({
            type: "POST",
            headers: { 'X-CSRFToken': token },
            url: reset_url,
            data: {
                "email": $('#id_email').val()
            },
            success: (e) => {
                if (e['result'] == 'failed') { label.css('color', 'red'); label.html("Unable to verify!") }
                else {
                    $('#pass_reset_modal').modal('hide'); alert('You will recieve an email with instructions, shortly.')
                }
            },
            failure: () => { alert('failure'); },
            complete: () => { btn.hide(); }
        });
    });
}
function reset_purge() {
    let label = $('#reset_label');
    label.css('color', 'black');
    label.html('Recover password:')
    $('#id_email').val('');
}