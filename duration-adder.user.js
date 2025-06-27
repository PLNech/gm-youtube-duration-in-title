// ==UserScript==
// @name     YouTube Duration + View Count + Date Titler
// @description A GreaseMonkey script to add video duration, view count, and upload date to YouTube titles
// @match https://www.youtube.com/watch*
// @match https://youtu.be/*
// @version  0.3
// @license GPL-3.0-or-later
// @icon https://image.flaticon.com/icons/png/128/174/174883.png
// @namespace plnech.fr
// @noframes
// @grant    none
// @updateURL https://github.com/PLNech/gm-youtube-duration-in-title/raw/master/duration-adder.user.js
//
// ==/UserScript==

// Configuration options - set to true/false to enable/disable features
const SHOW_DURATION = true;
const SHOW_VIEWCOUNT = true;
const SHOW_UPLOAD_DATE = true;
var timeout;
function updateTitle(){
  var durationElement = document.getElementsByClassName("ytp-time-duration")[0];
  var titleElement = document.getElementsByClassName("ytp-title-link")[0];
  var viewCountElement = document.querySelector("ytd-watch-info-text #info .bold") ||
                        document.querySelector("#info-contents #count .view-count") ||
                        document.querySelector("#count .ytd-video-view-count-renderer") ||
                        document.querySelector("ytd-video-view-count-renderer .view-count");

  if (durationElement && titleElement) {
    var duration = SHOW_DURATION ? durationElement.textContent : "";
    var title = titleElement.textContent;
    var viewCount = "";
    var uploadDate = "";

    if (SHOW_VIEWCOUNT && viewCountElement) {
      viewCount = viewCountElement.textContent.trim();
      // Extract number with K/M/B suffix, remove "views" and extra spaces
      viewCount = viewCount.replace(/\s*views?\s*/gi, '').replace(/\s+/g, '').trim();
    }

    if (SHOW_UPLOAD_DATE) {
      // First try to get exact date from tooltip
      var tooltipElement = document.querySelector("ytd-watch-info-text tp-yt-paper-tooltip #tooltip");
      if (tooltipElement) {
        var tooltipText = tooltipElement.textContent;
        // Extract date from tooltip like "7,369 views • Jan 2, 2021"
        var exactDateMatch = tooltipText.match(/•\s*([A-Za-z]{3}\s+\d{1,2},\s+\d{4})/);
        if (exactDateMatch) {
          var dateStr = exactDateMatch[1];
          var parsedDate = new Date(dateStr);
          if (!isNaN(parsedDate.getTime())) {
            uploadDate = parsedDate.getFullYear() + '-' +
                        String(parsedDate.getMonth() + 1).padStart(2, '0') + '-' +
                        String(parsedDate.getDate()).padStart(2, '0');
          }
        }
      }

      // Fallback: calculate from relative date if tooltip not available
      if (!uploadDate) {
        var infoElement = document.querySelector("ytd-watch-info-text #info");
        if (infoElement) {
          var infoText = infoElement.textContent;
          // Extract date patterns like "3 years ago", "4 months ago", etc.
          var dateMatch = infoText.match(/(\d+)\s+(year|month|week|day|hour|minute)s?\s+ago/i);
          if (dateMatch) {
            var amount = parseInt(dateMatch[1]);
            var unit = dateMatch[2].toLowerCase();
            var currentDate = new Date();

            // Calculate approximate upload date
            switch(unit) {
              case 'year':
                currentDate.setFullYear(currentDate.getFullYear() - amount);
                break;
              case 'month':
                currentDate.setMonth(currentDate.getMonth() - amount);
                break;
              case 'week':
                currentDate.setDate(currentDate.getDate() - (amount * 7));
                break;
              case 'day':
                currentDate.setDate(currentDate.getDate() - amount);
                break;
              case 'hour':
                currentDate.setHours(currentDate.getHours() - amount);
                break;
              case 'minute':
                currentDate.setMinutes(currentDate.getMinutes() - amount);
                break;
            }

            // Format as YYYY-MM-DD
            uploadDate = currentDate.getFullYear() + '-' +
                        String(currentDate.getMonth() + 1).padStart(2, '0') + '-' +
                        String(currentDate.getDate()).padStart(2, '0');
          }
        }
      }
    }

    // Build title with enabled components
    var titleParts = [];
    if (SHOW_DURATION && duration) titleParts.push("[" + duration + "]");
    if (SHOW_VIEWCOUNT && viewCount) titleParts.push("[" + viewCount + "+]");
    if (SHOW_UPLOAD_DATE && uploadDate) titleParts.push("[" + uploadDate + "]");

    if (titleParts.length > 0) {
      document.title = titleParts.join("") + " " + title + " - YouTube";
    } else {
      // Fallback to original format if no components enabled or found
      document.title = title + " - YouTube";
    }
  }

  timeout = setTimeout(updateTitle, 5000);
}

updateTitle();
