(() => {
    const ID_PROGRESS = "KlaviaExtension_RaceProgress";
    const CLASS_LETTER_TYPED_ANIMATION = "KlaviaExtension_LetterTypedAnimation"
    
    const EMOJIS = ["✨", "💥", "🔥", "💫", "🌟", "🎉", "⚡", "🚀", "💨"];

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

    function renderGfx(previous = null) {
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

    // ==============================================================================================================================================
    // Initialize:
    // ==============================================================================================================================================
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

    chrome.storage.sync.get(["autoRaceEnabled", "raceProgressIndicatorEnabled", "typingTrailEnabled"], (data) => {
        Promise.all([
            new Promise(resolve => {
                if (data.autoRaceEnabled ?? false) autorace();
            }),
            new Promise(resolve => {
                if (data.raceProgressIndicatorEnabled ?? false) progressBar();
            }),
            new Promise(resolve => {
                if (data.typingTrailEnabled ?? false) renderGfx();
            })
        ]);
    });
})();
