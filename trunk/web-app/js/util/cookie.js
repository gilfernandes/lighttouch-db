/**
 * Small library with utilities which you can use to set cookies.
 */
var cookieUtil = {

    /**
     * Sets a cookie with a specific validity and name.
     * @param c_name The name of the cookie.
     * @param value The value of the cookie.
     * @param exdays The time to live in days for this cookie.
     */
    setCookie : function(c_name, value, exdays) {
        var exdate = new Date();
        exdate.setDate(exdate.getDate() + exdays);
        var c_value = escape(value)
                + ((exdays == null) ? "" : "; expires=" + exdate.toUTCString());
        document.cookie = c_name + "=" + c_value;
    },

    /**
     * Returns the value of a cookie with a specific name.
     * @param c_name The name of the cookie.
     */
    getCookie : function(c_name) {
        var i, x, y, ARRcookies = document.cookie.split(";");
        for (i = 0; i < ARRcookies.length; i++) {
            x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
            y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
            x = x.replace(/^\s+|\s+$/g, "");
            if (x == c_name) {
                return unescape(y);
            }
        }
    }

}