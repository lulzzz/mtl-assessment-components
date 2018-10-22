const expect: any = chai.expect;

export function checkComponentDOM(el: any, params: { [key: string]: string | number | boolean } = {}): void {
    const shadowRoot: ShadowRoot = el.shadowRoot;
    expect(shadowRoot).not.to.be.null;
}