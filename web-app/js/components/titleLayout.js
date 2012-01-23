
var titleFactory = {
    
    /**
     * Creates the title layout.
     */
    createTitleLayout: function() {
        
        isc.HTMLFlow.create({
            ID: "titleLabel",
            align: "left",
            align: "center",
            wrap: false,
            showEdges: false,
            margin: 0,
            width: 200,
            contents: "",
            
            /**
             * Sets the contents into the right span element.
             */
            setContentsTxt: function(txt) {
                this.setContents('<div class="title">' + txt + '</div>\
                    <div id="userInfo" title="Logged in as ' + securityInfo.user + '">Logged in as <b>' + securityInfo.user + '</b></div>'
                    );
            }
        });
        
        isc.HTMLFlow.create({
            ID: "helpLabel",
            align: "right",
            wrap: false,
            showEdges: false,
            width: 70,
            margin: 0,
            padding: 0,
            height: 65,
            contents: "<div class='help'>" +
                "<a href='help' target='help' class='title' title='Click here to access the help pages'>" +
                "<img src='images/help.png' alt='Help' border='0'></a></div>"
        });
        
        return isc.HLayout.create({
            ID:"titleLayout",
            width: "100%",
            height: 65,
            members: [titleLabel, isc.Canvas.create({width: "*"}), helpLabel]
        });

    }
}