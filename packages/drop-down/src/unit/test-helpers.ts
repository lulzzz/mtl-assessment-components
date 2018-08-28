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
    expect(el.getAttribute('aria-label')).to.equal(shadowRoot.querySelector('.dropbtn').innerHTML);
}

export function clickElement(el: any): void {
    const event: Event = new Event('click');
    el.dispatchEvent(event);
}