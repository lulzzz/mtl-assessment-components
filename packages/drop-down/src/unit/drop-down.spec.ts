import { DropDown } from "../components/drop-down";
import { checkComponentDOM, clickElement, getOptions } from './test-helpers';

const tagName: string = 'drop-down';
const expect: any = chai.expect;

describe(`<${tagName}>`, (): void => {
    it('should render default state', async (): Promise<void> => {
        withSnippet('values-one-two-three');
        const el: DropDown = document.querySelector('drop-down') as any;
        await el.renderComplete;
        checkComponentDOM(el);
    });

    it('should open contents on button clicked', async (): Promise<void> => {
        withSnippet('default');
        const el: DropDown = document.querySelector('drop-down') as any;
        const shadowRoot = el.shadowRoot;
        clickElement(shadowRoot.querySelector('.dropbtn'));
        const content = shadowRoot.querySelector('.dropdown-content');
        const display = window.getComputedStyle(content).getPropertyValue("display");
        expect(display).to.equal('block');
    });

    it('should open contents on navigation (arrow) button clicked', async (): Promise<void> => {
        withSnippet('default');
        const el: DropDown = document.querySelector('drop-down') as any;
        clickElement(el.shadowRoot.querySelector('.nav-button'));
        const content = el.shadowRoot.querySelector('.dropdown-content');
        const display = window.getComputedStyle(content).getPropertyValue("display");
        expect(display).to.equal('block');
    });

    it('should contain the expected option values', async (): Promise<void> => {
        withSnippet('values-one-two-three');
        const el: DropDown = document.querySelector('drop-down') as any;
        const options = getOptions(el);
        expect(options[0].getAttribute('value')).to.equal('one');
        expect(options[1].getAttribute('value')).to.equal('two');
        expect(options[2].getAttribute('value')).to.equal('three');
    });

    it('should set aria-selected correctly when a selection is made', async (): Promise<void> => {
        withSnippet('values-one-two-three');
        let el: DropDown = document.querySelector('drop-down') as any;
        const options = getOptions(el);
        clickElement(options[0]);
        expect(options[0].getAttribute('aria-selected')).to.equal('true');
        expect(options[1].getAttribute('aria-selected')).to.equal('false');
        expect(options[2].getAttribute('aria-selected')).to.equal('false');
    });

    it('should change value when a selection is made', async (): Promise<void> => {
        withSnippet('values-one-two-three');
        let el: DropDown = document.querySelector('drop-down') as any;
        const options = getOptions(el);
        clickElement(options[0]);
        await el.renderComplete;
        expect(el.value).to.equal(options[0].getAttribute('value'));
    });

    it('should update the UI to reflect selected option content when a selection is made', async (): Promise<void> => {
        withSnippet('values-one-two-three');
        let el: DropDown = document.querySelector('drop-down') as any;
        const options = getOptions(el);
        clickElement(options[0]);
        await el.renderComplete;
        expect(el.shadowRoot.querySelector('.dropbtn').innerHTML).to.equal(options[0].innerHTML);
    });

    it('should allow for HTML as option content', async (): Promise<void> => {
        withSnippet('values-one-two-three');
        let el: DropDown = document.querySelector('drop-down') as any;
        const options = getOptions(el);
        expect(options[0].innerHTML.includes('<b>')).to.equal(true);
    });

    it('should dispatch change event when a selection is made', async (): Promise<void> => {
        withSnippet('values-one-two-three');
        let el: DropDown = document.querySelector('drop-down') as any;

        await new Promise(resolve => {
            el.addEventListener('change', (evt: CustomEvent) => {
                expect(evt.detail.value).to.equal('one');
                resolve();
            });

            const options = getOptions(el);
            clickElement(options[0]);
        });
    });
});

mocha.run();
