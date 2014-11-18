function strToInt(c) {
    var num = c.charCodeAt(0);
    if(num >= 48 && num <= 57) {
        return num - 48;
    }
    else if(num >=97 && num <= 102){
        return 10 + num - 97;
    }
    else if(num >= 65 && num <= 70){
        return 10 + num -65;
    }
    else{
        return -1;
    }
}

function numberDecode(str) {
    var n = 0;
    for(i = 0; i < str.length; i++) {
        n *= 16;
        n += strToInt(str[i]);
    }
    return String.fromCharCode(n);
}

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
    url += "title=test";
    
    info = [type, quality, url];
    return info;
}

function getURLs() {
    var text = $("#player-api").nextAll("script").nextAll("script").html();
    var re = new RegExp("\"url_encoded_fmt_stream_map\": \"[^\"]*\"");
    text = re.exec(text) + "";
    text = text.replace("\"url_encoded_fmt_stream_map\": \"", "");
    text = text.replace("\"", "");
    
    urls = text.split(",");
    for(var i = 0; i < urls.length; i ++) {
        var info = buildURL(decode(urls[i]));
        console.log(info[0] + " " + info[1] + ": " + info[2]);
    }
}

function downloadFunction() {
    getURLs();
}
$buttons = $("#watch8-secondary-actions");
if($buttons != "undefined") {
    var path = chrome.extension.getURL("download.png");
    $buttons.append("<button id='downloadbutton' class='yt-uix-button yt-uix-button-size-default yt-uix-button-opacity yt-uix-button-has-icon yt-uix-videoactionmenu-button addto-button yt-uix-tooltip' type='button' onclick=';return false;' title='download'><span class='yt-uix-button-icon-wrapper'><img src='" +  path + "'></span><span class='yt-uix-button-content'>download</span></button>");
    $("#downloadbutton").click(function(e) {
                               downloadFunction()
                               });
}
