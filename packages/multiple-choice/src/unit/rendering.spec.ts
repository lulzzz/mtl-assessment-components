import { MDCRadio } from '@material/radio/index';
import { MDCCheckbox } from '@material/checkbox/index';
import { expect, tagName } from './constants.spec';

export default () => {
    describe(`<${tagName}> default`, (): void => {
        it('default should render as expected', (): void => {
            withSnippet('default');
            const value: boolean = true;
            expect(value).to.be.true;
        });
        it('should be able to add options programmatically', (): void => {
            withSnippet('default');
            const value: boolean = true;
            expect(value).to.be.true;
            const element: HTMLElement = document.querySelector('multiple-choice');
            const div: HTMLDivElement = document.createElement('div');
            div.slot = 'options';
            div.id = '1';
            div.hidden = true;
            div.innerText = 'Option 1';
            element.appendChild(div);
            const divTest: HTMLDivElement = document.getElementById('1') as HTMLDivElement;
            expect(divTest).to.equal(div);
        });
        it('should be single answer by default', async (): Promise<void> => {
            withSnippet('default');
            const value: boolean = true;
            expect(value).to.be.true;
            const element: HTMLElement = document.querySelector('multiple-choice');
            const div: HTMLDivElement = document.createElement('div');
            div.slot = 'options';
            div.id = '1';
            div.hidden = true;
            div.innerText = 'Option 1';
            element.appendChild(div);
            const divTest: HTMLDivElement = document.getElementById('1') as HTMLDivElement;
            expect(divTest).to.equal(div);
            // @ts-ignore renderComplete is a protected member
            await element.renderComplete;
            const formField: HTMLDivElement = element.shadowRoot.querySelector('div.mdc-form-field');
            const radioBtn: HTMLDivElement = formField.querySelector('div');
            expect(radioBtn.className).to.equal('mdc-radio');
        });
        it('should be able to click added option', async (): Promise<void> => {
            withSnippet('default');
            const value: boolean = true;
            expect(value).to.be.true;
            const element: HTMLElement = document.querySelector('multiple-choice') as HTMLElement;
            const div: HTMLDivElement = document.createElement('div');
            div.slot = 'options';
            div.id = '1';
            div.hidden = true;
            div.innerText = 'Option 1';
            element.appendChild(div);
            const divTest: HTMLDivElement = document.getElementById('1') as HTMLDivElement;
            expect(divTest).to.equal(div);
            // @ts-ignore renderComplete is a protected member
            await element.renderComplete;
            const formFieldElement: HTMLDivElement = element.shadowRoot.querySelector('div.mdc-form-field');
            const radioElement = formFieldElement.querySelector('div');
            const label = formFieldElement.querySelector('label');
            const radio = new MDCRadio(radioElement);
            expect(radio.checked).to.be.false;
            label.click();
            expect(radio.checked).to.be.true;
        });
    });

    describe(`<${tagName}> single mode`, (): void => {
        it('should render as expected', (): void => {
            withSnippet('single');
            const value: boolean = true;

            expect(value).to.be.true;
        });
    });

    describe(`<${tagName}> multiple mode`, (): void => {
        it('should render as expected', (): void => {
            withSnippet('multiple');
            const value: boolean = true;
            expect(value).to.be.true;
        });
        it('should be able to click added option', async (): Promise<void> => {
            withSnippet('multiple');
            const value: boolean = true;
            expect(value).to.be.true;
            const element: HTMLElement = document.querySelector('multiple-choice') as HTMLElement;

            // @ts-ignore renderComplete is a protected member
            await element.renderComplete;
            const formFieldElement: HTMLDivElement = element.shadowRoot.querySelector('div.mdc-form-field');
            const checkboxElement = formFieldElement.querySelector('div');
            const label = formFieldElement.querySelector('label');
            const checkbox = new MDCCheckbox(checkboxElement);
            expect(checkbox.checked).to.be.false;
            label.click();
            expect(checkbox.checked).to.be.true;
        });
    });
};
