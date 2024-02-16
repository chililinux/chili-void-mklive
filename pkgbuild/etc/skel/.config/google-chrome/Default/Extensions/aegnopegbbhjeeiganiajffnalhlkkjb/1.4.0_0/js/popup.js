
    
    let browserEnvironment = new systemUtil.browserEnvironmentData();
    let hasLicense = false;
    let partnerId = 'ut';
    let torrentArray = [];
    let numTorrentDisplayForFreeUser = 5;
    let numTorrents = 0;
    let currentUrl = window.location.href;

    // Create all elements
    let linkStyle = document.createElement('link');
    linkStyle.setAttribute('rel', 'stylesheet');
    linkStyle.setAttribute('href', chrome.runtime.getURL("../css/custom.css"));

    let popup = document.createElement('div');
    popup.setAttribute('id', 'torrent-scanner-popup');
    popup.setAttribute('style', 'display: none;');

    let wrapper = document.createElement('div');
    wrapper.setAttribute('id', 'yf-bt-wrapper');

    // Header section
    let header = document.createElement('div');
    header.setAttribute('class', 'header');
    let logo = document.createElement('img');
    logo.setAttribute('class', 'sts-logo');

    let searchContent = document.createElement('div');
    searchContent.setAttribute('class', 'search-content');
    let searchInput = document.createElement('input');
    searchInput.setAttribute('id', 'search-input');
    searchInput.setAttribute('class', 'search-input');
    searchInput.setAttribute('type', 'search');
    searchInput.setAttribute('placeholder', 'Start your search here...');
    let searchBtn = document.createElement('span');
    searchBtn.setAttribute('id', 'search-btn');
    searchBtn.setAttribute('class', 'search-btn');

    searchContent.append(searchInput, searchBtn);
    header.append(logo, searchContent);
    // End header section

    // Sync section
    let syncContainer = document.createElement('div');
    syncContainer.setAttribute('class', 'sync-container nav-se-container');
    let syncStep1 = document.createElement('div');
    syncStep1.setAttribute('class', 'nav-se-content');
    let syncIcon1 = document.createElement('img');
    syncIcon1.setAttribute('class', 'sync-icon nav-se-icon');
    syncIcon1.setAttribute('src', chrome.runtime.getURL("img/assets/icon-sync.svg"));
    let syncTitle1 = document.createElement('div');
    syncTitle1.setAttribute('class', 'nav-se-title');
    syncTitle1.innerHTML = "One more step to go before you start torrenting!";
    let syncText1 = document.createElement('p');
    syncText1.setAttribute('class', 'nav-se-text');
    syncText1.innerHTML = "This extension can sync results with BitTorrent and/or uTorrent for instant downloading.";
    let syncText2 = document.createElement('p');
    syncText2.setAttribute('class', 'nav-se-text');
    syncText2.innerHTML = "To activate this feature, please click on the button below, and then on the Chrome message to activate the 'Messaging Permission'.";
    let syncPermssionBtn = document.createElement('button');
    syncPermssionBtn.setAttribute('class', 'sync-permission-btn nav-se-btn');
    syncPermssionBtn.innerHTML = "Activate Messaging Permission";

    let syncStep2 = document.createElement('div');
    syncStep2.setAttribute('class', 'nav-se-content display-none');
    let syncIcon2 = document.createElement('img');
    syncIcon2.setAttribute('class', 'sync-icon nav-se-icon');
    syncIcon2.setAttribute('src', chrome.runtime.getURL("img/assets/icon-sync.svg"));
    let syncTitle2 = document.createElement('div');
    syncTitle2.setAttribute('class', 'nav-se-title');
    syncTitle2.innerHTML = "Syncing...";
    let syncText3 = document.createElement('p');
    syncText3.setAttribute('class', 'nav-se-text');
    syncText3.innerHTML = "Please allow Messaging Permissions in the proceeding Chrome message.";

    let syncStep3 = document.createElement('div');
    syncStep3.setAttribute('class', 'nav-se-content display-none');
    let syncIcon3 = document.createElement('img');
    syncIcon3.setAttribute('class', 'sync-icon nav-se-icon');
    syncIcon3.setAttribute('src', chrome.runtime.getURL("img/assets/icon-success.svg"));
    let syncTitle3 = document.createElement('div');
    syncTitle3.setAttribute('class', 'nav-se-title');
    syncTitle3.innerHTML = "Sync Complete";
    let syncText4 = document.createElement('p');
    syncText4.setAttribute('class', 'nav-se-text');
    syncText4.innerHTML = "You have successfully activated the “Messaging Permission” feature. All your search results will sync with BitTorrent and/or uTorrent.";

    syncStep1.append(syncIcon1, syncTitle1, syncText1, syncText2, syncPermssionBtn);
    syncStep2.append(syncIcon2, syncTitle2, syncText3);
    syncStep3.append(syncIcon3, syncTitle3, syncText4);
    syncContainer.append(syncStep1, syncStep2, syncStep3);
    // End sync section

    // License section
    let licenseContainer = document.createElement('div');
    licenseContainer.setAttribute('class', 'license-container nav-se-container');
    let licenseStep1 = document.createElement('div');
    licenseStep1.setAttribute('class', 'nav-se-content');
    let licenseIcon1 = document.createElement('img');
    licenseIcon1.setAttribute('class', 'nav-se-icon');
    licenseIcon1.setAttribute('src', chrome.runtime.getURL("img/assets/icon-key2.svg"));
    let licenseTitle1 = document.createElement('div');
    licenseTitle1.setAttribute('class', 'nav-se-title');
    licenseTitle1.innerHTML = "Enter License Key";
    let licenseText1 = document.createElement('p');
    licenseText1.setAttribute('class', 'nav-se-text');
    licenseText1.innerHTML = "Enter your license key and click on the activate button to start using ";
    let licenseInputKey = document.createElement('input');
    licenseInputKey.setAttribute('type', 'text');
    licenseInputKey.setAttribute('id', 'license-input-key');
    licenseInputKey.setAttribute('class', 'license-input-key');
    licenseInputKey.setAttribute('placeholder', 'Enter Key');
    let licenseLoading = document.createElement('div');
    licenseLoading.setAttribute('class', 'license-spinner');
    let licenseBounce1 = document.createElement('div');
    licenseBounce1.setAttribute('class', 'bounce1');
    let licenseBounce2 = document.createElement('div');
    licenseBounce2.setAttribute('class', 'bounce2');
    let licenseBounce3 = document.createElement('div');
    licenseBounce3.setAttribute('class', 'bounce3');
    let licenseActiveBtn = document.createElement('button');
    licenseActiveBtn.setAttribute('id', 'license-activate-button');
    licenseActiveBtn.setAttribute('class', 'license-activate-button nav-se-btn');
    licenseActiveBtn.innerHTML = 'Activate';
    let licenseText2 = document.createElement('p');
    licenseText2.innerHTML = "Don't have a license key? ";
    let licenseBuyLink = document.createElement('a');
    licenseBuyLink.setAttribute('class', 'license-buy-link');
    licenseBuyLink.setAttribute('target', '_blank');
    licenseBuyLink.innerHTML = 'Click here';
    let licenseName = document.createElement('span');
    licenseName.appendChild(document.createTextNode('Torrent Scanner Plus.'));
    
    let licenseStep2 = document.createElement('div');
    licenseStep2.setAttribute('class', 'nav-se-content display-none');
    let licenseIcon2 = document.createElement('img');
    licenseIcon2.setAttribute('class', 'nav-se-icon');
    licenseIcon2.setAttribute('src', chrome.runtime.getURL("img/assets/icon-success.svg"));
    let licenseTitle2 = document.createElement('div');
    licenseTitle2.setAttribute('class', 'nav-se-title');
    licenseTitle2.innerHTML = "Happy Torrenting!";
    let licenseText3 = document.createElement('p');
    licenseText3.setAttribute('class', 'nav-se-text');
    licenseText3.innerHTML = "You are now an active PRO user";
    let licenseText4 = document.createElement('p');
    licenseText4.setAttribute('class', 'nav-se-text');
    licenseText4.innerHTML = "Your key is valid until ";
    let licenseExpiryDate1 = document.createElement('span');
    licenseExpiryDate1.setAttribute('class', 'expiry-date');

    let licenseStep3 = document.createElement('div');
    licenseStep3.setAttribute('class', 'nav-se-content display-none');
    let licenseIcon3 = document.createElement('img');
    licenseIcon3.setAttribute('class', 'nav-se-icon');
    licenseIcon3.setAttribute('src', chrome.runtime.getURL("img/assets/icon-alert.svg"));
    let licenseTitle3 = document.createElement('div');
    licenseTitle3.setAttribute('class', 'nav-se-title');
    licenseTitle3.innerHTML = "Your license key has expired";
    let licenseText5 = document.createElement('p');
    licenseText5.setAttribute('class', 'nav-se-text');
    licenseText5.innerHTML = "Looks like your license key has expired, to renew your PRO license key, please select a license type:";
    let licenseBuyButton2 = document.createElement('a');
    licenseBuyButton2.setAttribute('class', 'upgrade-to-pro-button-2 buy-license-expiry-button');
    licenseBuyButton2.setAttribute('href', 'https://shop.lavasoft.com/clickgate/join.aspx?ref=shop.lavasoft.com&ujid=W9yhyAwEW5Q%3D');
    licenseBuyButton2.setAttribute('target', '_blank');
    licenseBuyButton2.innerHTML = 'Buy Torrent Scanner +';
    let licenseText6 = document.createElement('p');
    licenseText6.setAttribute('class', 'nav-se-text');
    licenseText6.innerHTML = 'Already have a license key? ';
    let licenseShowActivationLink = document.createElement('a');
    licenseShowActivationLink.setAttribute('class', 'link');
    licenseShowActivationLink.setAttribute('id', 'show-license-panel');
    licenseShowActivationLink.innerHTML = 'Click here';

    let licenseStep4 = document.createElement('div');
    licenseStep4.setAttribute('class', 'nav-se-content display-none');
    let licenseIcon4 = document.createElement('img');
    licenseIcon4.setAttribute('class', 'nav-se-icon');
    licenseIcon4.setAttribute('src', chrome.runtime.getURL("img/assets/icon-success.svg"));
    let licenseText7 = document.createElement('p');
    licenseText7.setAttribute('class', 'nav-se-text');
    licenseText7.innerHTML = "Your key is valid until ";
    let licenseExpiryDate2 = document.createElement('span');
    licenseExpiryDate2.setAttribute('class', 'expiry-date');
    let licenseText8 = document.createElement('p');
    licenseText8.setAttribute('class', 'nav-se-text');
    licenseText8.innerHTML = "Your License Key:";
    let licenseText9 = document.createElement('p');
    licenseText9.setAttribute('class', 'nav-se-text text-bold license-key-text');
    licenseText9.setAttribute('class', 'nav-se-text');
    let licenseText10 = document.createElement('p');
    licenseText10.setAttribute('class', 'nav-se-text margin-top-50');
    licenseText10.innerHTML = "Switch back to Torrent Scanner Free?";
    let activateFreeBtn = document.createElement('button');
    activateFreeBtn.setAttribute('class', 'activate-free-btn nav-se-btn');
    activateFreeBtn.innerHTML = "Revert to Free Version";

    licenseText1.appendChild(licenseName);
    licenseText2.appendChild(licenseBuyLink);
    licenseText4.appendChild(licenseExpiryDate1);
    licenseText6.appendChild(licenseShowActivationLink);
    licenseText7.appendChild(licenseExpiryDate2);
    licenseStep1.append(licenseIcon1, licenseTitle1, licenseText1, licenseInputKey, licenseLoading, licenseActiveBtn, licenseText2);
    licenseStep2.append(licenseIcon2, licenseTitle2, licenseText3, licenseText4);
    licenseStep3.append(licenseIcon3, licenseTitle3, licenseText5, licenseBuyButton2, licenseText6);
    licenseStep4.append(licenseIcon4, licenseText7, licenseText8, licenseText9, licenseText10, activateFreeBtn);
    licenseContainer.append(licenseStep1, licenseStep2, licenseStep3, licenseStep4);
    // End license section

    // To test expiry button 
    // let resetExpiryDateButton = document.createElement('button');
    // resetExpiryDateButton.innerHTML = 'Reset expiry date';
    // licenseStep4.appendChild(resetExpiryDateButton);

    // Only to test expiry date event on click
    // resetExpiryDateButton.addEventListener('click', () => {
    //     chrome.storage.local.set({ licenseData: {"expiryDate" : "2022-06-30T00:00:00", "isActive" : 'true', "isExpired" : 'true', "license" : "be7e64cb-9f08-49ba-b1cc-f368111e90e6", "status": 'Active', "c": null, "description": 'BitTorrent Web Pro.' }});
    // });

    // Feedback Section
    let feedbackContainer = document.createElement('div');
    feedbackContainer.setAttribute('class', 'feedback-container nav-se-container');
    let feedbackStep1 = document.createElement('div');
    feedbackStep1.setAttribute('class', 'nav-se-content');
    let feedbackIcon1 = document.createElement('img');
    feedbackIcon1.setAttribute('class', 'nav-se-icon');
    feedbackIcon1.setAttribute('src', chrome.runtime.getURL("img/assets/icon-feedback.svg"));
    let feedbackTitle1 = document.createElement('div');
    feedbackTitle1.setAttribute('class', 'nav-se-title');
    feedbackTitle1.innerHTML = "Feedback";
    let feedbackText1 = document.createElement('p');
    feedbackText1.setAttribute('class', 'nav-se-text');
    feedbackText1.innerHTML = "Help us improve Torrent Scanner, send us comments, bugs, feedback, and suggestions.";
    let feedbackBtn = document.createElement('button');
    feedbackBtn.setAttribute('id', 'feedback-button');
    feedbackBtn.setAttribute('class', 'feedback-button nav-se-btn');
    feedbackBtn.innerHTML = 'Send Feedback';


    feedbackStep1.append(feedbackIcon1, feedbackTitle1, feedbackText1, feedbackBtn);
    feedbackContainer.appendChild(feedbackStep1);
    // End feedback section

    // Settings section
    let settingsContainer = document.createElement('div');
    settingsContainer.setAttribute('class', 'settings-container nav-se-container');
    let settingsHeader = document.createElement('div');
    settingsHeader.setAttribute('class', 'nav-se-content');
    let settingsTitle = document.createElement('div');
    settingsTitle.setAttribute('class', 'settings-title');
    settingsTitle.innerHTML = 'Settings';

    let settingsTable = document.createElement('div');
    settingsTable.setAttribute('class', 's-table');

    let faqRow = document.createElement('div');
    faqRow.setAttribute('class', 's-row');
    let faqTitle = document.createElement('div');
    faqTitle.setAttribute('class', 's-title');
    faqTitle.innerHTML = 'FAQ';
    let faqArrow = document.createElement('div');
    faqArrow.setAttribute('class', 's-arrow');
    let faqArrowIcon = document.createElement('span');
    faqArrowIcon.setAttribute('class', 'arrow-down');
    let faqContent = document.createElement('div');
    faqContent.setAttribute('class', 's-content faq-content');
    let faqText = document.createElement('p');
    faqText.setAttribute('class', 'faq-text');
    faqText.innerHTML = 'FAQ: <a href="' + chrome.runtime.getURL("./faq.html") + '" target="_blank">Click here</a>';

    faqContent.appendChild(faqText);
    faqArrow.appendChild(faqArrowIcon);
    faqTitle.appendChild(faqArrow);
    faqRow.append(faqTitle, faqContent);

    let rateRow = document.createElement('div');
    rateRow.setAttribute('class', 's-row');
    let rateTitle = document.createElement('div');
    rateTitle.setAttribute('class', 's-title');
    rateTitle.innerHTML = 'Rate the extension';
    let rateArrow = document.createElement('div');
    rateArrow.setAttribute('class', 's-arrow');
    let rateArrowIcon = document.createElement('span');
    rateArrowIcon.setAttribute('class', 'arrow-down');
    let rateContent = document.createElement('div');
    rateContent.setAttribute('class', 's-content');
    let rateText = document.createElement('p');
    rateText.setAttribute('class', 'rate-text');
    rateText.innerHTML = 'How did you like the extension experience?';
    let rating = document.createElement('div');
    rating.setAttribute('class', 'rating');
    
    for (let i = 0; i < 5; i++) {
        let ratingStar = document.createElement('span');
        ratingStar.setAttribute('class', 'rating-star');
        ratingStar.innerHTML = '&#9733;';
        rating.appendChild(ratingStar);
    }

    let ratingSubmit = document.createElement('button');
    ratingSubmit.setAttribute('class', 'rating-btn nav-se-btn');
    ratingSubmit.setAttribute('disabled', '');
    ratingSubmit.innerHTML = 'Submit';

    rateContent.append(rateText, rating, ratingSubmit);
    rateArrow.appendChild(rateArrowIcon);
    rateTitle.appendChild(rateArrow);
    rateRow.append(rateTitle, rateContent);

    let aboutRow = document.createElement('div');
    aboutRow.setAttribute('class', 's-row');
    let aboutTitle = document.createElement('div');
    aboutTitle.setAttribute('class', 's-title');
    aboutTitle.innerHTML = 'About';
    let aboutArrow = document.createElement('div');
    aboutArrow.setAttribute('class', 's-arrow');
    let aboutArrowIcon = document.createElement('span');
    aboutArrowIcon.setAttribute('class', 'arrow-down');
    let aboutContent = document.createElement('div');
    aboutContent.setAttribute('class', 's-content about-content');
    let aboutVersion = document.createElement('div');
    aboutVersion.setAttribute('class', 'about-version');
    aboutVersion.innerHTML = 'Version ' + chrome.runtime.getManifest().version + ' <br><br> What\'s New';
    let aboutNew = document.createElement('div');
    aboutNew.setAttribute('class', 'about-new');
    aboutNew.innerHTML = '<p><ul><li>Experience a complete new User Interface of the extension. It is enhanced and user friendly now.</li><li>Squashed some bugs.</il></ul></p>';

    aboutContent.append(aboutVersion, aboutNew);
    aboutArrow.appendChild(aboutArrowIcon);
    aboutTitle.appendChild(aboutArrow);
    aboutRow.append(aboutTitle, aboutContent);

    let policyRow = document.createElement('div');
    policyRow.setAttribute('class', 's-row');
    let policyTitle = document.createElement('div');
    policyTitle.setAttribute('class', 's-title');
    policyTitle.innerHTML = 'Privacy Policy';
    let policyArrow = document.createElement('div');
    policyArrow.setAttribute('class', 's-arrow');
    let policyArrowIcon = document.createElement('span');
    policyArrowIcon.setAttribute('class', 'arrow-down');
    let policyContent = document.createElement('div');
    policyContent.setAttribute('class', 's-content');
    let policyTexts = document.createElement('div');
    policyTexts.setAttribute('class', 'policy-text');
    policyTexts.innerHTML = 'Adaware Software (7270356 Canada Inc.) is the operator of the Adaware products suites and related services (the “<b>Company</b>”, ”<b>we</b>” or “<b>us</b>”). We respect your privacy rights and we are committed to protecting them. This privacy policy (“<b>Privacy Policy</b>” or simply “<b>policy</b>”) governs our products, services and websites that link to this Privacy Policy, and describes our practices of processing data from you. By “<b>you</b>”, we refer to either or all of the following: (i) visitors to our websites that links to this Privacy Policy (“<b>Visitor</b>” and “<b>Website</b>”, respectively); (ii) our customers using our software products and Services (“<b>User</b>”); and (c) a business customer, a business partner that has a contractual relationship with us or a prospective customer that is yet to be engaged in a contract with us (“Business Customer”). Unless explicitly mentioned otherwise, the information in this Privacy Policy refers to any and all data subject types (“you” or “your’). <br><br> For the purpose of this policy, the “<b>Service(s)</b>” shall include any software licensed by the Company, including features offered by or within the installed software or additional software scripts available therein (either downloaded from one of our websites, pre-installed on your device, downloaded through a third party website, obtained on a physical medium, or otherwise), or services provided through and/or on top such software, services offered on our websites, communication forums, support services, account operation, updates, enhancements, new features, premium support, extended guarantees, online version and free versions of a software or additional services or features as we ay make available from time to time. <br><br> If you are a California resident, please also see our <a href="https://www.adaware.com/CCPA/" target="_blank">CCPA Notice</a>. <br><br> <a href="https://www.adaware.com/privacy-policy/" target="_blank">Read more</a>';

    policyContent.appendChild(policyTexts);
    policyArrow.appendChild(policyArrowIcon);
    policyTitle.appendChild(policyArrow);
    policyRow.append(policyTitle, policyContent);

    let contactRow = document.createElement('div');
    contactRow.setAttribute('class', 's-row');
    let contactTitle = document.createElement('div');
    contactTitle.setAttribute('class', 's-title');
    contactTitle.innerHTML = 'Contact Us';
    let contactArrow = document.createElement('div');
    contactArrow.setAttribute('class', 's-arrow');
    let contactArrowIcon = document.createElement('span');
    contactArrowIcon.setAttribute('class', 'arrow-down');
    let contactContent = document.createElement('div');
    contactContent.setAttribute('class', 's-content');
    let contactText = document.createElement('div');
    contactText.setAttribute('class', 'contact-text');
    contactText.innerHTML = 'For any payment and order-related support, please contact us at Email: <a href=\'mailto:support@torrentscanner.zendesk.com\'>support@torrentscanner.zendesk.com</a> or <a href=\'mailto:pcsoftwareinfo.com\'>pcsoftwareinfo.com</a><br><br>Phone: <a href=\'https://pcsoftwareinfo.com/contact.aspx\' target="_blank">Click here</a>';

    contactContent.append(contactText);
    contactArrow.appendChild(contactArrowIcon);
    contactTitle.appendChild(contactArrow);
    contactRow.append(contactTitle, contactContent);
    
    settingsTable.append(faqRow, rateRow, aboutRow, policyRow, contactRow);
    settingsHeader.appendChild(settingsTitle);
    settingsContainer.append(settingsHeader, settingsTable);
    // End settings section

    // Content section
    let container = document.createElement('div');
    container.setAttribute('class', 'container');

    let mainContainer = document.createElement('div');
    mainContainer.setAttribute('class', 'main-container');

    let torrentContainer = document.createElement('div');
    torrentContainer.setAttribute('id', 'torrent-data');
    torrentContainer.setAttribute('class', 'torrent-content');

    let checkSection = document.createElement('div');
    checkSection.setAttribute('id', 'checked-sites');
    checkSection.setAttribute('class', 'checked-sites-section');
    let checkLeft = document.createElement('div');
    checkLeft.setAttribute('class', 'left');
    checkLeft.appendChild(document.createTextNode('Checked Sites'));
    let checkRight = document.createElement('div');
    checkRight.setAttribute('class', 'right');
    // let maliciousCount = document.createElement('span');
    // maliciousCount.setAttribute('id', 'mal-count');
    // maliciousCount.setAttribute('class', 'mal-count');
    // maliciousCount.appendChild(document.createTextNode('0'));
    let sitesCount = document.createElement('span');
    sitesCount.setAttribute('id', 'sites-count');
    sitesCount.setAttribute('class', 'sites-count');
    sitesCount.appendChild(document.createTextNode('0'));

    // checkRight.append(maliciousCount);
    checkRight.append(sitesCount);
    checkSection.append(checkLeft, checkRight);

    let torrentTable = document.createElement('div');
    torrentTable.setAttribute('class', 't-table');
    let torrentTableHeader = document.createElement('div');
    torrentTableHeader.setAttribute('class', 't-header');
    let torrentTableName = document.createElement('div');
    torrentTableName.setAttribute('class', 't-name');
    torrentTableName.appendChild(document.createTextNode('Torrent search results'));

    torrentTableHeader.append(torrentTableName);

    let torrentTableBody = document.createElement('div');
    torrentTableBody.setAttribute('id', 'table-body');
    torrentTableBody.setAttribute('class', 't-body');

    let loadingContainer = document.createElement('div');
    loadingContainer.setAttribute('id', 'loading');
    loadingContainer.setAttribute('class', 'spinner');

    let bounce1 = document.createElement('div');
    bounce1.setAttribute('class', 'bounce1');
    let bounce2 = document.createElement('div');
    bounce2.setAttribute('class', 'bounce2');
    let bounce3 = document.createElement('div');
    bounce3.setAttribute('class', 'bounce3');

    loadingContainer.append(bounce1, bounce2, bounce3);
    licenseLoading.append(licenseBounce1, licenseBounce2, licenseBounce3);

    let torrentMessageContainer = document.createElement('div');
    torrentMessageContainer.setAttribute('class', 'table-message-container');
    torrentMessageContainer.setAttribute('id', 'table-message');
    let torrentTableMessage = document.createElement('p');
    torrentTableMessage.innerHTML = 'No items to list <br> Use the search bar above for instant results';

    let searchTooltip = document.createElement('div');
    searchTooltip.setAttribute('class', 'tooltip');
    let searchTooltipText = document.createElement('p');
    searchTooltipText.setAttribute('class', 'tooltip-text');
    searchTooltipText.innerHTML = 'To see search results, type here and hit `Enter`';

    searchTooltip.appendChild(searchTooltipText);
    torrentMessageContainer.appendChild(torrentTableMessage);
    torrentTableBody.append(loadingContainer, torrentMessageContainer);
    torrentTable.append(torrentTableHeader, checkSection, torrentTableBody);
    torrentContainer.append(torrentTable);
    mainContainer.append(torrentContainer, searchTooltip);
    container.append(mainContainer, syncContainer, licenseContainer, feedbackContainer, settingsContainer);
    // End content section

    // Footer section
    let footer = document.createElement('div');
    footer.setAttribute('class', 'footer');
    let footerContent = document.createElement('span');
    let torrentNum = document.createElement('span');
    torrentNum.setAttribute('id', 'numberScanned');
    torrentNum.setAttribute('class', 'numberScanned');
    torrentNum.appendChild(document.createTextNode('No results'));

    footerContent.append(torrentNum);
    footer.append(footerContent);
    // End footer section

    // Navigation menu
    let nav = document.createElement('div');
    nav.setAttribute('class', 'nav');

    let btnSync = document.createElement('button');
    btnSync.setAttribute('id', 'btnSync');
    btnSync.setAttribute('class', 'nav-btn');
    btnSync.appendChild(document.createTextNode('Sync'));
    let btnLicense = document.createElement('button');
    btnLicense.setAttribute('id', 'btnLicense');
    btnLicense.setAttribute('class', 'nav-btn');
    btnLicense.appendChild(document.createTextNode('License'));
    let btnHome = document.createElement('button');
    btnHome.setAttribute('id', 'btnHome');
    btnHome.setAttribute('class', 'nav-btn');
    btnHome.appendChild(document.createTextNode('Home'));
    let btnFeedback = document.createElement('button');
    btnFeedback.setAttribute('id', 'btnFeedback');
    btnFeedback.setAttribute('class', 'nav-btn');
    btnFeedback.appendChild(document.createTextNode('Feedback'));
    let btnSettings = document.createElement('button');
    btnSettings.setAttribute('id', 'btnSettings');
    btnSettings.setAttribute('class', 'nav-btn');
    btnSettings.appendChild(document.createTextNode('Settings'));

    nav.append(btnSync, btnLicense, btnHome, btnFeedback, btnSettings);
    // End navigation menu

    mainContainer.appendChild(footer);
    wrapper.append(header, container, nav);
    document.body.appendChild(popup);

    let shadow = popup.attachShadow({ mode: 'open' });
    shadow.append(linkStyle, wrapper);

    // select rating starts
    const ratingStars = [...popup.shadowRoot.querySelectorAll(".rating-star")];
    const starsLength = ratingStars.length;
    let starIndex;
    ratingStars.map((star) => {
        star.onclick = () => {
            starIndex = ratingStars.indexOf(star);
            
            if (starIndex === 0 && ratingStars[0].className == 'rating-star orange-star') {
                ratingSubmit.disabled = true;
            } else {
                ratingSubmit.disabled = false;
            }

            if (star.className === 'rating-star') {
                for (starIndex; starIndex >= 0; --starIndex) ratingStars[starIndex].className = 'rating-star orange-star';
            } else {
                for (starIndex; starIndex < starsLength; ++starIndex) ratingStars[starIndex].className = 'rating-star';
            }
        }
    });

    ratingSubmit.addEventListener('click', () => {
        const orangeStars = [...popup.shadowRoot.querySelectorAll(".orange-star")];
        if (orangeStars.length <= 2) {
            window.open('https://forms.office.com/pages/responsepage.aspx?id=_b96hxOif0eSxRSrbE4jRxkVRMubrFJFgQPtdniM8HhUOFk4VkxBN1c2MUg4OVhPMkpRUzRYUFEzTy4u', '_blank');
        }

        if (orangeStars.length > 2) {
            window.open('https://chrome.google.com/webstore/detail/safe-torrent-scanner/aegnopegbbhjeeiganiajffnalhlkkjb/reviews', '_blank');
        }
    });

    const settingsTitles = [...popup.shadowRoot.querySelectorAll(".s-row")];
    settingsTitles.map((title) => {
        title.onclick = (ev) => {
            
            let target = ev.target;
            let arrowTarget = target;
            
            if (target.className !== 's-title') {
                
                target = target.closest(".s-title")?.nextSibling;
                arrowTarget = ev.target;
            } else {
                target = target.nextSibling;
                arrowTarget = arrowTarget.childNodes[1].childNodes[0];
            }

            
            
            if (target?.className.indexOf('s-content') != -1) {
                target?.classList.toggle('show-content');
            }
        
            if (arrowTarget?.className == 'arrow-down') {
                arrowTarget.className = arrowTarget.className.replace('arrow-down', 'arrow-up');
            } else {
                arrowTarget.className = arrowTarget.className.replace('arrow-up', 'arrow-down');
            }
        }
    });

    // document body clicked
    document.body.addEventListener('click', (ev) => {
        if (ev.target?.id !== "torrent-scanner-popup") {
            popup.style.display = 'none';
        }
    });

    // upgrade to pro button clicked
    // upgradeToProBtn.addEventListener('click', () => {
    //     settingWrapper.style.display = 'block';
    //     wrapper.style.display = 'none';

    //     chrome.runtime.sendMessage({
    //         what: 'eventType',
    //         name: 'UpgradetoProButton',
    //         clicked: 'button'
    //     });
    // });

    licenseShowActivationLink.addEventListener('click', () => {
        licenseStep1.style.display = 'block';
        licenseStep3.style.display = 'none';
    });

    btnSettings.addEventListener('click', () => {
        chrome.runtime.sendMessage({
            what: 'eventType',
            name: 'SettingsButton',
            clicked: 'button'
        });
    });

    searchInput.addEventListener('click', () => {
        searchTooltip.style.display = 'none';
    });

    searchInput.addEventListener('keypress', (event) => {
        let torrentWord = 'torrent';
        searchTooltip.style.display = 'none';
        
        if (searchInput.value.indexOf(torrentWord) !== -1) {
            torrentWord = '';
        }
        if (event.key === "Enter") {
            if (browserEnvironment.BrowserFamily == "Opera") {
                window.open('https://www.google.com/search?q=' + searchInput.value + ' ' + torrentWord + "&client=opera&sourceid=opera&ie=UTF-8&oe=UTF-8", '_top');
            } else {
                window.open('https://www.google.com/search?q=' + searchInput.value + ' ' + torrentWord, '_top');
            }
        }

        chrome.runtime.sendMessage({
            what: 'popupSearchBar',
            fromPopUI: true,
            searchEngine: "google",
            searchQuery: searchInput.value
        });
    });

    searchBtn.addEventListener('click', () => {
        let torrentWord = 'torrent';
        if (searchInput.value.indexOf(torrentWord) !== -1) {
            torrentWord = '';
        }
        if (browserEnvironment.BrowserFamily == "Opera") {
            window.open('https://www.google.com/search?q=' + searchInput.value + ' ' + torrentWord + "&client=opera&sourceid=opera&ie=UTF-8&oe=UTF-8", '_top');
        } else {
            window.open('https://www.google.com/search?q=' + searchInput.value + ' ' + torrentWord, '_top');
        }

        chrome.runtime.sendMessage({
            what: 'popupSearchBar',
            fromPopUI: true,
            searchEngine: "google",
            searchQuery: searchInput.value
        });
    }); 

    // Activate license trigger
    licenseActiveBtn.addEventListener('click', () => {
        let licenseKey = (licenseInputKey.value).trim() || '';

        // first when activation button clicked, display loading icon
        licenseLoading.style.display = 'block';

        chrome.runtime.sendMessage({what: "activateLicense", data: { licenseKey: licenseKey }}, (response) => {
            licenseLoading.style.display = 'none';

            if (response.request) {
                // reload page
                let successAlert = document.createElement('div');
                successAlert.setAttribute('class', 'alert-success');
                successAlert.innerHTML = 'License key successful!';
                licenseContainer.appendChild(successAlert);

                licenseInputKey.value = '';
                licenseInputKey.placeholder = 'License Activated';
                licenseInputKey.style.border = '1px solid #4CBF03';
                licenseInputKey.disabled = true;
                licenseActiveBtn.disabled = true;
                licenseTitle1.innerHTML = 'Pro License Key Activated';
                licenseText2.remove();

                // update license data
                updateLicenseData();
                let rows = [...popup.shadowRoot.querySelectorAll(".t-row")];
                let promotionPopup = popup.shadowRoot.querySelectorAll(".upgradeProPanel");
                let bar = popup.shadowRoot.querySelector("#checked-sites");
                promotionPopup[0].remove();
                bar.style.display = 'block';
                rows.map((row) => {
                    row.classList.remove('display-none');
                });

                contactRow.style.display = 'block';
            } else {
                licenseInputKey.value = '';
                // licenseInputKey.placeholder = 'Invalid License Key, try again.';
                licenseInputKey.style.border = '1px solid #FF846E';
                let warningAlert = document.createElement('div');
                warningAlert.setAttribute('class', 'alert-warning');
                warningAlert.innerHTML = 'Invalid license key!';
                licenseContainer.appendChild(warningAlert);
            }
        });

        chrome.runtime.sendMessage({
            what: 'eventType',
            name: 'ActivateButton',
            clicked: 'button'
        });
    });

    activateFreeBtn.addEventListener('click', () => {
        chrome.runtime.sendMessage({what: "deactivateLicense"}, (response) => {
            if (response.request) {
                window.location.reload();
            }
        });
    });

    // Buy button clicked
    licenseBuyLink.addEventListener('click', () => {
        chrome.storage.local.get({ 'b' : null }, (data) => {
            if (data.b == "bt") {
                if (browserEnvironment.BrowserFamily == "Opera") {
                    window.open("https://gateway.lavasoft.com/ext/buy/bittorrentpro/?mkey7=Opera", "_blank");
                } else if (browserEnvironment.BrowserFamily == "Edge") {
                    window.open("https://gateway.lavasoft.com/ext/buy/bittorrentpro/?mkey7=EDGE ", "_blank");
                } else {
                    window.open("https://gateway.lavasoft.com/ext/buy/bittorrentpro/", "_blank");
                }
            } else if (data.b == "ut") {
                if (browserEnvironment.BrowserFamily == "Opera") {
                    window.open("https://gateway.lavasoft.com/ext/buy/utorrentpro/?mkey7=Opera", "_blank");
                } else if (browserEnvironment.BrowserFamily == "Edge") {
                    window.open("https://gateway.lavasoft.com/ext/buy/utorrentpro/?mkey7=EDGE", "_blank");
                } else {
                    window.open("https://gateway.lavasoft.com/ext/buy/utorrentpro/", "_blank");
                }
            } else {
                if (browserEnvironment.BrowserFamily == "Opera") {
                    window.open("https://shop.lavasoft.com/clickgate/join.aspx?ref=shop.lavasoft.com&ujid=W9yhyAwEW5Q%3D&mkey7=Opera", "_blank");
                } else if (browserEnvironment.BrowserFamily == "Edge") {
                    window.open("https://shop.lavasoft.com/clickgate/join.aspx?ref=shop.lavasoft.com&ujid=W9yhyAwEW5Q%3D&mkey7=EDGE", "_blank");
                } else {
                    window.open("https://shop.lavasoft.com/clickgate/join.aspx?ref=shop.lavasoft.com&ujid=W9yhyAwEW5Q%3D", "_blank");
                }
            }
        });

        chrome.runtime.sendMessage({
            what: 'eventType',
            name: 'PurchaseLicenseButton',
            clicked: 'button'
        });
    });

    const createPermissionBanner = () => {
        let permissionPanel = document.createElement("div");
        permissionPanel.setAttribute("id", "ys-bt-permission-banner");
        let containerPermission = document.createElement('div');
        containerPermission.setAttribute("class", "container");
        let perPargh = document.createElement("p");
        perPargh.appendChild(document.createTextNode("Click the 'Sync' button below to sync extension results to BitTorrent or uTorrent for easy downloading. Activate the 'Messaging Permission' in Chrome when prompted."));
        let perBtn = document.createElement("button");
        perBtn.setAttribute("class", "per-btn");
        perBtn.appendChild(document.createTextNode("Sync Now"));
        let noThanksLink = document.createElement("a");
        noThanksLink.setAttribute("class", "per-link");
        noThanksLink.setAttribute("href", "javascript:void(0);");
        noThanksLink.appendChild(document.createTextNode("Remind me later"));
        let perX = document.createElement("span");
        perX.setAttribute("id", "per-x");
        perX.setAttribute("class", "per-x");
        perX.innerHTML = "&#215;";

        let overlay = document.createElement('div');
        overlay.setAttribute('class', 'permission-overlay');

        containerPermission.appendChild(perX);
        containerPermission.appendChild(perBtn);
        containerPermission.appendChild(perPargh);
        containerPermission.appendChild(noThanksLink);
        permissionPanel.appendChild(containerPermission);
        wrapper.appendChild(permissionPanel);

        mainContainer.appendChild(overlay);

        perBtn.addEventListener('click', () => {
            chrome.runtime.sendMessage({
                what: 'requestPermissions',
                permissions: ['nativeMessaging']
            }, (result) => {
                if (result.request === true) {
                    // reload page
                    // window.location.reload();
                    overlay.remove();
                    permissionPanel.remove();
                    syncStep1.style.display = 'none';
                    syncStep3.style.display = 'block';
                } else {
                    chrome.storage.local.set({ openPanelCount: 3 });
                    window.location.reload();
                }
            });
        });

        noThanksLink.addEventListener('click', () => {
            permissionPanel.remove();
            overlay.remove();
        }); 

        perX.addEventListener('click', () => {
            permissionPanel.remove();
            overlay.remove();
        }); 
    }

    chrome.runtime.sendMessage({
        what: 'containsPermissions',
        permissions: ['nativeMessaging']
    }, (result) => {
        if (result.request === true) {
            if (browserEnvironment.BrowserFamily == "Edge") {
                btnSync.style.display = 'none';
            }
            syncStep1.style.display = 'none';
            syncStep2.style.display = 'none';
            syncStep3.style.display = 'block';
        } else {
            if (browserEnvironment.BrowserFamily != "Edge") {
                chrome.runtime.sendMessage({
                    what: 'requestPermissionBanner'
                }, (result) => {
                    if (result) {
                        if (result.count < 3) {
                            createPermissionBanner();
                        }
                        // createPermissionBanner();
                    }
                });
            }
        }
    });

    // Sync permission button clicked
    syncPermssionBtn.addEventListener('click', () => {
        syncStep1.style.display = 'none';
        syncStep2.style.display = 'block';
        chrome.runtime.sendMessage({
            what: 'requestPermissions',
            permissions: ['nativeMessaging']
        }, (result) => {
            if (result.request === true) {
                // reload page
                // window.location.reload();
                syncContainer.style.display = 'none';
                syncStep2.style.display = 'none';
                syncStep3.style.display = 'block';
            } else {
                chrome.storage.local.set({ openPanelCount: 3 });
                window.location.reload();
            }
        });
    });

    const navigationMenu = (element) => {
        
        let currentBtn = element.target;
        const navBtns = popup.shadowRoot.querySelectorAll(".nav-btn");

        for (let i = 0; i < navBtns.length; i++) {
            if (navBtns[i].id === currentBtn.id) {
                navBtns[i].classList.add("selected");

                if (currentBtn.id === navBtns[i].id) {
                    const panels = [...popup.shadowRoot.querySelectorAll(".nav-se-container")];
                    panels.map((panel) => {
                        panel.style.display = 'none';
                    });
                }
            } else {
                navBtns[i].classList.remove("selected");
            }
        }
    }

    btnHome.addEventListener('click', (e) => {
        navigationMenu(e);
    });

    btnSync.addEventListener('click', (e) => {
        navigationMenu(e);
        syncContainer.style.display = 'block';

        let permissionBanner = popup.shadowRoot.querySelector("#ys-bt-permission-banner");
        let permissionBannerOverlay = popup.shadowRoot.querySelectorAll(".permission-overlay");
        if (permissionBanner) {
            permissionBanner.remove();
            permissionBannerOverlay[0].remove();
        }
    });

    btnLicense.addEventListener('click', (e) => {
        navigationMenu(e);
        licenseContainer.style.display = 'block';
    });

    btnFeedback.addEventListener('click', (e) => {
        navigationMenu(e);
        feedbackContainer.style.display = 'block';

        chrome.runtime.sendMessage({
            what: 'eventType',
            name: 'FeedbackButton',
            clicked: 'button'
        });
    });

    btnSettings.addEventListener('click', (e) => {
        navigationMenu(e);
        settingsContainer.style.display = 'block';
    });

    feedbackBtn.addEventListener('click', () => {
        window.open("https://forms.office.com/pages/responsepage.aspx?id=_b96hxOif0eSxRSrbE4jRxkVRMubrFJFgQPtdniM8HhUQ1pZNkE0U1ZHWkE0QVU1NUhJVUY1RDdWNS4u", "_blank");
    });

    const updateLicenseData = () => {
        chrome.storage.local.get({ 'licenseData': null }, (data) => {
            
            if (data.licenseData !== null) {
                wrapper.classList.add('free');
                hasLicense = data.licenseData.isActive;
    
                licenseStep1.style.display = 'none';

                licenseStep4.style.display = 'block';
                licenseText9.style.fontWeight = 'bold';
                licenseText9.innerHTML = data.licenseData.license;
                

                if (data.licenseData.description.toLowerCase().includes('bittorrent')) {
                    licenseName.innerHTML = 'BitTorrent Web Pro.';
                    logo.src = chrome.runtime.getURL('img/assets/bt-pro-logo.png');
                } else if (data.licenseData.description.toLowerCase().includes("utorrent")) {
                    licenseName.innerHTML = 'uTorrent Web Pro.';
                    logo.src = chrome.runtime.getURL('img/assets/ut-pro-logo.png');
                } else if (data.licenseData.description.toLowerCase().includes("torrent scanner plus")) {
                    licenseName.innerHTML = 'Torrent Scanner +.';
                    logo.src = chrome.runtime.getURL('img/assets/ts-plus-logo.png');
                } else {
                    logo.src = chrome.runtime.getURL('img/assets/bt-pro-logo.png');
                }

                if (data.licenseData.expiryDate !== null) {
                    let date = new Date(data.licenseData.expiryDate);
                    let dateFormat = date.toLocaleString('default', { month: 'long' }) + ' ' + date.getDay() + ', ' + date.getFullYear();
                    licenseExpiryDate1.innerHTML = dateFormat;
                    licenseExpiryDate2.innerHTML = dateFormat;
                }
    
                let expiryDate = new Date(data.licenseData.expiryDate);
                let now = new Date();
                if (expiryDate < now) {
                    
                    licenseStep4.style.display = 'none';
                    licenseStep3.style.display = 'block';
                    hasLicense = false;
                }
            } 
    
            if (hasLicense === false) {
                logo.src = chrome.runtime.getURL('img/assets/ts-free-logo.png');
                wrapper.classList.remove('pro');
                wrapper.classList.add('free');
                contactRow.style.display = 'none';
                createPromotionBanner();
            }
        });
    }

    const createPromotionBanner = () => {
        if (!hasLicense) {
            let upgradeProPanel = document.createElement("div");
            upgradeProPanel.setAttribute("class", "upgradeProPanel");
            let title = document.createElement("div");
            title.setAttribute("class", "upgradeProPanelTitle");
            title.appendChild(document.createTextNode("Try our Torrent Scanner Plus to unlock:"));

            let upgradeProPanelList = document.createElement("div");
            upgradeProPanelList.setAttribute("class", "upgradeProPanelList");
            let check1 = document.createElement("span");
            let text1 = document.createElement("p");
            let proPanelList1 = document.createElement("div");
            let check2 = document.createElement("span");
            let text2 = document.createElement("p");
            let proPanelList2 = document.createElement("div");
            let check3 = document.createElement("span");
            let check4 = document.createElement("span");
            let text4 = document.createElement("p");
            let proPanelList4 = document.createElement("div");

            text1.append(document.createTextNode("Faster Results")); 
            text2.append(document.createTextNode("Secure Torrenting"));
            text4.innerHTML = "Unlimited Search Results with detailed torrent info";
            proPanelList1.append(text1);
            proPanelList2.append(text2);
            proPanelList4.append(text4);
            upgradeProPanelList.append(proPanelList1, proPanelList4, proPanelList2);

            let buyProButton = document.createElement("a");
            buyProButton.setAttribute("class", "upgrade-to-pro-button-2");
            buyProButton.setAttribute("id", "buy-pro");
            buyProButton.appendChild(document.createTextNode("Get Torrent Scanner +"));
            buyProButton.setAttribute("href", "https://shop.lavasoft.com/clickgate/join.aspx?ref=shop.lavasoft.com&ujid=W9yhyAwEW5Q%3D");
            buyProButton.setAttribute("target", "_blank");

            upgradeProPanel.append(title, upgradeProPanelList, buyProButton);
            mainContainer.appendChild(upgradeProPanel);

            buyProButton.addEventListener("click", () => {
                
                chrome.runtime.sendMessage({
                    what: 'eventType',
                    name: 'UpgradetoProButton',
                    clicked: 'button'
                });
            });

            chrome.storage.local.get({ 'b' : null }, function(data) {
                if (data.b == "bt") {
                    licenseName.innerHTML = "BitTorrent Web Pro.";
                } else {
                    licenseName.innerHTML = "Torrent Scanner Plus.";
                }
            });

            // if (getParameterByName("openSection", window.location.href) == "setting") {
            //     settingWrapper.style.display = "block";
            //     wrapper.style.display = "none";
            // }
        }
    }

    updateLicenseData();

    const sortTorrents = (torrents) => {
        let sortedTorrents = [];

        for (let index in torrents) {
            let website = torrents[index].url || null;
            let torrentData = torrents[index].torrentData || [];
            let torrentLinks = torrents[index].torrentLinks || [];

            for (let i in torrentData) {
                sortedTorrents.push(
                    {
                        website: website, 
                        torrentLinks: torrentLinks[i],
                        torrentData: torrentData[i]
                    }
                );
            }
        }

        
        sortedTorrents.sort((a, b) => parseFloat(b.torrentData.seeders) - parseFloat(a.torrentData.seeders));

        return sortedTorrents
    }

    const appendTorrentToTable = (result) => {
        let data = result || null;
        if (data) {
            let tooltip = popup.shadowRoot.querySelector('.tooltip');
            let content = popup.shadowRoot.querySelector('#table-message');
            let torrent = data.torrentData;
            let torrentLink = (torrent.magnetUri) ? torrent.magnetUri : data.torrentLink;
            let name = torrent?.info?.name || torrent?.infoHash;
            let fileFormatReg = /(?:\.([^.]+))?$/;
            let file = getFile(torrent?.info?.files) || null;
            let fileExt = fileFormatReg.exec(file.name)[1] || null;
            let fileLang = getFileLanguage(name) || 'Unknown';
            let filePixel = getFilePixel(name);
            let fileSize = formatBytes(file.length) || 'Unknown';
            let status = torrent?.status;

            tooltip.style.display = 'none';
            content.style.display = 'none';
            // 
            // 
            // 
            // 
            // 
            // 

            // create element here to display the data
            let row = document.createElement('div');
            row.setAttribute('class', 't-row');
            row.setAttribute('data-id', torrent.infoHash);
            let trow = document.createElement('div');
            trow.setAttribute('class', 't-torrent');
            
            if (!hasLicense) {
                if (numTorrents > 4) {
                    row.classList.add('display-none');
                }
            }

            let tdownload = document.createElement('a');
            tdownload.setAttribute('class', 'torrent-download-icon');
            tdownload.setAttribute('href', torrentLink);
            tdownload.addEventListener('click', (ev) => {
                
                let animateDownloadGif = document.createElement('div');
                animateDownloadGif.setAttribute('class', 'torrent-download-icon-gif');
                let overlayDownload = document.createElement('div');
                overlayDownload.setAttribute('class', 'torrent-download-overlay');
                let downloadedText = document.createElement('p');
                downloadedText.setAttribute('class', 'download-text');
                downloadedText.innerHTML = 'Added to Downloads';
                overlayDownload.append(animateDownloadGif, downloadedText);
                ev.path[1].parentNode.append(overlayDownload);
                setTimeout(() => {
                    overlayDownload.remove();
                }, 5000);
            });

            let tcontent = document.createElement('div');
            tcontent.setAttribute('class', 'torrent-info-content');

            let tname = document.createElement('div');
            tname.setAttribute('class', 't-name-text');
            let tlink = document.createElement('a');
            tlink.setAttribute('class', 'torrent-link');
            tlink.setAttribute('target', '_blank');
            tlink.setAttribute('href', torrentLink);
            tlink.setAttribute('title', torrentLink);
            tlink.addEventListener('click', () => {
                chrome.runtime.sendMessage({
                    what: 'eventType',
                    name: 'torrentType',
                    clicked: 'link'
                });
            });

            let tnameSpan = document.createElement('span');
            tnameSpan.setAttribute('class', 'torrent-title');
            // tnameSpan.setAttribute('title', name);
            tnameSpan.appendChild(document.createTextNode(add3Dots(name, 34)));
            let overflow = document.createElement('div');
            overflow.setAttribute('class', 'overflow');

            let tinfolist = document.createElement('div');
            tinfolist.setAttribute('class', 'torrent-info-list');
            let tquality = document.createElement('div');
            tquality.setAttribute('class', 't-quality-text');
            let pixelimg = document.createElement('img');

            if (filePixel === "1080p" || filePixel === "2160p") {
                pixelimg.setAttribute('src', chrome.runtime.getURL('img/assets/icon-1080p.svg'));
            } else if (filePixel === "4k") {
                pixelimg.setAttribute('src', chrome.runtime.getURL('img/assets/icon-4k.svg'));
            } else {
                pixelimg.setAttribute('src', chrome.runtime.getURL('img/assets/icon-780p.png'));
            }

            if (filePixel !== null) {
                tquality.appendChild(pixelimg);
                tinfolist.appendChild(tquality);
            }

            let tsize = document.createElement('span');
            tsize.setAttribute('class', 't-torrent-size');
            tsize.innerHTML = 'Size: <b>' + fileSize + '</b>';
            let tsecure = document.createElement('span');
            tsecure.setAttribute('class', 't-torrent-secure');
            tsecure.innerHTML = 'Secure';
            let tseeds = document.createElement('span');
            tseeds.setAttribute('class', 't-torrent-seeds');
            let seedsIcon = document.createElement('img');
            seedsIcon.setAttribute('src', chrome.runtime.getURL('img/assets/icon-seeds.svg'));
            let tleeches = document.createElement('span');
            tleeches.setAttribute('class', 't-torrent-leeches');
            let leechesIcon = document.createElement('img');
            leechesIcon.setAttribute('src', chrome.runtime.getURL('img/assets/icon-peers.svg'));
            let lowAvailability = document.createElement('span');
            lowAvailability.setAttribute('class', 't-low-availability');
            // lowAvailability.innerHTML = '<img src="' + chrome.runtime.getURL('img/assets/icon-seeds.svg') + '"><img src="' + chrome.runtime.getURL('img/assets/icon-peers.svg') + '"> <span>Low availability</span>';

            if (!hasLicense) {
                tinfolist.append(tsize);
            } else {
                tinfolist.append(tsecure);
            }

            let sumAvail = 0;
            let numSeeders = 0;
            let numLeechers = 0;

            if (torrent.seeders && torrent.leechers) {
                numSeeders = torrent.seeders;
                numLeechers = torrent.leechers;
                sumAvail = numSeeders + numLeechers;
            }

            // tinfolist.append(tsize);
            tseeds.append(seedsIcon, document.createTextNode(numSeeders));
            tleeches.append(leechesIcon, document.createTextNode(numLeechers));

            if (sumAvail <= 5) {
                // tinfolist.append(tsize, tseeds, tleeches);
                tinfolist.append(lowAvailability);
            } else {
                tinfolist.append(tseeds, tleeches);
            }

            let tfiletype = document.createElement('span');
            tfiletype.setAttribute('class', 't-torrent-type'); 

            if (fileExt) {
                tfiletype.innerHTML = "Type: <b>" + fileExt + "</b>";
                tinfolist.append(tfiletype);
            }

            let tarrow = document.createElement('div');
            tarrow.setAttribute('class', 't-arrow');
            let tarrowIcon = document.createElement('span');
            tarrowIcon.setAttribute('class', 'arrow-down');
            tarrowIcon.addEventListener('click', (ev) => {
                if ((ev.target).closest('.t-torrent')?.nextSibling.className.indexOf('t-torrent-more') != -1) {
                    (ev.target).closest('.t-torrent')?.nextSibling.classList.toggle('show-info');
                }

                if (ev.target.className == 'arrow-down') {
                    ev.target.className = ev.target.className.replace('arrow-down', 'arrow-up');
                } else {
                    ev.target.className = ev.target.className.replace('arrow-up', 'arrow-down');
                }
            }); 

            let torrentInfoSection = document.createElement('div');
            torrentInfoSection.setAttribute('class', 't-torrent-more');
            let infoLeft = document.createElement('div');
            infoLeft.setAttribute('class', 't-info-left');
            let infoRight = document.createElement('div');
            infoRight.setAttribute('class', 't-info-right');
            let tfilename = document.createElement('div');
            tfilename.setAttribute('class', 't-torrent-filename');
            tfilename.setAttribute('title', file.name);
            let tpath = document.createElement('div');
            tpath.setAttribute('class', 't-torrent-path');
            tpath.setAttribute('title', (data.website).toString().replace(/^(?:https?:\/\/)?(?:www\.)?/i, ''));
            let pathIcon = document.createElement('span');
            pathIcon.setAttribute('class', 'info-title');
            pathIcon.appendChild(document.createTextNode('Link: '));
            let tbug = document.createElement('div');
            tbug.setAttribute('class', 't-torrent-virus');
            let bugIcon = document.createElement('span');
            bugIcon.setAttribute('class', 'info-title');
            bugIcon.appendChild(document.createTextNode('Bugs: '));
            let tlang = document.createElement('div');
            tlang.setAttribute('class', 't-torrent-lang');
            let langIcon = document.createElement('span');
            langIcon.setAttribute('class', 'info-title');
            langIcon.appendChild(document.createTextNode('Lang: '));

            let virusName = 'None';

            // Append elements
            tarrow.appendChild(tarrowIcon);
            tname.appendChild(tnameSpan);
            tlink.appendChild(tname);
            tcontent.append(tlink, tinfolist);
            trow.append(tdownload, tcontent, tarrow);
            row.appendChild(trow);

            tpath.append(pathIcon, document.createTextNode(' ' + add3Dots((data.website).toString().replace(/^(?:https?:\/\/)?(?:www\.)?/i, ''), 40)));
            tbug.append(bugIcon, document.createTextNode(' ' + add3Dots(virusName, 40)));
            tlang.append(langIcon, document.createTextNode(' ' + fileLang));
            if (!hasLicense) {
                infoRight.append(tlang, tpath, tbug);
            } else {
                infoRight.append(tlang, tpath, tbug);
            }
            torrentInfoSection.append(infoLeft, infoRight);

            if (!hasLicense) {
                // if (numTorrents < numTorrentDisplayForFreeUser) {
                    row.appendChild(torrentInfoSection);
                    torrentTableBody.appendChild(row);
                // }
            } else {
                checkSection.style.display = "block";
                row.appendChild(torrentInfoSection);
                torrentTableBody.appendChild(row);
            } 

            numTorrents++;
        }

        if (numTorrents > 0) {
            // remove loading elements
            loadingContainer.remove();
            // append torrents count
            torrentNum.innerHTML = numTorrents + ' torrents scanned';
            torrentTableName.style.display = 'block';

             // send number of torrents to background (badge)
             chrome.runtime.sendMessage({
                what: 'badgeCount',
                count: numTorrents
            });     
        }
    }

    const updateTorrentInTable = (torrentHealths, torrentList) => {
        let data = torrentHealths || [];
        let rows = popup.shadowRoot.querySelectorAll(".t-row");
        let badTorrents = [];

        // 
        // 
        // 
        if (data.length > 0) {
            for (let index = 0; rows.length > index; index++) {
                for (let i in data) {
                    if (rows[index].dataset.id === data[i].infoHash) {
                        // if bad torrent [status=2] found, remove the current row and add to bad torrent array
                        if (data[i]?.status === 2) {
                            badTorrents.push(torrentList[index]);
                            rows[index].remove();
                        }

                        // modify and update table row [status, leechers, seeders, virusName]
                        let leechers = data[i]?.leechers || 0;
                        let seeders = data[i]?.seeders || 0;

                        if (leechers > 0 || seeders > 0) {
                            if ((leechers + seeders) > 1) {
                                let tseeds = document.createElement('span');
                                tseeds.setAttribute('class', 't-torrent-seeds');
                                let seedsIcon = document.createElement('img');
                                seedsIcon.setAttribute('src', chrome.runtime.getURL('img/assets/icon-seeds.svg'));
                                let tleeches = document.createElement('span');
                                tleeches.setAttribute('class', 't-torrent-leeches');
                                let leechesIcon = document.createElement('img');
                                leechesIcon.setAttribute('src', chrome.runtime.getURL('img/assets/icon-peers.svg'));
                                tseeds.append(seedsIcon, document.createTextNode(seeders));
                                tleeches.append(leechesIcon, document.createTextNode(leechers));
                                
                                let els = rows[index].children[0].children[1].children[1].childNodes;

                                els.forEach(element => {
                                    if (element.className === "t-low-availability") {
                                        element.remove();
                                        rows[index].children[0].children[1].children[1].appendChild(tseeds);
                                        rows[index].children[0].children[1].children[1].appendChild(tleeches);
                                    }
                                })

                                let table = popup.shadowRoot.querySelector(".t-body");
                                let newRow = rows[index];
                                rows[index].remove();
                                table.prepend(newRow);
                            }
                        }
                    }
                }
            }

            // display count for bad torrent based badTorrents array length
            // popup.shadowRoot.querySelector(".mal-count").innerHTML = badTorrents.length;
        }
    } 

    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.text == "reloadPage") {
            window.location.reload();
            sendResponse("reloadPage reloaded");
        }

        if (request.text == "getWindowSize") {
            sendResponse({ h: window.innerHeight, w: window.innerWidth });
        }

        if (request.text == "togglePopup") {
            
            let popup = document.getElementById("torrent-scanner-popup");
            if (popup.style.display === "block") {
                popup.style.display = "none";
                sendResponse({ message: "popupClosed" });
            } else {
                popup.style.display = "block";
                sendResponse({ message: "popupOpened" });
                setTimeout(() => {
                    let rows = popup.shadowRoot.querySelectorAll(".t-row");

                    if (rows.length < 1) {
                        let loading = popup.shadowRoot.querySelector('.spinner');
                        let tooltip = popup.shadowRoot.querySelector('.tooltip');
                        let content = popup.shadowRoot.querySelector('#table-message');
                        loading.remove();
                        content.style.display = 'block';
                        tooltip.style.display = 'block';
                    }
                }, 3000);
            }
        }
        
        if (request.message == 'torrentData') {
            
            if (request) {
                // Open popup if magnet and torrents found
                popup.style.display = 'block';

                let data = request.data || {};
                let numSitesChecked = request.numSites || 0;

                sitesCount.innerHTML = numSitesChecked;

                for (let i in data.torrentData) {
                    if (data.torrentData[i].infoHash !== undefined) {
                        let found = torrentArray.some(obj  => obj.infoHash == data.torrentData[i].infoHash);
                        torrentArray.push({ infoHash: data.torrentData[i].infoHash, torrentData: data.torrentData[i], torrentLink: data.torrentLinks[i], website: data.url });
                        // check if torrentArray contains infoHash before append
                        if (found === false) {
                            appendTorrentToTable({ infoHash: data.torrentData[i].infoHash, torrentData: data.torrentData[i], torrentLink: data.torrentLinks[i], website: data.url });
                        }
                        
                    }
                }

                if (request.last) {
                    setTimeout(() => {
                        
                        if (torrentArray.length < 1) {
                            let loading = popup.shadowRoot.querySelector('.spinner');
                            let tooltip = popup.shadowRoot.querySelector('.tooltip');
                            let content = popup.shadowRoot.querySelector('#table-message');
                            loading.remove();
                            content.style.display = 'block';
                            tooltip.style.display = 'block';
                        }

                        let trackersObj = mapTorrentTrackers(torrentArray); 
                        
                        socketIoResponse(trackersObj).then((result) => {
                            
                            // merge socket io data with the current data
                            updateTorrentInTable(result, torrentArray);
                            // maliciousCount.innerHTML = countBadTorrents(result);
                            
                            chrome.runtime.sendMessage({
                                what: 'sendListDownloadEvent',
                                url: currentUrl,
                                hostname: (new URL(currentUrl)).hostname,
                                searchQuery: getParameterByName(currentUrl, "q"),
                                queryInput: 'Browser',
                                total: numTorrents,
                                badTorrents: 0
                            });
                        });
                    }, 3000);
                }

                // display query to input
                searchInput.value = request.searchQuery;
            }
            sendResponse("torrentData received");
        }

        return true;
    });
