import { ComponentBase, html, TemplateResult } from '@hmh/component-base/dist/components/component-base';
import { FeedbackMixin } from '@hmh/component-base/dist/components/feedback-mixin';
import { PersistenceMixin } from '@hmh/component-base/dist/components/persistence-mixin';
// @ts-ignore : no type definition available
import { MDCSelect } from '@material/select/index.js';

export class DropDown extends ComponentBase implements FeedbackMixin, PersistenceMixin {
    public values: string = '';

    static get properties(): { [key: string]: string | object } {
        return {
            values: String
        };
    }

    public showFeedback(): void {
        this.feedbackText = 'some feedback';
    }

    public _firstRendered(): void {
        const select = new MDCSelect(this.shadowRoot.querySelector('.mdc-select'));
        select.listen('change', () => {
          alert(`Selected option at index ${select.selectedIndex} with value "${select.value}"`);
        });
    }

    protected _render({ values }: DropDown): TemplateResult {

        const valuesArr = values.split(',');
        //TODO: loop
        return html`
        <link rel="stylesheet" type="text/css" href="/node_modules/@material/select/dist/mdc.select.css">
        <div class="mdc-select">
        <select class="mdc-select__native-control">
          <option value="" disabled selected></option>
          <option value=${valuesArr[0]}>
            ${valuesArr[1]}
          </option>
          <option value=${valuesArr[2]}>
            ${valuesArr[3]}
          </option>
          <option value=${valuesArr[4]}>
            ${valuesArr[5]}
          </option>
        </select>
        <label class="mdc-floating-label">Pick a Food Group</label>
        <div class="mdc-line-ripple"></div>
      </div>
        `;
    }
}

customElements.define('drop-down', DropDown);
