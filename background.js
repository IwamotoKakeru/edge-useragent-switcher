
const EDGE_UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.100.0";
const RULE_ID = 1;

function getEdgeRule() {
    return {
        id: RULE_ID,
        priority: 1,
        action: {
            type: "modifyHeaders",
            requestHeaders: [
                { header: "User-Agent", operation: "set", value: EDGE_UA }
            ]
        },
        condition: {
            urlFilter: "*",
            resourceTypes: ["main_frame"]
        }
    };
}

chrome.action.onClicked.addListener(async (tab) => {
    if (!tab?.id || !tab.url) return;

    // 現在の状態を取得
    const { isEdgeUA } = await chrome.storage.local.get("isEdgeUA");
    const nextState = !isEdgeUA;

    if (nextState) {
        // Edge UAに切り替え（ルール追加）
        await chrome.declarativeNetRequest.updateDynamicRules({
            addRules: [getEdgeRule()],
            removeRuleIds: [],
        });
        console.log("Edge UAに切り替えました: " + isEdgeUA);
    } else {
        // デフォルトUAに戻す（ルール削除）
        await chrome.declarativeNetRequest.updateDynamicRules({
            addRules: [],
            removeRuleIds: [RULE_ID]
        });
        console.log("デフォルトUAに戻しました:" + isEdgeUA);
    }

    // 状態保存
    await chrome.storage.local.set({ isEdgeUA: nextState });

    // ページリロード
    chrome.tabs.reload(tab.id);
});
