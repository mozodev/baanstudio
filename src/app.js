import { Alert } from 'bootstrap'
import $ from 'cash-dom'

$(() => {
    $('html').addClass('dom-loaded')
    $('<span class="text-muted">Appended with Cash</span>').appendTo($('footer .container'))

    var alertList = $('.alert')
    alertList.each( (index, alert) => {
        new Alert(alert)
    })
})
