import { Alert } from 'bootstrap'
import $ from 'cash-dom'

$(() => {
    $('html').addClass('dom-loaded')
    $('<span class="text-muted">Appended with Cash</span>').appendTo($('footer .container'))

    var alertList = document.querySelectorAll('.alert')
    alertList.forEach(function (alert) {
        new Alert(alert)
    })
})
