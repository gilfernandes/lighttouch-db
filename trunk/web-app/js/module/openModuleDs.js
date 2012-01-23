
/**
 * The data source associated to the data models.
 */
isc.BaseRestDataSource.create({
    ID:"openModuleDs",
    optionData: [],
    fields:[
        {name:"id", primaryKey:true, canEdit:false },
        {name:"name" },
        {name:"description", title: "Module Description", canEdit:true, type: "textArea" },
        {name: "defaultApp", title: "Default", canEdit:true, type: "boolean"},
        {name:"createdDate", title: "Created", type: "dateTime", canEdit:false},
        {name:"modifiedDate", title: "Modified", type: "dateTime", canEdit:false }
    ],
    fetchDataURL: "module/listJson",
    updateDataURL: "module/updateJson"
});

