chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
	inject();
});

chrome.tabs.onCreated.addListener(function(tabId, changeInfo, tab) {
	inject();
})

chrome.tabs.onReplaced.addListener(function(tabId, changeInfo, tab) {
	inject();
})

function inject() {
	if(true) {
		chrome.tabs.executeScript(null, {file: "inject.js"});
	}
}