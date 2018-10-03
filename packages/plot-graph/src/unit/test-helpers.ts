import { PlotGraph } from '../components/plot-graph';

const expect: any = chai.expect;

export function checkComponentDOM(el: PlotGraph, params: { [key: string]: string | number | boolean } = {}): void {
    const shadowRoot: ShadowRoot = el.shadowRoot;
    expect(shadowRoot).not.to.be.null;
}