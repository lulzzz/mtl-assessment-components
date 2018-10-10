import { AxisDef } from '../components/axis-def.js';
import { checkComponentDOM } from './test-helpers.js';
const tagName: string = 'axis-def';

describe(`<${tagName}>`, (): void => {
    it('should render default state', async (): Promise<void> => {
        withSnippet('default');
        const el: AxisDef = document.querySelector(tagName) as any;
        // @ts-ignore
        await el.updateComplete;
        checkComponentDOM(el);
    });
});

mocha.run();
