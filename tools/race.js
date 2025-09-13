
function isElementVisible(el) {
    if (!el) return false;

    const style = window.getComputedStyle(el);
    const rect = el.getBoundingClientRect();

    return (
        style.display !== 'none' &&
        style.visibility !== 'hidden' &&
        style.opacity !== '0' &&
        rect.width > 0 &&
        rect.height > 0 &&
        rect.bottom > 0 &&
        rect.right > 0
    );
}


function start() {
    let raceAgainButton = document.querySelector("#race-again");
    if (isElementVisible(raceAgainButton)) {
        raceAgainButton.click();
    }

    if (window.location.href.includes("klavia.io/race")) {
        setTimeout(start, 200);
    }
}

chrome.storage.sync.get(["autoRaceEnabled"], (data) => {
    if (data.autoRaceEnabled ?? false) start();
});
