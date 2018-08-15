export { ComponentBase, html, TemplateResult } from './components/base';
export { Persistence } from './mixins/persistence';
export { Feedback } from './mixins/feedback';

export function applyMixins(derivedCtor: any, baseCtors: any[]) {
    baseCtors.forEach(baseCtor => {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
            derivedCtor.prototype[name] = baseCtor.prototype[name];
        });
    });
}
