// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//     // Debugging log (optional, remove in production)
//     console.log("Message received in content.js:", message);

//     // Handle BLACKLIST_ALERT
//     if (message.type === 'BLACKLIST_ALERT') {
//         alert(`Warning! You are visiting a blacklisted website: ${message.url}. Proceed with caution!`);
//         return; // No need to perform a safety check if the site is blacklisted
//     }

//     // Handle checkSafety action
//     if (message.action === "checkSafety") {
//         chrome.runtime.sendMessage(
//             { action: "checkSafety", url: window.location.href },
//             (response) => {
//                 if (response.isUnsafe) {
//                     alert("This website may be unsafe!");
//                 } else {
//                     console.log("Website is safe.");
//                 }
//             }
//         );
//     }
// });


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("Message received in content.js:", message);

    if (message.type === 'BLACKLIST_ALERT') {
        alert(`Warning! You are visiting a blacklisted website: ${message.url}. Proceed with caution!`);
    } else if (message.type === 'UNSAFE_ALERT') {
        alert(`Caution! Unsafe website detected: ${message.url}.`);
    }
});
