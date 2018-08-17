import { TextInput } from '../components/text-input';

const expect: any = chai.expect;

export function checkComponentDOM(el: TextInput, attributes: { [key: string]: string | number | boolean } = {}): void {
    const shadowRoot: ShadowRoot = el.shadowRoot;
    expect(shadowRoot).not.to.be.null;
    const div: HTMLDivElement = shadowRoot.querySelector(
        'div.mdc-text-field.mdc-text-field--outlined' + (attributes.disabled ? '.mdc-text-field--disabled' : '')
    );
    expect(div).not.to.be.null;
    const input: HTMLInputElement = div.querySelector('input');
    expect(input).not.to.be.null;
    expect(input.getAttribute('id')).to.equal('tf-outlined');
    expect(input.getAttribute('type')).to.equal('text');
    if (attributes.disabled) {
        expect(input.hasAttribute('disabled')).to.be.true;
    } else {
        expect(input.hasAttribute('disabled')).to.be.false;
    }
    expect(input.classList.contains('mdc-text-field__input')).to.be.true;
    if (attributes.value) {
        expect(input.value).to.equal(attributes.value);
    }
    const outline: HTMLDivElement = div.querySelector('div.mdc-notched-outline');
    expect(outline).not.to.be.null;
    const idle: HTMLDivElement = div.querySelector('div.mdc-notched-outline__idle');
    expect(idle).not.to.be.null;
    checkAccessibilityAttributes(el);
}

export function inputValue(el: TextInput, value: string): void {
    const shadowRoot: ShadowRoot = el.shadowRoot;
    expect(shadowRoot).not.to.be.null;
    const input: HTMLInputElement = shadowRoot.querySelector('input');
    expect(input).not.to.be.null;
    input.value = value;
    // Create a new 'change' event
    const event = new Event('change');
    // Dispatch it.
    input.dispatchEvent(event);
}

export function checkAccessibilityAttributes(el: TextInput): void {
    expect(el.getAttribute('role')).to.equal('textbox');
    expect(el.hasAttribute('aria-label')).to.be.true;
    expect(el.hasAttribute('aria-placeholder')).to.be.true;
}
