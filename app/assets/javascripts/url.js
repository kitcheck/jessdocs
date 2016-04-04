$(document).ready(function () {
    
    $(document).on("ajax:success", ".spec-form", function() {
        $('#modal').closeModal();
        updateState();
    });
    
    $(document).on('click','.indent_spec', function(){
        updateState();
    });
    
});

function updateState(){
    var currentState = location.search;
    $.getScript("/specs/filter_tag.js" + currentState)
}