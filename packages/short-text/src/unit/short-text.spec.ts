import { ShortText } from '../components/short-text.js';
import { checkComponentDOM } from './test-helpers.js';
// const expect: any = chai.expect;
const tagName: string = 'short-text';

describe(`<${tagName}>`, (): void => {
    it('should render default state', async (): Promise<void> => {
        withSnippet('default');
        const el: ShortText = document.querySelector(tagName) as any;
        await el.updateComplete;
        checkComponentDOM(el);
    });
});

mocha.run();
