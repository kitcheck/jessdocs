$(document).ready(function () {
    
    $(document).on('mouseenter','.spec', function(){
        
        $('.side-button.active-btn', this).css('visibility','visible');
        $("ul.sortable").sortable({
            handle: '.drag-button',
            onDrop: function  ($item, container, _super) {
                var newIndex = $item.index();
                
                var parent_id = $item.closest('ul').attr('data-parent');
                var spec_id = $item.attr('data-spec-id');
                
                var bookmarkBtn = $item.find('.bookmark-btn');
                
                if (parent_id == "nil"){
                    bookmarkBtn.show();
                } else {
                    bookmarkBtn.hide();
                }
                
                
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
    
    $(document).on('mouseenter','#fixedEditBtn', function(){
        $('#toTheTopBtn').show();
        $('#hamburgerBtn').hide();
    }).on('mouseleave', '#fixedEditBtn', function() {
        $('#hamburgerBtn').show();
        $('#toTheTopBtn').hide();
    });
    
    
    $(document).on('click','.edit-button', function(){
        var specElem = $(this).parents('.spec');
        var specId = specElem.attr('id');
        var isRoot = (specElem.attr('data-root') === 'true')
        var btnElem = specElem.find('.spec-buttons');
        
        $('.tooltipped').not('.btn-floating').tooltip('remove');
        $('.spec-buttons').not(btnElem).html('');
        
        
        btnElem.html(renderButtons(specId));
        btnElem.find('.tooltipped').tooltip();
        if (!isRoot){
            btnElem.find('.bookmark-btn').hide();
        };
        btnElem.toggle('fast');

        
        
        var deleteElem = $(this).parents('.spec').find('.delete_tag');
        $('.delete_tag').not(deleteElem).hide();
        deleteElem.toggle('fast');
        
    });
    
});

function renderButtons(specId) {
    var btnHtml = "<span class='spec-button-container'>";
    
    btnHtml +="<a data-tooltip='bookmark' data-position='bottom' data-delay='20' class='tooltipped waves-effect waves-light btn btn-square bookmark-btn' data-remote='true' rel='nofollow' data-method='post' href='/specs/"+specId+"/bookmark'>"
            + "<i class='material-icons'>bookmark</i>"
            + "</a>";
    
    btnHtml += "<a data-tooltip='add tag' data-position='bottom' data-delay='20' class='tooltipped waves-effect waves-light btn btn-square' data-remote='true' href='/tags/new?id='" + specId+ "'>"
            + "<i class='material-icons'>label</i>"
            + "</a>";
    
    btnHtml += '<a data-tooltip="add ticket" data-position="bottom" data-delay="20" class="tooltipped waves-effect waves-light btn btn-square" data-remote="true" href="/tickets/new?id=' + specId + '">'
            + '<i class="material-icons">insert_link</i>'
            + '</a>';
    
    btnHtml += '<a data-tooltip="add parent" data-position="bottom" data-delay="20" class="tooltipped waves-effect waves-light btn btn-square" data-remote="true" href="/specs/new?id='+specId+'">'
            + 'p'
            + '</a>';
    
    btnHtml += '<a data-tooltip="add children" data-position="bottom" data-delay="20" class="tooltipped waves-effect waves-light btn btn-square" data-remote="true" href="/specs/mass_add_view?id='+specId+'">'
            + 'c'
            + '</a>';
    
    btnHtml += '<a class="waves-effect waves-light btn btn-square tooltipped" data-tooltip="edit" data-position="bottom" data-delay="20" data-remote="true" href="/specs/'+specId+'/edit">'
            +  '<i class="material-icons">edit</i>'
            + '</a>';
    
    btnHtml += '<a class="delete_spec waves-effect waves-light btn btn-square tooltipped" data-tooltip="delete" data-position="bottom" data-delay="20" data-remote="true" href="/specs/'+specId+'/delete">'
            + '<i class="material-icons">delete</i>'
            + '</a>';
    
    btnHtml += '</span>';
    
    return btnHtml;
}
