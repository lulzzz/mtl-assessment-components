import { expect, basicTagName, dropContainerTagName, dragContainerTagName, sortableDropContainerTagName } from './constants.spec';
import { DragDrop } from '../components/drag-drop';
import { DragContainer } from '../components/drag-container';
import { DropContainer } from '../components/drop-container';
import { SortableDropContainer } from '../components/sortable-drop-container';

export default () => {
    function dispatchDragEvent(eventType: string, element: HTMLElement, dataTransfer: DataTransfer) {
        element.dispatchEvent(new DragEvent(eventType, { bubbles: true, dataTransfer: dataTransfer }));
    }
    describe(`<${basicTagName}> default`, (): void => {
        it('default should render as expected', (): void => {
            withSnippet('default');
            const value: boolean = true;
            expect(value).to.be.true;
        });
    });
    describe(`<${dragContainerTagName}> default drag container`, (): void => {
        it('default should render as expected', (): void => {
            withSnippet(dragContainerTagName);
            const value: boolean = true;
            expect(value).to.be.true;
        });
        it('should be able to add options programmatically', async (): Promise<void> => {
            withSnippet(dragContainerTagName);
            const element: DragContainer = document.querySelector(dragContainerTagName) as any;
            await element.updateComplete;
            let div: HTMLDivElement = document.createElement('div');

            div.slot = 'options';
            div.id = '1';
            div.innerText = 'Option 1';
            element.appendChild(div);
            await element.updateComplete;

            expect(element.getElement(div.id)).to.equal(div);

            div = document.createElement('div');
            div.id = '2';
            div.innerText = 'Option 2';
            element.appendChild(div);
            await element.updateComplete;

            expect(element.getElement(div.id)).to.not.equal(div);
        });
        it('should not throw is there is no options slot', async (): Promise<void> => {
            withSnippet(dragContainerTagName);
            const element: DragContainer = document.querySelector(dragContainerTagName) as any;
            // @ts-ignore : access to protected member
            expect(() => element._onSlotChanged(new Event('slotchange'))).not.to.throw();
        });
    });
    describe(`<${dropContainerTagName}> default drop container`, (): void => {
        it('default should render as expected', (): void => {
            withSnippet(dropContainerTagName);
            const value: boolean = true;
            expect(value).to.be.true;
        });
        it('should be able to add options programmatically', async (): Promise<void> => {
            withSnippet(dropContainerTagName);
            const element: DropContainer = document.querySelector(dropContainerTagName) as any;
            await element.updateComplete;
            let div: HTMLDivElement = document.createElement('div');

            div.slot = 'options';
            div.id = '1';
            div.className = 'option-item';
            div.innerText = 'Option 1';
            element.appendChild(div);
            await element.updateComplete;
            expect(element.getElement(div.id)).to.equal(div);

            div = document.createElement('div');
            div.slot = 'options';
            div.className = 'other';
            div.id = '2';
            div.innerText = 'Option 2';
            element.appendChild(div);
            await element.updateComplete;

            expect(element.getElement(div.id)).to.not.equal(div);
        });
        it('should not throw is there is no options slot', async (): Promise<void> => {
            withSnippet(dropContainerTagName);
            const element: DropContainer = document.querySelector(dropContainerTagName) as any;
            // @ts-ignore : access to protected member
            expect(() => element._onSlotChanged(new Event('slotchange'))).not.to.throw();
        });
    });
    describe(`<${sortableDropContainerTagName}> default sortable drop container`, (): void => {
        it('default should render as expected', (): void => {
            withSnippet(sortableDropContainerTagName);
            const value: boolean = true;
            expect(value).to.be.true;
        });

        it('should not throw is there is no options slot', async (): Promise<void> => {
            withSnippet(sortableDropContainerTagName);
            const element: SortableDropContainer = document.querySelector(sortableDropContainerTagName) as any;
            // @ts-ignore : access to protected member
            expect(() => element._onSlotChanged(new Event('slotchange'))).not.to.throw();
        });
    });
    describe(`<${basicTagName}> basic`, (): void => {
        it('basic should render as expected', (): void => {
            withSnippet('basic');
            const value: boolean = true;
            expect(value).to.be.true;
        });
        it('should be able to programmatically add slots', async (): Promise<void> => {
            withSnippet('basic');
            const element: DragDrop = document.querySelector(basicTagName) as any;
            await element.updateComplete;
            const div: HTMLDivElement = document.createElement('div');
            div.slot = 'drop-container';
            div.id = '1';
            div.innerText = 'Option 1';
            element.appendChild(div);
        });
        it('should not throw is there is no options slot', async (): Promise<void> => {
            withSnippet('basic');
            const element: DragDrop = document.querySelector(basicTagName) as any;
            // @ts-ignore : access to protected member
            expect(() => element._onSlotChanged(new Event('slotchange'))).not.to.throw();
        });
        it('should  have the correct amount of initial options', async (): Promise<void> => {
            withSnippet('basic');
            const element: DragDrop = document.querySelector(basicTagName) as any;
            await element.updateComplete;

            // @ts-ignore Access private member
            expect(element.dragContainers[0].getElementsByTagName('div').length).to.equal(5);
            // @ts-ignore Access private member
            expect(element.dragContainers[0].options.length).to.equal(5);
        });
        it('should  not be able to drop unsupported elements', async (): Promise<void> => {
            withSnippet('basic');
            const element: DragDrop = document.querySelector(basicTagName) as any;
            await element.updateComplete;

            // @ts-ignore Access private member
            let dragSource = element.dragContainers[0];
            // @ts-ignore Access private member
            const dropTarget = element.dropContainers[1];
            const dataTransfer = new DataTransfer();
            dispatchDragEvent('dragstart', dragSource, dataTransfer);
            dispatchDragEvent('drop', dropTarget, dataTransfer);

            await element.updateComplete;

            expect(dropTarget.addedItems.length).to.equal(0);
        });
        it('should respect the maximum number of items', async (): Promise<void> => {
            withSnippet('basic');
            const element: DragDrop = document.querySelector(basicTagName) as any;
            await element.updateComplete;

            // @ts-ignore Access private member
            let dragSource = element.dragContainers[0].getElement('000-1');
            // @ts-ignore Access private member
            const dropTarget = element.dropContainers[1];
            const dataTransfer = new DataTransfer();
            dispatchDragEvent('dragstart', dragSource, dataTransfer);
            await element.updateComplete;
            dispatchDragEvent('drop', dropTarget, dataTransfer);
            await element.updateComplete;
            expect(dropTarget.addedItems.length).to.equal(1);

            // @ts-ignore Access private member
            dragSource = element.dragContainers[0].getElement('000-2');
            dispatchDragEvent('dragstart', dragSource, dataTransfer);
            await element.updateComplete;
            dispatchDragEvent('drop', dropTarget, dataTransfer);
            expect(dropTarget.addedItems.length).to.equal(1);
        });
        it('element should be hidden when drag in process', async (): Promise<void> => {
            withSnippet('basic');
            const element: DragDrop = document.querySelector(basicTagName) as any;
            await element.updateComplete;
            // @ts-ignore Access private member
            let dragSource = element.dragContainers[0].getElement('000-1');
            const dataTransfer = new DataTransfer();
            dispatchDragEvent('dragstart', dragSource, dataTransfer);
            dispatchDragEvent('dragend', dragSource, dataTransfer);
            await element.updateComplete;

            setTimeout(function() {
                expect(dragSource.classList.contains('hide')).to.be.true;
            }, 0);
        });
        it('element should be reappear after drag end', async (): Promise<void> => {
            withSnippet('basic');
            const element: DragDrop = document.querySelector(basicTagName) as any;
            await element.updateComplete;

            // @ts-ignore Access private member
            let dragSource = element.dragContainers[0].getElement('000-1');
            const dataTransfer = new DataTransfer();
            dispatchDragEvent('dragstart', dragSource, dataTransfer);
            await element.updateComplete;
            setTimeout(function() {
                expect(dragSource.classList.contains('hide')).to.be.true;
            }, 0);

            // @ts-ignore Access private member
            dispatchDragEvent('dragend', dragSource, dataTransfer);

            await element.updateComplete;
            setTimeout(function() {
                expect(dragSource.classList.contains('hide')).to.be.false;
            }, 0);
        });
        it('should be able to move from drop container to drag zone', async (): Promise<void> => {
            withSnippet('basic');
            1;
            const element: DragDrop = document.querySelector(basicTagName) as any;
            await element.updateComplete;

            // @ts-ignore Access private member
            let dragSource = element.dragContainers[0].getElement('000-1');
            // @ts-ignore Access private member
            const dropTarget = element.dropContainers[1];
            const dataTransfer = new DataTransfer();
            const dragEvent: Event = new DragEvent('dragstart', { bubbles: true, dataTransfer: dataTransfer });
            const dropEvent: Event = new DragEvent('drop', { bubbles: true, dataTransfer: dataTransfer });
            dragSource.dispatchEvent(dragEvent);
            dropTarget.dispatchEvent(dropEvent);
            await element.updateComplete;

            dropTarget.getElement('000-1').dispatchEvent(dragEvent);
            // @ts-ignore Access private member
            element.dragContainers[0].dispatchEvent(dropEvent);
            await element.updateComplete;

            // @ts-ignore Access private member
            expect(element.dragContainers[0].getElement('000-1')).to.equal(dragSource);
        });
        it('should be able to trash items', async (): Promise<void> => {
            withSnippet('basic');
            const element: DragDrop = document.querySelector(basicTagName) as any;
            await element.updateComplete;
            // @ts-ignore Access private member
            let dragSource = element.dragContainers[0].getElement('000-1');
            // @ts-ignore Access private member
            let dropTarget = element.dropContainers[1];
            const dataTransfer = new DataTransfer();
            const dragEvent: Event = new DragEvent('dragstart', { bubbles: true, dataTransfer: dataTransfer });
            const dragOverEvent: Event = new DragEvent('dragover', { bubbles: true, dataTransfer: dataTransfer });
            const dropEvent: Event = new DragEvent('drop', { bubbles: true, dataTransfer: dataTransfer });
            dragSource.dispatchEvent(dragEvent);
            dragSource.dispatchEvent(dragOverEvent);
            dropTarget.dispatchEvent(dropEvent);
            await element.updateComplete;

            dragSource = dropTarget.getElement('000-1');
            // @ts-ignore Access private member
            dropTarget = element.dragContainers[2]; //trash
            dragSource.dispatchEvent(dragEvent);
            await element.updateComplete;
            dropTarget.dispatchEvent(dropEvent);
            await element.updateComplete;
            // @ts-ignore Access private member
            expect(dropTarget.options.length).to.equal(0);
        });
        describe(`<${basicTagName}> sortable drag drop`, (): void => {
            it('should move option on hover', async (): Promise<void> => {
                withSnippet('sortable');
                const element: DragDrop = document.querySelector(basicTagName) as any;
                await element.updateComplete;

                // @ts-ignore Access private member
                const sortable: SortableDropContainer = element.dropContainers[0];
                let dragSource = sortable.getElement('1');
                // @ts-ignore Access private member
                let hoveredElement = sortable.getElement('2');

                // const dropTarget = element.dropContainers[1];
                const dataTransfer = new DataTransfer();
                const dragEvent: Event = new DragEvent('dragstart', { bubbles: true, dataTransfer: dataTransfer });
                const dragOverEvent: Event = new DragEvent('dragover', { bubbles: true, dataTransfer: dataTransfer });
                dragSource.dispatchEvent(dragEvent);
                hoveredElement.dispatchEvent(dragOverEvent);
                await element.updateComplete;

                // @ts-ignore Access private member
                expect(sortable.firstElementChild).to.equal(hoveredElement);
            });
        });
    });
};
