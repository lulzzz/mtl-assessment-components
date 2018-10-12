import baseSpec from './base.spec';
import feedbackSpec from './feedback.spec';
import multipleChoiceSpec from './multiple-choice.spec';
import responseValidationSpec from './response-validation.spec';
import coordinateSystemSpec from './coordinate-system.spec';

baseSpec();
feedbackSpec();
multipleChoiceSpec();
responseValidationSpec();
coordinateSystemSpec();
mocha.run();
