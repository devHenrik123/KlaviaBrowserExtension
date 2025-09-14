
const checkboxAutoRace = document.getElementById("checkboxAutoRace");
const checkboxGarageSearchBar = document.getElementById("checkboxGarageSearchBar");
const checkboxQuestsSearchBar = document.getElementById("checkboxQuestsSearchBar");
const checkboxRaceProgressIndicator = document.getElementById("checkboxRaceProgressBar");
const checkboxTypingTrail = document.getElementById("checkboxTypingTrail");

function save() {
    chrome.storage.sync.set({
        autoRaceEnabled: checkboxAutoRace.checked,
        garageSearchBarEnabled: checkboxGarageSearchBar.checked,
        questsSearchBarEnabled: checkboxQuestsSearchBar.checked,
        raceProgressIndicatorEnabled: checkboxRaceProgressIndicator.checked,
        typingTrailEnabled: checkboxTypingTrail.checked,
    });
}

[
    checkboxAutoRace,
    checkboxGarageSearchBar,
    checkboxQuestsSearchBar,
    checkboxRaceProgressIndicator,
    checkboxTypingTrail
].forEach( e => {
    e.addEventListener("click", save)
});

document.addEventListener("DOMContentLoaded", () => {
    chrome.storage.sync.get(["autoRaceEnabled", "garageSearchBarEnabled", "questsSearchBarEnabled", "raceProgressIndicatorEnabled", "typingTrailEnabled"], (data) => {
        checkboxAutoRace.checked = data.autoRaceEnabled ?? false;
        checkboxGarageSearchBar.checked = data.garageSearchBarEnabled ?? true;
        checkboxQuestsSearchBar.checked = data.questsSearchBarEnabled ?? true;
        checkboxRaceProgressIndicator.checked = data.raceProgressIndicatorEnabled ?? true;
        checkboxTypingTrail.checked = data.typingTrailEnabled ?? true;
    });
});
