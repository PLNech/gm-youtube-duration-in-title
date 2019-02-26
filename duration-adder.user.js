// ==UserScript==
// @name     YouTube Duration Titler
// @version  0.1
// @description "A GreaseMonkey script to add video duration to YouTube titles"
// @icon https://image.flaticon.com/icons/png/128/174/174883.png
// @namespace plnech.fr
// @noframes
// @grant    none
// @include https://www.youtube.com/*
// ==/UserScript==
var timeout;
function updateTitle(){
  var duration = document.getElementsByClassName("ytp-time-duration")[0].textContent;
  var title = document.getElementsByClassName("ytp-title-link")[0].textContent;
  document.title = "[" + duration + "] " + title + " - YouTube";
  timeout = setTimeout(updateTitle, 5000);
}

updateTitle();
