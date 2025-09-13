
const ROUTING_MAP = {
    "/racer/garage": "tools/garageSearchBar.js",
    "/racer/quests": "tools/questsSearchBar.js"
};

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (
        changeInfo.status == "complete" &&
        tab.url
    ) {
        let url = new URL(tab.url);

        for (const [route, scriptPath] of Object.entries(ROUTING_MAP)) {
            if (url.pathname == route) {
                chrome.scripting.executeScript({
                    target: { tabId: tabId },
                    files: [ scriptPath ]
                });
                break;
            }
        }
    }
});
