$(document).ready(function () {
    $(".dropdown-button").dropdown({ hover: false });
    $('select').material_select();
    $('.bookmarks .pinned').pushpin();
    
    $("ul.sortable").sortable({
        tolerance: 5
    });
    
    $("ul.sortable").sortable("disable");
    
    $(document).on("click", ".switch", function  (e) {
        var method = $('#sortSwitch').prop('checked') ? "enable" : "disable";
        $("ul.sortable").sortable(method);
    });
});