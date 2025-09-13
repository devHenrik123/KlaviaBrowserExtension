
async function questsSearchBar(anchorElement) {
    let questMap = new Map();

    // Create search bar:
    let searchBar = document.createElement("input");
    searchBar.type = "search";
    searchBar.style.width = "300px";
    searchBar.style.margin = "0px 20px 0px 0px";
    searchBar.placeholder = "Search";
    searchBar.onchange = function() {
        let searchString = searchBar.value.toLowerCase();
        let isValidSearch = searchString.length > 0;
        questMap.forEach( (questData, questRow, map) => {
            let questDescription = questData.toLowerCase();
            let questTitle = questRow.outerHTML.toLowerCase();
            let matchesSearchString = questDescription.includes(searchString) || questTitle.includes(searchString);
            questRow.style.display = (!isValidSearch || (isValidSearch && matchesSearchString)) ? "table-row" : "none";
        });
    }
    anchorElement.insertBefore(searchBar, anchorElement.firstChild);

    // Init quest table:
    let questTable = document.querySelector("#content > div:nth-child(3) > div:nth-child(2) > table");
    for (let rowIndex = 1; rowIndex < questTable.rows.length; rowIndex++) {
        let row = questTable.rows[rowIndex];
        let questUrl = row.cells[0].firstChild.href;
        let questValue = await fetch(questUrl).then((resp) => resp.text());
        questMap.set(row, questValue);
    }
}

function start() {
    let otherQuestsHeader = document.querySelector("#content > div:nth-child(3) > div:nth-child(2) > h4");
    if (otherQuestsHeader) {
        questsSearchBar(otherQuestsHeader);
    } else {
        setTimeout(start, 300);
    }
}

chrome.storage.sync.get(["questsSearchBarEnabled"], (data) => { 
    if (data.questsSearchBarEnabled ?? false) start();
});
