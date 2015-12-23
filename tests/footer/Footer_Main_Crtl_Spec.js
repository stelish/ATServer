/**
 * Created by kells4 on 24/12/2015.
 */
describe('Footer',function(){
        beforeEach(function() {
            browser.get('http://grabaseat.co.nz');
            browser.driver.manage().window().maximize();
        });

        // navs
        it('social media should have correct hrefs',function(){
            expect(element(by.css('.facebook')).getAttribute('href')).toEqual('http://www.facebook.com/grabaseat');
            expect(element(by.css('.iphone')).getAttribute('href')).toEqual('https://grabaseat.co.nz/apps');
            expect(element(by.css('.register')).getAttribute('href')).toEqual('https://grabaseat.co.nz/secure/handleRegistration?registerMode=true');
            expect(element(by.css('.twitter')).getAttribute('href')).toEqual('http://twitter.com/grabaseat');
            expect(element(by.css('.rss')).getAttribute('href')).toEqual('https://grabaseat.co.nz/rss');
        });

        it('star alliance text should be correct',function(){
            expect(element(by.css('.copyright')).element(by.xpath('..')).element(by.tagName('span')).getInnerHtml()).toContain('A STAR ALLIANCE MEMBER');
        });

        it('copyright text should display with correct year',function(){

            expect(element(by.css('.copyright')).getInnerHtml()).toContain('2006 - '+new Date().getFullYear().toString()+' Air New Zealand Limited.');
        });

        // destination drop downs
        it('destination name & hrefs to be correct',function() {
            element(by.id('footer-links-collapse')).all(by.css('.ng-scope')).then(function (dests) {
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

        afterEach(function(){
        });
    }
);