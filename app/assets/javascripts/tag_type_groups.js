function changeColor(color) {
    var colorElem = $('#tag_type_color');
    var colorDisplay = $('#colorDisplay');
    var colorPickerContainer = $('#colorPickerDiv');

    if (color){
        colorElem.val(color);
        colorElem.attr('value', color);
        colorDisplay.css('background-color', color);
        colorDisplay.show();
        colorPickerContainer.hide();
    }
    else {
        colorDisplay.hide();
        colorPickerContainer.show();
    }
}