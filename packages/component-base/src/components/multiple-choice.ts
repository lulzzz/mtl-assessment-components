import { Strategy } from '../mixins/feedback';
import { ResponseValidation } from './response-validation';
import { ComponentBase } from './base';
import { Feedback, FeedbackMessage } from '../mixins/feedback';
import { applyMixins } from '../index';

export class MultipleChoice extends ComponentBase<string[]> implements Feedback {
    public value: string[] = [];
    public feedbackMessage: FeedbackMessage;
    protected items: HTMLElement[] = [];

    static get properties(): { [key: string]: string | object } {
        return {
            ...super.properties,
            feedbackMessage: Object,
            items: Array,
            value: Array
        };
    }

    // @mixin: Feedback
    computeFeedback: (value: string[]) => FeedbackMessage;
    _onFeedbackSlotChanged: (evt: Event) => void;

    /**
     * @param  {ResponseValidation} el - the element containing an expected value and a strategy
     * @param  {any} response - The value to match against
     */
    public match(el: ResponseValidation, response: string[]): boolean {
        if (!el.expected) {
            // catch-all clause
            return true;
        }
        const expected: string[] = el.expected.split('|');

        switch (el.strategy) {
            case Strategy.ANY:
                return expected.some((answer: string) => response.includes(answer));
            case Strategy.CONTAINS:
                return expected.every((answer: string) => response.includes(answer));
            case Strategy.EXACT_MATCH:
            default:
                return response.length === expected.length && expected.every((answer: string) => response.includes(answer));
        }
    }

    /**
     * Called when an option item is selected.
     * Sets the element value to that of the selected element.
     *
     * @param  {HTMLElement} eventTarget
     * @param {string} selected
     * @param {boolean} multiple
     * @returns void
     */
    protected _onItemClicked(event: Event, selected: string, multiple: boolean = false): void {
        event.stopPropagation();

        let value: string[] = [...this.value];
        const index: number = value.indexOf(selected);

        if (index >= 0) {
            // remove element from the array
            value.splice(index, 1);
        } else {
            multiple ? value.push(selected) : (value = [selected]);
        }

        this.value = value;

        (this as any).dispatchEvent(
            new CustomEvent('change', {
                bubbles: true,
                composed: true,
                detail: { value }
            })
        );
    }

    /**
     * Fired on slot change
     * @param {Event} event
     */
    protected _onSlotChanged(event: Event): void {
        const items: HTMLElement[] = [];
        const slot: HTMLSlotElement = event.srcElement as HTMLSlotElement;
        if (slot) {
            slot.assignedNodes().forEach(
                (el: HTMLElement, index: number): void => {
                    el.setAttribute('index', String(index));
                    el.setAttribute('tabindex', String(index + 1));
                    el.setAttribute('role', 'button');
                    items.push(el);
                }
            );
        }
        this.items = items;
    }
}

applyMixins(MultipleChoice, [Feedback]);
