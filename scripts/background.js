let currentAuthorName = null;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    // console.log("background.js message=", message, "sender=", sender);
    switch (message.request) {
        case "url-changed":
            currentAuthorName = message.authorName;
            chrome.storage.sync.get(
                { enabled: false, allowed: [] },
                ({ enabled, allowed }) => {
                    console.log(
                        "enabled=",
                        enabled,
                        allowed,
                        "includes",
                        currentAuthorName,
                        ":",
                        allowed.includes(currentAuthorName)
                    );
                    sendResponse({
                        allow: !enabled || allowed.includes(currentAuthorName),
                    });
                }
            );
            return true;

        case "popup-loaded":
            sendResponse({ currentAuthorName });
            return false;

        default:
            sendResponse({ error: "wat" });
            return false;
    }
});

// chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
//     // console.log("tabId=", tabId, "changeInfo=", changeInfo, "tab=", tab);
//     if (changeInfo?.status == "complete") {
//         chrome.tabs.sendMessage(tabId, { url: tab.url });
//     }
// });
