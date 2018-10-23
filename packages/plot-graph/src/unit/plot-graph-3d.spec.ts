import { PlotGraph3D } from '../components/plot-graph-3d.js';
import { checkComponentDOM, checkFirstEquation, addEquation, addAxis } from './test-helpers.js';
const tagName: string = 'plot-graph-3d';
const expect: any = chai.expect;

export default () => {
    describe(`<${tagName}>`, (): void => {
        it('should render default state (3d)', async (): Promise<void> => {
            withSnippet('default-3d');
            const el: PlotGraph3D = document.querySelector(tagName) as any;
            // @ts-ignore
            await el.updateComplete;
            checkComponentDOM(el);
        });

        it('should update equations from slot elements', async (): Promise<void> => {
            withSnippet('default-3d');
            const el: PlotGraph3D = document.querySelector(tagName) as any;
            // @ts-ignore
            await el.updateComplete;
            // @ts-ignore
            checkFirstEquation(el, 'Math.sin(x/50) * Math.cos(y/50) * 50 + 50' );
        });

        it('should set equations in response to a slot change event', async (): Promise<void> => {
            withSnippet('3d-no-equations');
            const el: PlotGraph3D = document.querySelector(tagName) as any;
            const equation: string = 'Math.sin(x/30)';
            addEquation(el, equation, [{key :'equation-xmin', value : '0'}, {key :'equation-xmax', value : '360'}, {key :'equation-ymin', value : '0'}, {key :'equation-ymax', value : '360'},{key :'step', value : '10'},]);
            // @ts-ignore
            await el.updateComplete;
            // @ts-ignore
            checkFirstEquation(el, equation);
        });

        it('should set coordinate system axis in response to a slot change event', async (): Promise<void> => {
            withSnippet('3d-no-axis');
            const el: PlotGraph3D = document.querySelector(tagName) as any;
            const coordSystemElem: HTMLElement = document.createElement('coordinate-system');
            coordSystemElem.setAttribute('slot', 'graph-axis');
            addAxis(coordSystemElem, 'x', [{key :'color', value : 'red'}, {key :'direction', value : 'x'}, {key :'min', value : '0'}, {key :'max', value : '360'}]);
            await el.updateComplete;
            // @ts-ignore
            el.appendChild(coordSystemElem);
            // @ts-ignore
            await el.updateComplete;
            // @ts-ignore
            expect(el.axes.length).to.equal(1);
            // @ts-ignore
            expect(el.axes[0].innerHTML).to.equal('x');
        });

        it('should render a graph', async (): Promise<void> => {
            withSnippet('default-3d');
            const el: PlotGraph3D = document.querySelector(tagName) as any;
            // @ts-ignore
            await el.updateComplete;
            const shadowRoot = el.shadowRoot;
            const canvas = shadowRoot.querySelector('canvas');
            // @ts-ignore
            await el.updateComplete;
            expect(canvas.firstChild).to.not.be.null;
        });
    });
}
