/**
 * All components that have feedback must implement this mixin
 */
export abstract class FeedbackMixin {
    abstract feedbackText: string;
    abstract showFeedback(): void;
}
