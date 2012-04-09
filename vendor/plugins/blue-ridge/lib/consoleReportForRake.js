(function($) {
  $(Screw).bind("before", function(){
    $('.it')
      .bind('passed', function(){ 
        java.lang.System.out.print(".");
      })
      .bind('failed', function(e, reason){
        print("\nFAILED: " + BlueRidge.CommandLine.exampleName(this));
        print("          " + reason + "\n");
      });
  });

  $(Screw).bind("after", function(){
    var testCount = $('.passed').length + $('.failed').length;
    var failures = $('.failed').length;
    var elapsedTime = ((new Date() - Screw.suite_start_time)/1000.0);
    
    print("\n")
    print(testCount + ' test(s), ' + failures + ' failure(s)');
    print(elapsedTime.toString() + " seconds elapsed");
    
    if(failures > 0) { java.lang.System.exit(1) };
  });
})(jQuery);
