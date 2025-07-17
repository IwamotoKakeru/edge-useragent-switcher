chrome.action.onClicked.addListener(async (tab) => {
    if (!tab || !tab.id || !tab.url) return;

    const edgeUA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.100.0";

    const rules = [
        {
            id: 1,
            priority: 1,
            action: {
                type: "modifyHeaders",
                requestHeaders: [
                    { header: "User-Agent", operation: "set", value: edgeUA }
                ]
            },
            condition: {
                urlFilter: "*", // 必要に応じて絞る
                resourceTypes: ["main_frame"]
            }
        }
    ];

    // 古いルール削除 & 追加
    await chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: [1],
        addRules: rules
    });

    // UAルールが有効になるまで少し待つ
    await new Promise((resolve) => setTimeout(resolve, 300));

    // ページをリロード
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => location.reload()
    });
});
