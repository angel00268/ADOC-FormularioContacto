$(document).ready(function () {
    $("#btnEnviar").on("click", function (e) {
        if (validar('frmContacto', 'input, textarea')) {
            $.ajax({
                type: 'post',
                url: 'http://192.168.0.2:8002/api/v1/contact',
                dataType: "json",
                data: new FormData(document.getElementById("frmContacto")),
                processData: false,
                async: true,
                contentType: false,
                beforeSend: function (jqXHR, textStatus) {
                    $(".loader").show()
                    $("#alert-success").css('display', 'none')
                    $("#alert-danger").css('display', 'none');
                },
                success: function (data) {
                    if (manageError(data.error)) {
                        if (data.message != null && data.error == null) {
                            $("#alert-success").css('display', 'flex')
                            $("#alert-success span").html(`<h6> <strong> <i class="fa fa-check-circle"></i> Información: </strong> ${data.message} </h6>`).show();
                            $("#frmContacto")[0].reset();
                        }
                    }
                },
                error: function (error) {
                    manageError(error.responseJSON.message)
                },
                complete: function () {
                    $('.loader').hide();
                },
            })
        }
    });
})

function validar(seccion, elements) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let elementos = $(`#${seccion}`).find(`${elements}`)
    let valido = true;
    $(`#${seccion} .form-control`).removeClass('has-warning');
    $(`#${seccion} label[for]`).css('color', 'black');
    $(`#${seccion} span[class="error_span"]`).text('');
    elementos.each(function (index, element) {
        let elemento = $(element);
        let id = elemento.attr('id');
        let type = elemento.attr('type');
        let label = $(`label[for="${id}"]`)
        let labelText = label.text();
        let errorSpan = $(`span[id="error_${id}"]`)
        let valInput = elemento.val();
        let dataCaracterMin = elemento.data('min');
        let dataCaracterMax = elemento.data('max');
        if (elemento.is(':required') && !(valInput)) {
            label.css('color', '#ff2d00');
            elemento.addClass('has-warning');
            elemento.focus();
            valido = false;
            errorSpan.html(`El campo <strong> ${labelText} </strong> es requerido`)
        } else if (elemento.is(':required') && typeof dataCaracterMin !== undefined && valInput.trim().length < parseInt(dataCaracterMin)) {
            label.css('color', '#ff2d00');
            elemento.addClass('has-warning');
            elemento.focus();
            valido = false;
            errorSpan.html(`El campo <strong> ${labelText} </strong> debe tener al menos <strong> ${dataCaracterMin} </strong> caracteres.`)
        } else if (elemento.is(':required') && typeof dataCaracterMax !== undefined && valInput.trim().length > parseInt(dataCaracterMax)) {
            label.css('color', '#ff2d00');
            elemento.addClass('has-warning');
            elemento.focus();
            valido = false;
            errorSpan.html(`El campo <strong> ${labelText} </strong> no debe tener más de <strong> ${dataCaracterMax} </strong> caracteres.`)
        } else if (type === 'email' && !emailRegex.test(valInput)) {
            label.css('color', '#ff2d00');
            elemento.addClass('has-warning');
            elemento.focus();
            valido = false;
            errorSpan.html(`El campo <strong> ${labelText} </strong> debe de ser un formato de correo electronico.`)
        }
    });
    return valido;
}

function manageError(error) {
    console.log(error);

    if (error != null) {
        $errores = '';
        let tipo = $.type(error);
        if (tipo === 'string') {
            $errores = error;
        } else {
            for (let index = 0; index < error.length; index++) {
                $error = '<li>' + error[index] + '</li>';
                $errores += $error;
            }
        }
        $("#alert-danger").css('display', 'flex');
        $("#alert-danger span").html(`<h6> <strong> Error: </strong><ul>${$errores}</ul>`).show();
    } else {
        return true;
    }
}