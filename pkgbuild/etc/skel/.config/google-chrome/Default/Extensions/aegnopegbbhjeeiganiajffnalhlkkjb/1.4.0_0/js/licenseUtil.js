const license = function () {

    // Auto activate license key
    const activateLicenseKey = (key) => {
        // Activate key with extension install id
        return new Promise(function (resolve, reject) {
            chrome.storage.local.get({ 'installId': null }, (fetched) => {
                
                
                let data = JSON.stringify({
                    "key": {
                        "license": key
                    },
                    "uniqueId": fetched.installId,
                    "productCode": "BSA"
                });
                let isActive = false;
                let isExpired = false;
                let status = null;

                fetch("https://my.adaware.com/api/v1/license/activate", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "*/*"
                    },
                    body: data
                })
                .then(response => {
                    
                    if (response.status == 200) {
                        return response.text();
                    } else {
                        telemetry.sendMetaEvent('LicenseActivationFail', { Reason: this.response, licenseKey: key, status: this.status });
                        resolve(false);
                    }
                })
                .then(responseText => {
                    let blob = {};
                    blob = JSON.parse(responseText);
                    
                    if (blob.license.isExpired == false && blob.license.isActive == true && !blob.license.description.toLowerCase().includes("vpn")) {
                        isActive = true
                        chrome.storage.local.set({ licenseData: {"expiryDate" : blob.license.expiryDate, "isActive" : isActive, "isExpired" : isExpired, "license" : key, "status": status, "c": blob.license.type || null, "description": blob.license.description || null } });
                        telemetry.sendMetaEvent('LicenseActivationSuccess', { Reason: this.response, licenseKey: key, status: this.status });
                        resolve(true);
                    } else {
                        telemetry.sendMetaEvent('LicenseActivationFail', { Reason: this.response, licenseKey: key, status: this.status });
                        resolve(false);
                    }
                })
                .catch(error => {
                    
                });
            });
        });
    };

    // Remove license key
    const revokeLicenseKey = () => {
        // HTTP request to revoke key with unique id
        // Check if License localstorage exists or not
        chrome.storage.local.get({ licenseData: null }, function (result) {
            // If local data exists
            if (result.licenseData !== null) { 
                // Check if license key exists in local
                if (result.licenseData.license !== null && result.licenseData.license !== undefined) {
                    chrome.storage.local.get({ 'installId': null }, (fetched) => {
                        
                        // Revoke license using license api
                        let xhr = new XMLHttpRequest();
                        let data = JSON.stringify({
                            "key": {
                                "license": result.licenseData.license
                            },
                            "uniqueId": fetched.installId,
                            "productCode": "BSA"
                        });

                        xhr.open("POST", "https://my.adaware.com/api/v1/license/revoke");
                        xhr.setRequestHeader("Content-Type", "application/json");
                        xhr.setRequestHeader("Accept", "*/*");
                        xhr.addEventListener("readystatechange", function () {
                            if (this.readyState === 4) {
                                if (this.status == 200) {
                                    let blob = {};
                                    blob = JSON.parse(this.responseText);
                                    if (blob.message) {
                                        
                                        telemetry.sendMetaEvent('LicenseCancelled', { Reason: "Revoke successed", status: this.status });
                                    } else {
                                        
                                        telemetry.sendMetaEvent('LicenseCancelled', { Reason: "No key found in local", status: this.status });
                                    }
                                } else {
                                    
                                    telemetry.sendMetaEvent('LicenseCancelled', { Reason: this.response, status: this.status });
                                }
                            }
                        });
                        xhr.send(data);
                    });
                }

                // remove local sotrage
                
                chrome.storage.local.remove("licenseData");
                
            }
        });
    }

    // Check if license key is expired
    const expiryLicenseKey = () => {
        
        // check if key is in localstorage
        chrome.storage.local.get({ licenseData: null }, function (result) {
            
            if (result.licenseData !== null) {
                if (result.licenseData.license !== null && result.licenseData.license !== undefined) {
                    let licenseKey = result.licenseData.license;
                    

                    // fetch to see if license is valid or invalid
                    fetch("https://bsa.adaware.com/api/v1/license/status?license=" + licenseKey) // be7e64cb-9f08-49ba-b1cc-f368111e90e6
                    .then(response => {
                        if (response.status == 200) {
                            return response.text();
                        }
                    })
                    .then(responseText => {
                        let blob = {};
                        blob = JSON.parse(responseText);
                        
                        // isActive is true and IsExpired is false, license is valid
                        // else license is not valid
                        if (blob.isActive === false && blob.isExpired === false) {
                            
                            // if key is expired remove it from localstorage
                            chrome.storage.local.remove("licenseData");
                        }
                    })
                    .catch(error => {
                        
                    });
                }
            } else {
                
                chrome.storage.local.remove("licenseData");
            }
        });
    }

    return {
        activateKey: activateLicenseKey,
        revokeKey: revokeLicenseKey,
        expiryKey: expiryLicenseKey
    }

}();