
const ID_PROGRESS = "KlaviaExtension_RaceProgress";
const CLASS_LETTER_TYPED_ANIMATION = "KlaviaExtension_LetterTypedAnimation"

const SETTING_LEADERBOARD_POSITION = "RaceJS_SettingLeaderboardPosition"
const SETTING_ACTIVE_QUEST_POSITION = "RaceJS_SettingActiveQuestPosition"

const EMOJIS = ["✨", "💥", "🔥", "💫", "🌟", "🎉", "⚡", "🚀", "💨"];


async function autorace() {
    const src = chrome.runtime.getURL("/util/various.js");
    const module = await import(src);
    const isElementVisible = module.isElementVisible;

    const raceAgainButton = document.querySelector("#race-again");

    if (isElementVisible(raceAgainButton)) {
        raceAgainButton.click();
    }

    if (document.getElementById("game-container") !== undefined) {
        setTimeout(autorace, 200);
    }
}


async function updateProgressBar() {
    let letters = Array.from(document.getElementsByClassName("typing-letter"));
    let current = document.getElementsByClassName("highlight-letter")[0] ?? document.getElementsByClassName("incorrect-letter")[0];
    if (current) {
        let progressIndicator = document.getElementById(ID_PROGRESS);
        let progress = Math.ceil(letters.indexOf(current) / letters.length * 100);
        progressIndicator.style.width = `${progress}%`;
        if (progress == 100) {
            return;
        }
    }

    setTimeout(updateProgressBar, 200);
}

async function progressBar() {
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

    await updateProgressBar();
}


async function renderGfx(previous = null) {
    let letters = Array.from(document.getElementsByClassName("typing-letter"));
    let current = document.getElementsByClassName("highlight-letter")[0] ?? document.getElementsByClassName("incorrect-letter")[0];

    if (!current) {
        setTimeout(renderGfx, 100);
        return;
    }

    if (previous !== current) {
        let currentLocation = current.getBoundingClientRect();
        let animation = document.createElement("div");
        animation.classList.add(CLASS_LETTER_TYPED_ANIMATION);
        animation.style.position = "absolute";
        animation.style.left = `${currentLocation.left + window.scrollX}px`;
        animation.style.top = `${currentLocation.top + window.scrollY}px`;
        animation.style.width = `${currentLocation.width}px`;
        animation.style.height = `${currentLocation.height}px`;
        animation.textContent = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
        document.body.appendChild(animation);

        animation.addEventListener("animationend", () => {
            animation.remove();
        });
    }

    setTimeout(() => renderGfx(current), 100);
}


async function createLeaderboardFrame() {
    const src = chrome.runtime.getURL("../util/dynamicFrame.js");
    const module = await import(src);
    const dynamicFrame = new module.DynamicFrame("24h Leaderboard");

    const listener = (x, y, width, height) => {
        chrome.storage.local.set(
            {
                [SETTING_LEADERBOARD_POSITION]: [x, y, width, height]
            }
        );
    }
    dynamicFrame.addDragListener(listener);
    dynamicFrame.addResizeListener(listener);

    chrome.storage.local.get([SETTING_LEADERBOARD_POSITION], (data) => {
        const position = data[SETTING_LEADERBOARD_POSITION] ?? [150, 150, 400, 300];
        dynamicFrame.resize(position[2], position[3]);
        dynamicFrame.move(position[0], position[1]);
    });


    try {
        const response = await fetch("https://klavia.io/leaderboards/top_racers?tp=24h");
        const html = await response.text();

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        const element = doc.querySelector("#leaderboards_table > div.table-responsive");
        if (element) {
            dynamicFrame.showElement(element);
        } else {
            dynamicFrame.showHtml(`<p>Element not found.</p>`);
        }
    } catch (error) {
        dynamicFrame.showHtml(`<p>Error loading content: ${error.message}</p>`);
    }
    dynamicFrame.scale(.7);
}


async function createQuestsFrame() {
    const src = chrome.runtime.getURL("../util/dynamicFrame.js");
    const module = await import(src);
    const dynamicFrame = new module.DynamicFrame("Active Quest");

    const listener = (x, y, width, height) => {
        chrome.storage.local.set(
            {
                [SETTING_ACTIVE_QUEST_POSITION]: [x, y, width, height]
            }
        );
    }
    dynamicFrame.addDragListener(listener);
    dynamicFrame.addResizeListener(listener);

    chrome.storage.local.get([SETTING_ACTIVE_QUEST_POSITION], (data) => {
        const position = data[SETTING_ACTIVE_QUEST_POSITION] ?? [100, 100, 400, 300];
        dynamicFrame.resize(position[2], position[3]);
        dynamicFrame.move(position[0], position[1]);
    });

    try {
        const response = await fetch("https://klavia.io/racer/quests");
        const html = await response.text();

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        const element = doc.querySelector("#content > div:nth-child(3) > div.col-12.mb-5 > table");
        if (element) {
            dynamicFrame.showElement(element);
        } else {
            dynamicFrame.showHtml(`<p>Element not found.</p>`);
        }
    } catch (error) {
        dynamicFrame.showHtml(`<p>Error loading content: ${error.message}</p>`);
    }
    dynamicFrame.scale(.7);
}


export async function startDefaultRaceSession() {
    // Style for trail:
    let style = document.createElement("style");
    style.textContent = `
    .KlaviaExtension_LetterTypedAnimation {
        position: absolute;
        pointer-events: none;
        z-index: 9999;
        width: 1em;
        height: 1em;
        font-size: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: emoji-burst 0.8s ease-out forwards;
        opacity: 1;
    }

    @keyframes emoji-burst {
        0% {
            transform: scale(1) rotate(0deg) translate(0, 0);
            filter: brightness(1);
            opacity: 1;
        }
        30% {
            transform: scale(1.6) rotate(12deg) translate(-5px, -5px);
            filter: brightness(1.5);
        }
        60% {
            transform: scale(1.4) rotate(-12deg) translate(5px, -10px);
            filter: brightness(2);
        }
        100% {
            transform: scale(0.8) rotate(0deg) translate(0, -30px);
            opacity: 0;
            filter: brightness(1);
        }
    }
    `;
    document.head.appendChild(style);

    // Get settings and run:
    const settings = await new Promise(resolve => {
        chrome.storage.local.get([
            "autoRaceEnabled",
            "raceProgressIndicatorEnabled",
            "typingTrailEnabled",
            "show24HourLeaderboardEnabled",
            "showActiveQuestEnabled"
        ], resolve);
    });
    Promise.all([
        (settings.autoRaceEnabled               ?? false) && autorace(),
        (settings.raceProgressIndicatorEnabled  ?? false) && progressBar(),
        (settings.typingTrailEnabled            ?? false) && renderGfx(),
        (settings.show24HourLeaderboardEnabled  ?? false) && createLeaderboardFrame(),
        (settings.showActiveQuestEnabled        ?? false) && createQuestsFrame(),
    ].filter(Boolean)).catch(console.error);
};
