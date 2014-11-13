var f;
function click(e) {
	var f = document.getElementById("test");
	
	chrome.tabs.getSelected(null,function(tab) {
    	f.text = tab.url + "<<<<<<<<<<<<<<";
	});
	
	chrome.tabs.executeScript(null, {file: "inject.js"});
}

document.addEventListener('DOMContentLoaded', function () {
	var button = document.getElementById("button");
  	
	button.addEventListener('click', click);
});