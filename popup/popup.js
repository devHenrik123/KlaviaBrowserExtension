
const checkboxAutoRace = document.getElementById("checkboxAutoRace");
const checkboxGarageSearchBar = document.getElementById("checkboxGarageSearchBar");
const checkboxQuestsSearchBar = document.getElementById("checkboxQuestsSearchBar");

function save() {
    chrome.storage.sync.set({
        autoRaceEnabled: checkboxAutoRace.checked,
        garageSearchBarEnabled: checkboxGarageSearchBar.checked,
        questsSearchBarEnabled: checkboxQuestsSearchBar.checked,
    });
}

[
    checkboxAutoRace,
    checkboxGarageSearchBar,
    checkboxQuestsSearchBar
].forEach( e => {
    e.addEventListener("click", save)
});

document.addEventListener("DOMContentLoaded", () => {
    chrome.storage.sync.get(["autoRaceEnabled", "garageSearchBarEnabled", "questsSearchBarEnabled"], (data) => {
        checkboxAutoRace.checked = data.autoRaceEnabled ?? false;
        checkboxGarageSearchBar.checked = data.garageSearchBarEnabled ?? true;
        checkboxQuestsSearchBar.checked = data.questsSearchBarEnabled ?? true;
    });
});
