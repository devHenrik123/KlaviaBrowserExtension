

class Setting {
    constructor(name, defaultValue) {
        this.name = name,
            this.defaultValue = defaultValue;
    }
}


const DefaultSettings = new Map([
    [document.getElementById("checkboxAutoRace"), new Setting("autoRaceEnabled", false)],
    [document.getElementById("checkboxGarageSearchBar"), new Setting("garageSearchBarEnabled", true)],
    [document.getElementById("checkboxQuestsSearchBar"), new Setting("questsSearchBarEnabled", true)],
    [document.getElementById("checkboxRaceProgressBar"), new Setting("raceProgressIndicatorEnabled", true)],
    [document.getElementById("checkboxTypingTrail"), new Setting("typingTrailEnabled", true)],
    [document.getElementById("checkbox24HourLeaderboard"), new Setting("show24HourLeaderboardEnabled", true)],
    [document.getElementById("checkboxActiveQuest"), new Setting("showActiveQuestEnabled", true)],
]);


function saveSettings() {
    chrome.storage.local.set(
        Object.fromEntries(
            [...DefaultSettings].map(([checkbox, setting]) => [setting.name, checkbox.checked])
        )
    );
}


function loadSettings() {
    let settingNames = [...DefaultSettings.values()].map((setting) => setting.name);

    chrome.storage.local.get(settingNames, (data) => {
        for (const [checkbox, setting] of DefaultSettings.entries()) {
            checkbox.checked = data[setting.name] ?? setting.defaultValue;
        }
    });
}


// Init event listeners: ( Yes, I write comments. This is not AI generated! )

[...DefaultSettings.keys()].forEach(e => {
    e.addEventListener("click", saveSettings)
});

document.addEventListener("DOMContentLoaded", loadSettings);


document.getElementById("buttonReloadKlavia").addEventListener("click", async () => {
    const tabs = await chrome.tabs.query({});

    for (const tab of tabs) {
        try {
            const url = new URL(tab.url);
            if (
                (
                    url.hostname.includes("klavia.io") ||
                    url.hostname.includes("playklavia.com") ||
                    url.hostname.includes("ntcomps.io")
                ) && tab.id
            ) {
                chrome.tabs.reload(tab.id);
            }
        } catch (e) {
            // skipping invalid url...
        }
    }
});

