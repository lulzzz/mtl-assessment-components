import { DropDown } from '../components/drop-down';

const expect: any = chai.expect;

export function checkComponentDOM(el: DropDown, params: { [key: string]: string | number | boolean } = {}): void {
    const shadowRoot: ShadowRoot = el.shadowRoot;
    expect(shadowRoot).not.to.be.null;
    checkAccessibilityparams(el);
}

export function checkAccessibilityparams(el: DropDown, params: { [key: string]: string | number | boolean } = {}): void {
    expect(el.getAttribute('role')).to.equal('popupbutton');
}
