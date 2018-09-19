import { PlotGraph } from '../components/plot-graph';
import { checkComponentDOM } from './test-helpers';
// const expect: any = chai.expect;
const tagName: string = 'text-input';

describe(`<${tagName}>`, (): void => {
    it('should render default state', async (): Promise<void> => {
        withSnippet('default');
        const el: PlotGraph = document.querySelector('plot-graph') as any;
        await el.renderComplete;
        checkComponentDOM(el);
    });
});

mocha.run();
