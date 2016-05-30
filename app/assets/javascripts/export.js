$(document).ready(function () {
    
    $(document).on('click','#exportBtn', function(){
        $('.choose-spec').show();
        $('#fixedEditBtn').hide();
        $('#exportDoneBtn').show();
    });
    
    $(document).on('click','.export-checkbox', function(){
        var checked = $(this).prop('checked');
        var parentSpecElem = $(this).closest('.spec-li');
        parentSpecElem.find('.export-checkbox').not($(this)).prop('checked', checked); 
    });
    
    $(document).on('click','#exportDoneBtn', function(){
        $('.choose-spec').hide();
        $('#fixedEditBtn').show();
        $('#exportDoneBtn').hide();
        
        
        var specIds = $('.export-checkbox:checkbox:checked').map(function(){
            return parseInt(this.getAttribute("value"));
        }).get();
        
        $('.export-checkbox').prop('checked', false);
        
        $.ajax({
            url: "specs/export",
            type: "GET",
            data: {
                specs: {
                    spec_id: specIds
                }   
            },
            global: false
        });
    });
});