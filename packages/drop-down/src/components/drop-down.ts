import { ComponentBase, html, TemplateResult } from '@hmh/component-base/dist/components/component-base';
import { FeedbackMixin } from '@hmh/component-base/dist/components/feedback-mixin';
import { PersistenceMixin } from '@hmh/component-base/dist/components/persistence-mixin';

// @ts-ignore : no type definition available
import { MDCSelect } from '@material/select/index.js';

export class DropDown extends ComponentBase implements FeedbackMixin, PersistenceMixin {
    public feedbackText: string;
    public placeholder: string = 'enter some text';
    public value: string = '';

    static get properties(): { [key: string]: string | object } {
        return {
            feedbackText: String,
            placeholder: String,
            value: String
        };
    }

    public showFeedback(): void {
        this.feedbackText = 'some feedback';
    }

    public _firstRendered(): void {
        // run js here
        const select = new MDCSelect(document.querySelector('.mdc-select'));
        select.listen('change', () => {
          alert(`Selected option at index ${select.selectedIndex} with value "${select.value}"`);
        });
    }

    protected _render({ feedbackText, placeholder, value }: DropDown): TemplateResult {
        return html`
        <div class="mdc-select">
        <select class="mdc-select__native-control">
          <option value="" disabled selected></option>
          <option value="grains">
            Bread, Cereal, Rice, and Pasta
          </option>
          <option value="vegetables">
            Vegetables
          </option>
          <option value="fruit">
            Fruit
          </option>
        </select>
        <label class="mdc-floating-label">Pick a Food Group</label>
        <div class="mdc-line-ripple"></div>
      </div>
        `;
    }
}

customElements.define('drop-down', DropDown);
