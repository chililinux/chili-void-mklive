var changeSwitch = function (id, status) {
    if (status) {
        $(id).removeClass('off');
        $(id).addClass('on');
    } else {
        $(id).removeClass('on');
        $(id).addClass('off');
    }
};

chrome.runtime.sendMessage({
    action: 'getNotificationStatus'
}, function (response) {
    //$("#enableNotifications").prop('checked', response && response.status ? true : false);
    if (response && response.status) {
        changeSwitch("#showMeAlerts", true);
    } else {
        changeSwitch("#showMeAlerts", false);
    }
});

$(document).on("click", "#showMeAlerts", function () {
    trustnavStatus = !trustnavStatus;
    changeSwitch("#showMeAlerts", trustnavStatus);
    chrome.runtime.sendMessage({
        action: 'setNotificationStatus',
        status: !trustnavStatus,
        rating: rating
    }, function (response) {
        setRatingUI();

    });
});

chrome.runtime.sendMessage({
    action: 'getDisabledNotification'
}, function (response) {
    if (response && response.domains) {

        for (var domain of response.domains) {
            $("#setAlertSection .options-group").append('<div class="website-option option-wrap on" value="' + domain + '"><div><span class="option-name">' + domain + '</span></div><div class="option-switch"><div class="track"></div><div class="knob"></div></div></div>');
            //$("#noNotificationSites").append("<option value=" + domain + ">" + domain + "</option>");
        }
        if (!response.domains.length) {
            $("#setAlertSection .options-group").append('<div class="option-wrap no-options"><div><span>(Ninguno detectado)</span></div></div>')
        }
        $("#setAlertSection .website-option").on('click', function () {
            clearSiteNotification($(this), $(this).attr('value'));
        });
    }
});

chrome.runtime.sendMessage({
    action: 'getSession'
}, function (response) {
    var session = response ? response.session : null;
    // Puede editar el search provider si no tiene habilitado el adblocker_free_mode
    var canEditSP = (!session || !session.adblocker_free_mode);

    // Mostrar el mensaje correcto en la UI
    if (canEditSP) {
        $('[js-search-provider-enabled]').show();
    } else {
        $('[js-search-provider-disabled]').show();
    }

    chrome.runtime.sendMessage({
        action: 'getSearchProvider'
    }, function (response) {
        var searchProvider = response.searchProvider;

        chrome.runtime.sendMessage({
            action: 'getSearchProviders'
        }, function (response) {
            for (var i in response.searchProviders) {
                var sp = response.searchProviders[i];

                if (searchProvider && sp.id === searchProvider.id) {
                    var radio = '<div class="option-wrap radio-selected" value="' + i + '">'
                    radio += '<div><span class="option-name">' + sp.name + '</div>';
                    radio += '<div class="option-radio"><div class="radio-circle">'
                    radio += '<div class="radio-fill"></div></div></div></div>'

                    $("#setSearchEngineSection .options-group").append(radio);
                } else {
                    var disabledClass = canEditSP ? '' : 'option-disabled';
                    var radio = '<div class="option-wrap ' + disabledClass +'" value="' + i + '">';
                    radio += '<div><span class="option-name">' + sp.name + '</div>';
                    radio += '<div class="option-radio"><div class="radio-circle">';
                    radio += '</div></div></div>';

                    $("#setSearchEngineSection .options-group").append(radio);
                }

                if (sp.recommended) {
                    $('<span> ' + translateKey('settings_recommended') + ' </span>').insertAfter($("#setSearchEngineSection .options-group .option-name").last());
                }
            };

            // Solo definir los listeners si puede editar el buscador
            if (canEditSP) {
                $("#setSearchEngineSection .option-wrap").on('click', function () {
                    $("#setSearchEngineSection .option-wrap").each(function () {
                        engineSelect($(this), false);
                    });
    
                    engineSelect($(this), true);
    
                    var id = $(this).attr('value');
    
                    if (id || id === 0) {
                        var searchProvider = response.searchProviders[id];
                        chrome.runtime.sendMessage({
                            action: 'setSearchProvider',
                            searchProvider: searchProvider
                        }, function (response) {});
                    }
                });
            }
        });
    });
});

var clearSiteNotification = function (option, value) {
    chrome.runtime.sendMessage({
        action: 'setNotificationStatus',
        domains: [value],
        status: false
    }, function (response) {
        option.remove();
    });
};

$("[settings-toggle]").on('click', function () {
    $("#settingsSection").show();
    $("#mainSection").hide();
});

var sectionAlert = function () {
    $("#setAlert").addClass('selected');
    $("#setAlertSection").show();
    $("#setSearchEngine").removeClass('selected');
    $("#setSearchEngineSection").hide();
    $("#setAbout").removeClass('selected');
    $("#setAboutSection").hide();
};

$("#setAlert").on('click', sectionAlert);

$("#setSearchEngine").on('click', function () {
    $("#setAlert").removeClass('selected');
    $("#setAlertSection").hide();
    $("#setSearchEngine").addClass('selected');
    $("#setSearchEngineSection").show();
    $("#setAbout").removeClass('selected');
    $("#setAboutSection").hide();
});

$("#setAbout").on('click', function () {
    $("#setAlert").removeClass('selected');
    $("#setAlertSection").hide();
    $("#setSearchEngine").removeClass('selected');
    $("#setSearchEngineSection").hide();
    $("#setAbout").addClass('selected');
    $("#setAboutSection").show();
});

var engineSelect = function (option, value) {
    if (!value) {
        option.removeClass('radio-selected');
        option.find('.radio-circle').html('');
    } else {
        option.addClass('radio-selected');
        option.find('.radio-circle').html('<div class="radio-fill"></div>');
    }
}