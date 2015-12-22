/*global describe, beforeEach, it, expect, hasClass, element, by, browser*/
/**
 * Created by Steve Kelly on 21/05/2015
 * for AirNZ
 */
describe('SCA',function(){
    beforeEach(function() {
        browser.get('http://grabaseat.co.nz');
    });
    /**
     * Spec Test
     */
    it('should link last deal to vbook',function(){
        var lastDeal = element.all(by.css('.listing li')).last();
        //lastDeal.click();
    });
});
