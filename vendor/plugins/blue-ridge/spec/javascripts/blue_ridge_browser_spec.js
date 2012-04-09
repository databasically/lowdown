require("spec_helper.js");
require("../../lib/blue-ridge.js");

Screw.Unit(function() {
  describe("BlueRidge.Browser", function(){
    describe("deriveSpecNameFromCurrentFile", function(){
      it("returns the current file's patch from the fixtures directory minus the '.html' suffix and with '_spec.js' appended", function(){
        stub(BlueRidge.Browser, 'currentFile').and_return("/some/prefix/path/fixtures/path/to/current_file.html");
        expect(BlueRidge.Browser.deriveSpecNameFromCurrentFile()).to(equal, "path/to/current_file_spec.js");
      });
    });
    
    describe("urlCorrection", function(){
      it("returns an empty string if the given depth is zero", function(){
        expect(BlueRidge.Browser.urlCorrection(0)).to(equal, "");
      });

      it("returns one directory up if the given depth is 1", function(){
        expect(BlueRidge.Browser.urlCorrection(1)).to(equal, "../");
      });

      it("returns seven directories up if the given depth is 7", function(){
        expect(BlueRidge.Browser.urlCorrection(7)).to(equal, "../../../../../../../");
      });
    });
    
    describe("calculateDepth", function(){
      it("returns 1 if the current file is a direct child of the 'fixtures' directory", function(){
        stub(BlueRidge.Browser, 'currentFile').and_return("/some/prefix/fixtures/current_file.html");
        expect(BlueRidge.Browser.calculateDepth()).to(equal, 1);
      });

      it("returns 2 if the current file is in a subdirectory ONE level beneath the 'fixtures' directory", function(){
        stub(BlueRidge.Browser, 'currentFile').and_return("/some/prefix/fixtures/subdirectory/current_file.html");
        expect(BlueRidge.Browser.calculateDepth()).to(equal, 2);
      });

      it("returns 8 if the current file is in a subdirectory SEVEN levels beneath the 'fixtures' directory", function(){
        stub(BlueRidge.Browser, 'currentFile').and_return("/some/prefix/fixtures/1/2/3/4/5/6/7/current_file.html");
        expect(BlueRidge.Browser.calculateDepth()).to(equal, 8);
      });
    });

    //TODO split most of these tests out into tests for the treatUrlAsRelativeTo* functions
    describe("require", function(){
      describe("correctly alters the incoming URL based on the current file's relation to the 'fixtures' directory", function(){
        describe("when requiring a BlueRidge dependency", function(){
          it("prepends a single '../' if the current file is directly in the 'fixtures' directory", function(){
            stub(BlueRidge.Browser, 'currentFile').and_return("/ignored/fixtures/current_file.html");
            mock(BlueRidge.Browser).should_receive("createScriptTag").with_arguments("../some_file.js", null).at_least(1, "time");
            BlueRidge.Browser.require("some_file.js", {system: true});
          });
          
          it("prepends two '../' if the current file is in a subdirectory directly beneath the 'fixtures' directory", function(){
            stub(BlueRidge.Browser, 'currentFile').and_return("/ignored/fixtures/foo/current_file.html");
            mock(BlueRidge.Browser).should_receive("createScriptTag").with_arguments("../../some_file.js", null).at_least(1, "time");
            BlueRidge.Browser.require("some_file.js", {system: true});
          });

          it("prepends eight '../' if the current file is in a subdirectory nested seven-directories beneath the 'fixtures' directory", function(){
            stub(BlueRidge.Browser, 'currentFile').and_return("/ignored/fixtures/1/2/3/4/5/6/7/current_file.html");
            mock(BlueRidge.Browser).should_receive("createScriptTag").with_arguments("../../../../../../../../some_file.js", null).at_least(1, "time");
            BlueRidge.Browser.require("some_file.js", {system: true});
          });
        });
        
        describe("when requiring a spec dependency", function(){
          it("prepends a single '../' if the current file is directly in the 'fixtures' directory", function(){
            stub(BlueRidge.Browser, 'currentFile').and_return("/ignored/fixtures/current_file.html");
            mock(BlueRidge.Browser).should_receive("createScriptTag").with_arguments("../some_file.js", null).at_least(1, "time");
            BlueRidge.Browser.require("some_file.js");
          });
          
          it("pops off one '../' and then prepends two '../' if the current file is in a subdirectory directly beneath the 'fixtures' directory", function(){
            stub(BlueRidge.Browser, 'currentFile').and_return("/ignored/fixtures/foo/current_file.html");
            mock(BlueRidge.Browser).should_receive("createScriptTag").with_arguments("../../some_file.js", null).at_least(1, "time");
            BlueRidge.Browser.require("../some_file.js");
          });

          it("pops off seven '../' and then prepends eight '../' if the current file is in a subdirectory nested seven-directories beneath the 'fixtures' directory", function(){
            stub(BlueRidge.Browser, 'currentFile').and_return("/ignored/fixtures/1/2/3/4/5/6/7/current_file.html");
            mock(BlueRidge.Browser).should_receive("createScriptTag").with_arguments("../../../../../../../../some_file.js", null).at_least(1, "time");
            BlueRidge.Browser.require("../../../../../../../some_file.js");
          });
        });
      });

      // TODO: note, these tests conflict with the ones above because Smoke doesn't reset its stubs back to their "natural" values;
      // need to improve Smoke to be more forgiving on stubbing global objects

      // it("creates a script tag with an onload callback if passed an 'onload' option", function(){
      //   var callback = function(){ alert("some callback!") };
      //   stub(BlueRidge.Browser, "calculateDepth").and_return(0);
      //   mock(BlueRidge.Browser).should_receive("createScriptTag").with_arguments("some_url", callback).at_least(1, "time");
      //   BlueRidge.Browser.require("some_url", {onload: callback});
      // });
      // 
      // it("creates a script tag with NO onload callback if passed NOT an 'onload' option", function(){
      //   var callback = function(){ alert("some callback!") };
      //   stub(BlueRidge.Browser, "calculateDepth").and_return(0);
      //   mock(BlueRidge.Browser).should_receive("createScriptTag").with_arguments("some_url", null).at_least(1, "time");
      //   BlueRidge.Browser.require("some_url");
      // });
    });
  });
});
