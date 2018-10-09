import { PlotGraph } from '../components/plot-graph.js';
import { checkComponentDOM } from './test-helpers.js';
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
        const equation = el.items[0];
        expect(equation.innerHTML).to.equal('Math.sin(x/30)');
    });

    it('should render a line per equation', async (): Promise<void> => {
        withSnippet('three-equations');
        const el: PlotGraph = document.querySelector('plot-graph') as any;
        await el.updateComplete;
        var lineCount: number = 0;
        
        // @ts-ignore
        el.drawLine = function (xScale: any, yScale: any): d3.Line<any> {
            lineCount++;
        };

        await el.updateComplete;

        expect(lineCount).to.equal(3);
    });

    it('should set equations in response to a slot change event', async (): Promise<void> => {
        withSnippet('no-equations');
        const el: PlotGraph = document.querySelector('plot-graph') as any;
        const equation: string = 'Math.sin(x/30)';
        const optionElement: HTMLElement = document.createElement('div');
        optionElement.setAttribute('slot', 'options');
        optionElement.innerHTML = equation;
        el.appendChild(optionElement);
        await el.updateComplete;
        // @ts-ignore
        expect(el.items.length).to.equal(1);
        // @ts-ignore
        expect(el.items[0].innerHTML).to.equal(equation);
    });
});

mocha.run();
