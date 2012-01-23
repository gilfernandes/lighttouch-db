
/**
 * The data source used to contain the data of the form created by the user.
 * This is a dummy data source.
 */
isc.DataSource.create({
    ID : "initialDs",
    clientOnly : true,
    fields : [ {
        name : "foo"
    } ]
});

isc.HTMLFlow.create({
    ID : "titleLabel",
    align : "left",
    align : "center",
    height : 40,
    wrap : false,
    showEdges : false,
    margin : 8,
    contents : "<span class='title'>Generated Form</span>"
});

isc.Label.create({
    ID : "formLabel",
    align : "left",
    height : 40,
    wrap : false,
    showEdges : false,
    margin : 8,
    contents : "",
    baseStyle: "formLabel"
});

/**
 * The form used to display the properties.
 */
isc.DynamicForm.create({
    ID : "generatedForm",
    cellPadding : 5,
    useAllDataSourceFields : true,
    saveOnEnter : true,
    width: 400,
    titleSuffix : " &nbsp;"
});

isc.VLayout.create({
    ID : "mainLayout",
    width : globals.layoutWidth,
    styleName : "mainLayout",
    height : globals.mainLayoutHeight,
    align : "top",
    layoutLeftMargin : 0,
    layoutRightMargin : 0,
    members : [ titleLabel, formLabel, generatedForm ]
});

generatedForm.setDataSource("initialDs");

/**
 * The object used to generate the form.
 */
var dsOperator = isc.FormDsOperator.create({
    ID: "dsOperator",
    generatedForm: generatedForm,
    formLabel: formLabel,
    paramId: (typeof (paramId) != 'undefined' ? paramId : null)
});

if(typeof (paramId) != 'undefined') {
    var actionURL = "../formData/" + paramId;
}
