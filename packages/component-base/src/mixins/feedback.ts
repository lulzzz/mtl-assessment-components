/**
 * All components that have feedback must implement this mixin
 */
export abstract class Feedback {
    abstract feedbackText: string;
    public showFeedback(): void {
        console.log('show feedback from the mixin is called');
    };
}
