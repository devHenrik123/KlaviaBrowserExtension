

const checkboxGarageSearchBar = document.getElementById("checkboxGarageSearchBar");
const checkboxQuestsSearchBar = document.getElementById("checkboxQuestsSearchBar");

function save() {
    chrome.storage.sync.set({
        garageSearchBarEnabled: checkboxGarageSearchBar.checked,
        questsSearchBarEnabled: checkboxQuestsSearchBar.checked
    });
}

[
    checkboxGarageSearchBar,
    checkboxQuestsSearchBar
].forEach( e => {
    e.addEventListener("click", save)
});

document.addEventListener("DOMContentLoaded", () => {
    chrome.storage.sync.get(["garageSearchBarEnabled", "questsSearchBarEnabled"], (data) => {
        checkboxGarageSearchBar.checked = data.garageSearchBarEnabled ?? true;
        checkboxQuestsSearchBar.checked = data.questsSearchBarEnabled ?? true;
    });
});
