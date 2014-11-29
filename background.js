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
	chrome.tabs.getSelected(null, function(tab){
		if(tab.url.startsWith('https://www.youtube.com/watch?v=')) {
			chrome.tabs.executeScript(null, {file: "inject.js"});
		}
	});
}

if (typeof String.prototype.startsWith != 'function') {
  String.prototype.startsWith = function (str){
    return this.indexOf(str) == 0;
  };
}