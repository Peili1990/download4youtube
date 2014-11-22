chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if(changeInfo && changeInfo.status == "complete"){
        chrome.tabs.executeScript(tabId, {file: "jquery.min.js"}, function(){
            setTimeout(function() {inject();}, 1000);
        });
    }
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