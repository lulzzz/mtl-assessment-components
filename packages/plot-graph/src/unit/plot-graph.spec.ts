import { PlotGraph } from '../components/plot-graph';
import { checkComponentDOM, generateOnSlotChangeEvent } from './test-helpers';
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

    it('should render a line per equation', async (): Promise<void> => {
        withSnippet('three-equations');
        const el: PlotGraph = document.querySelector('plot-graph') as any;
        await el.updateComplete;
        var lineCount: number = 0;
        
        // @ts-ignore
        el.generateLine = function (xScale: any, yScale: any): d3.Line<any> {
            lineCount++;
        };

        await el.updateComplete;

        expect(lineCount).to.equal(3);
    });

    it('should set equations in response to a slot change event', async (): Promise<void> => {
        withSnippet('default');
        const el: PlotGraph = document.querySelector('plot-graph') as any;
        
        await el.updateComplete;
        // @ts-ignore
        el._onSlotChanged(generateOnSlotChangeEvent(el));
        await el.updateComplete;
        // @ts-ignore
        expect(el.equations).to.not.equal(null);
    });
});

mocha.run();
