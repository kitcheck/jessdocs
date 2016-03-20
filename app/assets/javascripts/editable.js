$(document).ready(function () {
    $(document).on('mouseenter','.spec', function(){
      $('.side-buttons', this).css('visibility','visible');
    }).on('mouseleave', '.spec', function() {
        $('.side-buttons', this).css('visibility','hidden');
    });  
    
    
    
    $(document).on('click','.edit-button', function(){

        var btnElem = $(this).parents('.spec').find('.spec-buttons');
        $('.spec-buttons').not(btnElem).hide();
        
        btnElem.toggle('fast');
        btnElem.find('[data-toggle="tooltip"]').tooltip();
        
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