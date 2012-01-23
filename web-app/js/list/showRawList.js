//isc.showConsole()

/**
 * Factory used to create the reference option data sources.
 */
var referenceDSFactory = isc.ReferenceDSFactory.create({});

/**
 * The basis for the window that opens the form definition in JSON.
 */
isc.defineClass("DsOperator", "DsOperatorBase").addProperties(
{
    createDS: function(newData) {
        
        /**
         * The data source used to contain the data of the form created
         * by the user. This is the real datasource.
         */
        return isc.BaseRestDataSource.create({
            fields : newData,
            fetchDataURL:"../readDataJson?" + dataModelIdParam + "=" + paramId,
            updateDataURL: "../updateDataJson?" + dataModelIdParam + "=" + paramId,
            transformResponse: function (dsResponse, dsRequest, data) {
                var res = this.Super("transformResponse", arguments);
                tableUtil.displayStatus(dsRequest, data, metaInfoLabel);
                if(data && data.response && data.response.data && data.response.data[0] && data.response.data[0].update_date) {
                    data.response.data[0].update_date = eval('(' + data.response.data[0].update_date + ')')
                    var mergedValues = dsRequest.oldValues;
                    for(var elem in data.response.data[0]) {
                        mergedValues[elem] = data.response.data[0][elem]
                    }
                    res.data = [mergedValues]
                }
                return res;
            }
        });
    },
    
    /**
     * Adds the fields to the table.
     * @param data The data that comes from the server.
     */
    addFieldsFromData: function(data) {
        var dataSplit = data.split(sep);
        var modelDataStr = dataSplit[0];
        var dataContentStr = dataSplit[1];
        var modelData = eval('(' + modelDataStr + ')');
        var dataContent = eval('(' + dataContentStr + ')');
        dataModelLabel.setContents(modelData.name);
        
        // change the data source.
        var newFields = [{name:"_id", title: "ID", primaryKey:true, canEdit:false }];
        for(var i = 0, length = modelData.fields.length; i < length; i++) {
            
            var field = modelData.fields[i];
            if(field.type != dataType.staticText) {
                var fType = field.type == fieldType.reference ? "select" : field.type;
                var fieldProps = {name: field.id + '_' + field.title, title: field.title, type: fType}
                switch(field.type) {
                    case dataType.reference:
                        fieldProps.optionDataSource = referenceDSFactory.createReferenceDataSource(field, field.id + "_" + field.title, fieldProps);
                        break;
                    case dataType.double:
                        fieldProps.transformInput = this.replaceNonDouble;
                        break;
                    case dataType.time:
                        fieldProps.displayFormat = "toShort24HourTime"
                        break;
                }
                if(field.domainValues) {
                    var domainValuesSplit = field.domainValues.split("\n");
                    fieldProps.valueMap = domainValuesSplit;
                }
                newFields[newFields.length] = fieldProps;
            }
        }
        newFields[newFields.length] = {name: CREATE_DATE_FIELD, type: "dateTime", canEdit: false};
        newFields[newFields.length] = {name: UPDATE_DATE_FIELD, type: "dateTime", canEdit: false};
        var generatedFormDs = this.createDS(newFields);
        generatedTable.setDataSource(generatedFormDs);

        // add the data.
        if (isc.isA.ResultSet(generatedTable.data)){
            generatedTable.data.invalidateCache();
        }
        generatedTable.fetchData()
    }
});

var dsOperator = isc.DsOperator.create({
    ID: "dsOperator"
});

//This gets called on load and fetches the data model and the current data in the data model.
var actionURL = "../readModelJson?dataModelId=" + paramId;

var tablePageTitle = "Generic Data Table";