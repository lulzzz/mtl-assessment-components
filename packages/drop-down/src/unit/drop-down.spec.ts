import { DropDown } from '../components/drop-down';
import { checkComponentDOM, clickElement, getOptions, triggerValidation, selectOptions, generateOnSlotChangeEvent } from './test-helpers';
import { ResponseValidation, Strategy } from '@hmh/component-base/dist/index';

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
        await el.renderComplete;
        const shadowRoot = el.shadowRoot;
        clickElement(shadowRoot.querySelector('.drop-button'));
        await el.renderComplete;
        const content = shadowRoot.querySelector('.dropdown-content');
        const display = window.getComputedStyle(content).getPropertyValue('display');
        expect(display).to.equal('block');
    });

    it('should open contents on navigation (arrow) button clicked', async (): Promise<void> => {
        withSnippet('default');
        const el: DropDown = document.querySelector('drop-down') as any;
        await el.renderComplete;
        clickElement(el.shadowRoot.querySelector('.nav-button'));
        await el.renderComplete;
        const content = el.shadowRoot.querySelector('.dropdown-content');
        const display = window.getComputedStyle(content).getPropertyValue('display');
        expect(display).to.equal('blocky');
    });

    it('should contain the expected option values', async (): Promise<void> => {
        withSnippet('values-one-two-three');
        const el: DropDown = document.querySelector('drop-down') as any;
        await el.renderComplete;
        const options = getOptions(el);
        await el.renderComplete;
        expect(options[0].getAttribute('id')).to.equal('one');
        expect(options[1].getAttribute('id')).to.equal('two');
        expect(options[2].getAttribute('id')).to.equal('three');
    });

    it('should set aria-selected property correctly when a selection is made', async (): Promise<void> => {
        withSnippet('values-one-two-three');
        let el: DropDown = document.querySelector('drop-down') as any;
        await el.renderComplete;
        let options = getOptions(el);
        clickElement(options[2]);
        await el.renderComplete;
        expect(options[0].getAttribute('aria-selected')).to.equal('false');
        expect(options[1].getAttribute('aria-selected')).to.equal('false');
        expect(options[2].getAttribute('aria-selected')).to.equal('true');
    });

    it('should set selected class correctly when multiple selections are made in single mode', async (): Promise<void> => {
        withSnippet('values-one-two-three');
        let el: DropDown = document.querySelector('drop-down') as any;
        await el.renderComplete;
        const options = getOptions(el);
        await selectOptions(options, [0]);
        await selectOptions(options, [1]);
        expect(options[0].classList.contains('selected')).to.equal(false);
        expect(options[1].classList.contains('selected')).to.equal(true);
        expect(options[2].classList.contains('selected')).to.equal(false);
    });

    it('should set selected class correctly when selections are made in multiple mode', async (): Promise<void> => {
        withSnippet('values-one-two-three-multiple');
        let el: DropDown = document.querySelector('drop-down') as any;
        await el.renderComplete;
        const options = getOptions(el);
        await selectOptions(options, [1, 2]);
        expect(options[0].classList.contains('selected')).to.equal(false);
        expect(options[1].classList.contains('selected')).to.equal(true);
        expect(options[2].classList.contains('selected')).to.equal(true);
    });

    it('should deselect an item when the item is clicked twice in multiple mode', async (): Promise<void> => {
        withSnippet('values-one-two-three-multiple');
        let el: DropDown = document.querySelector('drop-down') as any;
        await el.renderComplete;
        const options = getOptions(el);
        clickElement(options[0]);
        await el.renderComplete;
        expect(options[0].classList.contains('selected')).to.equal(true);
        clickElement(options[0]);
        await el.renderComplete;
        expect(options[0].classList.contains('selected')).to.equal(false);
    });

    it('should change value when a selection is made', async (): Promise<void> => {
        withSnippet('values-one-two-three');
        let el: DropDown = document.querySelector('drop-down') as any;
        await el.renderComplete;
        const options = getOptions(el);
        clickElement(options[1]);
        await el.renderComplete;
        expect(el.getValue()).to.deep.equal([options[1].getAttribute('id')]);
    });

    it('should change value when multiple selections are made', async (): Promise<void> => {
        withSnippet('values-one-two-three-multiple');
        let el: DropDown = document.querySelector('drop-down') as any;
        await el.renderComplete;
        await selectOptions(getOptions(el), [0, 2]);
        expect(el.getValue()).to.deep.equal(['one', 'three']);
    });

    it('should update the UI to reflect selected option content when a selection is made', async (): Promise<void> => {
        withSnippet('values-one-two-three');
        let el: DropDown = document.querySelector('drop-down') as any;
        await el.renderComplete;
        const options = getOptions(el);
        clickElement(options[0]);
        await el.renderComplete;
        expect(el.shadowRoot.querySelector('.drop-button').innerHTML).to.contain(options[0].innerHTML.trim());
    });

    it('should update the UI to reflect selected option content when selections are made in multiple mode', async (): Promise<void> => {
        withSnippet('values-one-two-three-multiple');
        let el: DropDown = document.querySelector('drop-down') as any;
        await el.renderComplete;
        await selectOptions(getOptions(el), [0, 1, 2]);
        expect(el.shadowRoot.querySelector('.drop-button').innerHTML).to.contain('one,two,three');
    });

    it('should allow for HTML as option content', async (): Promise<void> => {
        withSnippet('html');
        let el: DropDown = document.querySelector('drop-down') as any;
        await el.renderComplete;
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
                expect([...evt.detail.value].pop()).to.equal('two');
                resolve();
            });

            const options = getOptions(el);
            clickElement(options[1]);
        });
    });

    it('should display correct feedback on correct answer', async (): Promise<void> => {
        withSnippet('feedback');
        let el: DropDown = document.querySelector('drop-down') as any;
        await el.renderComplete;
        await triggerValidation(el, 0);
        const feedbackMessage = el.shadowRoot.querySelector('.feedback-message');
        expect(feedbackMessage.classList.contains('feedback-positive-background')).to.equal(true);
        const container = el.shadowRoot.querySelector('.container');
        expect(container.classList.contains('feedback-positive-border')).to.equal(true);
    });

    it('should display correct feedback on correct answer with strategy fuzzyMatch', async (): Promise<void> => {
        withSnippet('feedback-fuzzy-stategy');
        let el: DropDown = document.querySelector('drop-down') as any;
        await el.renderComplete;
        await triggerValidation(el, 0);
        const feedbackMessage = el.shadowRoot.querySelector('.feedback-message');
        expect(feedbackMessage.classList.contains('feedback-positive-background')).to.equal(true);
        const container = el.shadowRoot.querySelector('.container');
        expect(container.classList.contains('feedback-positive-border')).to.equal(true);
    });

    it('should display neutral feedback on neutral (almost correct) answer', async (): Promise<void> => {
        withSnippet('feedback');
        let el: DropDown = document.querySelector('drop-down') as any;
        await el.renderComplete;
        await triggerValidation(el, 1);
        const feedbackMessage = el.shadowRoot.querySelector('.feedback-message');
        expect(feedbackMessage.classList.contains('feedback-neutral-background')).to.equal(true);
        const container = el.shadowRoot.querySelector('.container');
        expect(container.classList.contains('feedback-neutral-border')).to.equal(true);
    });

    it('should display incorrect feedback on incorrect answer', async (): Promise<void> => {
        withSnippet('feedback');
        let el: DropDown = document.querySelector('drop-down') as any;
        await el.renderComplete;
        await triggerValidation(el, 2);
        const feedbackMessage = el.shadowRoot.querySelector('.feedback-message');
        expect(feedbackMessage.classList.contains('feedback-negative-background')).to.equal(true);
        const container = el.shadowRoot.querySelector('.container');
        expect(container.classList.contains('feedback-negative-border')).to.equal(true);
    });

    it('match should default to false when no strategy with an implememtation is set', async (): Promise<void> => {
        withSnippet('feedback-no-strategy');
        const el: DropDown = document.querySelector('drop-down') as any;
        await el.renderComplete;
        await selectOptions(getOptions(el), [0]);
        const rv: ResponseValidation = new ResponseValidation();
        rv.strategy = Strategy.MATH_EQUIVALENT;
        //@ts-ignore
        rv.expected = '1';
        expect(el.match(rv, ['3'])).to.equal(false);
    });

    it('should set _responseValidationElements in response to feedback slot change event', async (): Promise<void> => {
        withSnippet('values-one-two-three');
        const el: DropDown = document.querySelector('drop-down') as any;
        await el.renderComplete;
        el._onFeedbackSlotChanged(generateOnSlotChangeEvent(el));
        await el.renderComplete;
        expect(el._responseValidationElements).to.not.equal(null);
    });
});

mocha.run();
