
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	switch(request.action){
		case "delete":
			var tabs = request.tabs;
			var count = 0;
			for(var i = 0; i < tabs.length; i++){
				chrome.tabs.remove(tabs[i].id,function(){
					count++;
					if(count == tabs.length){
						sendResponse();
					}
				});
			}
			break;
		case "move":
			var tabs = request.tabs;
			var index = request.index;
			var windowId = request.windowId;
			var count = 0;
			for(var i = 0; i < tabs.length; i++){
				(function(tab){
					chrome.tabs.move(tab.id,{windowId:windowId,index:index},function(){
						chrome.tabs.update(tab.id,{pinned:tab.pinned},function(){
							count++;
							if(count == tabs.length){
								sendResponse();
							}
						});
					});
				})(tabs[i]);
			}
			break;
		case "new":
			var tabs = request.tabs;
			var first = tabs.shift();
			var count = 0;
			if(first){
				chrome.windows.create({tabId:first.id},function(w){
					chrome.tabs.update(first.id,{pinned:first.pinned});
					for(var i = 0; i < tabs.length; i++){
						(function(tab){
							chrome.tabs.move(tab.id,{windowId:w.id,index:1},function(){
								chrome.tabs.update(tab.id,{pinned:tab.pinned},function(){
									count++;
									if(count == tabs.length){
										sendResponse();
									}
								});
							});
						})(tabs[i]);
					}
				});
			}else{
				chrome.windows.create({});
			}
			break;
	}
});
