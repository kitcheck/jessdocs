function changeColor(colors, index) {
    var indexOfColor = index -1;
    var colorElem = $('#tag_type_color');
    
    if (indexOfColor >= 0){
        var color = colors[parseInt(indexOfColor)];
        colorElem.val(color)
        colorElem.prop('disabled', true);
    }
    else {
        colorElem.prop('disabled', false);
    }
}