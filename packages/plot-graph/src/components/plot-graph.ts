import { html, TemplateResult, property, ComponentBase, CoordinateSystem } from '@hmh/component-base';
import { select } from 'd3-selection';
import { color } from 'd3-color';
import { _3d } from 'd3-3d/index.js'

/**
 * `<plot-graph>`
 * Plot a graph using component-base CoordinateSystem to define the axes and equation-items for the equations
 *
 * equationXmin etc are variables the bound the range of the equations (independently of the axis dimensions)
 * step - the intervals at which points are plotted along the equation graphs
 * @demo ./demo/index.html
 *
 */
export class PlotGraph extends ComponentBase<any> {
    private axes: any[] = [];
    protected svgContainer: any = null;
    @property({ type: Array })
    protected equationItems: HTMLElement[] = [];

    protected render(): TemplateResult {
        return html`
        <link rel="stylesheet" type="text/css" href="/css/plot-graph.css">

        <div class="container">
            <div id="canvas"></div>
        </div>

        <slot hidden name="graph-axis" @slotchange=${(evt: Event) => this._onCoordSystemAdded(evt)}> </slot>
        <slot hidden name="equation-items" class="equations" @slotchange=${(evt: Event) => this._onSlotChanged(evt)}> </slot>
        `;
    }

    /**
     * Fired when equations are added
     *
     * Fired on slot change
     * @param {Event} event
     */
    protected _onSlotChanged(event: Event): void {
        const slot: HTMLSlotElement = event.srcElement as HTMLSlotElement;
        if (slot) {
            const equationItems: HTMLElement[] = [];
            slot.assignedNodes().forEach(
                (el: HTMLElement): void => {
                    equationItems.push(el);
                }
            );

            this.equationItems = equationItems;
            // this.drawGraph();     
        }
    }

    /**
     * A Coordinate System contains axis
     *
     * @param  {Event} event
     * @returns void
     */
    private _onCoordSystemAdded(event: Event): void {
        const slot: HTMLSlotElement = event.srcElement as HTMLSlotElement;
        if (slot) {
            slot.assignedNodes().forEach(
                (coordSystem: CoordinateSystem): void => {
                    coordSystem.getValue().forEach((axis: any) => {
                        this.axes.push(axis);
                    });
                }
            );
        }
        // in case axes are added after the equations
        //this.drawGraph();
        this.drawGrid();
    }

    private drawGrid(): void {
        const aspect = 1;
        const canvas = this.shadowRoot.getElementById('canvas');
        const width = canvas.clientWidth;
        const height = Math.round(width / aspect);
        const data = [[{x:-1,y:-1,z:-1},{x:0,y:1,z:0},{x:1,y:-1,z:-1}],[{x:-1,y:-1,z:1},{x:0,y:1,z:0},{x:1,y:-1,z:1}],[{x:-1,y:-1,z:1},{x:0,y:1,z:0},{x:-1,y:-1,z:-1}],[{x:1,y:-1,z:1},{x:0,y:1,z:0},{x:1,y:-1,z:-1}]]
        const origin = [480, 250];
        const startAngle = Math.PI/8;

        this.svgContainer = select(this.shadowRoot)
            .select('#canvas')
            .append('svg')
            .attr('preserveAspectRatio', 'xMinYMin meet')
            .attr('viewBox', `0 0 ${width} ${height}`)
            .classed('svg-content', true)
            .style('width', '100%')
            .style('height', '100%')
            .append('g');

            console.log('_3d(): ', _3d());

            console.log('threeDeee scale: ', _3d().scale(2));
            // console.log('threeDeee distance: ', threeDeee.distance(3));
            // console.log('threeDeee projection: ', threeDeee.projection('persp'));
            console.log('threeDeee rotateY: ', _3d().rotateY(startAngle));
            console.log('threeDeee origin: ', _3d().origin(origin));
            // console.log('threeDeee primitiveType: ', threeDeee.primitiveType('TRIANGLES'));

            const threeD = _3d()
                .scale(100)                         
               // .distance(3)                      //distance function is missing from 3d.js
               // .projection('persp')              //projection function is missing from 3d.js
                .rotateY(startAngle)
                .origin(origin)
               // .primitiveType('TRIANGLES');      //primitiveType function is missing from 3d.js
            
            const data3D = threeD(data);

            const processData = (data: object) => {
                const triangles = this.svgContainer.selectAll('path').data(data);

                triangles
                    .enter()
                    .append('path')
                    .merge(triangles)
                    .attr('stroke', color('black'))
                    .attr('fill', 'none')
                    .attr('d', _3d.draw);

                triangles.exit().remove();

                this.svgContainer
                .append('path')
                .datum(triangles) // inds data to the line;
            }

            processData(data3D);
    }
}

customElements.define('plot-graph', PlotGraph);
