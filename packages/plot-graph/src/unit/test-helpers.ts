const expect: any = chai.expect;

export function checkComponentDOM(el: any, params: { [key: string]: string | number | boolean } = {}): void {
    const shadowRoot: ShadowRoot = el.shadowRoot;
    expect(shadowRoot).not.to.be.null;
}

export function addEquation(parent: any, equation: string, attributes: Array<object> = []) {
    addSlotElement(parent, equation, 'equation-items', attributes);
}

export function addAxis(parent: any, label: string,  attributes: Array<object> = []) {
    addSlotElement(parent, label, 'axis', attributes);
}

export function checkFirstEquation(el: any, expectedEquation: string): void {
    // @ts-ignore
    const equation = el.equationItems[0];
    // @ts-ignore
    expect(el.equationItems.length).to.equal(1);
    expect(equation.textContent.trim()).to.equal(expectedEquation);
}

function addSlotElement(parent: any, textContent: string, slot: string, attributes: Array<object> = []) {
    const element: HTMLElement = document.createElement('span');
    element.setAttribute('slot', slot);

    attributes.forEach((attr: any) => {
        Object.keys(attr).forEach((key: string) => {
            element.setAttribute(key, attr[key]);
        });
    });

    element.textContent = textContent;
    // @ts-ignore
    parent.appendChild(element);    
}