/*global describe, beforeEach, it, expect, hasClass, element, by, browser*/
/**
 * Created by Steve Kelly on 21/05/2015
 * for AirNZ
 */

describe('LFF', function () {
    var toggleBtn;

    beforeEach(function() {
        browser.get('http://grabaseat.co.nz');
        browser.driver.manage().window().maximize();
    });

    it('should hide & show lff', function () {
        toggleBtn = element(by.id('lff-toggle-btn')) || null;
        expect(toggleBtn).not.toBe(null);
        // collapse
        toggleBtn.click();
        browser.sleep(2000);
        expect( element( by.id('lffContentWrapper') ).$('#lff-widget')).not.toBe(null);

        // uncollapse
        toggleBtn.click();
        browser.sleep(2000);
        expect( element( by.id('lff-wrapper') ).$('#lff-widget')).not.toBe(null);
    });

    afterEach(function(){
    });

});