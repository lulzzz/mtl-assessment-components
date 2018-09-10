import { applyMixins, ComponentBase, html, TemplateResult, Feedback, Strategy } from '@hmh/component-base/dist/index';
import { ResponseValidation, FeedbackMessage } from '@hmh/component-base/dist/components/response-validation';

/**
 * `<drop-down>`
 * A drop down menu that supports embedded HTML within its option elements.
 * Currently uses Set for value so option values must be unique.
 * @demo ./demo/index.html
 */
export class DropDown extends ComponentBase<Set<string>> implements Feedback{
    /**
     * open - is the drop down open.
     * multiple = is this muli select?
     * feedbackMessage
     * 
     * @returns string
     */                      
    static get properties(): { [key: string]: string | object } {
        return {
            ...ComponentBase.baseProperties,
            open: Boolean,
            multiple: Boolean,
            feedbackMessage: Object
        };
    }


    public value: Set<string> = new Set;
    public open: boolean = false;
    public multiple: boolean = false;
    private defaultTitle = 'Dropdown';
    private feedbackMessage: FeedbackMessage;
    private currentOptionIndex: number = -1;

    // declare mixins properties to satisfy the typescript compiler
    public _getFeedback: (value: Set<string>) => FeedbackMessage;
    public _responseValidationElements: ResponseValidation[];
    public _onFeedbackSlotChanged: any;

    public match: (el: ResponseValidation, response: Set<string>) => boolean = (el, response) => {

        if (!el.getExpected()) {
            // catch-all clause
            return true;
        }

        let equals: boolean = false;
        console.log('el.strategy: ', el.strategy);

        switch (el.strategy) {
            case Strategy.EXACT_MATCH:
                console.log('EXACT_MATCH: strategy');
                equals = response.size === el.getExpected().size;
                response.forEach((r: any) => {
                    equals = equals && el.getExpected().has(r);
                });
                return equals;
            case Strategy.FUZZY_MATCH:
                console.log('FUZZY_MATCH: strategy');
                equals = true;
                response.forEach((r: any) => {
                    equals = equals || el.getExpected().has(r);
                });
                return equals;
            default:
                console.log('default strategy');
                return false;
        }
    };
    
    /**
     * gets the FeedbackMessage message object for the current value
     * 
     * @returns FeedbackMessage
     */
    public getFeedback(): FeedbackMessage {
        return this._getFeedback(this.getValue());
    }

    public onFeedbackSlotChanged(evt: any): any {
        return this._onFeedbackSlotChanged(evt);
    }

    /**
     * Set the element feedbackMessage to update the rendered content
     * 
     * @returns void
     */
    public showFeedback(): void {
        this.feedbackMessage = this.getFeedback();
    }

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
     * Called when an option item is selected.
     * Sets the element value to that of the selected element.
     * 
     * @param  {HTMLElement} eventTarget
     * @returns void
     */
    private _onItemClicked(eventTarget: HTMLElement): void {
        if (eventTarget.hasAttribute('slot')) {
            const selectedValue = eventTarget.getAttribute('value');

            if (this.multiple) {
                if (this.value.has(selectedValue)) {
                    this._deselectElement(selectedValue, eventTarget);
                } else {
                    this._selectElement(selectedValue, eventTarget);
                }
            } else {
                if (this.currentOptionIndex > -1) {
                    this._deselectElement([...this.getValue()].pop(), this._getOptionElement(this.currentOptionIndex));
                }

                this._selectElement(selectedValue, eventTarget);
            }

            const strValue = [...this.value].toString();
            this.shadowRoot.querySelector('.drop-button').innerHTML = strValue ? strValue : this.defaultTitle;

            this.dispatchEvent(
                new CustomEvent('change', {
                    bubbles: true,
                    composed: true,
                    detail: {
                        value: [...this.value]
                    }
                })
            );
        }
    }

    /**
     * Select an options element. Behavior depends upon this.multiple
     * 
     * @param  {string} selectedValue
     * @param  {HTMLElement} eventTarget
     * @returns void
     */
    private _selectElement(selectedValue: string, eventTarget: HTMLElement) : void {
        this._clearAriaSelections();
        
        if (!this.multiple) {
            this.value.clear();
        }

        eventTarget.classList.add('selected');
        eventTarget.setAttribute('aria-selected', 'true');
        this.value.add(selectedValue);
        this.currentOptionIndex = Number(eventTarget.getAttribute('index'));
    }

    /**
     * Unselect an options element. Behavior depends upon this.multiple
     * 
     * @param  {string} selectedValue
     * @param  {HTMLElement} eventTarget
     * @returns void
     */
    private _deselectElement(selectedValue: string, eventTarget: HTMLElement) : void {
        this.value.delete(selectedValue);
        eventTarget.classList.remove('selected');
        eventTarget.setAttribute('aria-selected', 'false');
    }

    private _getOptionElement(optionIndex: number) : HTMLElement {
        const slot = this.shadowRoot.querySelector('slot') as HTMLSlotElement;
        return slot.assignedNodes()[optionIndex] as HTMLElement;
    }

    /**
     * Set all the option items 'aria-selected' attributes to false.
     * 
     * @returns void
     */
    private _clearAriaSelections(): void {
        const slot = this.shadowRoot.querySelector('slot') as HTMLSlotElement;
        if (slot) {
            const nodes: Node[] = slot.assignedNodes();
            if (nodes) {
                nodes.forEach((el: HTMLElement, index: number) => {
                    el.setAttribute('aria-selected', 'false');
                });
            }
        }       
    }

    /**
     * Used to set tabindex and role to option items (for accessibility).
     * 
     * @param  {Event} evt
     * @returns void
     */
    private _onSlotChanged(evt: Event): void {
        const slot: HTMLSlotElement = evt.srcElement as HTMLSlotElement;
        if (slot) {
            const nodes: Node[] = slot.assignedNodes();
            if (nodes) {
                nodes.forEach((el: HTMLElement, index: number) => {
                    el.setAttribute('index', String(index));
                    el.setAttribute('tabindex', String(++index));
                    el.setAttribute('role', 'button');
                });
            }
        }
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
        this.setAttribute('value', [...this.value].toString());
    }
    
    /**
     * The template to render.
     * 
     * @param  {} {open - is the drop down open or not
     * @param  {DropDown} value} - the value of the element (value of the currently selected option(s))
     * @returns TemplateResult
     */
    protected _render({ open, value, multiple, feedbackMessage }: DropDown): TemplateResult {
        return html`
        <link rel="stylesheet" type="text/css" href="/dist/css/drop-down.css">
        
        <div class$="container ${this._getContainerClass(feedbackMessage)}">
            <div class="dropdown" value="${value}">
                <div class="buttons-container">
                    <button class="drop-button" on-click="${(evt: Event) => this._onDropDownClicked()}">Dropdown</button>
                    <button class="nav-button" on-click="${(evt: Event) => this._onDropDownClicked()}">${ open ? html`&uarr;` : html`&darr;` }</button>
                </div>
                <div class="dropdown-content" hidden="${!open}">
                    <slot name="options" class="options" 
                    on-click="${(evt: MouseEvent) => this._onItemClicked(evt.target as HTMLElement)}"
                    on-slotchange="${(evt: Event) => this._onSlotChanged(evt)}"> </slot>
                </div>
            </div>

            <span class$="feedback-message ${this._getFeedbackClass(feedbackMessage)}">${ feedbackMessage ? feedbackMessage.message : ''}</span>

        </div>
        <slot name="feedback" class="feedback-values" on-slotchange="${(evt: Event) => this._onFeedbackSlotChanged(evt)}"></slot>`;
    }

    /**
     * Get container class for UI depending upon feedbackMessage.type
     * 
     * @param  {FeedbackMessage} feedbackMessage
     * @returns String
     */
    private _getContainerClass(feedbackMessage: FeedbackMessage) : String {
        let result = '';

        if (feedbackMessage) {
            result = feedbackMessage.type === 'positive' ? 'feedback-positive-border' : feedbackMessage.type === 'negative' ? 'feedback-negative-border'      
                : 'feedback-neutral-border';
        }

        return result;
    }

    /**
     * Get feedback class for UI depending upon feedbackMessage.type
     * 
     * @param  {FeedbackMessage} feedbackMessage
     * @returns String
     */
    private _getFeedbackClass(feedbackMessage: FeedbackMessage) : String {
        let result = '';

        if (feedbackMessage) {
            result = feedbackMessage.type === 'positive' ? 'feedback-positive-background' : feedbackMessage.type === 'negative' ? 'feedback-negative-background'      
                : 'feedback-neutral-background';
        }

        return result;
    }
}

applyMixins(DropDown, [Feedback]);

customElements.define('drop-down', DropDown);
