Screw.Unit(function() {
	describe("integrating with Screw.Unit", function() {
		before(function() {
			foo = {bar: function(attribute){return 'hello'}, baz:'goodbye'};
		});
		
		it("should forward stub() calls to new Stub to allow stub().and_return()", function() {
			var myStub = stub(foo,'baz')
			expect(myStub.and_return).to_not(equal, undefined);
		});
		
		it("should forward mock() calls to new mock object to allow mock().should_receive()", function() {
			var myMock = mock(foo);
			expect(myMock.should_receive).to_not(equal,undefined)
		});
	});
});