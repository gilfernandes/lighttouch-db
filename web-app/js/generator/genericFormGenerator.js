
// This js file contains code for the form generation.

//isc.showConsole()

/**
 * Factory used to create the reference option data sources.
 */
var referenceDSFactory = isc.ReferenceDSFactory.create({});

/**
 * The basis for the window that opens the form definition in JSON.
 */
isc.defineClass("FormDsOperator", "Class").addProperties(
{
    buttonHeight: 28,
    generatedForm: null,
    formLabel: null,
    paramId: null,
    addUrl: null,
    
    /**
     * Creates the form data source.
     */
    createDS: function(newData) {
    
        var selfGenerator = this;
        
        /**
         * The data source used to contain the data of the form created
         * by the user. This is the real datasource.
         */
        return isc.DataSource.create({
            clientOnly : true,
            fields : newData,
            
            /**
             * We handle the communication here to the server.
             * @param request The request to the server.
             */
            getClientOnlyResponse: function(request, serverData) {
                var data = request.data;
                data.formId = selfGenerator.paramId;
                RPCManager.sendRequest({ 
                    params: data,
                    httpMethod: "POST",
                    useSimpleHttp: true,
                    callback: this.processResponse,
                    actionURL: selfGenerator.addUrl == null ? "../addData" : selfGenerator.addUrl
                });
            },
            
            /**
             * Processes the response of the create data request.
             * @param response The response object.
             */
            processResponse: function(response) {
                var data = response.data;
                var dataObject = eval('(' + data + ')');
                if(dataObject.response.status == 0) {
                    isc.say("The data has been saved to the database.", function() {selfGenerator.generatedForm.reset()})
                }
                else {
                    isc.warn("Could not save data to the server. The status code: " + dataObject.response.status);
                }
            }
        });
    },
    
    /**
     * Creates a data source for a reference.
     * @param field The field for which the data source is to be created.
     * @param name The name of the column to be displayed in the select box.
     * @param fieldProps The field properties object to which some properties will be added.
     * @param setRefHint a function reference.
     */
    createReferenceDataSource: function(field, name, fieldProps, setRefHint) {
        return referenceDSFactory.createReferenceDataSource(field, name, fieldProps, setRefHint);
    },
    
    /**
     * Sets the reference hint which can be used to view the referenced table.
     * @param valForHint The value to be displayed.
     * @param tableViewId The identifier of the table view which displays the data of the referenced table.
     * @param theFieldName The actual field identifier in which the content is to be injected.
     */
    setRefHint: function(valForHint, tableViewId, theFieldName) {
        var link = contextPath + "/list/showFormattedList/" +  tableViewId;
        document.getElementById(theFieldName).innerHTML = 
            '<a href="#" onclick="windowUtil.smOpenFrame(\'' + link + '\',\'' + valForHint + '\'); return false;">' + valForHint + "</a>";
    },
    
    /**
     * Modifies the fields of this data source.
     */
    addFieldsFromData : function(data) {
        // Separate the form and the data model data.
        var dataSplit = data.split(sep);
        var formDataStr = dataSplit[0];
        var dataModelStr = dataSplit[1];
        var formData = eval('(' + formDataStr + ')');
        var dataModel = eval('(' + dataModelStr + ')');
        this.formLabel.setContents(formData.name + " (" + this.paramId + ")");
        var newData = [];
        var newFields = [];
        for ( var i = 0, l = formData.fields.length; i < l; i++) {
            var field = formData.fields[i];
            var widgetType = field.widgetType;
            var dataModelForeignKey = field.dataModelForeignKey;
            var label = field.label;
            var defaultValue = field.defaultValue;
            var required = false;
            var name = ""
            var type = ""
            var options = {}
            for ( var j = 0, m = dataModel.fields.length; j < m; j++) {
                var data = dataModel.fields[j]
                if (data.id == dataModelForeignKey) {
                    required = data.required
                    name = data.id + "_" + data.title;
                    type = data.type;
                    break;
                }
            }
            if (name) {
                var dsField = {
                    name : name,
                    type : type,
                    required: required
                }
                newData[newData.length] = dsField;
                var formElementType = widgetType;
                switch(widgetType) {
                    case fieldType.heading1:
                        formElementType = "header";
                        break;
                    case fieldType.combobox:
                        formElementType = "comboBox";
                        var splits = field.options.split("\n")
                        for(var k = 0, n = splits.length; k < n; k++) {
                            options[splits[k]] = splits[k];
                        }
                        break;
                    case fieldType.reference:
                        formElementType = "select";
                        break;
                }
                var hasOptions = false;
                for(var key in options) {
                    hasOptions = true;
                }
                // Prepare the basics for the dynamic form field
                var formField = {
                    name : name,
                    title: label,
                    type: formElementType,
                    defaultValue: defaultValue
                }
                if(hasOptions) {
                    formField.valueMap = options;
                }
                // Handle reference data sources and other reference combo attributes
                if(widgetType == fieldType.reference) {
                    
                    var selfForm = this.generatedForm;
                    formField.hint = '[<span id="' + name + '"></span>]';
                    formField.optionDataSource = this.createReferenceDataSource(field, name, formField, this.setRefHint);
                    formField.pickListProperties = {
                        formatCellValue : function (value, record, field, viewer) {
                            return record[name];
                        },
                        canHover: true,
                        showHover: true
                    }
                }
                switch(widgetType) {
                    case fieldType.textarea:
                        if(!isNaN(field.cols)) {
                            formField.width = field.cols * 10;
                        }
                        break;
                }
                newFields[newFields.length] = formField;
            }
        }
        // Add experimental element to repeat the data x times.
        newFields[newFields.length] = { name: "repeatTimes", title: "Repeat", type: "spinner", min: 1, max: 10000, step: 1, defaultValue: 1 }
        
        // Add the submit button.
        newFields[newFields.length] = { name: "reset", type: "reset", align: "right", endRow: false, height: this.buttonHeight }
        newFields[newFields.length] = { name: "submit", type: "submit", title: "Create", align: "left", 
            startRow: false, width: 120, height: this.buttonHeight }
        var generatedFormDs = this.createDS(newData);
        this.generatedForm.setDataSource(generatedFormDs, newFields);
    }
});