/**
 * Created by kells4 on 18/12/2015.
 */
describe('Top Level suite', function() {
    it('spec', function() {
        expect(1).toBe(1);
    });

    describe('Nested suite', function() {
        it('nested spec', function() {
            expect(true).toBe(true);
        });
    });
});