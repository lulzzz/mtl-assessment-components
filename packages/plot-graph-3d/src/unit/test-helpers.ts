import { PlotGraph3D } from '../components/plot-graph-3d.js';

const expect: any = chai.expect;

export function checkComponentDOM(el: PlotGraph3D, params: { [key: string]: string | number | boolean } = {}): void {
    const shadowRoot: ShadowRoot = el.shadowRoot;
    expect(shadowRoot).not.to.be.null;
}