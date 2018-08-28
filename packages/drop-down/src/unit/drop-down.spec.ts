import { DropDown } from "../components/drop-down";
import { checkComponentDOM, clickElement } from './test-helpers';

const tagName: string = 'drop-down';
const expect: any = chai.expect;

describe(`<${tagName}>`, (): void => {
    it('should render default state', async (): Promise<void> => {
        withSnippet('default');
        const el: DropDown = document.querySelector('drop-down') as any;
        await el.renderComplete;
        checkComponentDOM(el);
    });

    it('should open contents on button clicked', async (): Promise<void> => {
        withSnippet('default');
        const el: DropDown = document.querySelector('drop-down') as any;
        const shadowRoot = el.shadowRoot;   
        const dropButton = shadowRoot.querySelector('.dropbtn');
        clickElement(dropButton);
        const content = shadowRoot.querySelector('.dropdown-content');
        const display = window.getComputedStyle(content).getPropertyValue("display");
        expect(display).to.equal('block');
    });

    it('should contain the expected option values', async (): Promise<void> => {
        withSnippet('values-one-two-three');
        const el: DropDown = document.querySelector('drop-down') as any;
        const shadowRoot = el.shadowRoot;   
        const slot = shadowRoot.querySelector('slot') as HTMLSlotElement;
        if (slot) {
            const nodes: Node[] = slot.assignedNodes();  
            const optionOne = nodes[0] as HTMLElement;
            const optionTwo = nodes[1] as HTMLElement;
            const optionThree = nodes[2] as HTMLElement;
            expect(optionOne.getAttribute('value')).to.equal('one');
            expect(optionTwo.getAttribute('value')).to.equal('two');
            expect(optionThree.getAttribute('value')).to.equal('three');
        } 
    });

    it('should change value when a selection is made', async (): Promise<void> => {
        withSnippet('values-one-two-three');
        let el: DropDown = document.querySelector('drop-down') as any;
        const shadowRoot = el.shadowRoot;   
        const slot = shadowRoot.querySelector('slot') as HTMLSlotElement;
        if (slot) {
            const nodes: Node[] = slot.assignedNodes();  
            const optionOne = nodes[0] as HTMLElement;
            clickElement(optionOne);
            await el.renderComplete;
            expect(el.getAttribute('value')).to.equal(optionOne.getAttribute('value'));
        } 
    });
});

mocha.run();
