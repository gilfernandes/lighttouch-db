
/**
 * The supported field types.
 */
var fieldType = {
    text: "text",
    textarea: "textarea",
    checkbox: "checkbox",
    heading1: "h1",
    combobox: "combobox",
    date: "date",
    time: "time",
    reference: "reference"
};

/**
 * The types of editors.
 */
var editorType = {
    text: "text",
    textarea: "textArea",
    checkbox: "checkbox",
    heading1: "h1",
    combobox: "combobox",
    date: "date",
    time: "time",
    reference: "reference"
};

/**
 * The most popular data types.
 */
var dataType = {
    text: "text",
    staticText: "staticText",
    boolean: "boolean",
    int: "int",
    double: "double",
    email: "email",
    date: "date",
    time: "time",
    reference: "reference"
}

/**
 * The current form name.
 */
var currentForm = {
    blankFormName: "&lt;Unknown form model&gt;",
    name: "",
    description: "",
    id: -1,
    lastSaved: null
}

/**
 * The current form name.
 */
var currentData = {
    blankDataName: "&lt;Unknown data model&gt;",
    name: "",
    description: "",
    id: -1,
    lastSaved: null
}

/**
 * The current form name.
 */
var currentTable = {
    blankDataName: "&lt;Unknown table model&gt;",
    name: "",
    description: "",
    id: -1,
    lastSaved: null
}

/**
 * The current form name.
 */
var currentModule = {
    blankDataName: "&lt;No module loaded&gt;",
    name: "",
    description: "",
    id: -1,
    lastSaved: null,
    defaultApp: false
}

/**
 * Layout constants.
 */
var globals = {
    layoutWidth : screen.width > 1200 ? 1200 : 1024,
    mainBodyLeftPaneMinWidth: 100,
    mainBodyLeftPaneMaxWidth: 350,
    mainBodyLeftPaneWidth: 240,
    mainBodyLeftPaneHeight: 600,
    mainLayoutHeight: "100%",
    formComposerListHeight: "100%",
    jsonPopupDisplayHeight: 500,
    popupJsonWidth: 600
};

/**
 * The main tab identifiers.
 */
var mainTabIds = {
    designerTab: "designerTab",
    userTab: "userTab",
    moduleDesignerTab: "moduleDesignerTab"
}
/**
 * Container for constants.
 */
var CONSTANTS = (function() {

     var private = {
        'SIZE': 'size',
        'COLS': 'cols',
        'ROWS': 'rows',
        'CLASS': 'class',
        'DATA_MODEL_FOREIGN_KEY': 'dataModelForeignKey',
        'OPTIONS': 'options',
        'TABLE': 'table',
        'TABLE_COLUMN': 'tableColumn',
        'IMAGES': '../images'
     };

     return {
        get: function(name) { return private[name]; }
    };
})();

var jsonKeys = {
    domainValues: "domainValues"
}

/**
 * The data model identifier parameter
 */
var dataModelIdParam = "dataModelId";

