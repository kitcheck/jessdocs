$(document).ready(function () {
      
    $(document).on('click','.comment-card-clickable', function(){
        $(this).find('.resolve-btn').show();
        $.ajax({
            url: $(this).attr('ajax_path'),  
            data: { },
            dataType: 'script'
          });
        return false;
        
    });
    
});