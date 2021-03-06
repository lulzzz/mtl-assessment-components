export const basicTagName: string = 'drag-drop';
export const dropContainerTagName: string = 'drop-container';
export const sortableDropContainerTagName: string = 'sortable-drop-container';
export const dragContainerTagName: string = 'drag-container';

export const expect: any = chai.expect;
export async function sleep(delay: number = 100) {
    return new Promise((resolve: any) => {
        setTimeout(() => {
            resolve();
        }, delay);
    });
}