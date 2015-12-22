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

    it('should hide lff', function () {
        toggleBtn = element(by.id('lff-toggle-btn')) || null;
        expect(toggleBtn).not.toBe(null);
        // collapse
        toggleBtn.click();
        expect(element(by.id('lffContentWrapper')).children()).toBeGreaterThan();

        // uncollapse
        toggleBtn.click();
        expect(element(by.id('lff-wrapper')).children()).toBeGreaterThan();
    });

    afterEach(function(){
    });

});