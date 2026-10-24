try {
    (function explicitConsent(d) {
        "use strict";
        var acceptAllButton = document.getElementById("teal-consent-prompt-submit"),
            manageSettingsButton = document.getElementById("teal-manage-settings"),
            declineButton = document.getElementById("teal-decline-consent"),
            tealiumModal = document.getElementById("__tealiumGDPRecModal"),
            acceptNoticeModal = document.getElementById("accept-notice"),
            modals = document.querySelectorAll(".cookie-modal"),
            heading = document.querySelector(".privacy-prompt-header"),
            body = d.getElementsByTagName("body")[0],
            visibleClass = "cookie-modal--visible",
            lockClass = "lock-scroll",
            noScrollClass = "no-scroll";
        var acceptAll = function() {
            utag.gdpr.setConsentValue(1);
        };
        var declineAll = function() {
            utag.gdpr.setConsentValue(0);
        };

        function displayModalTracking(modalType) {
            var xhr = new XMLHttpRequest();
            xhr.open("POST", "https://collect.tealiumiq.com/event");
            var date = new Date();
            var payload = {
                tealium_account: utag.data["ut.account"],
                tealium_profile: utag.data["ut.profile"],
                policy: "gdpr",
                tealium_visitor_id: utag.data["cp.utag_main_v_id"],
                "ut.profile": utag.data["ut.profile"],
                page_url: (document.URL.match(/file:\/\/\//g)) ? document.URL.replace(/\/\/\/(.*)\//g, 'xxxxx/') : document.URL,
                "ut.domain": location.hostname,
                "tealium_environment": utag.cfg.path.split("/")[6],
                "tealium_random": Math.random().toFixed(16).substring(2),
                "tealium_random_timestamp": Math.random().toFixed(16).substring(2) + Date.now(),
                "tealium_timestamp_epoch": Math.floor(date.getTime() / 1000),
                "tealium_timestamp_utc": date.toISOString(),
                "consent_jurisdiction": utag.cfg.path.split("/")[5].split("-")[0].toUpperCase(),
                "gbgf": (utag.data["ut.profile"].indexOf("cmb") !== -1) ? 'CMB' : (utag.data["ut.profile"].indexOf("nonrbwm") !== -1) ? 'CMB' : (utag.data["ut.profile"].indexOf("hsbcnet") !== -1) ? 'CMB' : (utag.data["ut.profile"].indexOf("rbwm") !== -1) ? 'WPB' : (utag.data["ut.profile"].indexOf("gpb") !== -1) ? 'GPB' : (utag.data["ut.profile"].indexOf("gbm") !== -1) ? 'GB' : (utag.data["ut.profile"].indexOf("hsbchistorywebsite") !== -1) ? 'GB' : (utag.data["ut.profile"].indexOf("groupcoo") !== -1) ? 'GB' : "GBGF",
                "consent_source_type": (location.hostname === "tags.tiqcdn.com") ? 'Mobile App' : 'Website',
                "app_name": 'Web',
                "domain_app": location.hostname
            };
            if (utag.data["cp.trace_id"]) {
                payload.tealium_trace_id = utag.data["cp.trace_id"];
            }
            if (modalType === "explicit") {
                payload.tealium_event = "consent_modal_explicit";
            } else if (modalType === "preferences") {
                payload.tealium_event = "consent_modal_preferences";
            }
            if (TEALIUM.consent_event_logging === true && TEALIUM.consent_track_modal_view === true) {
                xhr.send(JSON.stringify(payload))
            };
        }
        var removeModal = function() {
            for (var i = 0; i < modals.length; i += 1) {
                var modal = modals[i];
                modal.classList.remove(visibleClass);
                modal.setAttribute('tabindex', -1);
                modal.removeAttribute('aria-modal');
                body.classList.remove(lockClass);
                body.classList.remove(noScrollClass);
            }
            var focusable = document.querySelectorAll('.site-wrapper button, .site-wrapper [href], .site-wrapper input, .site-wrapper select, .site-wrapper textarea, .site-wrapper [tabindex]:not([tabindex="-1"])');
            for (var i = 0; i < focusable.length; i += 1) {
                var focusItems = focusable[i];
                focusItems.setAttribute('tabindex', 0);
                focusItems.setAttribute('aria-hidden', 'false');
            }
        };
        var showExplicitModal = function() {
            acceptNoticeModal.setAttribute('aria-modal', 'true');
            body.classList.add(lockClass);
            body.classList.add(noScrollClass);
            var focusable = document.querySelectorAll('.site-wrapper button, .site-wrapper [href], .site-wrapper input, .site-wrapper select, .site-wrapper textarea, .site-wrapper [tabindex]:not([tabindex="-1"])');
            for (var i = 0; i < focusable.length; i += 1) {
                var focusItems = focusable[i];
                focusItems.setAttribute('tabindex', -1);
                focusItems.setAttribute('aria-hidden', 'true');
            }
            acceptNoticeModal.classList.add(visibleClass);
            tealiumModal.style.display = "block";
            heading.setAttribute('tabindex', -1);
            heading.focus();
            displayModalTracking("explicit");
        };
        var hideTealiumModal = function() {
            tealiumModal.style.display = "none";
        };
        var addEvent = function(obj, type, fn) {
            if (obj.addEventListener) {
                obj.addEventListener(type, fn, false);
            } else if (obj.attachEvent) {
                obj["e" + type + fn] = fn;
                obj[type + fn] = function() {
                    obj["e" + type + fn](window.event);
                };
                obj.attachEvent("on" + type, obj[type + fn]);
            } else {
                obj["on" + type] = obj["e" + type + fn];
            }
        };
        var profileDynamicContent = function() {
            try {
                if (typeof(TEALIUM) === "undefined") {
                    return
                }
                var langLocale = utag.gdpr.getLanguage();
                var lang = (langLocale || "").split("-")[0];
                if (lang) {
                    var cookie_url = "cookie_notice_url_" + lang;
                }
                if (document.getElementById("teal-cookie-notice-url") && TEALIUM.consent_prompt[cookie_url]) {
                    document.getElementById("teal-cookie-notice-url").href = TEALIUM.consent_prompt[cookie_url];
                }
                if (TEALIUM.language_toggle === true && TEALIUM.language_toggle !== undefined && TEALIUM.cm_languages !== undefined) {
                    var cm_languages = TEALIUM.cm_languages;

                    function getOtherLanguage(source) {
                        for (var i = 0; i < cm_languages.length; i++) {
                            if (cm_languages[i] !== source) {
                                return cm_languages[i];
                            }
                        }
                    }

                    function getUrl(current_code) {
                        return window.location.pathname === "/" ? current_code : window.location.pathname.replace(getOtherLanguage(current_code), current_code);
                    }
                    var config = {
                        "de-de": {
                            lang_name: "Deutsch",
                            code: "de-de",
                            url: getUrl("de-de"),
                        },
                        "en-ca": {
                            lang_name: "English",
                            code: "en-ca",
                            url: getUrl("en-ca"),
                        },
                        "en-gb": {
                            lang_name: "English",
                            code: "en-ca",
                            url: getUrl("en-gb"),
                        },
                        "fr-ca": {
                            lang_name: "Français",
                            code: "fr-ca",
                            url: getUrl("fr-ca"),
                        },
                        "cs-cz": {
                            lang_name: "Čeština",
                            code: "cs-cz",
                            url: getUrl("cs-cz"),
                        },
                        "pl-pl": {
                            lang_name: "Polski",
                            code: "pl-pl",
                            url: getUrl("pl-pl"),
                        },
                        "es-es": {
                            lang_name: "Español",
                            code: "es-es",
                            url: getUrl("es-es"),
                        },
                        "it-it": {
                            lang_name: "Italiano",
                            code: "it-it",
                            url: getUrl("it-it"),
                        },
                    };
                    var modal = document.getElementsByClassName("cookie-modal__content")[0];
                    var element_selector = document.createElement("div");
                    element_selector.setAttribute("class", "lang-selector");
                    modal.insertBefore(element_selector, modal.childNodes[0]);
                    var lang_selector = document.getElementsByClassName("lang-selector")[0];
                    if (lang_selector.childElementCount === 0 && Array.isArray(cm_languages) && cm_languages.length > 1) {
                        for (var i = 0; i < cm_languages.length; i++) {
                            var language_configured = cm_languages[i];
                            var element_lang = document.createElement("a");
                            var element_separator = document.createElement("span");
                            element_separator.setAttribute("class", "lang-selector__divide");
                            element_lang.innerText = config[language_configured].lang_name;
                            element_lang.href = config[language_configured].url;
                            element_lang.setAttribute("title", config[language_configured].lang_name);
                            element_lang.setAttribute("lang", config[language_configured].code.split("-")[0]);
                            lang_selector.appendChild(element_lang);
                            if (i === 0) {
                                lang_selector.appendChild(element_separator);
                            }
                        }
                    }
                }
            } catch (e) {
                utag.DB("Consent manager: Issue updating profile content");
                utag.DB(e);
            }
        };
        var addListeners = function() {
            if (acceptAllButton) {
                addEvent(acceptAllButton, "click", function(e) {
                    removeModal();
                    acceptAll();
                });
            }
            if (declineButton) {
                addEvent(declineButton, "click", function(e) {
                    removeModal();
                    declineAll();
                });
            }
            if (manageSettingsButton) {
                addEvent(manageSettingsButton, "click", function(e) {
                    removeModal();
                    utag.gdpr.showConsentPreferences();
                });
            }
            addEvent(document, "keydown", function(evt) {
                if (evt.keyCode === 27) {
                    removeModal();
                }
            });
        };
        var revealTarget = function() {
            if (window.__TEALIUM && window.__TEALIUM.adobe && window.__TEALIUM.adobe.target && window.__TEALIUM.adobe.target.bootstrap && window.__TEALIUM.adobe.target.bootstrap.css && window.__TEALIUM.adobe.target.bootstrap.css.remove) {
                window.__TEALIUM.adobe.target.bootstrap.css.remove();
            }
            utag.DB("Consent manager customisation: Target content revealed")
        };
        var init = function() {
            revealTarget();
            profileDynamicContent();
            showExplicitModal();
            addListeners();
        };
        init();

        function modalFocus() {
            const modalElement = document.getElementById('accept-notice');

            function trapFocus(modalElement) {
                var focusableEls = modalElement.querySelectorAll('a:not([disabled]), button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), select:not([disabled])');
                var firstFocusableEl = focusableEls[0];
                var lastFocusableEl = focusableEls[focusableEls.length - 1];
                var KEYCODE_TAB = 9;
                firstFocusableEl.focus();
                modalElement.addEventListener('keydown', function(e) {
                    var focusableEls = modalElement.querySelectorAll('a:not([disabled]), button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), select:not([disabled])');
                    var isTabPressed = (e.key === 'Tab' || e.keyCode === KEYCODE_TAB);
                    if (isTabPressed && e.shiftKey) {
                        if (document.activeElement === firstFocusableEl) {
                            lastFocusableEl.focus();
                            e.preventDefault();
                        } else if (!(document.activeElement in focusableEls)) {
                            firstFocusableEl.focus();
                            e.preventDefault();
                        } else {
                            return;
                        }
                    } else if (isTabPressed && !e.shiftKey) {
                        if (document.activeElement === lastFocusableEl) {
                            firstFocusableEl.focus();
                            e.preventDefault();
                        }
                    }
                });
            }
            trapFocus(modalElement);
        }
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", modalFocus);
        } else {
            modalFocus();
        }
        document.querySelectorAll('#accept-notice p,#accept-notice li').forEach((item) => {
            if (item.innerText.trim().length <= 0) {
                item.style.display = "None"
            }
        })
    }(document));
} catch (e) {
    utag.DB(e)
} //# sourceURL=consent.js