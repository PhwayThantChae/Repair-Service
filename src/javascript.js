 $(document).ready(function() {
     
   
      // $('.masthead')
      //   .visibility({
      //     once: false,
      //     onBottomPassed: function() {
      //       $('.fixed.menu').transition('fade in');
      //     },
      //     onBottomPassedReverse: function() {
      //       $('.fixed.menu').transition('fade out');
      //     }
      //   });

      // create sidebar and attach to menu open
      $('.custom.item')
      .popup({
        popup: '.custom.popup',
        position  : 'bottom center',
        // boundary:   $('body'),
        on: 'click'
      });
      

      $('.message .close')
        .on('click', function() {
          $(this)
            .closest('.message')
            .transition('fade')
          ;
        });


    
     
    });
 
     
        
 