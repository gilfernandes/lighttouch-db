
/**
 * Container for the JSON generating functions.
 */
var jsonGenerator = {

    /**
     * Renders the start of the JSON.
     * 
     * @param name
     *            The name of the entity.
     * @param fieldsStr If not {@code null} the title for the fields key will be {@code fields}
     * otherwise this is the title of the fields key.
     */
    renderStart : function(name, fieldsStr) {
        return '{"name":"' + name + '",' + (!fieldsStr ? '"fields\":[' : '"' + fieldsStr + '\":[');
    },

    /**
     * Renders the end of the JSON and checks, if the JSON in the fields is valid. 
     * 
     * @param formJson
     *            The string with the json
     */
    renderEnd : function(jsonStr) {
        jsonStr = jsonStr.chompComma();
        jsonStr += "]}";
        try {
            var result = jsonlint.parse(jsonStr);
            if (result) {
                jsonStr = JSON.stringify(result, null, "    ");
                jsonStr = jsonStr.replace(/\\\\n/g, "\\n");
            }
        } catch (e) {
            isc.warn("The produced JSON is not valid: " + e);
        }
        return jsonStr;
    },

    /**
     * Builds the JSON using the data in a data object.
     * 
     * @param dataObject
     *            The object which contains the data.
     * @param name
     *            The name of the object being saved.
     * @param includeTitle
     *            If {@code true} the title is included, else not.
     * @param domainValues
     *            The domain values collection.
     */
    createJson : function(dataObject, name, includeTitle, domainValues) {
        if (name == "null") {
            name = null;
        }
        var formJson = jsonGenerator.renderStart(name);
        var records = dataObject.data

        // Create the form JSON.
        for ( var i = 0, c = records.getLength(); i < c; i++) {
            var curRecord = records.get(i);
            if (curRecord != null) {
                formJson += '{';
                for ( var obj in curRecord) {
                    if (obj == "title" && !includeTitle) {
                        continue;
                    }
                    if (obj.indexOf("_") != 0 && obj.indexOf("$") != 0) { // Remove Smartclient internal stuff.
                        formJson += '"' + obj;
                        var currentValue = curRecord[obj]
                        if (obj != "id") {
                            if (domainValues && obj == "widgetType"
                                    && currentValue == editorType.combobox
                                    && curRecord.options) {
                                // Extract the domain values from the form element properties which are to be saved into the model.
                                domainValues[curRecord.dataModelForeignKey + ""] = curRecord.options;
                            }
                            var curType = typeof (curRecord[obj]);
                            if (curType == "boolean") {
                                formJson += '":' + currentValue + ',';
                            } else if (curType == "object" && currentValue
                                    && currentValue.getMonth) {
                                formJson += '":'
                                        + dateUtil.formatDateJson(currentValue)
                                        + ',';
                            } else {
                                if (curType == "string") {
                                    currentValue = currentValue
                                            .jsonReplaceNewLine();
                                }
                                // Handle integer types.
                                if(!(obj == "maxlength" || obj == "minlength" 
                                    || obj == CONSTANTS.get("TABLE") || obj == CONSTANTS.get("TABLE_COLUMN"))) {
                                    formJson += '":"'
                                        + (currentValue == "null"
                                                || currentValue == null ? ""
                                                : currentValue) + '",';
                                }
                                else { // maxlength and minlength are numeric.
                                    formJson += '":' + currentValue + ',';
                                }
                            }
                        } else { // Special handling for the id field.
                            formJson += '":' + currentValue + ',';
                            if (domainValues && domainValues[curRecord.id]) { // add domain values to the model.
                                var toAddValues = domainValues[curRecord.id];
                                formJson += '"' + jsonKeys.domainValues + '":"'
                                        + toAddValues.jsonReplaceNewLine()
                                        + '",';
                            }
                        }
                    }
                }
                formJson = formJson.chompComma();
                formJson += "},"
            }
        }
        return jsonGenerator.renderEnd(formJson);
    },

    /**
     * Creates the JSON with the table model definition.
     * 
     * @param dataObject
     *            The object which contains the data.
     * @param name
     *            The name of the object being saved.
     */
    createTableJson : function(dataObject, name) {
        if (name == "null") {
            name = null;
        }
        var formJson = jsonGenerator.renderStart(name);
        var records = dataObject.data.root.children;
        for ( var i = 0, length = records.length; i < length; i++) {
            var record = records[i];
            formJson += '{"id":' + record.id + ', "name":"' + record.name
                    + '","dataModelForeignKey":' + record.dataModelForeignKey
                    + ',';
            for ( var j = 0, childrenLength = record.children.length; j < childrenLength; j++) {
                var child = record.children[j];
                switch (child.name) {
                case "Width":
                    if (child.active) {
                        formJson += '"' + child.name + '":' + child.value + ',';
                    }
                    break;
                default:
                    formJson += '"' + child.name + '":' + (child.active ? true : false) + ',';
                }

            }
            formJson = formJson.chompComma();
            formJson += '},';
        }
        return jsonGenerator.renderEnd(formJson);
    },
    
    /**
     * Creates the JSON with module definition.
     * 
     * @param dataObject
     *            The object which contains the data.
     * @param name
     *            The name of the object being saved.
     */
    createModuleJson : function(dataObject, name) {
        if (name == "null") {
            name = null;
        }
        var formJson = jsonGenerator.renderStart(name, "models");
        var records = dataObject.root.children;
        for (var i = 0, length = records.length; i < length; i++) {
            var record = records[i];
            formJson += '{"id":' + record.id + ', "name":"' + record.name + '",';
            for ( var j = 0, childrenLength = record.children.length; j < childrenLength; j++) {
                var child = record.children[j];
                if(j == 0) {
                    formJson += '"views":[';
                }
                formJson += '{"id": ' + record.children[j].id + ', "name": "' + record.children[j].name + '"' + 
                    ', "hidden": ' + (record.children[j].hidden ? 'true' : 'false') + ', "type": "' + record.children[j].type + '"},';
                if(j == childrenLength - 1) {
                	formJson = formJson.chompComma();
                    formJson += ']';
                }
            }
            formJson = formJson.chompComma();
            formJson += '},';
        }
        return jsonGenerator.renderEnd(formJson);
    }
}