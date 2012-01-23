////////////////////////////////////////////////////////
//////////////////// String changes ////////////////////
////////////////////////////////////////////////////////

/**
 * Trimming for strings.
 */
String.prototype.removeEndLine = function() {
    var tmp = "";
    for(var i = 0, length = this.length; i < length; i++) {
        var c = this.charAt(i);
        if(c != "\n" && c != "\r") {
            tmp += c;
        }
    }
    return tmp;
}

/**
 * Trimming for strings.
 */
String.prototype.jsonReplaceNewLine = function() {
    var tmp = "";
    for(var i = 0, length = this.length; i < length; i++) {
        var c = this.charAt(i);
        if(c != "\n" && c != "\r") {
            tmp += c;
        }
        else {
            tmp += c == "\n" ? "\\n" : "\\r";
        }
    }
    return tmp;
}

/**
 * Removes the comma at the end of the string.
 */
String.prototype.chompComma = function() {
    return this.replace(/\,$/, "");
}

/**
 * Converts to lower case and replaces all spaces with underscore.
 */
String.prototype.simplify = function() {
    return this.toLowerCase().replace(/\s/g, "_");
}

var stringUtils = {
    /**
     * Removes the comma and the quotes from a string {@code str}.
     * @param str The string from which the comma and quotes are to be removed.
     * @return {@code str} without comma nor quotes.
     */
    replaceCommaQuotes : function(str) {
        if(str == null) {
            return null;
        }
        return str.replace(/\,|\"/g, "");
    }
}