$(document).ready( function(){
//  $("#insertPage").click(function(){
//  var port=chrome.runtime.connect({name: "getpage"});
//    port.postMessage({req:"get",addr:"insertpage.html"});
//    port.onMessage.addListener(function(msg) {
//      if (msg.req=="insertpage.html"){
//          $("body").append("<div id=\"inner\">"+msg.content+"</div>");
//        port.disconnect();
//      }
//    });
//  });

  chrome.runtime.onMessage.addListener(
    function (msg) {
      if (msg.req=="init" && $("#initPart").length==0){
        $("body").append(msg.content);
        runBar();
      }
    }
  );
});

function runBar(){
  var percent=80;
  var element=".";
  var elements=".";
  (function(){
    percent=percent+10;
    $("#bar").width(percent*14/10);
    $("#percent").text("分析中");
    if(percent<99){
      setTimeout(arguments.callee,300);
    }
    else {
      $("#bar").detach();
      $("#percent").detach();
      $("#initBar").append("<input class=\"buttons\" id=\"insertContent\" type=\"button\" value=\"open\"/>");
      $("#initBar").append("<input class=\"buttons\" id=\"closeInitBar\" type=\"button\" value=\"close\"/>");
      $("#closeInitBar").click(
        function(){
        $("#initPart").detach();
      }
      );
      $("#insertContent").click(loadBgPage);
    }
  }).call(this);
}

function loadBgPage(){
  var port=chrome.runtime.connect({name: "getpage"});
  port.postMessage({req:"get",addr:"insertpage.html"});
  port.onMessage.addListener(function(msg) {
    if (msg.req=="insertpage.html"){
      $("#initPart").fadeOut();
      setTimeout(function(){
        $("body").append("<div id=\"inner\">"+msg.content+"</div>");
        $("#inner").hide().fadeIn();
        $("#funcExit").click(function(){
          $("#inner").detach();
          $("#initPart").fadeIn();
        });

//insert content and keywords here to #contentWrapper and #?...not defined yet
//--not implemented----

//content block
        if ($("#contentContainer").height()>$("#contentBg").height()) {
          calcScrollBar($("#contentBg"),$("#contentWrapper"),$("#contentContainer"));
        }
//menu block to come
//--not implemented-----
      },500);
      port.disconnect();
    }
  });
}

//add the scrollBar with  background, wrapper, and the text container
function calcScrollBar(bg,wrapper,container){
if (container.height()>bg.height()){
  initContainer();
  }
//surface of the scorllbar
//initContainer();
  function initContainer(){
    var sc=$("<div class=\"scrollContainer\"></div>");
    var sb=$("<div class=\"scrollBg\" align=\"center\"></div>");
    var sf=$("<div class=\"scrollButton\"></div>");
    var sa=$("<div class=\"scrollBlock\"></div>");
    bg.append(sc);
    sc.append(sa);
    sc.append(sb);
    sb.append(sf);
    sc.css({"float":"right",
            "width":"30px",
            "height":"80%",
            "position":"relative",
            "margin-right":"3px",
            "z-index":"10000"
           });
    sa.css({"width":"30px",
            "height":"10%"
    });
    sb.css({"width":"30px",
            "padding-top":"2px",
            "padding-bottom":"2px",
            "opacity":"0.9",
            "height":"100%",
            "background-color":"#d3d8df",
            "border-radius":"15px"
           });
    sf.css({"position":"relative",
            "width":"26px",
            "margin-left":"0px",
            "height":"120px",
            "background-color":"#f3f8ff",
            "border-radius":"12px"
           });

//functional part

//init numbers
    var scrollLength=sb.height()*0.6;
    var distance= (function (){
      if (container.height()>wrapper.height()){
        return container.height()-wrapper.height();
      }
    })();
    var mousey=0, blockTop=0, newTop=0;

//drag event
    sf.mousedown(function(e){

      var pos=$(this).position();
      blockTop = parseInt(pos.top);
      mousey = e.pageY;
      $(document).bind("mousemove",blockMove);
      function blockMove(event){
        newTop=parseInt(blockTop + (event.pageY-mousey));
        getScroll(newTop);
        event.stopPropagation();
        event.preventDefault();
      }
      $(document).mouseup(function(){
        $(document).unbind("mousemove");
      });
    });

//get the pixes already moved
    function getScroll(newTop){
      if(newTop<0){
        newTop=0;
      }
      var maxTop = sc.height()-sf.height();
      if(newTop>maxTop){
        newTop = maxTop;
      }
      sf.css({"top":newTop});
      var connTop = parseInt((newTop / scrollLength)*distance);
      if(connTop>0){connTop=connTop-1}
      container.css({"top":0-connTop});
      return false;
    }
  }
  return false;
}
