import { PlotGraph3D } from '../components/plot-graph-3d.js';
import { checkComponentDOM } from './test-helpers.js';
const tagName: string = 'plot-graph-3d';
// const expect: any = chai.expect;

export default () => {
    describe(`<${tagName}>`, (): void => {
        it.only('should render default state (3d)', async (): Promise<void> => {
            withSnippet('default-3d');
            const el: PlotGraph3D = document.querySelector(tagName) as any;
            // @ts-ignore
            await el.updateComplete;
            checkComponentDOM(el);
        });
    });
}
