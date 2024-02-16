'use strict';

var translate = function() {
    $("[tkey]").each(function (index) {
        var key = $(this).attr('tkey');
        var translation = translateKey(key);
        
        $(this).html(translation);
    });
}

var translateKey = function(key) {
    return chrome.i18n.getMessage(key);
}

translate();