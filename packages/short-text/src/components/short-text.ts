import { ComponentBase, html, TemplateResult } from '@hmh/component-base';
/*
import Quill from 'quill/core'
import Toolbar from 'quill/modules/toolbar';
import Snow from 'quill/themes/snow';

import Bold from 'quill/formats/bold';
import Italic from 'quill/formats/italic';
import Header from 'quill/formats/header';
*/

/**
 * `<short-text>`
 * @demo ./demo/index.html
 */
export class ShortText extends ComponentBase<string> {
    public value: string;

    /**
     * @returns TemplateResult
     */
    protected render(): TemplateResult {
        return html`
        <link rel="stylesheet" type="text/css" href="/css/short-text.css">
        <link rel="stylesheet" type="text/css" href="quill/dist/quill.core.css">
        <link rel="stylesheet" type="text/css" href="quill/dist/quill.snow.css">
        <span class='quill-container'> </span>
        `;
    }

    /**
     * Called after each render
     *
     * @returns void
     */
    protected updated(): void {
        const options = {
            debug: 'info',
            modules: {
              toolbar: [
                [{ header: [1, 2, false] }],
                ['bold', 'italic', 'underline'],
                ['image', 'code-block']
              ]
            },
            placeholder: 'placeholder!',
            readOnly: false,
            theme: 'snow'
        };

        const container = this.shadowRoot.querySelector('.quill-container');
        new Quill(container, options);
    }
}

customElements.define('short-text', ShortText);