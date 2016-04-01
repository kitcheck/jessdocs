$(document).ready(function () {
      

    $.validator.setDefaults({
      errorClass: 'invalid',
      validClass: "valid",
      errorPlacement: function (error, element) {
          $(element)
              .closest("form")
              .find("label[for='" + element.attr("id") + "']")
              .attr('data-error', error.text());
      },
      
  });
    
});