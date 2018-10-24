import { DropDown } from '../components/drop-down';
import { checkComponentDOM, clickElement, getOptions, triggerValidation, selectOptions, sleep, generateOnSlotChangeEvent } from './test-helpers.js';
import { ResponseValidation, Strategy } from '@hmh/component-base/dist/index';

const tagName: string = 'drop-down';
const expect: any = chai.expect;

describe(`<${tagName}>`, (): void => {
    it('should render default state', async (): Promise<void> => {
        withSnippet('values-one-two-three');
        const el: DropDown = document.querySelector('drop-down') as any;
        // @ts-ignore
        await el.updateComplete;
        checkComponentDOM(el);
    });

    it('should open contents on button clicked', async (): Promise<void> => {
        withSnippet('default');
        const el: DropDown = document.querySelector('drop-down') as any;
        // @ts-ignore
        await el.updateComplete;
        const shadowRoot = el.shadowRoot;
        clickElement(shadowRoot.querySelector('.drop-button'));
        // @ts-ignore
        await el.updateComplete;
        const content = shadowRoot.querySelector('.dropdown-content');
        const display = window.getComputedStyle(content).getPropertyValue('display');
        expect(display).to.equal('block');
    });

    it('should open contents on navigation (arrow) button clicked', async (): Promise<void> => {
        withSnippet('default');
        const el: DropDown = document.querySelector('drop-down') as any;
        // @ts-ignore
        await el.updateComplete;
        clickElement(el.shadowRoot.querySelector('.nav-button'));
        // @ts-ignore
        await el.updateComplete;
        const content = el.shadowRoot.querySelector('.dropdown-content');
        const display = window.getComputedStyle(content).getPropertyValue('display');
        expect(display).to.equal('block');
    });

    it('should contain the expected option values', async (): Promise<void> => {
        withSnippet('values-one-two-three');
        const el: DropDown = document.querySelector('drop-down') as any;
        // @ts-ignore
        await el.updateComplete;
        await sleep();
        const options = getOptions(el);
        // @ts-ignore
        await el.updateComplete;
        expect(options[0].getAttribute('id')).to.equal('one');
        expect(options[1].getAttribute('id')).to.equal('two');
        expect(options[2].getAttribute('id')).to.equal('three');
    });

    it('should set aria-selected property correctly when a selection is made', async (): Promise<void> => {
        withSnippet('values-one-two-three');
        let el: DropDown = document.querySelector('drop-down') as any;
        // @ts-ignore
        await el.updateComplete;
        await sleep();
        let options = getOptions(el);
        clickElement(options[2]);
        // @ts-ignore
        await el.updateComplete;
        expect(options[0].getAttribute('aria-selected')).to.equal('false');
        expect(options[1].getAttribute('aria-selected')).to.equal('false');
        expect(options[2].getAttribute('aria-selected')).to.equal('true');
    });

    it('should set selected class correctly when multiple selections are made in single mode', async (): Promise<void> => {
        withSnippet('values-one-two-three');
        let el: DropDown = document.querySelector('drop-down') as any;
        // @ts-ignore
        await el.updateComplete;
        await sleep();
        const options = getOptions(el);
        await selectOptions(options, [0]);
        await selectOptions(options, [1]);
        expect(options[0].classList.contains('selected')).to.be.false;
        expect(options[1].classList.contains('selected')).to.be.true;
        expect(options[2].classList.contains('selected')).to.be.false;
    });

    it('should set selected class correctly when selections are made in multiple mode', async (): Promise<void> => {
        withSnippet('values-one-two-three-multiple');
        let el: DropDown = document.querySelector('drop-down') as any;
        // @ts-ignore
        await el.updateComplete;
        await sleep();
        const options = getOptions(el);
        await selectOptions(options, [1, 2]);
        expect(options[0].classList.contains('selected')).to.be.false;
        expect(options[1].classList.contains('selected')).to.be.true;
        expect(options[2].classList.contains('selected')).to.be.true;
    });

    it('should deselect an item when the item is clicked twice in multiple mode', async (): Promise<void> => {
        withSnippet('values-one-two-three-multiple');
        let el: DropDown = document.querySelector('drop-down') as any;
        // @ts-ignore
        await el.updateComplete;
        await sleep();
        const options = getOptions(el);
        clickElement(options[0]);
        // @ts-ignore
        await el.updateComplete;
        expect(options[0].classList.contains('selected')).to.be.true;
        clickElement(options[0]);
        // @ts-ignore
        await el.updateComplete;
        expect(options[0].classList.contains('selected')).to.be.false;
    });

    it('should change value when a selection is made', async (): Promise<void> => {
        withSnippet('values-one-two-three');
        let el: DropDown = document.querySelector('drop-down') as any;
        // @ts-ignore
        await el.updateComplete;
        await sleep();
        const options = getOptions(el);
        clickElement(options[1]);
        // @ts-ignore
        await el.updateComplete;
        expect(el.getValue()).to.deep.equal([options[1].getAttribute('id')]);
    });

    it('should change value when multiple selections are made', async (): Promise<void> => {
        withSnippet('values-one-two-three-multiple');
        let el: DropDown = document.querySelector('drop-down') as any;
        // @ts-ignore
        await el.updateComplete;
        await sleep();
        await selectOptions(getOptions(el), [0, 2]);
        expect(el.getValue()).to.deep.equal(['one', 'three']);
    });

    it('should update the UI to reflect selected option content when a selection is made', async (): Promise<void> => {
        withSnippet('values-one-two-three');
        let el: DropDown = document.querySelector('drop-down') as any;
        // @ts-ignore
        await el.updateComplete;
        await sleep();
        const options = getOptions(el);
        clickElement(options[0]);
        // @ts-ignore
        await el.updateComplete;
        expect(el.shadowRoot.querySelector('.drop-button').innerHTML).to.contain(options[0].innerHTML.trim());
    });

    it('should update the UI to reflect selected option content when selections are made in multiple mode', async (): Promise<void> => {
        withSnippet('values-one-two-three-multiple');
        let el: DropDown = document.querySelector('drop-down') as any;
        // @ts-ignore
        await el.updateComplete;
        await sleep();
        await selectOptions(getOptions(el), [0, 1, 2]);
        expect(el.shadowRoot.querySelector('.drop-button').innerHTML).to.contain('one,two,three');
    });

    it('should allow for HTML as option content', async (): Promise<void> => {
        withSnippet('html');
        let el: DropDown = document.querySelector('drop-down') as any;
        // @ts-ignore
        await el.updateComplete;
        await sleep();
        const options = getOptions(el);
        expect(options[0].innerHTML.includes('https://ebird.org/content/atlasva/wp-content/uploads/sites/68/Picture-286-1024x768.jpg')).to.be.true;
        expect(options[1].innerHTML.includes('<b>')).to.be.true;
    });

    it('should dispatch change event when a selection is made', async (): Promise<void> => {
        withSnippet('values-one-two-three');
        let el: DropDown = document.querySelector('drop-down') as any;
        // @ts-ignore
        await el.updateComplete;
        await sleep();
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
        // @ts-ignore
        await el.updateComplete;
        await sleep();
        await triggerValidation(el, 0);
        const feedbackMessage = el.shadowRoot.querySelector('.feedback-message');
        expect(feedbackMessage.classList.contains('feedback-positive-background')).to.be.true;
        const container = el.shadowRoot.querySelector('.container');
        expect(container.classList.contains('feedback-positive-border')).to.be.true;
    });

    it('should display correct feedback on correct answer with strategy contains', async (): Promise<void> => {
        withSnippet('feedback-contains-stategy');
        let el: DropDown = document.querySelector('drop-down') as any;
        // @ts-ignore
        await el.updateComplete;
        await sleep();
        await triggerValidation(el, 0);
        const feedbackMessage = el.shadowRoot.querySelector('.feedback-message');
        expect(feedbackMessage.classList.contains('feedback-positive-background')).to.be.true;
        const container = el.shadowRoot.querySelector('.container');
        expect(container.classList.contains('feedback-positive-border')).to.be.true;
    });

    it('should display neutral feedback on neutral (almost correct) answer', async (): Promise<void> => {
        withSnippet('feedback');
        let el: DropDown = document.querySelector('drop-down') as any;
        // @ts-ignore
        await el.updateComplete;
        await sleep();
        await triggerValidation(el, 1);
        const feedbackMessage = el.shadowRoot.querySelector('.feedback-message');
        expect(feedbackMessage.classList.contains('feedback-neutral-background')).to.be.true;
        const container = el.shadowRoot.querySelector('.container');
        expect(container.classList.contains('feedback-neutral-border')).to.be.true;
    });

    it('should display incorrect feedback on incorrect answer', async (): Promise<void> => {
        withSnippet('feedback');
        let el: DropDown = document.querySelector('drop-down') as any;
        // @ts-ignore
        await el.updateComplete;
        await sleep();
        await triggerValidation(el, 2);
        const feedbackMessage = el.shadowRoot.querySelector('.feedback-message');
        expect(feedbackMessage.classList.contains('feedback-negative-background')).to.be.true;
        const container = el.shadowRoot.querySelector('.container');
        expect(container.classList.contains('feedback-negative-border')).to.be.true;
    });

    it('match should default to false when no strategy with an implememtation is set', async (): Promise<void> => {
        withSnippet('feedback-no-strategy');
        const el: DropDown = document.querySelector('drop-down') as any;
        // @ts-ignore
        await el.updateComplete;
        await sleep();
        await selectOptions(getOptions(el), [0]);
        const rv: ResponseValidation = new ResponseValidation();
        rv.strategy = Strategy.MATH_EQUIVALENT;
        //@ts-ignore
        rv.expected = '1';
        expect(el.match(rv, ['3'])).to.be.false;
    });

    it('should set _responseValidationElements in response to feedback slot change event', async (): Promise<void> => {
        withSnippet('values-one-two-three');
        const el: DropDown = document.querySelector('drop-down') as any;
        // @ts-ignore
        await el.updateComplete;
        el._onFeedbackSlotChanged(generateOnSlotChangeEvent(el));
        // @ts-ignore
        await el.updateComplete;
        expect(el._responseValidationElements).to.not.equal(null);
    });
});

mocha.run();
