import { expect, basicTagName } from './constants.spec.js';
import { DragDrop } from '../components/drag-drop.js';
import { SortableDropContainer } from '../components/sortable-drop-container.js';

export default () => {
    describe(`<${basicTagName}> feedback`, (): void => {
        it('should provide negative feedback on incorrect answer', async (): Promise<void> => {
            withSnippet('basic');
            const element: DragDrop = document.querySelector(basicTagName) as any;
            await element.updateComplete;

            element.showFeedback();
            // @ts-ignore Access private member
            expect(element.dropContainers[0].getFeedback().type).to.equal('negative');
        });

        it('should provide positive feedback on correct answer', async (): Promise<void> => {
            withSnippet('basic');
            const element: DragDrop = document.querySelector(basicTagName) as any;
            await element.updateComplete;
            // @ts-ignore Access private member
            const dragSource = element.dragContainers[1].getElement('4');
            // @ts-ignore Access private member

            const dropTarget = element.dropContainers[1];

            //Simulate drag&drop
            const dataTransfer = new DataTransfer();
            const dragEvent: Event = new DragEvent('dragstart', { bubbles: true, dataTransfer: dataTransfer } as any);
            dragSource.dispatchEvent(dragEvent);
            const dropEvent: Event = new DragEvent('drop', { bubbles: true, dataTransfer: dataTransfer } as any);
            dropTarget.dispatchEvent(dropEvent);
            await element.updateComplete;

            element.showFeedback();
            expect(dropTarget.getFeedback().type).to.equal('positive');
        });

        it('should provide neutral feedback on neutral answer', async (): Promise<void> => {
            withSnippet('basic');
            const element: DragDrop = document.querySelector(basicTagName) as any;
            await element.updateComplete;
            // @ts-ignore Access private member
            const dragSource = element.dragContainers[0].getElement('000-1');
            // @ts-ignore Access private member
            const dropTarget = element.dropContainers[0];
            const dataTransfer = new DataTransfer();
            const dragEvent: Event = new DragEvent('dragstart', { bubbles: true, dataTransfer: dataTransfer } as any);
            dragSource.dispatchEvent(dragEvent);
            const dropEvent: Event = new DragEvent('drop', { bubbles: true, dataTransfer: dataTransfer } as any);
            dropTarget.dispatchEvent(dropEvent);
            await element.updateComplete;

            element.showFeedback();
            expect(dropTarget.getFeedback().type).to.equal('neutral');
        });
    });
    describe(`<${basicTagName}> sortable feedback`, (): void => {
        it('should provide negative feedback on incorrect answer', async (): Promise<void> => {
            withSnippet('sortable');
            const element: DragDrop = document.querySelector(basicTagName) as any;
            await element.updateComplete;

            // @ts-ignore Access private member
            const sortable: SortableDropContainer = element.dropContainers[0];
            // @ts-ignore Access private member
            const dragSource = sortable.getElement('4');
            // @ts-ignore Access private member
            const hoverTarget = sortable.getElement('1');
            const dataTransfer = new DataTransfer();
            const dragEvent: Event = new DragEvent('dragstart', { bubbles: true, dataTransfer: dataTransfer } as any);
            dragSource.dispatchEvent(dragEvent);
            let dropEvent: Event = new DragEvent('dragover', { bubbles: true, dataTransfer: dataTransfer } as any);
            hoverTarget.dispatchEvent(dropEvent);
            dropEvent = new DragEvent('drop', { bubbles: true, dataTransfer: dataTransfer } as any);
            sortable.dispatchEvent(dropEvent);

            await element.updateComplete;

            element.showFeedback();
            expect(sortable.getFeedback().type).to.equal('negative');
        });

        it('should provide positive feedback on correct answer', async (): Promise<void> => {
            withSnippet('sortable');
            const element: DragDrop = document.querySelector(basicTagName) as any;
            await element.updateComplete;

            element.showFeedback();
            // @ts-ignore Access private member
            expect(element.dropContainers[0].getFeedback().type).to.equal('positive');
        });

        it('should provide neutral feedback on neutral answer', async (): Promise<void> => {
            withSnippet('sortable');
            const element: DragDrop = document.querySelector(basicTagName) as any;
            await element.updateComplete;

            // @ts-ignore Access private member
            const sortable: SortableDropContainer = element.dropContainers[0];
            // @ts-ignore Access private member
            const dragSource = sortable.getElement('5');
            // @ts-ignore Access private member
            const hoverTarget = sortable.getElement('4');
            const dataTransfer = new DataTransfer();
            const dragEvent: Event = new DragEvent('dragstart', { bubbles: true, dataTransfer: dataTransfer } as any);
            dragSource.dispatchEvent(dragEvent);
            const dropEvent: Event = new DragEvent('dragover', { bubbles: true, dataTransfer: dataTransfer } as any);
            hoverTarget.dispatchEvent(dropEvent);
            await element.updateComplete;

            element.showFeedback();
            expect(sortable.getFeedback().type).to.equal('neutral');
        });
    });
};
