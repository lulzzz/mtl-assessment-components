import { TextInput } from '../components/text-input';

const expect: any = chai.expect;

export function checkComponentDOM(el: TextInput, params: { [key: string]: string | number | boolean } = {}): void {
    const shadowRoot: ShadowRoot = el.shadowRoot;
    expect(shadowRoot).not.to.be.null;
    const div: HTMLDivElement = shadowRoot.querySelector('div.mdc-text-field.mdc-text-field--outlined' + (params.disabled ? '.mdc-text-field--disabled' : ''));
    expect(div).not.to.be.null;
    const input: HTMLInputElement = div.querySelector('input');
    expect(input).not.to.be.null;
    expect(input.getAttribute('id')).to.equal('tf-outlined');
    expect(input.getAttribute('type')).to.equal('text');
    if (params.disabled) {
        expect(input.hasAttribute('disabled')).to.be.true;
    } else {
        expect(input.hasAttribute('disabled')).to.be.false;
    }
    expect(input.classList.contains('mdc-text-field__input')).to.be.true;
    if (params.value) {
        expect(input.value).to.equal(params.value);
    } else {
        expect(input.value).to.equal('');
    }
    const outline: HTMLDivElement = div.querySelector('div.mdc-notched-outline');
    expect(outline).not.to.be.null;
    const idle: HTMLDivElement = div.querySelector('div.mdc-notched-outline__idle');
    expect(idle).not.to.be.null;
    checkAccessibilityparams(el);
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

export function isDisabled(el: TextInput): boolean {
    const shadowRoot: ShadowRoot = el.shadowRoot;
    expect(shadowRoot).not.to.be.null;
    const input: HTMLInputElement = shadowRoot.querySelector('input');
    expect(input).not.to.be.null;
    return input.disabled;
}

export function checkAccessibilityparams(el: TextInput, params: { [key: string]: string | number | boolean } = {}): void {
    expect(el.getAttribute('role')).to.equal('textbox');
    expect(el.hasAttribute('aria-label')).to.be.true;
    expect(el.hasAttribute('aria-placeholder')).to.be.true;
    if (params.value) {
        expect(el.getAttribute('aria-label')).to.equal(params.value);
    } else if (params.placeholder) {
        expect(el.getAttribute('aria-label')).to.equal(params.placeholder);
        expect(el.getAttribute('aria-placeholder')).to.equal(params.placeholder);
    }

    if (params.placeholder) {
        expect(el.getAttribute('aria-placeholder')).to.equal(params.placeholder);
    } else if (params.placeholder) {
        expect(el.getAttribute('aria-placeholder')).to.equal('');
    }
}

export async function checkAnswer(el: TextInput, value: string): Promise<void> {
    // @ts-ignore
    await el.updateComplete;
    const input: HTMLInputElement = el.shadowRoot.querySelector('input');
    input.value = value;
    input.dispatchEvent(new Event('change'));
    // @ts-ignore
    await el.updateComplete;
    checkComponentDOM(el, { value });
}
