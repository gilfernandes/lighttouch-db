

var zenbox = {
    
    /**
     * Creates a fixed floater on the side.
     */
    createBox: function(isWorbench) {
        var viewPortSize = screenSize.calculateViewPort();
        var target = (isWorbench ? 'designer' : 'workbench');
        var imgOffset = -5;
        var zenboxLabel = isc.Label.create({
            ID:"zenboxLabel",
            shadowOffset: 0,
            padding:5,
            valign:"center",
            align:"center",
            canDragReposition: false, 
            dragAppearance:"target",
            width: 49,
            height: 137,
            top: (viewPortSize.height - 137) / 2, 
            left: imgOffset, // start off-screen
            zIndex: 1000,
            contents: '<div>\
                      <a href="' + target + '.gsp">\
                      <img src="images/zenbox_' + target + '.png"></a>\
                 </div>',
            mouseOver: function() { this.animateMove(0, zenboxLabel.top) },
            mouseOut: function() { this.animateMove(imgOffset, zenboxLabel.top) },
            prompt: "Switch to <b>" + target + "</b>",
            hoverOpacity: 90,
            hoverWidth: 120
        });
        zenboxLabel.bringToFront();
    }
}