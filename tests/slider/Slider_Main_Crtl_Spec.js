/*global describe, beforeEach, it, expect, hasClass, element, by*/
/**
 * Created by Steve Kelly on 21/05/2015
 * for AirNZ
 */
describe('Slider', function () {
    var hasClass = function (element, cls) {
        return element.getAttribute('class').then(function (classes) {
            return classes.split(' ').indexOf(cls) !== -1;
        });
    };

    beforeEach(function() {
        browser.get('http://grabaseat.co.nz');
        // set mobile height
        var width = 480;
        var height = 700;
        browser.driver.manage().window().setSize(width, height);
    });

    var hamBtn = element(by.id('hamburgerBtn'));
    var mainBody = element(by.id('body-content-wrapper'));

    it(' - should slideout', function () {
        hamBtn.click();
        expect(hasClass(mainBody,'contentSlideout')).toBe(true);
    });
});