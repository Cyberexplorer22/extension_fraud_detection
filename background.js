// chrome.runtime.onInstalled.addListener(() => {
//     console.log("Extension installed");
//     fetch(chrome.runtime.getURL('db/blacklist.json'))
//       .then(response => response.json())
//       .then(data => {
//         console.log("Blacklist loaded:", data);
//         chrome.storage.local.set({ blacklist: data });
//       })
//       .catch(error => console.error('Error loading blacklist:', error));
//   });
  
//   // Google Safe Browsing API configuration
//   const API_KEY = "AIzaSyCVNm3M_rDmfmZtmtNcxXEma_5SyBGl3Bg"; // Replace with your API key
//   const SAFE_BROWSING_ENDPOINT = "https://safebrowsing.googleapis.com/v4/threatMatches:find";
  
//   // Function to check a URL against Safe Browsing API
//   async function checkUrlSafety(url) {
//     const requestBody = {
//       client: {
//         clientId: "Fraud Detection Extension",
//         clientVersion: "1.0",
//       },
//       threatInfo: {
//         threatTypes: ["MALWARE", "SOCIAL_ENGINEERING", "UNWANTED_SOFTWARE", "POTENTIALLY_HARMFUL_APPLICATION"],
//         platformTypes: ["ANY_PLATFORM"],
//         threatEntryTypes: ["URL"],
//         threatEntries: [{ url }],
//       },
//     };
  
//     try {
//       const response = await fetch(`${SAFE_BROWSING_ENDPOINT}?key=${API_KEY}`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(requestBody),
//       });
  
//       const data = await response.json();
//       if (data && data.matches) {
//         console.log("Threats detected:", data.matches);
//         return true; // URL is unsafe
//       } else {
//         console.log("No threats found for URL:", url);
//         return false; // URL is safe
//       }
//     } catch (error) {
//       console.error("Error checking URL safety:", error);
//       return false; // Default to safe if there's an error
//     }
//   }
  
//   // Listener for tab updates
//   chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
//     if (changeInfo.status === 'complete' && tab.url) {
//       console.log("Tab URL checked:", tab.url);
  
//       // Check against local blacklist
//       chrome.storage.local.get('blacklist', ({ blacklist }) => {
//         if (blacklist) {
//           console.log("Blacklist retrieved:", blacklist);
//           const isBlacklisted = blacklist.some(entry => tab.url.includes(entry.url));
//           if (isBlacklisted) {
//             console.log("Blacklisted URL detected:", tab.url);
//             chrome.tabs.sendMessage(tabId, {
//               type: 'BLACKLIST_ALERT',
//               url: tab.url,
//             }, () => {
//               if (chrome.runtime.lastError) {
//                 console.error("Error sending message to content script:", chrome.runtime.lastError);
//               }
//             });
//           } else {
//             console.log("URL not blacklisted:", tab.url);
//           }
//         } else {
//           console.error("Blacklist not found in storage.");
//         }
//       });
  
//       // Check URL using Google Safe Browsing API
//       checkUrlSafety(tab.url).then((isUnsafe) => {
//         if (isUnsafe) {
//           console.log("Unsafe URL detected via Safe Browsing API:", tab.url);
//           chrome.tabs.sendMessage(tabId, {
//             type: 'UNSAFE_ALERT',
//             url: tab.url,
//           }, () => {
//             if (chrome.runtime.lastError) {
//               console.error("Error sending message to content script:", chrome.runtime.lastError);
//             }
//           });
//         }
//       });
//     }
//   });
  
//   // Listener for messages from content scripts
//   chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//     if (message.action === "checkSafety") {
//       checkUrlSafety(message.url).then((isUnsafe) => {
//         sendResponse({ isUnsafe });
//       });
//       return true; // Keep the message channel open for async response
//     }
//   });
  

// Listener for when the extension is installed
chrome.runtime.onInstalled.addListener(() => {
    console.log("Extension installed");
    fetch(chrome.runtime.getURL('db/blacklist.json'))
        .then(response => response.json())
        .then(data => {
            console.log("Blacklist loaded:", data);
            chrome.storage.local.set({ blacklist: data });
        })
        .catch(error => console.error('Error loading blacklist:', error));
});

// Google Safe Browsing API configuration
const API_KEY = "AIzaSyCVNm3M_rDmfmZtmtNcxXEma_5SyBGl3Bg"; // Replace with your API key
const SAFE_BROWSING_ENDPOINT = "https://safebrowsing.googleapis.com/v4/threatMatches:find";

// Function to check a URL against Safe Browsing API
async function checkUrlSafety(url) {
    const requestBody = {
        client: {
            clientId: "Fraud Detection Extension",
            clientVersion: "1.0",
        },
        threatInfo: {
            threatTypes: ["MALWARE", "SOCIAL_ENGINEERING", "UNWANTED_SOFTWARE", "POTENTIALLY_HARMFUL_APPLICATION"],
            platformTypes: ["ANY_PLATFORM"],
            threatEntryTypes: ["URL"],
            threatEntries: [{ url }],
        },
    };

    try {
        const response = await fetch(`${SAFE_BROWSING_ENDPOINT}?key=${API_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody),
        });

        const data = await response.json();
        if (data && data.matches) {
            console.log("Threats detected:", data.matches);
            return true; // URL is unsafe
        } else {
            console.log("No threats found for URL:", url);
            return false; // URL is safe
        }
    } catch (error) {
        console.error("Error checking URL safety:", error);
        return false; // Default to safe if there's an error
    }
}

// Listener for tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url) {
        console.log("Tab URL checked:", tab.url);

        // Check against local blacklist
        chrome.storage.local.get('blacklist', ({ blacklist }) => {
            if (blacklist) {
                const isBlacklisted = blacklist.some(entry => tab.url.includes(entry.url));
                if (isBlacklisted) {
                    console.log("Blacklisted URL detected:", tab.url);
                    chrome.tabs.sendMessage(tabId, {
                        type: 'BLACKLIST_ALERT',
                        url: tab.url,
                    }, handleMessageError);
                }
            }
        });

        // Check URL using Google Safe Browsing API
        checkUrlSafety(tab.url).then((isUnsafe) => {
            if (isUnsafe) {
                console.log("Unsafe URL detected via Safe Browsing API:", tab.url);
                chrome.tabs.sendMessage(tabId, {
                    type: 'UNSAFE_ALERT',
                    url: tab.url,
                }, handleMessageError);
            }
        });
    }
});

// Handle message sending errors
function handleMessageError() {
    if (chrome.runtime.lastError) {
        console.error("Error sending message to content script:", chrome.runtime.lastError);
    }
}

// Listener for messages from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "checkSafety") {
        checkUrlSafety(message.url).then((isUnsafe) => {
            sendResponse({ isUnsafe });
        });
        return true; // Keep the message channel open for async response
    }
});

// Content script logic to show alert or toast message
chrome.runtime.onMessage.addListener((message) => {
    if (message.type === 'UNSAFE_ALERT') {
        alert(`Unsafe URL detected: ${message.url}`);
    } else if (message.type === 'BLACKLIST_ALERT') {
        alert(`Blacklisted URL detected: ${message.url}`);
    }
});
