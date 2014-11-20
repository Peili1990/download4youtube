console.log("inject");

// get the button bar
$buttons = $("#watch8-secondary-actions");

// if download button not exists
if($("#downloadbutton").length == 0) {
    console.log("inject start");
    // add the button
    var path = chrome.extension.getURL("download.png");
    $buttons.append("<div class='yt-uix-menu'><div class='yt-uix-menu-trigger'><button id='downloadbutton' class='yt-uix-button yt-uix-button-size-default yt-uix-button-opacity yt-uix-button-has-icon yt-uix-videoactionmenu-button yt-uix-tooltip' type='button' onclick=';return false;' title='download'><span class='yt-uix-button-icon-wrapper'><img src='" +  path + "'></span><span class='yt-uix-button-content'>download</span></button></div></div>");
    $("#downloadbutton").click(function(e) {
                               downloadFunction();
							   return false;
                               });
    
    // add the div
    var div = "<div id='downloadDiv' class='yt-uix-menu-content yt-ui-menu-content yt-uix-menu-content-hidden' role='menu'></div>";
    $("body").append(div);
    
    // set the coordinate
    var tops = $("#downloadbutton").offset().top + $("#downloadbutton").height();
    var lefts = $("#downloadbutton").offset().left + 10;
    
    $("#downloadDiv").css({
                          "top": tops + "px",
                          "left": lefts + "px"
                          });
    
    $("#downloadDiv").hide();
    
    $(document).bind("click", function(e) {
                     var target  = $(e.target);
					 console.log(target);
                     if(target.closest("#downloadbutton").length == 0 && target.closest("#downloadDiv").length == 0){
						$("#downloadbutton").parent().removeClass("yt-uix-menu-trigger-selected");
						$("#downloadbutton").removeClass("yt-uix-button-toggled");
                     	$("#downloadDiv").hide();
                     }
     });
}
console.log("inject end");

// convert a char (0~9, A~Z, a~z) to decimalism integer
function strToInt(c) {
    var num = c.charCodeAt(0);
	// if the char c is between [0-9]
    if(num >= 48 && num <= 57) {
        return num - 48;
    }
	// if the char c is between [a-z]
    else if(num >=97 && num <= 102){
        return 10 + num - 97;
    }
	// if the char c is between [A-Z]
    else if(num >= 65 && num <= 70){
        return 10 + num -65;
    }
    else{
        return -1;
    }
}

// convert a string of hexadecimal number to decimalism integer
function numberDecode(str) {
    var n = 0;
    for(i = 0; i < str.length; i++) {
        n *= 16;
        n += strToInt(str[i]);
    }
    return String.fromCharCode(n);
}

// decode, change /uxxxx and %xx to chars
function decode(url) {
    var target = "";
    for(var i = 0; i < url.length; i++) {
        if(url[i] == '\\') {
            if(url[++ i] == 'u') {
                var t = "";
                t += url[++ i];
                t += url[++ i];
                t += url[++ i];
                t += url[++ i];
                target += numberDecode(t);
            }
            else {
                target += url[i];
            }
        }
        else if(url[i] == '%') {
            var t = "";
            t += url[++ i];
            t += url[++ i];
            target += numberDecode(t);
        }
        else {
            target += url[i];
        }
    }
    return target;
}

function encode(title) {
	var encoded = "";
	for(var i = 0; i < title.length; i ++) {
		var num = title.charCodeAt(i);
		if((num >= 48 && num <= 57) || (num >=97 && num <= 102) || (num >= 65 && num <= 70)) {
			encoded +=title[i];
		}
		else {
			encoded += ("%" + (num).toString(16));
		}
	}
	return encoded;
}

// build download url from the code get by decode
function buildURL(code) {
    var url = "";
    var itagFlag = false;
    var quality = "";
    var type = "";
    equations = code.split("&");
    for(var i = 0; i < equations.length; i ++) {
        var parts = equations[i].split("=");
        if(parts[0] == "url") {
            url = equations[i].substring(4) + "&" + url;
        }
        else if(parts[0] == "itag") {
            if(!itagFlag) {
                itagFlag = true;
                url += (equations[i] + "&");
            }
        }
        else if(!(parts[0] == "quality" || parts[0] == "fallback_host" || parts[0] == "type")) {
            url += (equations[i] + "&");
        }
        else if(parts[0] == "quality") {
            quality = parts[1];
        }
        else if(parts[0] == "type") {
            type = parts[1].split(";")[0];
        }
    }
    url += ("title=" + encode($("title").text().replace(" - YouTube", "")));
    
    info = [type, quality, url];
    return info;
}

// get all download urls
function getURLs() {
    var text = $("#player-api").nextAll("script").nextAll("script").html();
    var re = new RegExp("\"url_encoded_fmt_stream_map\": \"[^\"]*\"");
    text = re.exec(text) + "";
    text = text.replace("\"url_encoded_fmt_stream_map\": \"", "");
    text = text.replace("\"", "");
    
    urls = text.split(",");
	var urlArray = [];
    for(var i = 0; i < urls.length; i ++) {
        var info = buildURL(decode(urls[i]));
		urlArray.push(info);
        console.log(info[0] + " " + info[1] + ": " + info[2]);
    }
	return urlArray;
}

// called when download button is clicked
function downloadFunction() {
	if($("#downloadDiv").is(":hidden")) {
    	var urlArray = getURLs();
	
		$("#download-list").remove();

		//in div
		$ul = '<ul id="download-list"></ul>';
		$("#downloadDiv").append($ul);
		
		var infoArray = new Array();
		for(var i = 0; i < urlArray.length; i++) {
			if(!infoArray[urlArray[i][1]]) {
				infoArray[urlArray[i][1]] = true;
				$("#download-list").append('<li><button id="download-link-' + i + '" type="button" class="yt-ui-menu-item has-icon yt-uix-menu-close-on-select action-panel-trigger"> <span class="yt-ui-menu-item-icon yt-uix-button-icon-action-panel-report yt-sprite"></span><span class="yt-ui-menu-item-label">' + urlArray[i][1] + '</span></button> </li>');
		
				var urllink = urlArray[i][2];
		
				$(("#download-link-" + i)).click(function() {
					window.open(urllink, '_blank');
				});
			}
		}
	
		$(".yt-uix-menu-trigger").removeClass("yt-uix-menu-trigger-selected").children().removeClass("yt-uix-button-toggled").children().removeClass("yt-uix-button-toggled");
		$("#downloadbutton").parent().addClass("yt-uix-menu-trigger-selected");
		$("#downloadbutton").addClass("yt-uix-button-toggled");
		$("#downloadDiv").show();
	}
	else {
		$("#downloadDiv").hide();
	}
	
	console.log($("title").text().replace(" - YouTube", ""));
}

