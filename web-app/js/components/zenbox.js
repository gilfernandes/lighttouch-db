
/**
 * Contains methods for rendering a box on the side used to switch either to 
 * the designer or to the workbench.
 */
var zenbox = {
    
    /**
     * Creates a fixed floater on the side.
     * @param isWorkbench If {@code true} the target link will be for the designer pager,
     * else for the workbench page.
     * @param userRole If ADMIN or USER the fixed floater is created, else not.
     */
    createBox: function(isWorbench, userRole) {
        var viewPortSize = screenSize.calculateViewPort();
        var target = (isWorbench ? 'designer' : 'workbench');
        var imgOffset = -5;
        var imgHeight = 137;
        var zenboxLabel = isc.Label.create({
            ID:"zenboxLabel",
            shadowOffset: 0,
            padding:5,
            valign:"center",
            align:"center",
            canDragReposition: false,
            dragAppearance:"target",
            width: 49,
            height: imgHeight,
            top: (viewPortSize.height - imgHeight) / 2, 
            left: imgOffset, // start off-screen
            zIndex: 1000,
            contents: '<div>\
                      <a href="' + target + '.gsp">\
                      <img border="0" src="images/zenbox_' + target + '.png"></a>\
                 </div>',
            mouseOver: function() { this.animateMove(0, zenboxLabel.top) },
            mouseOut: function() { this.animateMove(imgOffset, zenboxLabel.top) },
            redrawOnResize: true,
            redraw: function() {
                var viewPortSize = screenSize.calculateViewPort();
                this.top = (viewPortSize.height - imgHeight) / 2;
                this.Super("redraw",arguments);
                return this;
            },
            init: function() {
                this.Super("init", arguments);
                isc.Page.setEvent("resize", function() {
                    zenboxLabel.markForRedraw();
                });
            }
        });
        zenboxLabel.bringToFront();
    }
}