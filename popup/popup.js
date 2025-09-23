
const CheckboxAutoRace = document.getElementById("checkboxAutoRace");
const CheckboxGarageSearchBar = document.getElementById("checkboxGarageSearchBar");
const CheckboxQuestsSearchBar = document.getElementById("checkboxQuestsSearchBar");
const CheckboxRaceProgressIndicator = document.getElementById("checkboxRaceProgressBar");
const CheckboxTypingTrail = document.getElementById("checkboxTypingTrail");


class Setting {
    constructor(name, defaultValue) {
        this.name = name,
        this.defaultValue = defaultValue;
    }
}


const DefaultSettings = new Map([
    [CheckboxAutoRace,              new Setting("autoRaceEnabled",              false   )],
    [CheckboxGarageSearchBar,       new Setting("garageSearchBarEnabled",       true    )],
    [CheckboxQuestsSearchBar,       new Setting("questsSearchBarEnabled",       true    )],
    [CheckboxRaceProgressIndicator, new Setting("raceProgressIndicatorEnabled", true    )],
    [CheckboxTypingTrail,           new Setting("typingTrailEnabled",           true    )]
]);


function saveSettings() {
    chrome.storage.sync.set(
        Object.fromEntries(
            [...DefaultSettings].map( ([checkbox, setting]) => [setting.name, checkbox.checked] )
        )
    );
}


function loadSettings() {
    let settingNames = [...DefaultSettings.values()].map( (setting) => setting.name );

    chrome.storage.sync.get(settingNames, (data) => {
        for ( const [checkbox, setting] of DefaultSettings.entries() ) {
            checkbox.checked = data[setting.name] ?? setting.defaultValue;
        }
    });
}


// Init event listeners: ( Yes, I write comments. This is not AI generated! )

[...DefaultSettings.keys()].forEach( e => {
    e.addEventListener("click", saveSettings)
});

document.addEventListener("DOMContentLoaded", loadSettings); 
