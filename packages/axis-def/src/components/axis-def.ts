import { ComponentBase, html, TemplateResult, property } from '@hmh/component-base/dist/index';
import * as d3 from 'd3';


enum Direction {
    X = 'X',
    Y = 'Y',
    Z = 'Z'
};

/**
 * `<axis-def>`
 * @demo ./demo/index.html
 */
export class AxisDef extends ComponentBase<string> {
    @property({ type: Array })
    private axes: HTMLElement[] = [];
    public shadowRoot: ShadowRoot;

    private graphSize: number = 500;
    private svgContainer: any = null;
    private renderedGraph: boolean = false;
    private axisSize: number = 25;

    /**
     * Return a d3.scale function
     * 
     * @param  {Direction} axis X or Y
     * @returns d3.ScaleLinear
     */
    private scale(axis: Direction, min: number, max: number ): d3.ScaleLinear<number, number> {
        const domain = [min, max];
        const range = (axis === Direction.X ? [0, this.graphSize] : [this.graphSize, 0]);

        return d3
        .scaleLinear()
        .domain(domain) // input
        .range(range); // output
    }

    private addAxis(axis: HTMLElement): void {
        const dir = axis.getAttribute('direction');
        var direction = (dir === 'x' ? Direction.X : dir === 'y' ? Direction.Y : Direction.Z);
        const min = axis.getAttribute('min');
        const max = axis.getAttribute('max');

        const scale = this.scale(direction, parseInt(min), parseInt(max));
        // Call the X and Y axes in a group tag
        const translationX = 'translate(0,' + (this.graphSize - this.axisSize) + ')';
        const translationY = 'translate(' + this.axisSize + ',0)';

        // Call the x axis in a group tag
        this.svgContainer
        .append('g')
        .attr('class', direction === Direction.X ? 'x-axis' : 'y-axis')
        .attr('transform', direction === Direction.X ? translationX : translationY)
        .call(direction === Direction.X ? d3.axisBottom(scale) : d3.axisLeft(scale)); // Create an axis component with d3.axisBottom
    }

    protected render(): TemplateResult {
        return html`
        <link rel="stylesheet" type="text/css" href="/dist/css/axis-def.css">
            <div id="canvas"></div>
        <slot hidden name="axis" class="axis" @slotchange=${(evt: Event) => this._onSlotChanged(evt)}> </slot>
        `;
    }

    /**
     * Called after rendering (graph and lines generated here).
     * 
     * @returns void
     */
    public updated(): void {
        if (!this.renderedGraph && this.axes.length > 0) {
            this.renderedGraph = true;
            this.svgContainer = d3
                .select(this.shadowRoot)
                .select('#canvas')
                .append('svg');

            this.svgContainer
            .attr('width', this.graphSize)
            .attr('height', this.graphSize)
            .append('g');

            this.axes.forEach((axis) => {                
                this.addAxis(axis);
            });
        }
    }
 
    /**
     * Fired on slot change
     * @param {Event} event
     */
    protected _onSlotChanged(event: Event): void {
        const slot: HTMLSlotElement = event.srcElement as HTMLSlotElement;
        if (slot) {
            const axes: HTMLElement[] = [];
            slot.assignedNodes().forEach(
                (el: HTMLElement): void => {
                    axes.push(el);
                }
            );

            this.axes = axes;
            console.log('axes:', this.axes);
        }
    }
}

customElements.define('axis-def', AxisDef);
