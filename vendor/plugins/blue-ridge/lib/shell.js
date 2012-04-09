(function(){
  var _old_quit = this.quit;
  this.__defineGetter__("exit", function(){ _old_quit() });
  this.__defineGetter__("quit", function(){ _old_quit() });
  
  print("=================================================");
  print(" Rhino JavaScript Shell");
  print(" To exit type 'exit', 'quit', or 'quit()'.");
  print("=================================================");

  var plugin_prefix = environment["blue.ridge.prefix"] || "vendor/plugins/blue-ridge";
  var fixture_file = plugin_prefix + "/generators/blue_ridge/templates/application.html";

  load(plugin_prefix + "/lib/env.rhino.js");
  print(" - loaded env.js");

  window.location = fixture_file;
  print(" - sample DOM loaded");

  load(plugin_prefix + "/lib/jquery-1.3.2.js");
  print(" - jQuery-1.3.2 loaded");
  
  load(plugin_prefix + "/lib/jquery.print.js");
  print(" - jQuery print lib loaded");

  print("=================================================");
})();
