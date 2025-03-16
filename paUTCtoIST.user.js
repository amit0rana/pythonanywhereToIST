// ==UserScript==
// @name         PythonAnywhere UTC to IST Converter
// @namespace   https://github.com/amit0rana/pythonanywhereToIST
// @version      0.1
// @description  Convert UTC time to IST time on PythonAnywhere
// @author       Amit
// @match        https://www.pythonanywhere.com/*
// @grant        none
// @downloadURL  https://github.com/amit0rana/pythonanywhereToIST/raw/refs/heads/main/paUTCtoIST.user.js
// @updateURL    https://github.com/amit0rana/pythonanywhereToIST/raw/refs/heads/main/paUTCtoIST.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to convert UTC to IST and update the display
    function updateISTTime() {
        // Find the server time span
        const serverTimeSpan = document.getElementById('id_server_time');
        
        // If the span exists
        if (serverTimeSpan) {
            // Get the UTC time string
            const utcTimeStr = serverTimeSpan.textContent.trim();
            
            // Parse the time components (handle both "HH:MM:SS" and "HH:MM" formats)
            const timeParts = utcTimeStr.split(':').map(Number);
            const hours = timeParts[0] || 0;
            const minutes = timeParts[1] || 0;
            const seconds = timeParts[2] || 0;
            
            // Calculate IST time (UTC+5:30)
            let istHours = hours + 5;
            let istMinutes = minutes + 30;
            
            // Adjust if minutes overflow
            if (istMinutes >= 60) {
                istHours += 1;
                istMinutes -= 60;
            }
            
            // Adjust if hours overflow
            if (istHours >= 24) {
                istHours -= 24;
            }
            
            // Format the IST time string
            let istTimeStr = 
                String(istHours).padStart(2, '0') + ':' +
                String(istMinutes).padStart(2, '0');
                
            // Only add seconds if they were in the original format
            if (timeParts.length > 2) {
                istTimeStr += ':' + String(seconds).padStart(2, '0');
            }
            
            // Find or create the IST time span
            let istTimeSpan = document.getElementById('id_ist_time');
            if (!istTimeSpan) {
                // Create a new span if it doesn't exist
                istTimeSpan = document.createElement('span');
                istTimeSpan.id = 'id_ist_time';
                
                // Add it to a paragraph inside the clock div
                const clockDiv = document.getElementById('id_clock');
                if (clockDiv) {
                    // Look for an existing paragraph, or create one if it doesn't exist
                    let paragraph = clockDiv.querySelector('p');
                    if (!paragraph) {
                        paragraph = document.createElement('p');
                        clockDiv.appendChild(paragraph);
                    }
                    
                    // Add the IST time to the paragraph
                    paragraph.appendChild(document.createTextNode(' / '));
                    paragraph.appendChild(istTimeSpan);
                }
            }
            
            // Update the IST time display
            if (istTimeSpan) {
                istTimeSpan.textContent = istTimeStr + ' IST';
            }
        }
    }

    // Function to set up the observer
    function setupObserver() {
        const serverTimeSpan = document.getElementById('id_server_time');
        if (!serverTimeSpan) {
            // If the span doesn't exist yet, try again soon
            setTimeout(setupObserver, 500);
            return;
        }

        // Create a new MutationObserver
        const observer = new MutationObserver(function(mutations) {
            // When changes are detected, update the IST time
            updateISTTime();
        });

        // Configure and start the observer
        observer.observe(serverTimeSpan, { 
            characterData: true, 
            childList: true,
            subtree: true
        });

        // Initial update
        updateISTTime();
    }

    // Start observing when the page loads
    window.addEventListener('load', function() {
        setupObserver();
    });

    // Also try to set up the observer immediately in case the DOM is already loaded
    setupObserver();
})();