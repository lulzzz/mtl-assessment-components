import { PlotGraph3D } from '../components/plot-graph-3d.js';
import { checkComponentDOM } from './test-helpers.js';
const tagName: string = 'plot-graph-3d';
// const expect: any = chai.expect;

describe(`<${tagName}>`, (): void => {
    it('should render default state (3d)', async (): Promise<void> => {
        withSnippet('default');
        const el: PlotGraph3D = document.querySelector('plot-graph-3d') as any;
        // @ts-ignore
        await el.updateComplete;
        checkComponentDOM(el);
    });
});

mocha.run();