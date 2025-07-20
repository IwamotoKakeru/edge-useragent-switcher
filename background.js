chrome.action.onClicked.addListener(async (tab) => {
    if (!tab?.id || !tab.url) return;

    const edgeUA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.100.0";

    const rule = {
        id: 1,
        priority: 1,
        action: {
            type: "modifyHeaders",
            requestHeaders: [
                { header: "User-Agent", operation: "set", value: edgeUA }
            ]
        },
        condition: {
            urlFilter: "*",
            resourceTypes: ["main_frame"]
        }
    };

    const existingRules = await chrome.declarativeNetRequest.getDynamicRules();
    const alreadySet = existingRules.some(r => r.id === 1);

    if (!alreadySet) {
        await chrome.declarativeNetRequest.updateDynamicRules({
            addRules: [rule]
        });
    }

    // 確実なリロード方法
    chrome.tabs.reload(tab.id);
});
