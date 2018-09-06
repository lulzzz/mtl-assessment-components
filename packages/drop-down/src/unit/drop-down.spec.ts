import { DropDown } from "../components/drop-down";
import { checkComponentDOM, clickElement, getOptions, getValue } from './test-helpers';

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
        clickElement(shadowRoot.querySelector('.drop-button'));
        await el.renderComplete;
        const content = shadowRoot.querySelector('.dropdown-content');
        const display = window.getComputedStyle(content).getPropertyValue("display");
        expect(display).to.equal('block');
    });

    it('should open contents on navigation (arrow) button clicked', async (): Promise<void> => {
        withSnippet('default');
        const el: DropDown = document.querySelector('drop-down') as any;
        clickElement(el.shadowRoot.querySelector('.nav-button'));
        await el.renderComplete;
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
        clickElement(options[2]);
        expect(options[0].getAttribute('aria-selected')).to.equal('false');
        expect(options[1].getAttribute('aria-selected')).to.equal('false');
        expect(options[2].getAttribute('aria-selected')).to.equal('true');
    });

    it('should change value when a selection is made', async (): Promise<void> => {
        withSnippet('values-one-two-three');
        let el: DropDown = document.querySelector('drop-down') as any;
        const options = getOptions(el);
        clickElement(options[1]);
        await el.renderComplete;
        expect(getValue(el).pop()).to.equal(options[1].getAttribute('value'));
    });

    it('should update the UI to reflect selected option content when a selection is made', async (): Promise<void> => {
        withSnippet('values-one-two-three');
        let el: DropDown = document.querySelector('drop-down') as any;
        const options = getOptions(el);
        clickElement(options[0]);
        await el.renderComplete;
        expect(el.shadowRoot.querySelector('.drop-button').innerHTML).to.equal(options[0].innerHTML.trim());
    });

    it('should allow for HTML as option content', async (): Promise<void> => {
        withSnippet('html');
        let el: DropDown = document.querySelector('drop-down') as any;
        const options = getOptions(el);
        expect(options[0].innerHTML.includes('https://ebird.org/content/atlasva/wp-content/uploads/sites/68/Picture-286-1024x768.jpg')).to.equal(true);
        expect(options[1].innerHTML.includes('<b>')).to.equal(true);
    });

    it('should dispatch change event when a selection is made', async (): Promise<void> => {
        withSnippet('values-one-two-three');
        let el: DropDown = document.querySelector('drop-down') as any;
        await el.renderComplete;

        await new Promise(resolve => {
            el.addEventListener('change', (evt: CustomEvent) => {
                expect(evt.detail.value.pop()).to.equal('two');
                resolve();
            });

            const options = getOptions(el);
            clickElement(options[1]);
        });
    });

    it('should change value when a selection is made in multiple mode', async (): Promise<void> => {
        withSnippet('values-one-two-three-multiple');
        let el: DropDown = document.querySelector('drop-down') as any;
        const options = getOptions(el);
        clickElement(options[0]);
        await el.renderComplete;
        clickElement(options[1]);
        await el.renderComplete;
        expect(getValue(el)[0]).to.equal('one');
        expect(getValue(el)[1]).to.equal('two');
    });
});

mocha.run();
