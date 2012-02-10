
/**
 * Simple option object used to stored the data of a select option.
 * @param key The key
 * @param value The value.
 * @param dataModelData The fields of the specific data model.
 * @returns {SelectOption}
 */
function SelectOption(key, value, dataModelData) {
    this.key = key;
    this.value = value;
    this.dataModelData = dataModelData;
}

/**
 * The data source associated to the data models.
 */
isc.BaseRestDataSource.create({
    ID: "openDefinitionDs",
    optionData: [],
    fields:[
        {name:"id", primaryKey:true, canEdit:false, hidden: true },
        {name:"formDefinitionId", hidden: true },
        {name:"dataModelName", title: "DM Name", canEdit: true},
        {name:"dataModelDescription", title: "DM Description", hidden: true},
        {name:"dataModelData", title: "DM Data", canEdit: false, hidden: true},
        {name:"formDefinitionName", title: "FD Name", canEdit: true},
        {name:"formDefinitionDescription", title: "FD Description", hidden: true},
        {name:"formDefinitionFormData", canEdit:false, hidden: true},
        {name:"tableDefinitionId", canEdit:false, hidden: true},
        {name:"tableDefinitionName", canEdit:true},
        {name:"tableDefinitionDescription", canEdit:false, hidden: true},
        {name:"tableDefinitionData", canEdit:false, hidden: true},
        {name:"userName", canEdit:false, hidden: securityInfo.isAdmin ? true : false}
    ],
    fetchDataURL: "formDefinition/listJson",
    updateDataURL: "dataModel/updateListJson",
    
    /**
     * Fetches the current data model and saves it a string
     * with select options.
     * @param callback Function to be executed after fetching the option data if not {@code null}.
     * @param dynform The dynamic form where the references are to be put. (To be used by the callback).
     * @param tableValue the identifier of the referenced table. (To be used by the callback).
     */
    fetchOptionData: function(tablesField, callback, dynform, tableValue) {
        var self = this;
        this.fetchData(null, function (dsResponse, data, dsRequest) {
            self.optionData = [];
            for(var i = 0, l = data.length; i < l; i++) {
                self.optionData[self.optionData.length] = new SelectOption(data[i].id, data[i].dataModelName, data[i].dataModelData);
            }
            self.optionData.sort(function(a, b) { // Sort the referred entities.
                var aLower = a.value.toLowerCase();
                var bLower = b.value.toLowerCase();
                for(var i = 0, l = aLower.length; i < l; i++) {
                    var aChar = aLower.charCodeAt(i);
                    if(i < bLower.length) {
                        var bChar = bLower.charCodeAt(i);
                        var res = aChar - bChar;
                        if(res != 0) {
                            return res;
                        }
                    }
                    else {
                        return 1;
                    }
                }
                return 1;
            });
            if(tablesField) {
                for(key in tablesField.valueMap) {
                    delete tablesField.valueMap[key];
                }
                for(var i = 0, l = self.optionData.length; i < l; i++) {
                    tablesField.valueMap[self.optionData[i].key] = self.optionData[i].value;
                }
            }
            if(callback) {
                callback(dynform, null, tableValue);
            }
        });
    }
});

