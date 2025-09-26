
(async () => {
    const MODULE_VARIOUS = await import(chrome.runtime.getURL("../util/various.js"));


    async function autoStartRace() {
        // The querySelector below may need to be updated,
        // because the current implementation is considered invalid html and may be changed.
        const startRaceBtn = document.querySelector("#start-race > #start-race");

        if (MODULE_VARIOUS.isElementVisible(startRaceBtn)) {
            startRaceBtn.click();
        }

        if (window.location.href.includes("lobbies")) {
            setTimeout(autoStartRace, 200);
        }
    }


    await Promise.all([
        autoStartRace()
    ]);

})();
