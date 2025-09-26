(async () => {
    const raceUtils = await import(chrome.runtime.getURL("/util/raceUtils.js"));
    await raceUtils.startDefaultRaceSession();
})();
