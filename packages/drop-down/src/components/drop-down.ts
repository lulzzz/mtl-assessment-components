import { applyMixins, ComponentBase, html, TemplateResult, Feedback, MultipleChoice, repeat, unsafeHTML } from '@hmh/component-base/dist/index';
import { ResponseValidation } from '@hmh/component-base/dist/components/response-validation';
import { FeedbackMessage } from '@hmh/component-base/dist/mixins/feedback';

/**
 * `<drop-down>`
 * A drop down menu that supports embedded HTML within its option elements.
 * Currently uses Set for value so option values must be unique.
 * @demo ./demo/index.html
 */
export class DropDown extends ComponentBase<string[]> implements Feedback, MultipleChoice {
    static get properties(): { [key: string]: string | object } {
        return {
            ...super.properties,
            open: Boolean,
            multiple: Boolean,
            items: Array,
            value: Object
        };
    }

    public open: boolean = false;
    public multiple: boolean = false;
    items: HTMLElement[] = [];
    private defaultTitle = 'Select an option';
    public value: string[] = [];

    // declare mixins properties to satisfy the typescript compiler
    _getFeedback: (value: string[]) => FeedbackMessage;
    _onFeedbackSlotChanged: (evt: Event) => void;
    _onSlotChanged: (event: Event) => void;
    _onItemClicked: (event: Event, selected: string, multiple?: boolean) => void;
    match: (el: ResponseValidation, response: string[]) => boolean;

    /**
     * Called when the drop down menu is clicked on.
     * Sets the menu state to open.
     *
     * @returns void
     */
    private _onDropDownClicked(): void {
        this.open = !this.open;
    }

    /**
     * Sets various accessibility attributes.
     *
     * @returns void
     */
    private _enableAccessibility(): void {
        this.setAttribute('role', 'popupbutton');
        this.setAttribute('aria-haspopup', 'true');
        this.setAttribute('aria-label', this.shadowRoot.querySelector('.drop-button').innerHTML);
    }

    /**
     * Called after each render (render called per relevant state change).
     *
     * @returns void
     */
    protected _didRender(): void {
        this._enableAccessibility();
    }

    /**
     * The template to render.
     *
     * @param  {Boolean} open - is the drop down open or not
     * @param  {FeedbackMessage} feedbackMessage - message and feedback type (can be null)
     * @param  {Array of HTMLElement} items - the option items
     * @param  {Array of String} value - the value of this element (currently selected item(s))
     *
     * @returns TemplateResult
     */
    protected _render({ open, feedbackMessage, items, multiple, value }: DropDown): TemplateResult {
        return html`
        <link rel="stylesheet" type="text/css" href="/dist/css/drop-down.css">
        
        <div class$="container ${this._getFeedbackClass(feedbackMessage, false)}">
            <div class="dropdown">
                <div class="buttons-container">
                    <button class="drop-button" on-click="${(evt: Event) => this._onDropDownClicked()}">${
            value.length > 0 ? [...value].join(',') : this.defaultTitle
        }</button>
                    <button class="nav-button" on-click="${(evt: Event) => this._onDropDownClicked()}">${open ? html`&uarr;` : html`&darr;`}</button>
                </div>
            </div>
                
            <div class="dropdown-content" hidden="${!open}">
                ${repeat(
                    items,
                    (item: HTMLElement) => item.id,
                    (item: HTMLElement, index: number) => html`
                    <div class="options">
                        <div class$="option-item ${value.includes(item.id) ? 'selected' : ''}" aria-selected$="${value.includes(item.id)}" id$="${
                        item.id
                    }" tabindex$="${index + 1}" role="button" on-click="${(evt: MouseEvent) => this._onItemClicked(evt, item.id, multiple)}"> 
                            ${unsafeHTML(item.innerHTML)}
                        </div>
                    </div>
                `
                )}
            </div>
            
            <span class$="feedback-message ${this._getFeedbackClass(feedbackMessage, true)}">${feedbackMessage ? feedbackMessage.message : ''}</span>
        
        </div>
        
        <slot name="options" class="options" on-slotchange="${(evt: Event) => this._onSlotChanged(evt)}" hidden> </slot>
        <slot name="feedback" class="feedback-values" on-slotchange="${(evt: Event) => this._onFeedbackSlotChanged(evt)}"></slot>`;
    }

    /**
     * Get feedback classes for UI depending upon feedbackMessage.type
     *
     * @param  {FeedbackMessage} feedbackMessage
     * @returns String
     */
    private _getFeedbackClass(feedbackMessage: FeedbackMessage, isContainer: boolean): string {
        if (!feedbackMessage) {
            return '';
        }

        return isContainer ? `feedback-${feedbackMessage.type}-background` : `feedback-${feedbackMessage.type}-border`;
    }
}

applyMixins(DropDown, [MultipleChoice, Feedback]);

customElements.define('drop-down', DropDown);
