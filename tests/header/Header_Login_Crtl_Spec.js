/*global describe, beforeEach, it, expect, hasClass, element, by, browser*/
/**
 * Created by Steve Kelly on 21/05/2015
 * for AirNZ
 */
describe('Login', function() {

    beforeEach(function() {
        browser.get('http://grabaseat.co.nz');
        // set mobile height
        var width = 480;
        var height = 700;
        browser.driver.manage().window().setSize(width, height);
        //browser.driver.manage().window().setPosition(1930,0);
    });

    it('should login successfully', function() {
        var hamBtn = element(by.id('hamburgerBtn'));
        hamBtn.click();

        var loginBtn = element(by.id('loginBtnToggle'));
        loginBtn.click();

        var usernameInput = element(by.id('username'));
        usernameInput.sendKeys('stelish');
        expect(usernameInput.getAttribute('value')).toEqual('stelish');

        var passwordInput = element(by.id('password'));
        passwordInput.sendKeys('hitech4455');
        expect(passwordInput.getAttribute('value')).toEqual('hitech4455');

        var submitBtn = element(by.id('loginSubmitBtn'));
        submitBtn.click();

        // need to check response
    });
});