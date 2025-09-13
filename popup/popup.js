
const checkboxAutoRace = document.getElementById("checkboxAutoRace");
const checkboxGarageSearchBar = document.getElementById("checkboxGarageSearchBar");
const checkboxQuestsSearchBar = document.getElementById("checkboxQuestsSearchBar");
const checkboxRaceProgressIndicator = document.getElementById("checkboxRaceProgressBar");

function save() {
    chrome.storage.sync.set({
        autoRaceEnabled: checkboxAutoRace.checked,
        garageSearchBarEnabled: checkboxGarageSearchBar.checked,
        questsSearchBarEnabled: checkboxQuestsSearchBar.checked,
        raceProgressIndicatorEnabled: checkboxRaceProgressIndicator.checked,
    });
}

[
    checkboxAutoRace,
    checkboxGarageSearchBar,
    checkboxQuestsSearchBar,
    checkboxRaceProgressIndicator
].forEach( e => {
    e.addEventListener("click", save)
});

document.addEventListener("DOMContentLoaded", () => {
    chrome.storage.sync.get(["autoRaceEnabled", "garageSearchBarEnabled", "questsSearchBarEnabled", "raceProgressIndicatorEnabled"], (data) => {
        checkboxAutoRace.checked = data.autoRaceEnabled ?? false;
        checkboxGarageSearchBar.checked = data.garageSearchBarEnabled ?? true;
        checkboxQuestsSearchBar.checked = data.questsSearchBarEnabled ?? true;
        checkboxRaceProgressIndicator.checked = data.raceProgressIndicatorEnabled ?? true;
    });
});
