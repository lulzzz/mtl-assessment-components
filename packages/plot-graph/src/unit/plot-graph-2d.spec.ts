import { PlotGraph } from '../components/plot-graph.js';
import { checkComponentDOM } from './test-helpers.js';
import { scaleLinear } from 'd3-scale';
const tagName: string = 'plot-graph';
const expect: any = chai.expect;

export default () => {
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
            const equation = el.equationItems[0];
            expect(equation.innerText.trim()).to.equal('Math.sin(x/30)');
        });

        it('should render a line per equation', async (): Promise<void> => {
            withSnippet('three-equations');
            const el: PlotGraph = document.querySelector('plot-graph') as any;
            var lineCount: number = 0;
            // @ts-ignore
            el.drawLine = function (xScale: d3.ScaleLinear<number, number>, yScale: d3.ScaleLinear<number, number>): d3.Line<any> {
                lineCount++;
            };

            // @ts-ignore
            await el.updateComplete;

            expect(lineCount).to.equal(3);
        });

        it('should set equations in response to a slot change event', async (): Promise<void> => {
            withSnippet('no-equations');
            const el: PlotGraph = document.querySelector('plot-graph') as any;
            const equation: string = 'Math.sin(x/30)';
            const optionElement: HTMLElement = document.createElement('div');
            optionElement.setAttribute('slot', 'equation-items');
            optionElement.innerHTML = equation;
            // @ts-ignore
            el.appendChild(optionElement);

            // @ts-ignore
            await el.updateComplete;
            // @ts-ignore
            expect(el.equationItems.length).to.equal(1);
            // @ts-ignore
            expect(el.equationItems[0].innerHTML).to.equal(equation);
        });

        it('should set coordinate system axis in response to a slot change event', async (): Promise<void> => {
            withSnippet('no-axis');
            const el: PlotGraph = document.querySelector('plot-graph') as any;
            const expectedInnerHTML = '<p>i am the expected axis</p>'
            const axisElement: HTMLElement = document.createElement('div');
            axisElement.setAttribute('slot', 'axis');
            axisElement.setAttribute('color', 'red');
            axisElement.setAttribute('direction', 'x');
            axisElement.setAttribute('min', '-5');
            axisElement.setAttribute('max', '5');
            axisElement.innerHTML = expectedInnerHTML;

            const coordSystemElem: HTMLElement = document.createElement('coordinate-system');
            coordSystemElem.setAttribute('slot', 'graph-axis');
            coordSystemElem.appendChild(axisElement);
            // @ts-ignore
            await el.updateComplete;
            // @ts-ignore
            el.appendChild(coordSystemElem);
            // @ts-ignore
            await el.updateComplete;
            // @ts-ignore
            expect(el.axes.length).to.equal(1);
            // @ts-ignore
            expect(el.axes[0].innerHTML).to.equal(expectedInnerHTML);
        });

        it('drawLine should return x and y', async (): Promise<void> => {
            withSnippet('no-equations');

            const domain = [0, 1];
            const range = [0, 10];
            const scale = scaleLinear()
                .domain(domain) // input
                .range(range); // output

            const el: PlotGraph = document.querySelector('plot-graph') as any;
            // @ts-ignore
            await el.updateComplete;
            // @ts-ignore
            const lineX = el.drawLine(scale, scale).x();
            // @ts-ignore
            const lineY = el.drawLine(scale, scale).y();
            expect(lineX).to.not.be.null;
            expect(lineY).to.not.be.null;
        });

        it('scale should return domain and range', async (): Promise<void> => {
            withSnippet('no-equations');

            const el: PlotGraph = document.querySelector('plot-graph') as any;
            // @ts-ignore
            await el.updateComplete;
            // @ts-ignore
            const testScale = el.scale('X', 0, 100, 100);

            expect(testScale).to.not.be.null;
        }); 

    });
}
