"use strict";
(() => {
  // src/options/options.ts
  var radioButtons = [
    ...document.querySelectorAll('input[name="theme"]')
  ];
  var getRadioButton = (value) => {
    const el = radioButtons.find((input) => input.value === value);
    if (!el)
      throw new Error(`Could not find radio button with value "${value}".`);
    return el;
  };
  chrome.storage.local.get("themeOverride", (result) => {
    const value = result.themeOverride;
    getRadioButton(value).checked = true;
  });
  radioButtons.forEach((input) => {
    input.addEventListener("change", () => {
      switch (input.value) {
        case "system":
        case "force_light":
        case "force_dark":
          chrome.storage.local.set({
            themeOverride: input.value
          });
          break;
        default:
          throw new Error(`Unexpected value "${input.value}"`);
      }
    });
  });
  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === "local" && changes.themeOverride) {
      getRadioButton(changes.themeOverride.newValue).checked = true;
    }
  });
})();
