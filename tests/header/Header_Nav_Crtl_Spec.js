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

    // user count
    it('should display correct user count', function() {
        var counterDiv = element(by.id('counter'));
        var userContainer = element(by.css('.users'));
        expect(counterDiv).not.toBe(null);
        expect(userContainer.getText()).toContain('users online');
    });

    // logo
    it('logo should link to https://grabaseat.co.nz/flights',function(){
        expect(element(by.css('.logo')).getAttribute('href')).toEqual('https://grabaseat.co.nz/flights');
    });

    // navs
    it('nav items should have correct hrefs',function(){
        expect(element(by.css('.flights a')).getAttribute('href')).toEqual('https://grabaseat.co.nz/flights');
        expect(element(by.css('.auctions a')).getAttribute('href')).toEqual('https://grabaseat.co.nz/secure/auctions');
        expect(element(by.css('.tourofduty a')).getAttribute('href')).toEqual('https://grabaseat.co.nz/tikitrips');
        expect(element(by.css('.hotels a')).getAttribute('href')).toEqual('https://grabaseat.secure-travel.net/');
        expect(element(by.css('.campervans a')).getAttribute('href')).toEqual('http://campervans.grabaseat.co.nz/');
        expect(element(by.css('.cars a')).getAttribute('href')).toEqual('https://grabaseat.co.nz/cars');
        expect(element(by.css('.experiences a')).getAttribute('href')).toEqual('https://grabaseat.co.nz/experiences');
        expect(element(by.css('.createAccount a')).getAttribute('href')).toEqual('https://grabaseat.co.nz/secure/handleRegistration?registerMode=true');
    });

    // destination drop downs
    it('destination dropdowns to be correct',function(){
        var navDropDown = element(by.css('.destinations'));
        navDropDown.click();
        navDropDown.all(by.css('.ng-scope')).then(function (dests) {
            expect(dests[0].getInnerHtml()).toContain('Auckland');
            expect(dests[1].getInnerHtml()).toContain('Blenheim');
            expect(dests[2].getInnerHtml()).toContain('Christchurch');
            expect(dests[3].getInnerHtml()).toContain('Dunedin');
            expect(dests[4].getInnerHtml()).toContain('Gisborne');
            expect(dests[5].getInnerHtml()).toContain('Hamilton');
            expect(dests[6].getInnerHtml()).toContain('Hokitika');
            expect(dests[7].getInnerHtml()).toContain('Invercargill');
            expect(dests[8].getInnerHtml()).toContain('Kerikeri');
            expect(dests[9].getInnerHtml()).toContain('Napier Hastings');
            expect(dests[10].getInnerHtml()).toContain('Nelson');
            expect(dests[11].getInnerHtml()).toContain('New Plymouth');
            expect(dests[12].getInnerHtml()).toContain('Palmerston North');
            expect(dests[13].getInnerHtml()).toContain('Paraparaumu');
            expect(dests[14].getInnerHtml()).toContain('Queenstown');
            expect(dests[15].getInnerHtml()).toContain('Rotorua');
            expect(dests[16].getInnerHtml()).toContain('Taupo');
            expect(dests[17].getInnerHtml()).toContain('Tauranga');
            expect(dests[18].getInnerHtml()).toContain('Timaru');
            expect(dests[20].getInnerHtml()).toContain('Wellington');
            expect(dests[19].getInnerHtml()).toContain('Wanganui');
            expect(dests[21].getInnerHtml()).toContain('Whangarei');
        });
    });
});