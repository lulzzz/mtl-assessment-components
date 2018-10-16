import { html, TemplateResult, property, ComponentBase, CoordinateSystem } from '@hmh/component-base';
import { select } from 'd3-selection';
import { color } from 'd3-color';
import { scaleLinear } from 'd3-scale';
import { _3d } from 'd3-3d/index.js'
import { line, Line } from 'd3-shape';

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

        const aspect = 1;
        const canvas = this.shadowRoot.getElementById('canvas');

        const width = canvas.clientWidth;
        const height = Math.round(width / aspect);

        this.svgContainer = select(this.shadowRoot)
            .select('#canvas')
            .append('svg')
            .attr('preserveAspectRatio', 'xMinYMin meet')
            .attr('viewBox', `0 0 ${width} ${height}`)
            .classed('svg-content', true)
            .style('width', '100%') 
            .style('height', '100%')
            .append('g');

        this.draw3dTriange();
    }

    private drawShapes(): void {

        const drawRect = (data: object) => {
            const barHeight = 20;
            const rect = this.svgContainer.selectAll('rect').data(data);

            rect
                .enter()
                .append('rect')
                .attr('width', function(d: any) {  return d; })
                .attr('height', barHeight)

            rect.exit().remove();
        }

        drawRect([100]);

        const drawTriangle = (data: object) => {
            var scaleX = scaleLinear().range([0, 500]);
            var scaleY = scaleLinear().range([500, 0]);

            scaleX.domain([0, 50]);
            scaleY.domain([0, 50]);

            const triangle = this.svgContainer.selectAll('polygon').data(data);

            triangle
                .enter()
                .append('polygon')
                .attr("points", function(d: any) {
                    return Object.keys(d).map(key => {
                        return [scaleX(d[key]),scaleY(d[key])].join(",");
                    }).join(" ");
                });

            triangle.exit().remove();
        }

        const triangleData = [{"x":10, "y":50},
                        {"x":20,"y":20},
                        {"x":50,"y":10},
                        {"x":30,"y":30}];

        // drawTriangle(triangleData);
    }

    private draw3dTriange(): void {
        const data3D = [ [[0,-1,0],[-1,1,0],[1,1,0]] ];

        const triangles3D = _3d()
            .scale(100)
            .origin([480, 250])
            .shape('TRIANGLE');
        
            const projectedData = triangles3D(data3D);
        
        const scaleX = scaleLinear().range([0, 500]);
        const scaleY = scaleLinear().range([500, 0]);

        scaleX.domain([0, 50]);
        scaleY.domain([0, 50]);

        const init = (data: any) => {
            const triangles = this.svgContainer.selectAll('path').data(data);

            triangles
            .enter()
            .append('path')     
            .attr('class', 'line') // Assign a class for styling
            .attr('d', this.drawLine(scaleX, scaleY)) // Calls the line generator
            .style('stroke', 'red');

            triangles.exit().remove();        
        }

        init(projectedData);
    }

    // https://bl.ocks.org/niekes/5e1254ae778e2854f0079350a0376528
    private draw3dTriangeB(): void {
        const data = [[{x:-1,y:-1,z:-1},{x:0,y:1,z:0},{x:1,y:-1,z:-1}],[{x:-1,y:-1,z:1},{x:0,y:1,z:0},{x:1,y:-1,z:1}],[{x:-1,y:-1,z:1},{x:0,y:1,z:0},{x:-1,y:-1,z:-1}],[{x:1,y:-1,z:1},{x:0,y:1,z:0},{x:1,y:-1,z:-1}]]
        const origin = [250, 250];
        const startAngle = Math.PI/8;

            const threeD = _3d()
                .scale(100)                         
               // .distance(3)                      //distance function is missing from 3d.js
               //.projection()             //projection function is missing from 3d.js
                .rotateY(startAngle)
                .origin(origin)
               // .primitiveType('TRIANGLES');      //primitiveType function is missing from 3d.js
            
            const data3D = threeD(data);

            _3d().projection = this.perpective; //hack
            _3d().primitiveType = 'TRIANGLES';  //hack

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
            }

            processData(data3D);
    }

    /**
     * @param  {d3.ScaleLinear<number, number>} xScale
     * @param  {d3.ScaleLinear<number, number>} yScale
     * @returns Returns a D3 line defined by xScale and yScale
     */
    private drawLine(xScale: d3.ScaleLinear<number, number>, yScale: d3.ScaleLinear<number, number>): Line<any> {
        return line()
            .x(function(d: any, i: any) {
                return xScale(i);
            }) // set the x values for the line generator
            .y(function(d: any) {
                return yScale(d.y);
            }) // set the y values for the line generator
    }


    private perpective(t: any, e: any, r: any, n: any, o: any) {
        return {
            x: r[0] + n * t.x / (t.z + o),
            y: r[1] + n * t.y / (t.z + o)
        }
    }
}

customElements.define('plot-graph', PlotGraph);
