/*global describe, beforeEach, it, expect, hasClass, element, by, browser*/
/**
 * Created by Steve Kelly on 21/05/2015
 * for AirNZ
 */

describe('GLD', function () {
    var toggleBtn;

    beforeEach(function() {
        browser.get('http://grabaseat.co.nz');
        browser.driver.manage().window().maximize();
    });

    it('tnc link should got to correct page', function(){
        var tncLink = element(by.id('gld-widget')).element(by.css('.toptermslink'));
        tncLink.click();
        browser.sleep(4000);
        browser.getAllWindowHandles().then(function(handles){
            newWindowHandle = handles[1]; // this is your new window
            browser.switchTo().window(newWindowHandle).then(function () {
                expect(browser.getCurrentUrl()).toBe('https://grabaseat.co.nz/terms#generalterms');
            });
        });

    });

    it('should display correct title and conditions', function () {
        expect( element(by.id('gld-widget')).element(by.css('.heading')).getInnerHtml() ).toContain('greenlight deals');
        expect( element(by.id('gld-widget')).element(by.css('.heading')).getInnerHtml()).toContain('No checked-in baggage allowance, unless specified. Card payment fee applies');
    });

    afterEach(function(){
    });

});