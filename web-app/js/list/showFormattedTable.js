

//isc.showConsole()

//This gets called on load and fetches the data model and the current data in the data model.
if(typeof(paramId) != 'undefined') {
    var actionURL = "../readTableModelJson?tableDefinitionId=" + paramId;
}

var tablePageTitle = "Formatted Data Table";