// ==UserScript==
// @name     YouTube Duration Titler
// @description "A GreaseMonkey script to add video duration to YouTube titles"
// @include https://www.youtube.com/*
// @version  0.1
// @license GPL-3.0-or-later
// @icon https://image.flaticon.com/icons/png/128/174/174883.png
// @namespace plnech.fr
// @noframes
// @grant    none
// @updateURL https://github.com/PLNech/gm-youtube-duration-in-title/raw/master/duration-adder.user.js
//
// ==/UserScript==
var timeout;
function updateTitle(){
  var duration = document.getElementsByClassName("ytp-time-duration")[0].textContent;
  var title = document.getElementsByClassName("ytp-title-link")[0].textContent;
  document.title = "[" + duration + "] " + title + " - YouTube";
  timeout = setTimeout(updateTitle, 5000);
}

updateTitle();
