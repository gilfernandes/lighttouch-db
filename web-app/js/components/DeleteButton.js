/**
 * The basis for the window that opens the form definition in JSON.
 */
isc.defineClass("DeleteButton", "IButton").addProperties({
    title: "Delete",
    icon: "[SKIN]/actions/remove.png",
    processOpenMsg: "Please select a record !",
    deleteQuestion: "Are you sure you want to delete this item?",
    myActionURL: null
});