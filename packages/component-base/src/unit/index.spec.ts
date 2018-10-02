import baseSpec from './base.spec';
import feedbackSpec from './feedback.spec';
import multipleChoiceSpec from './multiple-choice.spec';
import responseValidationSpec from './response-validation.spec';

baseSpec();
feedbackSpec();
multipleChoiceSpec();
responseValidationSpec();
mocha.run();
