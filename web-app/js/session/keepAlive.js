/**
 * Contains functions used to maintain in the background connection to the server.
 */
var keepAlive = {

    finished: false,
    
    msgPosY: 100,
    
    msgWidth: 450,

    /** Sends a keep alive request and schedules another one in 30 seconds */
    loop : function() {
        if(keepAlive.finished) { 
            return
        }
        setTimeout(keepAlive.loop, 10000)
        RPCManager.sendRequest({
            actionURL: "keepalive",
            httpMethod: "GET",
            callback: function(data, request) {
                var viewPortSize = screenSize.calculateViewPort();
                if(data.httpResponseCode != 200) {
                    keepAlive.finished = true;
                    keepAliveBox.animateMove(viewPortSize.width / 2 - keepAlive.msgWidth / 2, keepAlive.msgPosY);
                }
            }
        });
    },
    
    /**
     * Starts the keep alive with the delay of one minute.
     */
    startKeepAlive : function() {
        var viewPortSize = screenSize.calculateViewPort();
        var label = isc.Label.create({
            ID:"keepAliveBox",
            styleName:"exampleTitle",
            showEdges: false,
            showShadow: true,
            shadowSoftness: 10,
            shadowOffset: 3,
            padding:5,
            valign:"center",
            align:"center",
            canDragReposition:true, dragAppearance:"target",
            width: keepAlive.msgWidth,
            top: -keepAlive.msgPosY - 40, 
            left: viewPortSize.width / 2 - keepAlive.msgWidth / 2, // start off-screen    
            contents: "<div class='warning'>Oops, you lost connection to the server.<br />" 
                + "<a href='#' onclick='location.reload(true);'>Click here to reload the page</a></div>",
            animateTime: 1200 // milliseconds
        });
        label.bringToFront();
        setTimeout(keepAlive.loop, 10000)
    }
}

keepAlive.startKeepAlive()