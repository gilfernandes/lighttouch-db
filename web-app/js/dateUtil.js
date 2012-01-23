var directInputDate = "directInputDate1"

/**
 * Date utilities.
 */
var dateUtil = {

    /**
     * Creates a form element.
     * @param inLayout If {@code true} returns this form in the layout, else not.
     * @param height The height of the element.
     * @param dataValue The current date value.
     * @param isTime If {@code true} this is a time field, else a date field.
     */
    createFormElement: function(inLayout, height, dateValue, isTime) {
        var fieldName = directInputDate;
        var dynForm = isc.DynamicForm.create({
            numCols: 1,
            width: 200,
            dateValue: null,
            flexCanvas: null,
            fields: [
                {name: fieldName, showTitle: false, type: isTime ? "time" : "date",
                    defaultValue: new Date(),
                    change: function(form, item, value, oldValue)  {
                        if(this.form.flexCanvas) {
                            this.form.flexCanvas.saveEditData(value);
                        }
                    }, 
                    disabled: !inLayout
                }
            ]
        });
        if(!isTime) {
            dynForm.getField(fieldName).useTextField = false;
        }
        dynForm.setValue(fieldName, dateValue ? dateValue : new Date()); // set the default date to today.
        if(!inLayout) {
            return dynForm;
        }
        return isc.VLayout.create({
            layoutRightMargin: 0,
            layoutLeftMargin: 5,
            layoutTopMargin: 5,
            layoutBottomMargin: 5,
            align: "center",
            height: height,
            members: [dynForm]
        });
    },

    /**
     * Generate the html using SmartClient
     * @param dateValue The date value.
     * @param isTime If {@code true} we are rendering a time widget.
     */
    renderDateWidget : function(dateValue, isTime) {
        var dynForm = dateUtil.createFormElement(null, null, dateValue, isTime);
        var fieldHtml = dynForm.getInnerHTML();
        // dirty trick to inject the default value into the time field
        if(isTime) {
            var dataValue = dynForm.getField(directInputDate).getValue();
            fieldHtml = fieldHtml.replace(/(NAME\=\'directInputDate\')/, RegExp.$1 + " value='" 
                + dataValue.getHours() + ":" + dateUtil.padSimple(dataValue.getMinutes()) + "'");
        }
        dynForm.destroy();
        return fieldHtml;
    },
    
    padSimple:
    /**
      * Simple padding function.
      */
    function(value) {
        return value < 10 ? "0" + value : value;
    },
    
    /**
     * Formats like this: year-month-day (2011-01-21)
     * @param value The value to be formatted.
     */
    formatDateJson: function(value) {
        if(!value) {
            return ""
        }
        return "\"new Date(" + value.getFullYear() + ',' + (this.padSimple(value.getMonth())) + ',' + this.padSimple(value.getDate()) + ")\""
            // + 'T' + this.padSimple(value.getHours()) + ':' + this.padSimple(value.getMinutes()) + ':' + this.padSimple(value.getSeconds());
    }
}