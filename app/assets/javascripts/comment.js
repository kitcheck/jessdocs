$(document).ready(function () {
    
    $(document).on('click','.comment-button', function(){
        if ($(this).next('div.popover:visible').length){
          // popover is visible
        }
        else {
            $.ajax({
              url: '/comments/new',
              dataType: "script"
            });
        }
        
    });
    
});