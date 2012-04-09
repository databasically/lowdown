Screw.Unit(function() {
	describe("stubbing", function() {
		before(function() {
			foo = {bar: function(attribute){return 'hello'}, baz:'goodbye'};
		});
		
		it("should return the stubbed value of a property", function() {
			stub(foo,'baz').and_set_to('baz');
			expect(foo.baz).to(equal, 'baz');
		});
		
		it("should return the stubbed value of a function", function() {
			stub(foo,'bar').and_return('bar');
			expect(foo.bar()).to(equal, 'bar');
		});
	});
});