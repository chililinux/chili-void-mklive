"use strict";
(() => {
  // src/lib/beforeAll.ts
  window.__jsonFormatterStartTime = performance.now();

  // src/style.css
  var style_default = "body {\n  background-color: #fff;\n  user-select: text;\n  overflow-y: scroll !important;\n  margin: 0;\n  position: relative;\n  padding-top: 1px; /* hack to prevent margin collapse in 'Raw' */\n  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,\n    Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;\n}\n#optionBar {\n  user-select: none;\n  display: block;\n  position: absolute;\n  top: 13px;\n  right: 15px;\n}\n#buttonFormatted,\n#buttonPlain {\n  border-radius: 2px;\n  box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.1);\n  user-select: none;\n  background: linear-gradient(#fafafa, #f4f4f4 40%, #e5e5e5);\n  border: 1px solid #aaa;\n  color: #444;\n  font-size: 13px;\n  /* text-transform: uppercase; */\n  margin-bottom: 0px;\n  min-width: 4em;\n  padding: 3px 0;\n  position: relative;\n  z-index: 10;\n  display: inline-block;\n  width: 80px;\n  text-shadow: 1px 1px rgba(255, 255, 255, 0.3);\n}\n#buttonFormatted {\n  margin-left: 0;\n  border-top-left-radius: 0;\n  border-bottom-left-radius: 0;\n}\n#buttonPlain {\n  margin-right: 0;\n  border-top-right-radius: 0;\n  border-bottom-right-radius: 0;\n  border-right: none;\n}\n:is(#buttonPlain, #buttonFormatted):not(.selected):hover {\n  box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.2);\n  background: #ebebeb linear-gradient(#fefefe, #f8f8f8 40%, #e9e9e9);\n  border-color: #999;\n  color: #222;\n}\n:is(#buttonPlain, #buttonFormatted):active {\n  box-shadow: inset 0px 1px 3px rgba(0, 0, 0, 0.2);\n  background: #ebebeb linear-gradient(#f4f4f4, #efefef 40%, #dcdcdc);\n  color: #333;\n}\n:is(#buttonPlain, #buttonFormatted).selected {\n  box-shadow: inset 0px 1px 5px rgba(0, 0, 0, 0.2);\n  background: #ebebeb linear-gradient(#e4e4e4, #dfdfdf 40%, #dcdcdc);\n  color: #333;\n}\n:is(#buttonPlain, #buttonFormatted):focus {\n  outline: 0;\n}\n.entry {\n  display: block;\n  padding-left: 20px;\n  margin-left: -20px;\n  position: relative;\n}\n#jsonFormatterParsed {\n  padding-left: 28px;\n  padding-top: 6px;\n  line-height: 1.5;\n}\n#jsonFormatterRaw {\n  padding: 36px 10px 5px;\n}\n.collapsed {\n  white-space: nowrap;\n}\n.collapsed > .blockInner {\n  display: none;\n}\n.collapsed > .ell:after {\n  content: '\u2026';\n  font-weight: bold;\n}\n.collapsed > .ell {\n  margin: 0 4px;\n  color: #888;\n}\n.collapsed .entry {\n  display: inline;\n}\n\n.collapsed:after {\n  content: attr(data-size);\n  color: #aaa;\n}\n\n.e {\n  width: 20px;\n  height: 18px;\n  display: block;\n  position: absolute;\n  left: 0px;\n  top: 1px;\n  color: black;\n  z-index: 5;\n  background-repeat: no-repeat;\n  background-position: center center;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  opacity: 0.15;\n}\n\n.e::after {\n  content: '';\n  display: block;\n  width: 0;\n  height: 0;\n  border-style: solid;\n  border-width: 4px 0 4px 6.9px;\n  border-color: transparent transparent transparent currentColor;\n  transform: rotate(90deg) translateY(1px);\n}\n\n.collapsed > .e::after {\n  transform: none;\n}\n\n.e:hover {\n  opacity: 0.35;\n}\n.e:active {\n  opacity: 0.5;\n}\n.collapsed .entry .e {\n  display: none;\n}\n.blockInner {\n  display: block;\n  padding-left: 24px;\n  border-left: 1px dotted #bbb;\n  margin-left: 2px;\n}\n#jsonFormatterParsed {\n  color: #444;\n}\n\n.entry {\n  font-size: 13px;\n  font-family: monospace;\n}\n\n.b {\n  font-weight: bold;\n}\n.s {\n  color: #0b7500;\n  word-wrap: break-word;\n}\na:link,\na:visited {\n  text-decoration: none;\n  color: inherit;\n}\na:hover,\na:active {\n  text-decoration: underline;\n  color: #050;\n}\n.bl,\n.nl,\n.n {\n  font-weight: bold;\n  color: #1a01cc;\n}\n.k {\n  color: #000;\n}\n\n[hidden] {\n  display: none !important;\n}\nspan {\n  white-space: pre-wrap;\n}\n\n@keyframes spin {\n  from {\n    transform: rotate(0deg);\n  }\n  to {\n    transform: rotate(360deg);\n  }\n}\n\n#spinner {\n  animation: spin 2s linear infinite;\n}\n";

  // src/styleDark.css
  var styleDark_default = "body {\n  background-color: #1a1a1a;\n  color: #eee;\n  -webkit-font-smoothing: antialiased;\n}\n\na:hover,\na:active {\n  color: hsl(114, 90%, 55%);\n}\n\n#optionBar {\n  -webkit-font-smoothing: subpixel-antialiased;\n}\n\n#jsonFormatterParsed {\n  color: #b6b6b6;\n}\n\n.blockInner {\n  border-color: #4d4d4d;\n}\n\n.k {\n  color: #fff;\n}\n\n.s {\n  color: hsl(114, 100%, 35%);\n}\n\n.bl,\n.nl,\n.n {\n  color: hsl(200, 100%, 70%);\n}\n\n.e {\n  color: #fff;\n  opacity: 0.25;\n}\n\n.e:hover {\n  opacity: 0.45;\n}\n.e:active {\n  opacity: 0.6;\n}\n\n.collapsed:after {\n  color: #707070;\n}\n\n:is(#buttonPlain, #buttonFormatted) {\n  text-shadow: none;\n  border: 0;\n  background: hsl(200, 35%, 60%);\n  box-shadow: none;\n  color: #000;\n}\n\n:is(#buttonPlain, #buttonFormatted):not(.selected):hover {\n  box-shadow: none;\n  background: hsl(200, 50%, 70%);\n  color: #000;\n}\n\n:is(#buttonPlain, #buttonFormatted).selected {\n  box-shadow: inset 0px 1px 5px rgba(0, 0, 0, 0.7);\n  background: hsl(200, 40%, 60%);\n  color: #000;\n}\n";

  // src/lib/constants.ts
  var TYPE_STRING = 1;
  var TYPE_NUMBER = 2;
  var TYPE_OBJECT = 3;
  var TYPE_ARRAY = 4;
  var TYPE_BOOL = 5;
  var TYPE_NULL = 6;

  // src/lib/assert.ts
  var prefix = "Runtime assertion failed";
  function assert(condition, message) {
    if (condition)
      return;
    const providedMessage = typeof message === "function" ? message() : message;
    const finalMessage = providedMessage ? "".concat(prefix, ": ").concat(providedMessage) : prefix;
    throw new Error(finalMessage);
  }

  // src/lib/getValueType.ts
  var getValueType = (value) => {
    if (typeof value === "string")
      return TYPE_STRING;
    if (typeof value === "number")
      return TYPE_NUMBER;
    if (value === false || value === true)
      return TYPE_BOOL;
    if (value === null)
      return TYPE_NULL;
    if (Array.isArray(value))
      return TYPE_ARRAY;
    return TYPE_OBJECT;
  };

  // src/lib/templates.ts
  var baseSpan = document.createElement("span");
  var createBlankSpan = () => baseSpan.cloneNode(false);
  var getSpanWithClass = (className) => {
    const span = createBlankSpan();
    span.className = className;
    return span;
  };
  var getSpanWithBoth = (innerText, className) => {
    const span = createBlankSpan();
    span.className = className;
    span.innerText = innerText;
    return span;
  };
  var templates = {
    t_entry: getSpanWithClass("entry"),
    t_exp: getSpanWithClass("e"),
    t_key: getSpanWithClass("k"),
    t_string: getSpanWithClass("s"),
    t_number: getSpanWithClass("n"),
    t_null: getSpanWithBoth("null", "nl"),
    t_true: getSpanWithBoth("true", "bl"),
    t_false: getSpanWithBoth("false", "bl"),
    t_oBrace: getSpanWithBoth("{", "b"),
    t_cBrace: getSpanWithBoth("}", "b"),
    t_oBracket: getSpanWithBoth("[", "b"),
    t_cBracket: getSpanWithBoth("]", "b"),
    t_sizeComment: getSpanWithClass("sizeComment"),
    t_ellipsis: getSpanWithClass("ell"),
    t_blockInner: getSpanWithClass("blockInner"),
    t_colonAndSpace: document.createTextNode(":\xA0"),
    t_commaText: document.createTextNode(","),
    t_dblqText: document.createTextNode('"')
  };

  // src/lib/buildDom.ts
  var buildDom = (value, keyName) => {
    const type = getValueType(value);
    const entry = templates.t_entry.cloneNode(false);
    let collectionSize = 0;
    if (type === TYPE_OBJECT) {
      collectionSize = Object.keys(value).length;
    } else if (type === TYPE_ARRAY) {
      collectionSize = value.length;
    }
    let nonZeroSize = false;
    if (type === TYPE_OBJECT || type === TYPE_ARRAY) {
      for (const objKey in value) {
        if (value.hasOwnProperty(objKey)) {
          nonZeroSize = true;
          break;
        }
      }
      if (nonZeroSize)
        entry.appendChild(templates.t_exp.cloneNode(false));
    }
    if (keyName !== false) {
      entry.classList.add("objProp");
      const keySpan = templates.t_key.cloneNode(false);
      keySpan.textContent = JSON.stringify(keyName).slice(1, -1);
      entry.appendChild(templates.t_dblqText.cloneNode(false));
      entry.appendChild(keySpan);
      entry.appendChild(templates.t_dblqText.cloneNode(false));
      entry.appendChild(templates.t_colonAndSpace.cloneNode(false));
    } else {
      entry.classList.add("arrElem");
    }
    let blockInner;
    let childEntry;
    switch (type) {
      case TYPE_STRING: {
        assert(typeof value === "string");
        const innerStringEl = createBlankSpan();
        let escapedString = JSON.stringify(value);
        escapedString = escapedString.substring(1, escapedString.length - 1);
        if (value.substring(0, 8) === "https://" || value.substring(0, 7) === "http://" || value[0] === "/") {
          const innerStringA = document.createElement("a");
          innerStringA.href = value;
          innerStringA.innerText = escapedString;
          innerStringEl.appendChild(innerStringA);
        } else {
          innerStringEl.innerText = escapedString;
        }
        const valueElement = templates.t_string.cloneNode(false);
        valueElement.appendChild(templates.t_dblqText.cloneNode(false));
        valueElement.appendChild(innerStringEl);
        valueElement.appendChild(templates.t_dblqText.cloneNode(false));
        entry.appendChild(valueElement);
        break;
      }
      case TYPE_NUMBER: {
        const valueElement = templates.t_number.cloneNode(
          false
        );
        valueElement.innerText = String(value);
        entry.appendChild(valueElement);
        break;
      }
      case TYPE_OBJECT: {
        assert(typeof value === "object");
        entry.appendChild(templates.t_oBrace.cloneNode(true));
        if (nonZeroSize) {
          entry.appendChild(templates.t_ellipsis.cloneNode(false));
          blockInner = templates.t_blockInner.cloneNode(false);
          let lastComma;
          for (let k in value) {
            if (value.hasOwnProperty(k)) {
              childEntry = buildDom(value[k], k);
              const comma = templates.t_commaText.cloneNode();
              childEntry.appendChild(comma);
              blockInner.appendChild(childEntry);
              lastComma = comma;
            }
          }
          assert(
            typeof childEntry !== "undefined" && typeof lastComma !== "undefined"
          );
          childEntry.removeChild(lastComma);
          entry.appendChild(blockInner);
        }
        entry.appendChild(templates.t_cBrace.cloneNode(true));
        entry.dataset.size = ` // ${collectionSize} ${collectionSize === 1 ? "item" : "items"}`;
        break;
      }
      case TYPE_ARRAY: {
        assert(Array.isArray(value));
        entry.appendChild(templates.t_oBracket.cloneNode(true));
        if (nonZeroSize) {
          entry.appendChild(templates.t_ellipsis.cloneNode(false));
          blockInner = templates.t_blockInner.cloneNode(false);
          for (let i = 0, length = value.length, lastIndex = length - 1; i < length; i++) {
            childEntry = buildDom(value[i], false);
            if (i < lastIndex) {
              const comma = templates.t_commaText.cloneNode();
              childEntry.appendChild(comma);
            }
            blockInner.appendChild(childEntry);
          }
          entry.appendChild(blockInner);
        }
        entry.appendChild(templates.t_cBracket.cloneNode(true));
        entry.dataset.size = ` // ${collectionSize} ${collectionSize === 1 ? "item" : "items"}`;
        break;
      }
      case TYPE_BOOL: {
        if (value)
          entry.appendChild(templates.t_true.cloneNode(true));
        else
          entry.appendChild(templates.t_false.cloneNode(true));
        break;
      }
      case TYPE_NULL: {
        entry.appendChild(templates.t_null.cloneNode(true));
        break;
      }
    }
    return entry;
  };

  // src/content.ts
  var PERFORMANCE_DEBUGGING = false;
  var cssPromise = new Promise((resolve) => {
    chrome.storage.local.get("themeOverride", (result) => {
      switch (result["themeOverride"]) {
        case "force_light":
          resolve(style_default);
          break;
        case "force_dark":
          resolve(style_default + "\n\n" + styleDark_default);
          break;
        case "system":
        default:
          resolve(
            style_default + "\n\n@media (prefers-color-scheme: dark) {\n" + styleDark_default + "\n}"
          );
      }
    });
  });
  var resultPromise = (async () => {
    const originalPreElement = (() => {
      const bodyChildren = document.body.children;
      const length = bodyChildren.length;
      for (let i = 0; i < length; i++) {
        const child = bodyChildren[i];
        if (child.tagName === "PRE")
          return child;
      }
      return null;
    })();
    if (originalPreElement === null)
      return { formatted: false, note: "No body>pre found", rawLength: null };
    const rawPreContent = originalPreElement.textContent;
    if (!rawPreContent)
      return { formatted: false, note: "No content in body>pre", rawLength: 0 };
    const rawLength = rawPreContent.length;
    if (rawLength > 3e6)
      return {
        formatted: false,
        note: `Too long`,
        rawLength
      };
    if (!/^\s*[\{\[]/.test(rawPreContent))
      return {
        formatted: false,
        note: `Does not start with { or ]`,
        rawLength
      };
    originalPreElement.remove();
    const parsedJsonContainer = document.createElement("div");
    parsedJsonContainer.id = "jsonFormatterParsed";
    document.body.appendChild(parsedJsonContainer);
    const rawJsonContainer = document.createElement("div");
    rawJsonContainer.hidden = true;
    rawJsonContainer.id = "jsonFormatterRaw";
    rawJsonContainer.append(originalPreElement);
    document.body.appendChild(rawJsonContainer);
    {
      let parsedJsonValue;
      try {
        parsedJsonValue = JSON.parse(rawPreContent);
      } catch (e) {
        parsedJsonContainer.remove();
        rawJsonContainer.remove();
        document.body.prepend(originalPreElement);
        return { formatted: false, note: "Does not parse as JSON", rawLength };
      }
      if (typeof parsedJsonValue !== "object" && !Array.isArray(parsedJsonValue)) {
        return {
          formatted: false,
          note: "Technically JSON but not an object or array",
          rawLength
        };
      }
      const parsedJsonRootStruct = parsedJsonValue;
      {
        const jfStyleEl = document.createElement("style");
        jfStyleEl.id = "jfStyleEl";
        jfStyleEl.insertAdjacentHTML("beforeend", await cssPromise);
        document.head.appendChild(jfStyleEl);
        const optionBar = document.createElement("div");
        optionBar.id = "optionBar";
        const buttonPlain = document.createElement("button");
        const buttonPlainSpan = document.createElement("span");
        const buttonFormatted = document.createElement("button");
        const buttonFormattedSpan = document.createElement("span");
        buttonPlain.appendChild(buttonPlainSpan);
        buttonFormatted.appendChild(buttonFormattedSpan);
        buttonPlain.id = "buttonPlain";
        buttonPlainSpan.innerText = "Raw";
        buttonFormatted.id = "buttonFormatted";
        buttonFormattedSpan.innerText = "Parsed";
        buttonFormatted.classList.add("selected");
        let plainOn = false;
        buttonPlain.addEventListener(
          "mousedown",
          () => {
            if (!plainOn) {
              plainOn = true;
              rawJsonContainer.hidden = false;
              parsedJsonContainer.hidden = true;
              buttonFormatted.classList.remove("selected");
              buttonPlain.classList.add("selected");
            }
          },
          false
        );
        buttonFormatted.addEventListener(
          "mousedown",
          function() {
            if (plainOn) {
              plainOn = false;
              rawJsonContainer.hidden = true;
              parsedJsonContainer.hidden = false;
              buttonFormatted.classList.add("selected");
              buttonPlain.classList.remove("selected");
            }
          },
          false
        );
        optionBar.appendChild(buttonPlain);
        optionBar.appendChild(buttonFormatted);
        document.body.prepend(optionBar);
        document.addEventListener("mousedown", generalClick);
      }
      const rootEntry = buildDom(parsedJsonRootStruct, false);
      await Promise.resolve();
      parsedJsonContainer.append(rootEntry);
    }
    return {
      formatted: true,
      note: "done",
      rawLength
    };
    function collapse(elements) {
      let el, i, blockInner;
      for (i = elements.length - 1; i >= 0; i--) {
        el = elements[i];
        el.classList.add("collapsed");
        if (!el.id) {
          blockInner = el.firstElementChild;
          while (blockInner && !blockInner.classList.contains("blockInner")) {
            blockInner = blockInner.nextElementSibling;
          }
          if (!blockInner)
            continue;
        }
      }
    }
    function expand(elements) {
      for (let i = elements.length - 1; i >= 0; i--)
        elements[i].classList.remove("collapsed");
    }
    function generalClick(ev) {
      const elem = ev.target;
      if (!(elem instanceof HTMLElement))
        return;
      if (elem.className === "e") {
        ev.preventDefault();
        const parent = elem.parentNode;
        assert(parent instanceof HTMLElement);
        if (parent.classList.contains("collapsed")) {
          if (ev.metaKey || ev.ctrlKey) {
            const gp = parent.parentNode;
            assert(gp instanceof HTMLElement);
            expand(gp.children);
          } else
            expand([parent]);
        } else {
          if (ev.metaKey || ev.ctrlKey) {
            const gp = parent.parentNode;
            assert(gp instanceof HTMLElement);
            collapse(gp.children);
          } else
            collapse([parent]);
        }
      }
    }
  })();
  if (PERFORMANCE_DEBUGGING) {
    resultPromise.then((result) => {
      const startTime = window.__jsonFormatterStartTime;
      const endTime = performance.now();
      const duration = endTime - startTime;
      console.log("JSON Formatter", result);
      console.log("Duration:", Math.round(duration * 10) / 10, "ms");
    });
  }
})();
