import { PlotGraph } from '../components/plot-graph';

const expect: any = chai.expect;

export function checkComponentDOM(el: PlotGraph, params: { [key: string]: string | number | boolean } = {}): void {
    const shadowRoot: ShadowRoot = el.shadowRoot;
    expect(shadowRoot).not.to.be.null;
}


export function generateOnSlotChangeEvent(el: PlotGraph): CustomEvent {
    const slot: HTMLElement = el.shadowRoot.querySelector('slot') as any;

    const evt = new CustomEvent('slotchange', {
        bubbles: true,
        composed: true,
        detail: {
            srcElement: slot
        }
    });

    return evt;
}