
const ID_PROGRESS = "KlaviaExtension_RaceProgress";

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


function autorace() {
    let raceAgainButton = document.querySelector("#race-again");
    if (isElementVisible(raceAgainButton)) {
        raceAgainButton.click();
    }

    if (window.location.href.includes("klavia.io/race")) {
        setTimeout(autorace, 200);
    }
}

function updateProgressBar() {
    let letters = Array.from(document.getElementsByClassName("typing-letter"));
    let current = document.getElementsByClassName("highlight-letter")[0] ?? document.getElementsByClassName("incorrect-letter")[0];
    if (current) {
        let progressIndicator = document.getElementById(ID_PROGRESS);
        progressIndicator.style.width = `${Math.ceil(letters.indexOf(current) / letters.length * 100)}%`;

        console.log(`Current letter: ${current}`);
        console.log(`Letter count: ${letters.length}`);
        console.log(`Current index: ${letters.indexOf(current)}`);
        console.log(`Progress: ${Math.ceil(letters.indexOf(current) / letters.length * 100)}`);
    }

    setTimeout(updateProgressBar, 200);
}

function progressBar() {
    let anchorElement = document.querySelector("#dashboard");
    if (!anchorElement) {
        setTimeout(progressBar, 200);
        return;
    }

    let progBarElem = document.createElement("div");
    progBarElem.style.width = "100%";
    progBarElem.style.height = "25px";
    progBarElem.style.backgroundColor = "#302f2fff";
    let progress = document.createElement("div");
    progress.id = ID_PROGRESS;
    progress.style.width = "0%";
    progress.style.height = "100%";
    progress.style.backgroundColor = "#2f6dabff"
    anchorElement.parentNode.insertBefore(progBarElem, anchorElement.nextSibling);
    progBarElem.appendChild(progress);

    updateProgressBar();
}

chrome.storage.sync.get(["autoRaceEnabled", "raceProgressIndicatorEnabled"], (data) => {
    Promise.all([
        new Promise( resolve => {
            if (data.autoRaceEnabled ?? false) autorace();
        }),
        new Promise( resolve => {
            if (data.raceProgressIndicatorEnabled ?? false) progressBar();
        })
    ]);
});
