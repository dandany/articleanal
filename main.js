//var preparedPage = fetch(chrome.extension.getURL("insertpage.html"));
chrome.browserAction.onClicked.addListener(function(){
  chrome.runtime.onMessage.addListener(function(msg){
    if(msg.req=="initpiece.html"){
      chrome.tabs.query({active:true,currentWindow:true},function(tabs){
        chrome.tabs.sendMessage(tabs[0].id,{req:"init",content:msg.content});
    });
    }
  });
  fetch(chrome.extension.getURL("initpiece.html"),"initpiece.html");
});
chrome.runtime.onConnect.addListener(
  function(port){
    if (port.name == "getpage"){
      port.onMessage.addListener(function(msg){
        if (msg.req=="get") {
          var s = chrome.extension.getURL(msg.addr);
          var result = null;
          var who = msg.addr;
          chrome.runtime.onMessage.addListener(
            function(request,sender,sendResponse){
              if (request.req== who){
                result=request.content;
                port.postMessage({req:who,content:result});
              }
            }
          );
          fetch(s,who);
        }});
    }}
);

function fetch2(url,callback){
  var results = null;
  var req = new XMLHttpRequest();
  req.open("GET",url,true);
  req.onreadystatechange= function(){
    if (this.readyState === 4){
      results = this.responseText;
      callback({res:results});
    }
  };
  req.send();
  }
///

function fetch(url,who){
  var results = null;
  var req = new XMLHttpRequest();
  req.open("GET",url,true);
  req.onreadystatechange= function(){
    if (this.readyState === 4){
      results = this.responseText;
      chrome.runtime.sendMessage({req:who,content:results});
    }
  };
  req.send();
  }



function fetchUrl(url,callback,contentType){
  var results = null;
  var request = new XMLHttpRequest();
  request.open("GET", url, callback != undefined);
  request.onreadystatechange = function(){
    if (this.readyState == XMLHttpRequest.DONE){
      if (contentType == "JSON")
        results = JSON.parse(this.responseText);
      else if (contentType == "XML")
        results = this.responseXML;
      else
        results = this.responseText;

      if (callback)
        callback(results);
      }
  };
  request.send(null);
  //return results;
}
