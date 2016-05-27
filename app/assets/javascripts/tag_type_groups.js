function changeColor(color) {
    var colorElem = $('#tag_type_color');
    alert('color = ' + color);
    
    if (color){
        
        colorElem.val(color);
        colorElem.attr('value', color);
        colorElem.prop('disabled', true);
    }
    else {
        colorElem.prop('disabled', false);
    }
}