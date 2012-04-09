Screw.Unit(function() {
	describe("core", function() {    
    var anonymous_function = function() { return arguments };
    describe("printArguments", function() {
      it("should return '()' is the arguments are empty", function() {
        expect(Smoke.printArguments(arguments)).to(equal, '()');
      });

      it("should return '()' is the arguments are undefined", function() {
        expect(Smoke.printArguments()).to(equal, '()');
      });

      it("should return the arguments comma seperated wrapped in parenthesis", function() {
        var args = anonymous_function(1,2);
        expect(Smoke.printArguments(args)).to(equal, '(1, 2)');
      });
      
      it("should handle being passed something other than an array or arguments object", function() {
        expect(Smoke.printArguments(false)).to(equal, '(false)');
      });
    });
    
    describe("argumentsToArray", function() {
      it("should return an array", function() {
        expect(Smoke.argumentsToArray(anonymous_function(1,2)) instanceof Array).to(equal, true);
      });
      
      it("should return the arguments in an array", function() {
        expect(Smoke.argumentsToArray(anonymous_function(1,2))).to(equal, [1,2]);        
      });      
    });

    describe("compare", function() {
      describe("with arrays", function() {
        var array = [1,2,3], nested_array = [[1,2], [3,4]];
        it("should return true if the two arrays are equal", function() {
          expect(Smoke.compare(array, [1,2,3])).to(equal, true);
        });

        it("should return true if the two nested arrays are equal", function() {
          expect(Smoke.compare(nested_array, [[1,2], [3,4]])).to(equal, true);
        });
        
        it("should return false if the two arrays are not equal", function() {
          expect(Smoke.compare(array, [1,2,3,4])).to(equal, false);
        })

        it("should return false if the two nested arrays are not equal", function() {
          expect(Smoke.compare(nested_array, [[1,2],[3]])).to(equal, false);
        })
      });
      
      describe("with objects", function() {
        var object = { foo: 'bar' }, nested_object = { foo: { a: 'b' }, bar: { c: 'd'} };
        it("should return true if the two objects are equal", function() {
          expect(Smoke.compare(object, { foo: 'bar' })).to(equal, true);
        });

        it("should return true if the two nested objects are equal", function() {
          expect(Smoke.compare(nested_object, { foo: { a: 'b' }, bar: { c: 'd'} })).to(equal, true);
        });
        
        it("should return false if the two objects are not equal", function() {
          expect(Smoke.compare(object, {bar: 'foo'})).to(equal, false);
        });

        it("should return false if the two nested objects are not equal", function() {
          expect(Smoke.compare(nested_object, { foo: { c: 'd' }, bar: { a: 'b' } })).to(equal, false);
        });
        
        it("should return false if an one of the objects has an additional property", function() {
          expect(Smoke.compare(object, { foo: 'bar', bar: 'foo' })).to(equal, false);          
        })
      });

      describe('with value types', function() {
        var string = 'foo', number = 1;
        it("should return true if the two strings are equal", function() {
          expect(Smoke.compare(string, 'foo')).to(equal, true);
        });

        it("should return true if the two numbers are equal", function() {
          expect(Smoke.compare(number, 1)).to(equal, true);
        });
        
        it("should return false if the two strings are not equal", function() {
          expect(Smoke.compare(string, 'bar')).to(equal, false);
        });

        it("should return false if the two number are not equal", function() {
          expect(Smoke.compare(number, 2)).to(equal, false);
        });
      })

      describe("with mixed types", function() {
        var array = [1, { foo: 'bar'}, '2'], object = { foo: [1,2,3], bar: 'foo', one: 1 };
        it("should return true if the two arrays with mixed types are equal", function() {
          expect(Smoke.compare(array, [1, { foo: 'bar'}, '2'])).to(equal, true);
        });

        it("should return false if the two arrays with mixed types are not equal", function() {
          expect(Smoke.compare(array, [1, { foo: 'bar'}, 3])).to(equal, false);
        });
        
        it("should return true if the two objects with mixed types are equal", function() {
          expect(Smoke.compare(object, { foo: [1,2,3], bar: 'foo', one: 1 })).to(equal, true);
        });

        it("should return false if the two objects with mixed types are not equal", function() {
          expect(Smoke.compare(object, { foo: [1,2,3], bar: 'foo', two: 3 })).to(equal, false);
        });
      })
    });    
	});
});