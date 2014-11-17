function myFunction() {
	alert("11");
}
$buttons = $("#watch8-secondary-actions");
if($buttons != "undefined") {
	var path = chrome.extension.getURL("download.png");
	$buttons.append("<button id='downloadbutton' class='yt-uix-button yt-uix-button-size-default yt-uix-button-opacity yt-uix-button-has-icon yt-uix-videoactionmenu-button addto-button yt-uix-tooltip' type='button' onclick=';return false;' title='download'><span class='yt-uix-button-icon-wrapper'><img src='" +  path + "'></span><span class='yt-uix-button-content'>download</span></button>");
	$("#downloadbutton").click(function(e) {
        myFunction()
    });
}
