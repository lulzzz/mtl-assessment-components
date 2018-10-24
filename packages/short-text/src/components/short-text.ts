import { ComponentBase, html, TemplateResult } from '@hmh/component-base';

/**
 * `<short-text>`
 * @demo ./demo/index.html
 */
export class ShortText extends ComponentBase<string> {
    public value: string = '';
    private quill: any;

    /**
     * @returns TemplateResult
     */
    protected render(): TemplateResult {
        return html`
        <link rel="stylesheet" type="text/css" href="/css/short-text.css">
        <link rel="stylesheet" type="text/css" href="quill/dist/quill.core.css">
        <link rel="stylesheet" type="text/css" href="quill/dist/quill.snow.css">
        <span class='editor-container'> </span>
        `;
    }

    protected firstUpdated(): void {
        this.quill = new Quill(this.shadowRoot.querySelector('.editor-container'), {
            formula: true,
            debug: 'warn',
            modules: { toolbar: [ ['formula']]},
            theme: 'snow'
        });
        
        this.quill.on('text-change', () => {
            const contents = this.quill.getContents();
            // set value to the last formula entered
            contents.ops.forEach((el: any) => {
                this.value = el.insert.formula ? el.insert.formula : this.value;
            });
    
            console.log('value:', this.value);       
        });
    }
}

customElements.define('short-text', ShortText);