'use strict';

var icons = {
    safe: {
        enabled: "/icons/Safe64.png",
        enabledWithUpdate: "/icons/Safe-Not64.png",
        disabled: "/icons/Safe-Disable64.png",
        disabledWithUpdate: "/icons/Safe-Disable-Not64.png"
    },
    unsafe: {
        enabled: "/icons/Unsafe64.png",
        enabledWithUpdate: "/icons/Unsafe-Not64.png",
        disabled: "/icons/Unsafe-Disable64.png",
        disabledWithUpdate: "/icons/Unsafe-Disable-Not64.png"
    },
    unknown: {
        enabled: "/icons/Unknown64.png",
        enabledWithUpdate: "/icons/Unknown-Not64.png",
        disabled: "/icons/Unknown-Disable64.png",
        disabledWithUpdate: "/icons/Unknown-Disable-Not64.png"
    }
};

/* Evento de instalacion/actualizacion */
chrome.runtime.onInstalled.addListener(function(details) {
    /* Verifico si es actualizacion de la extension */
    if (details.reason == 'update') {
        isUpdated = true;
    }
})

/**
 * @description Escucha el evento "onUpdateAvailable" que se lanza cuando hay una actualizacion de la extension disponible
 * @param {Function} callback - Funcion para manejar el evento
 */
chrome.runtime.onUpdateAvailable.addListener(function() {
    /* Hace un reload para que se actualice la extension en el momento, y no esperar al proximo restart de chrome */
    chrome.runtime.reload();
});

/**
 * @description Escucha el evento "onSelectionChanged" que se lanza cuando cambia la seleccion de un tab
 * @param {Function} callback - Funcion para manejar el evento
 */
chrome.tabs.onActivated.addListener(function() {
    chrome.tabs.query({ 'active': true, 'lastFocusedWindow': true }, function(tabs) {
        var tab = tabs[0];
        if (tab) {
            updateTab(tab.id, tab.url, tab);
        }
    });
});

/**
 * @description Escucha el evento "onCreated" que se lanza cuando se crea una nueva tab
 * @param {Function} callback - Funcion que recibe un objeto con la informacion del evento
 */
chrome.tabs.onCreated.addListener(function(tab) {
    tabStates[tab.id] = {};

    chrome.tabs.query({ 'active': true, 'lastFocusedWindow': true }, function(tabs) {
        var selectedTab = tabs[0];
        /* Solo actualiza si el tab que creo es el actual (por si abre cosas en pestaña nueva) */
        if (selectedTab && selectedTab.id === tab.id) {
            /* Setea el icono verde al tab */
            handler.getNotificationStatus({}, null, function(response) {
                var icon = {};
                /* Las notificaciones estan activadas */
                if (response && response.status) {
                    icon.path = adblockerInstalled ? icons.safe.enabled : icons.safe.enabledWithUpdate;
                } else {
                    icon.path = adblockerInstalled ? icons.safe.disabled : icons.safe.disabledWithUpdate;
                }
            
                chrome.browserAction.setIcon(icon);
            });
        }
    });    
});

/**
 * @description Escucha el evento "onReplaced" que se lanza cuando una tab es reemplazada por otra
 * @param {Integer} newId - Identificador de la nueva tab
 * @param {Integer} removedId - Identificador de la vieja tab
 */
chrome.tabs.onReplaced.addListener(function(newId, removedId) {
    tabStates[newId] = {};

    /* Guarda en la tab nueva, el ultimo dominio de la tab vieja. Y luego borra la tab vieja */
    if (tabStates[removedId]) {
        if (tabStates[removedId].actualDomain) {
            tabStates[newId].actualDomain = tabStates[removedId].actualDomain;
            // tabStates[newId].start = tabStates[removedId].start;
        }

        delete tabStates[removedId];
    }

    /* Obtiene el tab por id y lo actualiza */
    chrome.tabs.get(newId, function(tab) {
        updateTab(newId, tab.url, tab);
    })
});

/**
 * @description Escucha el evento "onRemoved" que se lanza cuando una tab se cierra
 * @param {Function} callback - Funcion que recibe un objeto con la informacion del evento
 */
chrome.tabs.onRemoved.addListener(function(tabId) {
    if (tabStates[tabId]) {
        var tabState = tabStates[tabId];

        /* Estaba en un dominio, envia el check domain */
        if (tabState.actualDomain && tabState.start) {
            var elapsedTime = ((new Date()).getTime() - tabState.start);
            elapsedTime = msToTime(elapsedTime);
            // console.log("Estuvo en dominio " + tabState.actualDomain + " por " + elapsedTime);
        }

        delete tabStates[tabId];
    }
});

/**
 * @description Escucha el evento "onUpdated" que se lanza cada vez que se actualiza la pestaña (cambios de url).
 * @param {Function} callback - Funcion que recibe un objeto con la informacion del evento
 */
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.url || changeInfo.status === 'loading') {
        updateTab(tabId, changeInfo.url ? changeInfo.url : tab.url, tab);
    }
});

var updateTab = function(tabId, url, tab) {
    if (!tabStates[tabId]) {
        tabStates[tabId] = {};
    }
    
    var tabState = tabStates[tabId];
    var domain = parseDomain(url);

    /* Si no cambio el dominio, no hay que hacer nada */
    if (tabStates[tabId].actualDomain && tabStates[tabId].actualDomain === domain) {
        setIconNew(tabStates[tabId].rating, tabId);
        return;
    } else {
        handler.getRating({ tab: tab }, null, function(response) {
            var rating = response.rating;
            var validUrl = validateUrl(url);

            setIconNew(rating, tabId);

            /* Si la URL es valida, verifica el cambio de dominio */
            if (validUrl) {
                if (!tabState.actualDomain || tabState.actualDomain !== domain) {
                    /* Si tenia dominio previo, cambio el dominio */
                    if (tabState.actualDomain) {
                        tabState.lastDomain = tabState.actualDomain;
        
                        var elapsedTime = ((new Date()).getTime() - tabState.start);
                        elapsedTime = msToTime(elapsedTime);
                    }
                }

                tabState.start = new Date();
                tabState.actualDomain = domain;
            } else {
                /* Si antes estaba en un dominio, quiere decir que se fue del dominio */
                if (tabState.actualDomain) {
                    delete tabState.actualDomain;
                    delete tabState.lastDomain;
                }
            }
        });
    }
};

var updateIcon = function(active, rating) {
    var icon = {};
    
    if (rating) {
        if (rating.average === null) {
            if (active) {
                icon.path = adblockerInstalled ? icons.unknown.enabled : icons.unknown.enabledWithUpdate;
            } else {
                icon.path = adblockerInstalled ? icons.unknown.disabled : icons.unknown.disabledWithUpdate;
            }
        } else if (rating.average <= 40) {
            if (active) {
                icon.path = adblockerInstalled ? icons.unsafe.enabled : icons.unsafe.enabledWithUpdate;
            } else {
                icon.path = adblockerInstalled ? icons.unsafe.disabled : icons.unsafe.disabledWithUpdate;
            }
        } else {
            if (active) {
                icon.path = adblockerInstalled ? icons.safe.enabled : icons.safe.enabledWithUpdate;
            } else {
                icon.path = adblockerInstalled ? icons.safe.disabled :   icons.safe.disabledWithUpdate;
            }
        }
    } else {  /* Si hubo error lo marca como verde */
        if (active) {
            icon.path = adblockerInstalled ? icons.safe.enabled : icons.safe.enabledWithUpdate;
        } else {
            icon.path = adblockerInstalled ? icons.safe.disabled : icons.safe.disabledWithUpdate;
        }
    }

    chrome.browserAction.setIcon(icon);
};

var setIconNew = function(rating, tabId) {
    chrome.tabs.query({ 'active': true, 'lastFocusedWindow': true }, function(tabs) {
        var tab = tabs[0];
        /* Si la tab activa es igual a la que estamos actualizando, le cambia el icono */
        if (tab && tab.id == tabId) {
            /* Si tiene rating */
            var validUrl = validateUrl(tab.url);
            var domain = undefined;

            if (validUrl) {
                domain = parseDomain(tab.url);
            }

            handler.getNotificationStatus({ domain: domain }, null, function(response) {
                updateIcon(response.status, rating);
            });
        }
    });
};

var updateCurrentTabIcon = function() {
    chrome.tabs.query({ 'active': true, 'lastFocusedWindow': true }, function(tabs) {
        var tab = tabs[0];
        var rating = tabStates[tab.id].rating;
        setIconNew(rating, tab.id);
    });
};