(function() {
    'use strict';
    chrome.runtime.onInstalled.addListener(function(details) {
        return console.log('previousVersion', details.previousVersion);
    });

    chrome.tabs.onActivated.addListener(function(activeInfo) {
        return chrome.tabs.get(activeInfo.tabId, function(tab) {
            var tabUrl;
            tabUrl = tab.url.split("/");
            tabUrl = tabUrl[2];
            //alert(tabUrl);
            getSiteId(tabUrl);
            //return chrome.browserAction.setBadgeText({
            //	text: "" + getCount(siteId)
            //}); 
        });
    });



    function getSiteId(s) {

        var req = new XMLHttpRequest();

        req.open('GET', 'http://localhost:8000/api/v1/site/', false);

        req.setRequestHeader('Content-type', 'application/json', true);

        req.onreadystatechange = function() {
            //alert(req.readyState + " " + req.status);
            if (req.readyState == 4 && req.status == 200) {

                var data = JSON.parse(this.responseText);
                var str;
                var siteId = "/api/v1/site/";
                for (var i = 0; i < data.objects.length; i++) {
                    if (data.objects[i]["url"] == s) {
                        siteId += data.objects[i]["id"] + "/";
                        break;
                    }
                }

                getCount(siteId);
            }
        }
        return req.send(null);
    }

    function getCount(s) {

        var req = new XMLHttpRequest();

        req.open('GET', 'http://localhost:8000/api/v1/comment/', false);

        req.setRequestHeader('Content-type', 'application/json', true);

        req.onreadystatechange = function() {
            //alert(req.readyState + " " + req.status);
            if (req.readyState == 4 && req.status == 200) {
            	var data = JSON.parse(req.responseText);
                var count = 0;
                for (var i = 0; i < data.objects.length; i++) {
                    if (data.objects[i]["site"] == s) {
                        count++;
                    }
                }
                chrome.browserAction.setBadgeText({
				  text: "" + count
				});
            }
        }
        return req.send(null);
    }

}).call(this);
