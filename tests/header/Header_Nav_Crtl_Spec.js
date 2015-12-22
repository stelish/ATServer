/*global describe, beforeEach, it, expect, hasClass, element, by, browser*/
/**
 * Created by Steve Kelly on 21/05/2015
 * for AirNZ
 */
describe('Header', function() {
    var usercount;
    beforeEach(function() {
        browser.get('http://grabaseat.co.nz');
        // set mobile height
        browser.driver.manage().window().maximize();
    });

    it('should display correct user count', function() {
        var counterDiv = element(by.id('counter'));
        var userContainer = element(by.css('.users'));
        expect(counterDiv).not.toBe(null);
        expect(userContainer.getText()).toContain('users online');
    });

});