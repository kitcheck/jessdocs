$(document).ready(function () {
    
    $(document).on('mouseenter','.spec', function(){
        
        $('.side-button.active-btn', this).css('visibility','visible');
        $("ul.sortable").sortable({
            handle: '.drag-button',
            onDrop: function  ($item, container, _super) {
                var newIndex = $item.index();
                
                var parent_id = $item.closest('ul').attr('data-parent');
                var spec_id = $item.attr('data-spec-id');
                var project_id = $item.attr('data-project-id');
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
                }).done(function(){
                   $.ajax({
                    url: "specs/bookmarks",
                    type: "GET",
                    data: {
                        project_id: project_id   
                    },
                    global: false
                }) 
              });
                
                //send parent
                //send id of sibling right above newIndex if there is one
                //send spec id
                _super($item, container);
            }    
            
        });
        
    }).on('mouseleave', '.spec', function() {
        $('.side-button.active-btn', this).css('visibility','hidden');
    });  
    
    
    
    $(document).on('click','.edit-button', function(){
        
        var btnElem = $(this).parents('.spec').find('.spec-buttons');
        $('.spec-buttons').not(btnElem).hide();
        
        btnElem.toggle('fast');
        
        
        
        var deleteElem = $(this).parents('.spec-data').find('.delete_tag');
        $('.delete_tag').not(deleteElem).hide();
        deleteElem.toggle('fast');
        
    });
    
});

function toggleTagEdit() {
    var tagElem = $('.delete_tag')
    if ( tagElem.hasClass('hidden')){
        tagElem.removeClass('hidden');
    }
    else {
        tagElem.addClass('hidden');
    }
}

function toggleEdit(tagElem) {
    if ( tagElem.hasClass('hidden')){
        tagElem.removeClass('hidden');
    }
    else {
        tagElem.addClass('hidden');
    }
}