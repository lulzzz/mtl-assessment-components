import { MDCRadio } from '@material/radio/index';
import { MDCCheckbox } from '@material/checkbox/index';
import { expect, mcqTagName, mrqTagName } from './constants.spec';

export default () => {
    describe(`<${mcqTagName}> single`, (): void => {
        it('default should render as expected', (): void => {
            withSnippet('single-default');
            const value: boolean = true;
            expect(value).to.be.true;
        });
        it('should be able to add options programmatically', (): void => {
            withSnippet('single-default');
            const value: boolean = true;
            expect(value).to.be.true;
            const element: HTMLElement = document.querySelector(mcqTagName);
            const div: HTMLDivElement = document.createElement('div');
            div.slot = 'options';
            div.id = '1';
            div.hidden = true;
            div.innerText = 'Option 1';
            element.appendChild(div);
            const divTest: HTMLDivElement = document.getElementById('1') as HTMLDivElement;
            expect(divTest).to.equal(div);
        });

        it('should be able to click added option', async (): Promise<void> => {
            withSnippet('single-default');
            const value: boolean = true;
            expect(value).to.be.true;
            const element: HTMLElement = document.querySelector(mcqTagName) as HTMLElement;
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

    describe(`<${mrqTagName}> multiple`, (): void => {
        it('default should render as expected', (): void => {
            withSnippet('multiple-default');
            const value: boolean = true;
            expect(value).to.be.true;
        });

        it('should be able to add options programmatically', (): void => {
            withSnippet('multiple-default');
            const value: boolean = true;
            expect(value).to.be.true;
            const element: HTMLElement = document.querySelector(mrqTagName);
            const div: HTMLDivElement = document.createElement('div');
            div.slot = 'options';
            div.id = '1';
            div.hidden = true;
            div.innerText = 'Option 1';
            element.appendChild(div);
            const divTest: HTMLDivElement = document.getElementById('1') as HTMLDivElement;
            expect(divTest).to.equal(div);
        });
        it('should be able to click added option', async (): Promise<void> => {
            withSnippet('multiple-default');
            const value: boolean = true;
            expect(value).to.be.true;
            const element: HTMLElement = document.querySelector(mrqTagName) as HTMLElement;
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
            const checkboxElement = formFieldElement.querySelector('div');
            const label = formFieldElement.querySelector('label');
            const checkbox = new MDCCheckbox(checkboxElement);
            expect(checkbox.checked).to.be.false;
            label.click();
            expect(checkbox.checked).to.be.true;
        });
    });
};
