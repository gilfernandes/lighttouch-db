/**
 * The basis for the window that opens the form definition in JSON.
 */
isc.defineClass("JsonFormWindow", "Window").addProperties({
    autoSize:true,
    autoCenter: true,
    isModal: true,
    showModalMask: true,
    autoDraw: false,
    showMinimizeButton: false
});

var windowUtil = {
    /**
     * Opens a URL on a browser window with a specific name, width and height.
     * @param url The URL which is to be opened.
     * @param windowName The name of the window to be opened.
     * @param width The width of the window which is to be opened.
     * @param height The height of the window which is to be opened.
     */
    open: function(url, windowName, width, height) {
        var showRawListWindow = window.open(url, 
            windowName, "location=1,status=1,scrollbars=1,width=" + width + ",height=" + height);
        showRawListWindow.moveTo(0, 0);
        showRawListWindow.focus();
    },

    /**
     * Open a frame in a modal window.
     * @param url
     * @param title
     * @returns
     */
    smOpenFrame: function(url, title) {
        var height = 600;
        var width = 600;
        isc.JsonFormWindow.create({
            ID: "modalWindow",
            title: title,
            width: width,
            height: height,
            items: [
                isc.HTMLFlow.create({
                    align: "center",
                    wrap: false,
                    showEdges: false,
                    margin: 0,
                    width: "100%",
                    contents: "<iframe src='" + url + "' frameborder='0' width='" + width + "' height='" + height + "'/>"
                })
            ]
        }).show();
    }
}