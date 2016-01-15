/*global describe, beforeEach, it, expect, hasClass, element, by*/
/**
 * Created by Steve Kelly on 21/05/2015
 * for AirNZ
 */
describe('Third Party Ad', function () {
    beforeEach(function() {
        browser.get('http://grabaseat.co.nz');
    });
    it('check adid is set', function () {
        var target = element(by.tagName('thirdpartyad')).getAttribute('adid').then(function(attrs){
            expect(attrs).not.toBe(null);
        });
    });
});