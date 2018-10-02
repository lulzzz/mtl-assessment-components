import { PlotGraph } from '../components/plot-graph';
import { checkComponentDOM, getLines } from './test-helpers';
// const expect: any = chai.expect;
const tagName: string = 'plot-graph';
const expect: any = chai.expect;

describe(`<${tagName}>`, (): void => {
    it('should render default state', async (): Promise<void> => {
        withSnippet('default');
        const el: PlotGraph = document.querySelector('plot-graph') as any;
        // @ts-ignore
        await el.updateComplete;
        checkComponentDOM(el);
    });

    it('should update equations from slot elements', async (): Promise<void> => {
        withSnippet('default');
        const el: PlotGraph = document.querySelector('plot-graph') as any;
        // @ts-ignore
        await el.updateComplete;
        // @ts-ignore
        const equation = el.equations[0];
        expect(equation.innerHTML).to.equal('Math.sin(x/30)');
    });
});

mocha.run();
