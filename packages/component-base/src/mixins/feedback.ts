/**
 * All components that have feedback must implement this mixin
 */
export abstract class Feedback {
    abstract feedbackText: string;
    abstract showFeedback(): void;
}
