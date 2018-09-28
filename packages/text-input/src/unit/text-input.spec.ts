import { TextInput } from '../components/text-input';
import { checkComponentDOM, inputValue, isDisabled, checkAnswer } from './test-helpers';
const expect: any = chai.expect;
const tagName: string = 'text-input';

describe(`<${tagName}>`, (): void => {
    it('should render default state', async (): Promise<void> => {
        withSnippet('default');
        const el: TextInput = document.querySelector('text-input') as any;
        await el.updateComplete;
        checkComponentDOM(el);
    });

    it('should render disabled state', async (): Promise<void> => {
        withSnippet('disabled');
        const el: TextInput = document.querySelector('text-input') as any;
        await el.updateComplete;
        checkComponentDOM(el, { disabled: true });
    });

    it('should render prefilled state', async (): Promise<void> => {
        withSnippet('prefilled');
        const el: TextInput = document.querySelector('text-input') as any;
        await el.updateComplete;
        checkComponentDOM(el, { value: 'Tokyo' });
    });

    it('should render readonly state', async (): Promise<void> => {
        withSnippet('readonly');
        const el: TextInput = document.querySelector('text-input') as any;
        await el.updateComplete;
        checkComponentDOM(el, { disabled: true, value: 'Hong Kong' });
    });

    it('should allow user input', async (): Promise<void> => {
        withSnippet('default');
        const el: TextInput = document.querySelector('text-input') as any;
        await el.updateComplete;
        checkComponentDOM(el);
        inputValue(el, 'Montreal');
        await el.updateComplete;
        checkComponentDOM(el, { value: 'Montreal' });
    });

    it('should dispatch change event on user input', async (): Promise<void> => {
        withSnippet('default');
        const el: TextInput = document.querySelector('text-input') as any;
        await el.updateComplete;

        await new Promise(resolve => {
            el.addEventListener('change', (evt: CustomEvent) => {
                expect(evt.detail.value).to.equal('Toronto');
                resolve();
            });
            inputValue(el, 'Toronto');
        });
    });

    it('should toggle disabled state', async (): Promise<void> => {
        withSnippet('default');
        const el: TextInput = document.querySelector('text-input') as any;
        await el.updateComplete;
        checkComponentDOM(el);
        inputValue(el, 'Ottawa');
        await el.updateComplete;
        checkComponentDOM(el, { value: 'Ottawa' });
        el.setAttribute('disabled', 'disabled');
        await el.updateComplete;
        expect(isDisabled(el)).to.be.true;
        checkComponentDOM(el, { value: 'Ottawa', disabled: true });
        el.removeAttribute('disabled');
        await el.updateComplete;
        expect(isDisabled(el)).to.be.false;
        inputValue(el, 'London');
        await el.updateComplete;
        checkComponentDOM(el, { value: 'London' });
    });

    it('should allow to change the value programmatically', async (): Promise<void> => {
        withSnippet('default');
        const el: TextInput = document.querySelector('text-input') as any;
        await el.updateComplete;
        checkComponentDOM(el);
        el.value = 'Calgary';
        await el.updateComplete;
        checkComponentDOM(el, { value: 'Calgary' });
        el.value = 'Edmonton';
        await el.updateComplete;
        checkComponentDOM(el, { value: 'Edmonton' });
        el.value = '';
        await el.updateComplete;
        checkComponentDOM(el);
    });

    it('should render within a paragraph', async (): Promise<void> => {
        withSnippet('three');
        const values = ['peculiarity', 'character', 'conscious'];
        const elements: NodeListOf<any> = document.querySelectorAll('text-input');
        expect(elements.length).to.equal(3);
        for (const el of Array.from(elements)) {
            await (el as TextInput).updateComplete;
            expect(getComputedStyle(el).display).to.equal('inline');
            checkComponentDOM(el, { value: values.shift() });
        }
    });
});

describe(`<${tagName}> validation and feedback`, (): void => {
    it('should give positive feedback on right answer', async (): Promise<void> => {
        withSnippet('feedback');
        const el: TextInput = document.querySelector('text-input') as any;
        await checkAnswer(el, 'smile');
        el.showFeedback();
        expect(el.feedbackMessage.type).to.equal('positive');
    });

    it('should give neutral feedback on neutral answer', async (): Promise<void> => {
        withSnippet('feedback');
        const el: TextInput = document.querySelector('text-input') as any;
        await checkAnswer(el, 'grin');
        el.showFeedback();
        expect(el.feedbackMessage.type).to.equal('neutral');
    });

    it('should give negative feedback on wrong answer', async (): Promise<void> => {
        withSnippet('feedback');
        const el: TextInput = document.querySelector('text-input') as any;
        await checkAnswer(el, 'some wrong answer');
        el.showFeedback();
        expect(el.feedbackMessage.type).to.equal('negative');
    });

    it('should give appropriate feedback message on each attempt', async (): Promise<void> => {
        withSnippet('feedback');
        const el: TextInput = document.querySelector('text-input') as any;
        await checkAnswer(el, 'first atttempt');
        el.showFeedback();
        expect(el.feedbackMessage.type).to.equal('negative');
        expect(el.feedbackMessage.message).to.equal('Try again');
        await checkAnswer(el, 'second atttempt');
        el.showFeedback();
        expect(el.feedbackMessage.type).to.equal('negative');
        expect(el.feedbackMessage.message).to.equal('Still not good');
        await checkAnswer(el, 'third atttempt');
        el.showFeedback();
        expect(el.feedbackMessage.type).to.equal('negative');
        expect(el.feedbackMessage.message).to.equal('Wrong answer');
        await checkAnswer(el, 'smile');
        el.showFeedback();
        expect(el.feedbackMessage.type).to.equal('positive');
        expect(el.feedbackMessage.message).to.equal('Good');
    });
});

mocha.run();
