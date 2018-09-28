import { DropDown } from '../components/drop-down';

const expect: any = chai.expect;

export function checkComponentDOM(el: DropDown, params: { [key: string]: string | number | boolean } = {}): void {
    const shadowRoot = el.shadowRoot;
    expect(shadowRoot).not.to.be.null;
    checkAccessibilityparams(el);
}

export function checkAccessibilityparams(el: DropDown, params: { [key: string]: string | number | boolean } = {}): void {
    const shadowRoot = el.shadowRoot;
    expect(el.getAttribute('role')).to.equal('popupbutton');
    expect(el.getAttribute('aria-haspopup')).to.equal('true');
    expect(el.getAttribute('aria-label')).to.equal(shadowRoot.querySelector('.drop-button').innerHTML);
}

export function getOptions(el: DropDown): HTMLElement[] {
    return Array.from(el.shadowRoot.querySelectorAll('.option-item'));
}

export function clickElement(el: HTMLElement): void {
    var event = new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true
    });
    el.dispatchEvent(event);
}

export function generateOnSlotChangeEvent(el: DropDown): CustomEvent {
    const feedback: HTMLElement = el.shadowRoot.querySelector('.feedback') as any;

    const evt = new CustomEvent('slotchange', {
        bubbles: true,
        composed: true,
        detail: {
            srcElement: feedback
        }
    })

    return evt;
}

export async function selectOptions(options: HTMLElement[], optionIndices: number[]){    
    optionIndices.forEach((index: number) => {
        clickElement(options[index]);
    });
}

export async function triggerValidation(el: DropDown, optionIndex: number){
    await selectOptions(getOptions(el), [optionIndex]);
    el.showFeedback();
    await el.updateComplete;
}