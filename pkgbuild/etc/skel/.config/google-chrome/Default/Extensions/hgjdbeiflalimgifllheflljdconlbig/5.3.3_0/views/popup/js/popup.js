/* Variables para inicializar */
var blockedUrl = false;
var trustnavStatus = true;
var rating = {};

/* Init */
var setRatingUI = function () {
    // si trustnav esta activado, controlo rating
    if (trustnavStatus) {
        // oculto todo
        $('#unknownSite').hide();
        $('#safeSite').hide();
        $('#unsafeSite').hide();

        // si la url es bloqueada (sitios localhost, chrome, etc), muestro que esta todo ok y oculto rating
        if (blockedUrl) {
            $('#safeSite').show();
            $('#safebrowsingStatus').show();
            $('#vote').hide();
            $('#voteText').hide();
            $('#disabled-1').hide();
            $('#disabled-2').hide();
            // to do -> ocultar seccion rating
        }
        // si la url no es bloqueada, proceso rating
        else {
            // si llega undefined es porque se cayo la API. oculto seccion ratings y muestro que está todo ok
            if (rating.average === undefined) {
                $('#safeSite').show();
                $('#vote').hide();
                $('#voteText').hide();
            }
            // si el rating es null, es porque todavia no hay info. pongo en unknown
            else if (rating.average === null) {
                $('#unknownSite').show();
                $('#vote').show();
                $('#voteText').show();
            }
            // si el rating es menor a 40, pongo como unsafe
            else if (rating.average <= 40) {
                $('#unsafeSite').show();
                $('#vote').show();
                $('#voteText').show();
            }
            // el rating es bueno
            else {
                $('#safeSite').show();
                $('#vote').show();
                $('#voteText').show();
            }

            $('#unvoted').hide();
            $('#safeVoted').hide();
            $('#unsafeVoted').hide();
            $('#voteText').hide();
            $('#alreadyVotedText').hide();

            // si el usuario voto negativo
            if (rating.user === 0) {
                $('#alreadyVotedText').show();
                $('#unsafeVoted').show();
                $('#userVote').html(translateKey('main_unsafe'));
            }
            // si el usuario voto positivo
            else if (rating.user === 1) {
                $('#alreadyVotedText').show();
                $('#safeVoted').show();
                $('#userVote').html(translateKey('main_safe'));
            }
            // el usuario no voto todavia Y la api no esta caida
            else if (rating.average !== undefined) {
                $('#voteText').show();
                $('#unvoted').show();
            }

            $('#disabled-1').hide();
            $('#disabled-2').hide();
            $('#safebrowsingStatus').show();
        }
    }
    // si trustnav esta desactivado, muestro switch
    else {
        $('#disabled-1').show();
        $('#disabled-2').show();
        $('#safebrowsingStatus').hide();
        $('#voteText').hide();
        $('#alreadyVotedText').hide();
        $('#vote').hide();
    }
    $('#loader').hide();
}
var getStatus = function () {
    // Lanzo las dos cosas en paralelo y cuando terminen las dos, actualiza la vista
    var count = 0;
    var ready = function () {
        count++;
        if (count == 2) {
            setRatingUI();
        }
    }

    // consulto el estado de las notificaciones
    chrome.runtime.sendMessage({
        action: 'getNotificationStatus'
    }, function (response) {
        if (response && response.status)
            trustnavStatus = true;
        else
            trustnavStatus = false;
        ready();
    })

    // consulto el rating
    chrome.tabs.query({
        'active': true,
        'lastFocusedWindow': true
    }, function (tabs) {
        var tab = tabs[0];
        var domain = parseDomain(tab.url);
        var validUrl = validateUrl(tab.url);

        if (!validUrl)
            blockedUrl = true;

        /* Si es una URL valida, pido el rating */
        if (validUrl) {
            chrome.runtime.sendMessage({
                'action': 'getRating',
                'domain': domain,
                'tab': tab
            }, function (response) {
                if (response && response.rating)
                    rating = response.rating;
                ready();
            });
        }
        /* Si es una URL bloqueada, muestro que está todo OK */
        else {
            ready();
        }
    })
}

var vote = function (safe) {
    // actualizo el UI
    rating.user = safe;
    setRatingUI();

    // envio el rating
    chrome.tabs.query({
        'active': true,
        'lastFocusedWindow': true
    }, function (tabs) {
        var tab = tabs[0];
        var domain = parseDomain(tab.url);
        chrome.runtime.sendMessage({
            action: 'sendRating',
            domain: domain,
            safe: safe
        }, function (response) {});
    });
}

var undueVote = function () {
    // actualizo el UI
    rating.user = null;
    setRatingUI();

    // envio el rating
    chrome.tabs.query({
        'active': true,
        'lastFocusedWindow': true
    }, function (tabs) {
        var tab = tabs[0];
        var domain = parseDomain(tab.url);
        chrome.runtime.sendMessage({
            action: 'removeRating',
            domain: domain
        }, function (response) {});
    });
}

var enableTrustnav = function () {
    chrome.runtime.sendMessage({
        action: 'setNotificationStatus',
        status: false,
        rating: rating
    }, function (response) {});

    trustnavStatus = true;
    setRatingUI();
}

var checkAdblocker = function () {
    chrome.runtime.sendMessage({
        action: 'checkExtensionInstalled',
        extensionType: 'ADBLOCKER'
    }, function (response) {
        if (!response || !response.installed) {
            $("#settings-no-dot").addClass("hidden");
            $(".update-alert").show();
            $("#installedBtn").hide();

            chrome.runtime.sendMessage({
                action: 'getUpdateNotificationStatusPopUp'
            }, function (response) {
                if (response.status) {
                    $("#share").removeClass("hidden");
                }
            });
        }
    });
};

var checkLogged = function () {
    chrome.runtime.sendMessage({
        action: 'checkLogged'
    }, function (response) {
        if (response && response.logged) {
            loggedUser = response;
            $(".my-account-name").html(loggedUser.name);
            $(".my-account-edit-field > span").eq(0).html(loggedUser.email);
            $(".my-account-logged").show();
            $(".my-account-logout").hide();

            if (loggedUser.picture) {
                $(".circle-img-container").attr('src', loggedUser.picture);
                $("#account-avatar").show();
                $("#placeholder-avatar").hide();
            } else {
                $("#placeholder-avatar span").html(loggedUser.name[0].toUpperCase());
                $("#account-avatar").hide();
                $("#placeholder-avatar").show();
            }

            $("#login").hide();
            $("#account").show();
            $("#mainSection").hide();
        } else {
            loggedUser = false;
            $("#login").show();
            $("#account").hide();
            $("#mainSection").hide();
        }
    });
};

var init = function () {
    getStatus();
    checkAdblocker();
}

$(document).ready(function () {
    init();

    $('#voteSafe').click(function () {
        vote(1);
    })
    $('#voteUnsafe').click(function () {
        vote(0);
    })
    $('.undue-vote').click(function () {
        undueVote();
    })
    $('#enableButton').click(function () {
        enableTrustnav();
        changeSwitch("#showMeAlerts", true);
    })

    $("#update , #installAdblock").click(function () {
        chrome.tabs.create({
            url: configServer.installAdblockerUrl
        });
    });

    $("#closeShare").click(function () {
        chrome.runtime.sendMessage({
            'action': 'setUpdateNotificationStatusPopUp',
            'status': false
        }, function () {});

        $("#share").addClass("hidden");
    });

    /* Entrar en modo profile */
    $("[profile-toggle]").click(function () {
        checkLogged();
    });

    $("[go-back]").click(function () {
        $('#login').hide();
        $('#account').hide();
        $("#settingsSection").hide();
        $("#mainSection").show();
    });

    // Botones de inicio de sesion
    $(document).on("click", ".facebook-btn", function () {
        var url = configServer.accountUrl + '/login?action=login&social_provider=facebook';
        window.open(url);
    });

    $(document).on("click", ".google-btn", function () {
        var url = configServer.accountUrl + '/login?action=login&social_provider=google';
        window.open(url);
    });

    $(document).on("submit", "#login-form", function (e) {
        e.preventDefault();
        var email = $('#login-email').val();
        var url = configServer.accountUrl + '/login?action=login&email=' + encodeURIComponent(email);
        window.open(url);
    });

    $("[js-account-url-prefix]").each(function () {
        var fullUrl = configServer.accountUrl + $(this).attr('href');
        $(this).attr('href', fullUrl);
    });

    // Boton de logout
    $(document).on("click", ".logout-wrap", function () {
        $(".logout-wrap").hide();
        $(".my-account-logged").hide();
        $(".my-account-logout").show();

        chrome.runtime.sendMessage({
            action: 'logout',
        }, function (response) {
            checkLogged();
        })
    })
});