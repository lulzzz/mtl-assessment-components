import { Strategy } from '../../dist/index';
import { ResponseValidation, FeedbackMessage } from '../../dist/components/response-validation';

export abstract class MultipleChoiceMixin {
    public _responseValidationElements: ResponseValidation[];
    public items: HTMLElement[] = [];
    public multiple: boolean;
    public feedbackMessage: FeedbackMessage;
    public value: Set<string> = new Set();

    /**
     * Fired on slot change
     * @param {Event} event
     */
    _onSlotChanged(event: Event): void {
        const items: HTMLElement[] = [];
        const slot: HTMLSlotElement = event.srcElement as HTMLSlotElement;
        if (slot) {
            const nodes: Node[] = slot.assignedNodes();
            if (nodes) {
                nodes.forEach(
                    (el: HTMLElement, index: number): void => {
                        el.setAttribute('index', String(index));
                        el.setAttribute('tabindex', String(index + 1));
                        el.setAttribute('role', 'button');
                        items.push(el);
                    }
                );
            }
        }
        this.items = items;
    }

    getFeedback(): FeedbackMessage {
        return this._getFeedback(this.getValue());
    }

    _getFeedback(value: any): FeedbackMessage {
        for (const el of this._responseValidationElements) {
            if (this.match(el, value)) {
                return el.getFeedbackMessage();
            }
        }
        throw new Error('missing default response-validation');
    }

    getValue(): Set<string> {
        return this.value;
    }

    showFeedback(): void {
        this.feedbackMessage = this.getFeedback();
    }

    match: (el: ResponseValidation, response: Set<string>) => boolean = (el, response) => {
        if (!el.getExpected()) {
            // catch-all clause
            return true;
        }

        let equals: boolean = false;

        switch (el.strategy) {
            case Strategy.EXACT_MATCH:
                equals = response.size === el.getExpected().size;
                response.forEach((r: any) => {
                    equals = equals && el.getExpected().has(r);
                });
                return equals;
            case Strategy.FUZZY_MATCH:
                equals = true;
                response.forEach((r: any) => {
                    equals = equals || el.getExpected().has(r);
                });
                return equals;
            default:
                return false;
        }
    };

    _onItemClicked: (event: Event, id: string, type?: string) => void;
}