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
        element.all(by.repeater('dest in destinations')).then(function(dests) {
            expect(dests[0].element(by.css('.destination a')).getInnerHtml() ).toContain('Auckland');
            expect(dests[1].element(by.css('.destination a')).getInnerHtml() ).toContain('Blenheim');
            expect(dests[2].element(by.css('.destination a')).getInnerHtml() ).toContain('Christchurch');
            expect(dests[3].element(by.css('.destination a')).getInnerHtml() ).toContain('Dunedin');
            expect(dests[4].element(by.css('.destination a')).getInnerHtml() ).toContain('Gisborne');
            expect(dests[5].element(by.css('.destination a')).getInnerHtml() ).toContain('Hamilton');
            expect(dests[6].element(by.css('.destination a')).getInnerHtml() ).toContain('Hokitika');
            expect(dests[7].element(by.css('.destination a')).getInnerHtml() ).toContain('Invercargill');
            expect(dests[8].element(by.css('.destination a')).getInnerHtml() ).toContain('Kerikeri');
            expect(dests[9].element(by.css('.destination a')).getInnerHtml() ).toContain('Napier Hastings');
            expect(dests[10].element(by.css('.destination a')).getInnerHtml() ).toContain('Nelson');
            expect(dests[11].element(by.css('.destination a')).getInnerHtml() ).toContain('New Plymouth');
            expect(dests[12].element(by.css('.destination a')).getInnerHtml() ).toContain('Palmerston North');
            expect(dests[13].element(by.css('.destination a')).getInnerHtml() ).toContain('Paraparaumu');
            expect(dests[14].element(by.css('.destination a')).getInnerHtml() ).toContain('Queenstown');
            expect(dests[15].element(by.css('.destination a')).getInnerHtml() ).toContain('Rotorua');
            expect(dests[16].element(by.css('.destination a')).getInnerHtml() ).toContain('Taupo');
            expect(dests[17].element(by.css('.destination a')).getInnerHtml() ).toContain('Tauranga');
            expect(dests[18].element(by.css('.destination a')).getInnerHtml() ).toContain('Timaru');
            expect(dests[20].element(by.css('.destination a')).getInnerHtml() ).toContain('Wellington');
            expect(dests[19].element(by.css('.destination a')).getInnerHtml() ).toContain('Wanganui');
            expect(dests[21].element(by.css('.destination a')).getInnerHtml() ).toContain('Whangarei');
        });
    });
});