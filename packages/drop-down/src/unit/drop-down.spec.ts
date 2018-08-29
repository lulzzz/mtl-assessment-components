import { DropDown } from "../components/drop-down";
import { checkComponentDOM } from './test-helpers';

//const expect: any = chai.expect;
const tagName: string = 'drop-down';

describe(`<${tagName}>`, (): void => {
    it('should render default state', async (): Promise<void> => {
        withSnippet('default');
        const el: DropDown = document.querySelector('drop-down') as any;
        await el.renderComplete;
        checkComponentDOM(el);
    });
});

mocha.run();
