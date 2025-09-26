
const ROUTING_MAP = new Map([
    [ new RegExp( "^\/racer\/garage$"       ), "tools/garageSearchBar.js"   ],
    [ new RegExp( "^\/racer\/quests$"       ), "tools/questsSearchBar.js"   ],
    [ new RegExp( "^\/race$"                ), "tools/race.js"              ],
    [ new RegExp( "^\/lobbies\/.{19}$"      ), "tools/lobbies.js"           ],
]);

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (
        changeInfo.status == "complete" &&
        tab.url
    ) {
        let url = new URL(tab.url);

        for (const [routeRegex, scriptPath] of ROUTING_MAP) {
            if (routeRegex.test(url.pathname)) {
                chrome.scripting.executeScript({
                    target: { tabId: tabId },
                    files: [ scriptPath ]
                });
                break;
            }
        }
    }
});
