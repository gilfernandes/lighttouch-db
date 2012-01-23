/**
 * Factory used to create the reference option data sources.
 */
var referenceDSFactory = isc.ReferenceDSFactory.create({});

/**
 * The basis for the window that opens the form definition in JSON.
 */
isc.defineClass("DsOperator", "DsOperatorBase").addProperties(
{

    dataModelId: -1,
    fetchDataURL: "../readDataJson",
    updateDataURL: "../updateDataJson",
    dataModelLabel: null,
    metaInfoLabel: null,
    generatedTable: null,
    
    /**
     * Does not display the filter editor on the table per default.
     */
    showFilterEditor: false,
    
    /**
     * Instantiates the data source.
     */
    createDS: function(newData) {
    
        var dsOperator = this;
    
        /**
         * The data source used to contain the data of the form created
         * by the user. This is the real datasource.
         */
        return isc.BaseRestDataSource.create({
            fields : newData,
            willHandleAdvancedCriteria: true,
            fetchDataURL: this.fetchDataURL + "?" + dataModelIdParam + "=" + this.dataModelId,
            updateDataURL: this.updateDataURL + "?" + dataModelIdParam + "=" + this.dataModelId,
            transformResponse: function (dsResponse, dsRequest, data) {
                var res = this.Super("transformResponse", arguments);
                tableUtil.displayStatus(dsRequest, data, dsOperator.metaInfoLabel);
                if(dsOperator.showFilterEditor && !dsOperator.generatedTable.showFilterEditor) {
                    setTimeout(function() { dsOperator.generatedTable.setShowFilterEditor(true) } , 1000);
                }
                return res;
            }
        });
    },
    
    /**
     * Adds the fields to the table.
     * @param data The data that comes from the server. This includes the data model and 
     * the table definition separated by a special separator.
     */
    addFieldsFromData: function(data) {
        var dataSplit = data.split(sep);
        var modelDataStr = dataSplit[1];
        var tableDefinitionStr = dataSplit[0];
        var modelData = eval('(' + modelDataStr + ')');
        this.dataModelId = dataSplit[2];
        var tableDefinition = eval('(' + tableDefinitionStr + ')');
        if(this.dataModelLabel) {
            this.dataModelLabel.setContents(modelData.name);
        }
        else if (dataModelLabel) {
            dataModelLabel.setContents(modelData.name);
        }
        
        // change the data source.
        var newFields = [{name:"_id", title: "ID", primaryKey:true, canEdit:false, hidden: true }];
        // These are the fields for the table.
        var newTableFields = [];
        for(var i = 0, iLength = tableDefinition.fields.length; i < iLength; i++) {
            var curField = tableDefinition.fields[i];
            if(curField.Visible) {
                for(var j = 0, length = modelData.fields.length; j < length; j++) {
                    var field = modelData.fields[j];
                    if(curField.dataModelForeignKey == field.id && field.type != dataType.staticText) {
                        var fieldProps = {name: field.id + '_' + field.title, title: curField.title, 
                            type: field.type == "int" ? "integer" : (field.type == "double" ? "float" : field.type) };
                        // if the max length of the data type is very big, then we use the text area for editing.
                        if(field.maxlength > 255) {
                            fieldProps.editorType = "TextAreaItem";
                        }
                        var canFilter = curField.Filter;
                        switch(field.type) {
                            case dataType.reference:
                                canFilter = false; // TODO: currently the filtering for references is not supported. Needs to be implemented on the server.
                                fieldProps.optionDataSource = referenceDSFactory.createReferenceDataSource(field, field.id + "_" + field.title, fieldProps);
                                fieldProps.filterOperator = "equals"
                                break;
                            case dataType.double:
                                fieldProps.transformInput = this.replaceNonDouble;
                                fieldProps.filterOperator = "equals";
                                fieldProps.changed = function(form, item, value) {
                                    if(!value.search("[^0-9\.+-]")) {
                                        return this.Super("changed", arguments);
                                    }
                                    return false;
                                }
                                break
                            case dataType.string:
                                fieldProps.filterOperator = "iContains"
                                break;
                            case dataType.date:
                                fieldProps.filterOperator = "equals"
                                break;
                            case dataType.time:
                                fieldProps.displayFormat = "toShort24HourTime"
                                break;
                            case dataType.int:
                                fieldProps.filterOperator = "equals"
                                fieldProps.filterEditorType = "spinner";
                                fieldProps.changed = function(form, item, value) {
                                    for(var num = 0, numL = value.length; num < numL; num++) {
                                        if(isNaN(value.charAt(num))) {
                                            return false;
                                        }
                                    }
                                    return true;
                                }
                                break;
                        }
                        
                        newTableFields[newTableFields.length] = 
                            {name: field.id + '_' + field.title, title: curField.name, 
                                canSort: curField.Sort, canFilter: canFilter, 
                                canEdit: curField.Editable,
                                canReorder: curField.Reorder, width: curField.Width};
                        if(canFilter) {
                            this.showFilterEditor = true;
                        }
                        if(field.domainValues) {
                            var domainValuesSplit = field.domainValues.split("\n");
                            fieldProps.valueMap = domainValuesSplit;
                        }
                        newFields[newFields.length] = fieldProps;
                        break;
                    }
                }
            }
        }
        var generatedFormDs = this.createDS(newFields);
        this.generatedTable.setDataSource(generatedFormDs);
        this.generatedTable.setFields(newTableFields);
        // add the data.
        if (isc.isA.ResultSet(this.generatedTable.data)){
            this.generatedTable.data.invalidateCache();
        }
        this.generatedTable.fetchData()
    }
});