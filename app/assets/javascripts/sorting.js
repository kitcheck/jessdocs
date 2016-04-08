$(document).ready(function () {
    
    $('#reorderDoneBtn').hide();
    
    $(document).on("click", "#reorderDoneBtn", function  () {
        $('#reorderDoneBtn').hide();
        $('#fixedEditBtn').show();
        $("ul.sortable").sortable("disable");
    });
    
    $(document).on("click", "#reorderBtn", function  () {
        $('#reorderDoneBtn').show();
        $('#fixedEditBtn').hide();
        $("ul.sortable").sortable({
             onDrop: function  ($item, container, _super) {
                var newIndex = $item.index();
            
                console.log('index = ' + newIndex);
            
                _super($item, container);
              }    
            
        });
    });
});