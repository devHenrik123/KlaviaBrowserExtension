
(async () => {
    const variousUtils = await import(chrome.runtime.getURL("/util/various.js"));
    const raceUtils = await import(chrome.runtime.getURL("/util/raceUtils.js"));


    async function autoStartRace() {
        // The querySelector below may need to be updated,
        // because the current implementation is considered invalid html and may be changed.
        const startRaceBtn = document.querySelector("#start-race > #start-race");

        if (variousUtils.isElementVisible(startRaceBtn)) {
            startRaceBtn.click();
        }

        if (window.location.href.includes("lobbies")) {
            setTimeout(autoStartRace, 200);
        }
    }

    async function initRaceUtils() {
        const raceHasStarted = document.getElementById("game-container") !== undefined;
        if (raceHasStarted) {
            await raceUtils.startDefaultRaceSession();
        }
    }

    const lobbySettings = await new Promise(resolve => {
        chrome.storage.local.get(["lobbyAutoStartEnabled"], resolve);
    });
    await Promise.all([
        (lobbySettings.lobbyAutoStartEnabled ?? false ) && autoStartRace(),
        initRaceUtils()
    ].filter(Boolean)).catch(console.error);

})();
