import { TextInput } from '../components/text-input';
import { checkComponentDOM, inputValue, isDisabled } from './test-helpers';
const expect: any = chai.expect;
const tagName: string = 'text-input';

describe(`<${tagName}>`, (): void => {
    it('should render default state', async (): Promise<void> => {
        withSnippet('default');
        const el: TextInput = document.querySelector('text-input') as any;
        await el.renderComplete;
        checkComponentDOM(el);
    });

    it('should render disabled state', async (): Promise<void> => {
        withSnippet('disabled');
        const el: TextInput = document.querySelector('text-input') as any;
        await el.renderComplete;
        checkComponentDOM(el, { disabled: true });
    });

    it('should render prefilled state', async (): Promise<void> => {
        withSnippet('prefilled');
        const el: TextInput = document.querySelector('text-input') as any;
        await el.renderComplete;
        checkComponentDOM(el, { value: 'Tokyo' });
    });

    it('should render readonly state', async (): Promise<void> => {
        withSnippet('readonly');
        const el: TextInput = document.querySelector('text-input') as any;
        await el.renderComplete;
        checkComponentDOM(el, { disabled: true, value: 'Hong Kong' });
    });

    it('should allow user input', async (): Promise<void> => {
        withSnippet('default');
        const el: TextInput = document.querySelector('text-input') as any;
        await el.renderComplete;
        checkComponentDOM(el);
        inputValue(el, 'Montreal');
        await el.renderComplete;
        checkComponentDOM(el, { value: 'Montreal' });
    });

    it('should dispatch change event on user input', async (): Promise<void> => {
        withSnippet('default');
        const el: TextInput = document.querySelector('text-input') as any;
        await el.renderComplete;

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
        await el.renderComplete;
        checkComponentDOM(el);
        inputValue(el, 'Ottawa');
        await el.renderComplete;
        checkComponentDOM(el, { value: 'Ottawa' });
        el.setAttribute('disabled', 'disabled');
        await el.renderComplete;
        expect(isDisabled(el)).to.be.true;
        checkComponentDOM(el, { value: 'Ottawa', disabled: true });
        el.removeAttribute('disabled');
        await el.renderComplete;
        expect(isDisabled(el)).to.be.false;
        inputValue(el, 'London');
        await el.renderComplete;
        checkComponentDOM(el, { value: 'London' });
    });

    it('should allow to change the value programmatically', async (): Promise<void> => {
        withSnippet('default');
        const el: TextInput = document.querySelector('text-input') as any;
        await el.renderComplete;
        checkComponentDOM(el);
        el.value = 'Calgary';
        await el.renderComplete;
        checkComponentDOM(el, { value: 'Calgary' });
        el.value = 'Edmonton';
        await el.renderComplete;
        checkComponentDOM(el, { value: 'Edmonton' });
        el.value = '';
        await el.renderComplete;
        checkComponentDOM(el);
    });

    it('should render within a paragraph', async (): Promise<void> => {
        withSnippet('three');
        const values = ['peculiarity', 'character', 'conscious'];
        const elements: NodeListOf<any> = document.querySelectorAll('text-input');
        expect(elements.length).to.equal(3);
        for (const el of Array.from(elements)) {
            await (el as TextInput).renderComplete;
            expect(getComputedStyle(el).display).to.equal('inline');
            checkComponentDOM(el, { value: values.shift() });
        }
    });
});

mocha.run();
