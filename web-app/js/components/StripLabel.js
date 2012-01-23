/**
 * The label used to display the module's element name.
 */
isc.defineClass("StripLabel", "HTMLFlow").addProperties({
    align: "right",
    wrap: false,
    showEdges: false,
    margin: 8,
    prefix: "",
    setContents: function(content) {
        if(content.indexOf("&lt;") == -1 && content.indexOf("&gt;") == -1) {
            content = this.prefix + ": " + content;
        }
        this.Super("setContents", arguments);
    }
});