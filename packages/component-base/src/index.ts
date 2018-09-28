export { ComponentBase, html, repeat, TemplateResult, unsafeHTML } from './components/base';
export { Feedback, FeedbackType, FeedbackMessage, Strategy } from './mixins/feedback';
export { MultipleChoice } from './components/multiple-choice';
export { ResponseValidation } from './components/response-validation';

/**
 * Apply Mixins Implementation to a Component
 *
 * ref: https://www.typescriptlang.org/docs/handbook/mixins.html
 *
 * @param derivedCtor : derived class
 * @param baseCtors : list of mixins to apply to the derived class
 */
export function applyMixins(derivedCtor: any, baseCtors: any[]): void {
    baseCtors.forEach(
        (baseCtor: any): void => {
            Object.getOwnPropertyNames(baseCtor.prototype).forEach(
                (name: string): void => {
                    if (name !== 'constructor') {
                        // For LitElement, we must NOT override the constructor
                        derivedCtor.prototype[name] = baseCtor.prototype[name];
                    }
                }
            );
        }
    );
}
