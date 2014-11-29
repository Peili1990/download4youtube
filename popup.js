$().ready(function() {
	chrome.storage.sync.get("resolution", function(data) {
		console.log(data["resolution"]);
		$("#" + data["resolution"]).attr("checked", "true");
	});
})

var f;
function click(e) {
	var f = document.getElementById("test");
	
	chrome.tabs.getSelected(null,function(tab) {
    	f.text = tab.url + "<<<<<<<<<<<<<<";
	});
	
	chrome.tabs.executeScript(null, {file: "inject.js"});
}

document.addEventListener('DOMContentLoaded', function () {
  	
	$("#button").click(function(e) {
		click(e);
	});
	
	$(".default").click(function(e) {
		chrome.storage.sync.set({"resolution":e.target.id});
	});
});