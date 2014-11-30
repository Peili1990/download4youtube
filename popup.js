var $resolution;
$().ready(function() {
	chrome.storage.sync.get("resolution", function(data) {
		//console.log(data["resolution"]);
		$resolution = data["resolution"];
		$("#" + data["resolution"]).attr("checked", "true");
	});
})

var f;
function click(e) {
	//use API
	chrome.widget.getYoutubeLinks(function(links) {
		for(var i = 0; i < links.length; i++){
			var title = link[i].title;
			
			var link = link[i].url;
	
			//var title = "apple";
	
			//var link = "https://www.youtube.com/watch?v=-hzbRgRSI_U";
			
			// Ajax
			$.ajax({
				type: "GET",
				url : link,
				
				success: function(data){
					content = $(data).find("#player-api").nextAll("script").nextAll("script").html();
					re = new RegExp("\"url_encoded_fmt_stream_map\": \"[^\"]*\"");
					content = re.exec(content) + "";
										
					content = content.replace("\"url_encoded_fmt_stream_map\": \"", "");
					content = content.replace("\"", "");
					
					
					var flag = false;
					urls = content.split(",");
					for(var i = 0; i < urls.length; i ++) {
						var info = buildURL(decode(urls[i]));
						if(info[2].indexOf("signature") > -1) {
						$("#test").html($resolution+"----"+ info[0]);
							if(info[1]== $resolution){
								
								flag = true;
								
								var name = info[0].split("\/")[1];
								if(name.indexOf("-") > -1) {
									name = name.split("-")[1];
								}
								
								name = "./" + title + "." + name;
								chrome.downloads.download({url: info[2]+"", filename: name}, function(){});
								break;
							}
							
						}
						else {
							//	
							flag = true;
							alert("due to copyright, cannot download ");
							break;
						}
						console.log(info[0] + " " + info[1] + ": " + info[2]);
					}
					
					if(!flag){
						
					}
					
				},
				
				error: function(data){
					
				},
				
				timeout: function(data){
				
				}
				
			});
		}
	});
}

document.addEventListener('DOMContentLoaded', function () {
  	
	$("#button").click(function(e) {
		click(e);
	});
	
	$(".default").click(function(e) {
		chrome.storage.sync.set({"resolution":e.target.id});
		chrome.storage.sync.get("resolution", function(data) {
		$resolution = data["resolution"];
		
	});
	});
});

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
