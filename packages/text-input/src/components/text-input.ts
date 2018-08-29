import { applyMixins, ComponentBase, Feedback, html, TemplateResult } from '@hmh/component-base/dist/index';
import { MDCTextField } from '@material/textfield/index';

export class TextInput extends ComponentBase implements Feedback {
    public feedbackText: string = '';
    public placeholder: string = '';
    public value: string = '';

    // declare mixins properties to satisfy the typescript compiler
    public showFeedback: () => void;

    static get properties(): { [key: string]: string | object } {
        return {
            ...ComponentBase.baseProperties,
            feedbackText: String,
            placeholder: String,
            value: String
        };
    }

    protected _render({ disabled, feedbackText, placeholder, value }: TextInput): TemplateResult {
        return html`
        <link rel="stylesheet" type="text/css" href="/node_modules/@material/textfield/dist/mdc.textfield.css">
        <link rel="stylesheet" type="text/css" href="/dist/css/text-input.css">
        <div class$="mdc-text-field mdc-text-field--outlined ${disabled ? 'mdc-text-field--disabled' : ''}">
            <input 
                disabled=${disabled}
                type="text" 
                id="tf-outlined" 
                class="mdc-text-field__input" 
                value="${value}" 
                placeholder="${placeholder}" 
                on-change="${(evt: Event) => this.onInputChange(evt)}" />
            <div class="mdc-notched-outline">
                <svg>
                <path class="mdc-notched-outline__path"/>
                </svg>
            </div>
            <div class="mdc-notched-outline__idle"></div>
        </div>
        <span>${feedbackText}</span>
        <slot on-slotchange="${(evt: Event) => this.onSlotChanged(evt)}"></slot>
        `;
    }

    protected _didRender(): void {
        MDCTextField.attachTo(this.shadowRoot.querySelector('.mdc-text-field'));
        this.enableAccessibility();
    }

    private onInputChange(evt: Event): void {
        evt.stopPropagation();
        this.value = (evt.target as HTMLInputElement).value;

        this.dispatchEvent(
            new CustomEvent('change', {
                bubbles: true,
                composed: true,
                detail: {
                    value: this.value
                }
            })
        );
    }

    private enableAccessibility(): void {
        this.setAttribute('role', 'textbox');
        this.setAttribute('aria-placeholder', this.placeholder);
        this.setAttribute('aria-label', this.value || this.placeholder);
    }

    private onSlotChanged(event: Event) {
        event.stopPropagation();

        console.log('slot changed');
        const slot: HTMLSlotElement = event.srcElement as HTMLSlotElement;
        if (slot) {
            const nodes: Node[] = slot.assignedNodes();
            if (nodes) {
                const feedbackItems: HTMLElement[] = [];
                for (const el of nodes as HTMLElement[]) {
                    if (el && el.tagName) {
                        console.log('TEXT_INPUT', el);
                        feedbackItems.push(el);
                    }
                }
            }
        }
    }
}

applyMixins(TextInput, [Feedback]);

customElements.define('text-input', TextInput);
