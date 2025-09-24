
function garageSearchBar(anchorElement) {
    let cars = document.querySelector("#content > div:nth-child(3) > div.col-lg-8 > div");
    let searchBar = document.createElement("input");
    searchBar.type = "search";
    searchBar.style.width = "300px";
    searchBar.style.margin = "0px 20px 0px 0px";
    searchBar.placeholder = "Search";
    searchBar.onchange = function() {
        Array.from(cars.children).forEach((child) => {
            let carLink = child.children[0].children[0].children[0];
            child.style.display = carLink.title.toLowerCase().includes(searchBar.value.toLowerCase()) ? "block" : "none";
        });
    }

    anchorElement.insertBefore(searchBar, anchorElement.firstChild);
}

function start() {
    let parkedCarsHeader = document.querySelector("#content > div:nth-child(3) > div.col-lg-8 > h4");
    if (parkedCarsHeader) {
        garageSearchBar(parkedCarsHeader);
    } else {
        setTimeout(start, 300);
    }
}

chrome.storage.local.get(["garageSearchBarEnabled"], (data) => {
    if (data.garageSearchBarEnabled ?? false) start();
});
