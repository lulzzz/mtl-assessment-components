import { AxisDef } from '../components/axis-def.js';

const expect: any = chai.expect;

export function checkComponentDOM(el: AxisDef, params: { [key: string]: string | number | boolean } = {}): void {
    const shadowRoot: ShadowRoot = el.shadowRoot;
    expect(shadowRoot).not.to.be.null;
}