
var DEFAULT_ID = "_id";

/**
 * Factory used to create the reference option data sources.
 */
isc.defineClass("ReferenceDSFactory", "Class").addProperties({
    
	/**
     * Creates a data source for a reference.
     * @param field The field for which the data source is to be created.
     * @param name The name of the column to be displayed in the select box.
     * @param fieldProps The properties object with the properties of the field
     * @param setRefHint Set the name of the referenced table.
     * to which the created REST data source is associated.
     */
    createReferenceDataSource: function(field, name, fieldProps, setRefHint) {
        var refTable = field.table;
        var refCol = field.tableColumn;
        var optionFields = [
            {name: DEFAULT_ID, primaryKey: true, hidden: "true", type: "sequence" },
            {name: name, type: "text"}
        ];
        fieldProps.valueField = DEFAULT_ID;
        fieldProps.displayField = name;
        return isc.BaseRestDataSource.create({
            fieldName: name,
            fields : optionFields,
            dataModelName: "",
            setRefHint: setRefHint,
            fetchDataURL: contextPath + "/generator/readReferenceOptions?" + dataModelIdParam + "=" + refTable + "&colId=" + refCol
            ,
            /**
             * Manipulates the data record to contain a field which is a copy of 
             * the column that is in the database and has exactly the name specified 
             * in {@code name}.
             */
            transformResponse: function (dsResponse, dsRequest, data) {
                if(typeof this.setRefHint != "undefined" && this.setRefHint) {
                    this.setRefHint(data.response.dataModelName, data.response.tableDefId, this.fieldName);
                }
                for(var i = 0, l = data.rows.length ; i < l; i++) {
                    var row = data.rows[i];
                    for(var prop in row) {
                        if(prop.indexOf(refCol + '_') == 0) {
                            row[name] = row[prop];
                            break;
                        }
                    }
                }
                var dsResponse = this.Super("transformResponse", arguments);
                return dsResponse;
            }
        });
    }
});