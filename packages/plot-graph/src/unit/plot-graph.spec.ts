import { PlotGraph } from '../components/plot-graph';
import { checkComponentDOM } from './test-helpers';
// const expect: any = chai.expect;
const tagName: string = 'plot-graph';

describe(`<${tagName}>`, (): void => {
    it('should render default state', async (): Promise<void> => {
        withSnippet('default');
        const el: PlotGraph = document.querySelector('plot-graph') as any;
        await el.updateComplete;
        checkComponentDOM(el);
    });
});

mocha.run();
