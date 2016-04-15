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
                
                var parent_id = $item.closest('ul').attr('data-parent');
                var spec_id = $item.attr('data-spec-id');
                var prev_id;
                
                if (newIndex > 0) {
                    prev_id = $item.prev().attr('data-spec-id');
                }
                
                $.ajax({
                    url: "specs/" + spec_id + "/move",
                    type: "POST",
                    data: {
                        parent_id: parent_id,
                        sibling_id: prev_id     
                    },
                    global: false
                });
                
                //send parent
                //send id of sibling right above newIndex if there is one
                //send spec id
                _super($item, container);
              }    
            
        });
    });
});