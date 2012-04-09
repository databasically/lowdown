require("spec_helper.js");
require("../../lib/test_runner.js");

//TODO: get Smoke to where I can just stub all the assigmnents to BlueRidge.CommandLine.specFile below.
Screw.Unit(function() {
  describe("BlueRidge.CommandLine", function(){
    after(function(){ teardownFixtures() });
    
    describe("fixtureFile", function(){
      it("returns the filename converted from a '_spec.js' suffix to '.html'", function(){
        BlueRidge.CommandLine.specFile = 'some/path/to/a_spec.js' 
        expect(BlueRidge.CommandLine.fixtureFile).to(match, /a\.html$/);
      });
    
      it("returns the filename prepended with 'fixtures/'", function(){
        BlueRidge.CommandLine.specFile = 'some/path/to/a_spec.js'
        expect(BlueRidge.CommandLine.fixtureFile).to(match, /^fixtures\/some\/path\/to\/a/);
      });
    });
    
    describe("specDirname", function(){
      it("returns null if given a null spec filename", function(){
        BlueRidge.CommandLine.specFile = null
        expect(BlueRidge.CommandLine.specDirname).to(be_null);
      });
    
      it("returns null if given a spec filename without a path prefix", function(){
        BlueRidge.CommandLine.specFile = 'some_spec.js'
        expect(BlueRidge.CommandLine.specDirname).to(be_null);
      });
      
      it("returns the path prefix if given a spec filename with a path prefix", function(){
        BlueRidge.CommandLine.specFile = 'some/path/to/some_spec.js'
        expect(BlueRidge.CommandLine.specDirname).to(equal, "some/path/to");
      });
    });
    
    describe("specBasename", function(){
      it("returns null if given a null spec filename", function(){
        BlueRidge.CommandLine.specFile = null
        expect(BlueRidge.CommandLine.specBasename).to(be_null);
      });
    
      it("returns the filename if given a spec filename without a path prefix", function(){
        BlueRidge.CommandLine.specFile = 'some_spec.js'
        expect(BlueRidge.CommandLine.specBasename).to(equal, 'some_spec.js');
      });
      
      it("returns only the filename if given a spec filename with a path prefix", function(){
        BlueRidge.CommandLine.specFile = 'some/path/to/some_spec.js'
        expect(BlueRidge.CommandLine.specBasename).to(equal, 'some_spec.js');
      });
    });
    
    describe("prepareFilenameForRequireBasedOnSpecDirectory", function(){
      it("returns null if given a null filename", function(){
        expect(BlueRidge.CommandLine.prepareFilenameForRequireBasedOnSpecDirectory(null)).to(be_null);
      });
      
      it("returns the given filename if is it an absolute filepath", function(){
        var filename = BlueRidge.CommandLine.prepareFilenameForRequireBasedOnSpecDirectory("/some/absolute/filename.txt");
        expect(filename).to(equal, "/some/absolute/filename.txt");
      });
      
      describe("when given a relative filepath", function(){
        it("returns the given filename unchanged if there was NO path prefix on the spec filename", function(){
          BlueRidge.CommandLine.specFile = 'some_spec.js'
          var filename = BlueRidge.CommandLine.prepareFilenameForRequireBasedOnSpecDirectory("../../filename.txt");
          expect(filename).to(equal, "../../filename.txt");
        });
        
        it("returns the given filename with the spec file dirname prepended if there was a path prefix on the spec filename", function(){
          BlueRidge.CommandLine.specFile = 'some/path/to/some_spec.js'
          var filename = BlueRidge.CommandLine.prepareFilenameForRequireBasedOnSpecDirectory("../../filename.txt");
          expect(filename).to(equal, "some/path/to/../../filename.txt");
        });
      });
    });
    
    describe("exampleName", function(){
      it("returns the context name plus the example name for the given 'it' block when there is only one parent describe block", function(){
        fixture(createDescribeDiv("describe")
          .append($('<ul class="its"/>')
            .append('<li class="it" id="sample-it"><h2>example</h2></li>')));
      
        expect(BlueRidge.CommandLine.exampleName("#sample-it")).to(equal, "describe example");
      });
      
      it("returns the outer-most to inner-most context name plus the example name for the given 'it' block when it is inside several nested describes", function(){
        fixture(createDescribeDiv("describe 3")
          .append(createDescribeDiv("describe 2")
            .append(createDescribeDiv("describe 1")
              .append($('<ul class="its"/>')
                .append('<li class="it" id="sample-it"><h2>example</h2></li>')))));
        
        expect(BlueRidge.CommandLine.exampleName("#sample-it")).to(equal, "describe 3 describe 2 describe 1 example");
      });
    });
    
    describe("contextNamesForExample", function(){
      it("returns an array with the context name for the given 'it' block when there is only one parent describe block", function(){
        fixture(createDescribeDiv("describe")
          .append($('<ul class="its"/>')
            .append('<li class="it" id="sample-it"><h2>example</h2></li>')));
      
        expect(BlueRidge.CommandLine.contextNamesForExample("#sample-it")).to(equal, ["describe"]);
      });
      
      it("returns an array of context names, sorted from outer-most to inner-most, when the given 'it' block is inside several nested describes", function(){
        fixture(createDescribeDiv("describe 3")
          .append(createDescribeDiv("describe 2")
            .append(createDescribeDiv("describe 1")
              .append($('<ul class="its"/>')
                .append('<li class="it" id="sample-it"><h2>example</h2></li>')))));
        
        var expected = ["describe 3", "describe 2", "describe 1"];
        expect(BlueRidge.CommandLine.contextNamesForExample("#sample-it")).to(equal, expected);
      });
    });
  });
});
