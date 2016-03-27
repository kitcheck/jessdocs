$(document).ready(function () {
      
    $(document).on('click','.comment-card-clickable', function(){
        var activeElem = $('.comment-card-active');
        if (activeElem.length > 0) {
            removeActive(activeElem);
        }
        var button = $(this).find('.resolve-btn');
        var card = $(this);
        $.ajax({
            url: $(this).attr('ajax_path'),  
            data: { },
            dataType: 'script'
          }).done(function() {
              button.show();
              card.find('input').focus();
          });
        return false;
    });
    
    $(document).on('click','.comment-card-active', function(e){
        e.stopPropagation();
    });
    
    $(document).on('click','.modal', function(){
        var elem = $(this).find('.comment-card-active');
        removeActive(elem);
    });
    
});

function removeActive(elem){
    elem.addClass('comment-card-clickable');
    elem.removeClass('comment-card-active');
    elem.find('.comment-form').remove();
    elem.find('.resolve-btn').hide();
}