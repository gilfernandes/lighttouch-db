

/**
 * The basis for the class which creates the data sources dynamically for 
 * tables.
 */
isc.defineClass("DsOperatorBase", "Class").addProperties({
    replaceNonDouble: function(form, item, value, oldValue) {
        return value.replace(/[^\d\.]/g, "");
    }
});