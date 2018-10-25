import { ComponentBase, html, TemplateResult } from '@hmh/component-base';

/**
 * `<short-text>`
 * @demo ./demo/index.html
 */
export class ShortText extends ComponentBase<string> {
    public value: string = '';
    private quill: any;
    private formats: string[] =  ['header','bold','italic','underline','strike','blockquote','list','bullet','indent','link','image','formula'];
    private modules: object = { formula: true,
        toolbar: [
            [{ header: [1, 2, false] }],
            [
                'bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
            ['link', 'image'],
            ['clean'],
            ['formula',]
            ]
        };

    /**
     * @returns TemplateResult
     */
    protected render(): TemplateResult {
        return html`
        <link rel="stylesheet" type="text/css" href="/css/short-text.css">
        <link rel="stylesheet" type="text/css" href="katex/dist/katex.min.css">
        <link rel="stylesheet" type="text/css" href="quill/dist/quill.core.css">
        <link rel="stylesheet" type="text/css" href="quill/dist/quill.snow.css">
        <span class='editor-container'> </span>
        `;
    }

    protected firstUpdated(): void {
        this.quill = new Quill(this.shadowRoot.querySelector('.editor-container'), {
            debug: 'error',
            theme: 'snow',
            modules: this.modules,
            formats: this.formats
          });
        
        this.quill.on('text-change', this._textChanged.bind(this));
    }

    private _textChanged(): void {
        const deltas = this.quill.getContents();
        

        // update value each time and I suppose embed formulas in a tag (getText() does not include formulas)
        deltas.ops.forEach((delta: any) => {
            this.value += delta.insert.formula ? `<formula> ${delta.insert.formula} </formula>` : delta.insert;;
        });

        // console.log('deltas: ', deltas);
        // console.log('value:', this.value);

        dispatchEvent(
            new CustomEvent('change', {
                bubbles: true,
                composed: true,
                detail: {
                    value: this.value
                }
            }
        ));    
    }
}

customElements.define('short-text', ShortText);