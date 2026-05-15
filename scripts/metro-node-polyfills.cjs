"use strict";

/**
 * Metro / RN CLI assume Node APIs from 20.12+ (util.styleText) and 18.17+ (URL.canParse).
 * Preload via NODE_OPTIONS so every react-native CLI process gets them before Metro loads.
 */
const util = require("util");
if (typeof util.styleText !== "function") {
  util.styleText = function styleText(_style, text) {
    return text;
  };
}

if (typeof URL !== "undefined" && typeof URL.canParse !== "function") {
  URL.canParse = function urlCanParse(input, base) {
    try {
      new URL(input, base);
      return true;
    } catch {
      return false;
    }
  };
}
