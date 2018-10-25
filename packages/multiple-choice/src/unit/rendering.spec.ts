import { MDCRadio } from '@material/radio/index';
import { MDCCheckbox } from '@material/checkbox/index';
import { expect, mcqTagName, mrqTagName, sleep } from './constants.spec';

export default () => {
    describe(`<${mcqTagName}> single`, (): void => {
        it('default should render as expected', async (): Promise<void> => {
            withSnippet('single-default');
            const element: HTMLElement = document.querySelector(mcqTagName);
            // @ts-ignore renderComplete is a protected member
            await element.updateComplete;
            expect(element.shadowRoot).not.to.be.undefined;
        });
        
        it('should be able to add options programmatically', async (): Promise<void> => {
            withSnippet('single-default');

            const element: HTMLElement = document.querySelector(mcqTagName);
            // @ts-ignore renderComplete is a protected member
            await element.updateComplete;
            const span: HTMLSpanElement = document.createElement('span');
            span.slot = 'options';
            span.id = '1';
            span.hidden = true;
            span.innerText = 'Option 1';
            element.appendChild(span);
            const spanTest: HTMLSpanElement = document.getElementById('1') as HTMLSpanElement;
            expect(spanTest).to.equal(span);
        });

        it('should be able to click added option', async (): Promise<void> => {
            withSnippet('single-default');
            const element: HTMLElement = document.querySelector(mcqTagName) as HTMLElement;
            // @ts-ignore renderComplete is a protected member
            await element.updateComplete;
            const span: HTMLSpanElement = document.createElement('span');
            span.slot = 'options';
            span.id = '1';
            span.hidden = true;
            span.innerText = 'Option 1';
            element.appendChild(span);
            const spanTest: HTMLSpanElement = document.getElementById('1') as HTMLSpanElement;
            expect(spanTest).to.equal(span);
            // @ts-ignore renderComplete is a protected member
            await element.updateComplete;
            await sleep();
            const formFieldElement: HTMLDivElement = element.shadowRoot.querySelector('div.mdc-form-field');
            const radioElement = formFieldElement.querySelector('div');
            const label = formFieldElement.querySelector('label');
            const radio = new MDCRadio(radioElement);
            expect(radio.checked).to.be.false;
            label.click();
            expect(radio.checked).to.be.true;
        });
    });

    describe(`<${mrqTagName}> multiple`, (): void => {
        it('default should render as expected', async (): Promise<void> => {
            withSnippet('multiple-default');
            const element: HTMLElement = document.querySelector(mrqTagName);
            // @ts-ignore renderComplete is a protected member
            await element.updateComplete;
            expect(element.shadowRoot).not.to.be.undefined;
        });

        it('should be able to add options programmatically', async (): Promise<void> => {
            withSnippet('multiple-default');
            const element: HTMLElement = document.querySelector(mrqTagName);
            // @ts-ignore renderComplete is a protected member
            await element.updateComplete;
            const span: HTMLSpanElement = document.createElement('span');
            span.slot = 'options';
            span.id = '1';
            span.hidden = true;
            span.innerText = 'Option 1';
            element.appendChild(span);
            // @ts-ignore renderComplete is a protected member
            await element.updateComplete;
            const spanTest: HTMLSpanElement = document.getElementById('1') as HTMLSpanElement;
            expect(spanTest).to.equal(span);
        });

        it('should be able to check added option', async (): Promise<void> => {
            withSnippet('multiple-default');
            const element: HTMLElement = document.querySelector(mrqTagName) as HTMLElement;
            // @ts-ignore renderComplete is a protected member
            await element.updateComplete;
            const span: HTMLSpanElement = document.createElement('span');
            span.slot = 'options';
            span.id = '1';
            span.hidden = true;
            span.innerText = 'Option 1';
            element.appendChild(span);
            const spanTest: HTMLSpanElement = document.getElementById('1') as HTMLSpanElement;
            expect(spanTest).to.equal(span);
            // @ts-ignore renderComplete is a protected member
            await element.updateComplete;
            await sleep();

            const formFieldElement: HTMLDivElement = element.shadowRoot.querySelector('div.mdc-form-field');
            const checkboxElement = formFieldElement.querySelector('div');
            const label = formFieldElement.querySelector('label');
            const checkbox = new MDCCheckbox(checkboxElement);
            expect(checkbox.checked).to.be.false;
            label.click();
            // @ts-ignore renderComplete is a protected member
            await element.updateComplete;

            expect(checkbox.checked).to.be.true;
        });

        it('should be able to uncheck added option', async (): Promise<void> => {
            withSnippet('multiple-default');
            const element: HTMLElement = document.querySelector(mrqTagName) as HTMLElement;
            // @ts-ignore renderComplete is a protected member
            await element.updateComplete;
            const span: HTMLSpanElement = document.createElement('span');
            span.slot = 'options';
            span.id = '1';
            span.hidden = true;
            span.innerText = 'Option 1';
            element.appendChild(span);
            const spanTest: HTMLDivElement = document.getElementById('1') as HTMLDivElement;
            expect(spanTest).to.equal(span);
            // @ts-ignore renderComplete is a protected member
            await element.updateComplete;
            await sleep();
            const formFieldElement: HTMLDivElement = element.shadowRoot.querySelector('div.mdc-form-field');
            const checkboxElement = formFieldElement.querySelector('div');
            const label = formFieldElement.querySelector('label');
            const checkbox = new MDCCheckbox(checkboxElement);
            expect(checkbox.checked).to.be.false;
            label.click();
            // @ts-ignore renderComplete is a protected member
            await element.updateComplete;
            expect(checkbox.checked).to.be.true;
            label.click();
            // @ts-ignore renderComplete is a protected member
            await element.updateComplete;
            expect(checkbox.checked).to.be.false;
        });
    });
};
