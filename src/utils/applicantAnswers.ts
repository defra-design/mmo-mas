// src/utils/applicantAnswers.ts
// The applicant's own answers that task forms show read-only, per application.
// They arrive with the application from CDP, so each must match that
// application's CDP pages in public/cdp.
import { asset } from './asset';
import { applicationFor } from './cases';
import type { Application } from './cases';
import { HAYLING_PROPOSED_WORKS } from './consultationCaseAnswers';
import { BRIXHAM_PROPOSED_WORKS, BRIXHAM_WFD_DOCUMENT } from './brixhamCaseAnswers';
import {
  EXMOUTH_PROPOSED_WORKS,
  EXMOUTH_WFD_DOCUMENT,
  EXMOUTH_WITHHOLD_REQUEST,
} from './exmouthCaseAnswers';
import { DART_PROPOSED_WORKS, DART_WFD_DOCUMENT, DART_WITHHOLD_REQUEST } from './dartCaseAnswers';

export interface ApplicantAnswers {
  proposedWorks: string;
  wfdDocument?: { fileName: string; href: string };
  // What the applicant asked to be withheld, or undefined if they asked for
  // nothing to be (then there is no decision to make).
  withholdRequest?: string;
}

const answers: Record<Application, ApplicantAnswers> = {
  teignmouth: {
    proposedWorks:
      'South Devon Coast SUP Ltd is a small paddleboarding hire and instruction business ' +
      'operating in Teignmouth. We are applying for a marine licence to install a small ' +
      'floating pontoon within Teignmouth Harbour to provide a safe and accessible launching ' +
      'and landing platform for paddleboards and kayaks hired to our customers. The pontoon ' +
      'would be attached to the existing harbour wall using H-frame wall guides and a short ' +
      'hinged gangway, and the works will take place entirely within the outer harbour area.',
    wfdDocument: {
      fileName: 'WFD-Teignmouth-2026.docx',
      href: asset('documents/WFD-Teignmouth-2026.docx'),
    },
    // Matches the Withholding information tab (public/cdp/public-register.html).
    withholdRequest:
      'We would like the fees and financial figures in our activity description withheld. A ' +
      'second operator is expected to bid for a concession in the same harbour next year, and ' +
      'if they can see what we are paying and what we expect to take they can pitch against us. ' +
      'We would also like the pontoon dimensions and fixing method shown on our construction ' +
      'drawing withheld. We spent two years getting this set-up right and we do not want ' +
      'another hire business copying it.',
  },
  hayling: {
    proposedWorks: HAYLING_PROPOSED_WORKS,
    // From the GOV.UK prototype (a dead link, as there).
    wfdDocument: { fileName: 'hayling-groynes-wfd-assessment.pdf', href: '#' },
  },
  brixham: {
    proposedWorks: BRIXHAM_PROPOSED_WORKS,
    wfdDocument: BRIXHAM_WFD_DOCUMENT,
  },
  exmouth: {
    proposedWorks: EXMOUTH_PROPOSED_WORKS,
    wfdDocument: EXMOUTH_WFD_DOCUMENT,
    withholdRequest: EXMOUTH_WITHHOLD_REQUEST,
  },
  dart: {
    proposedWorks: DART_PROPOSED_WORKS,
    wfdDocument: DART_WFD_DOCUMENT,
    withholdRequest: DART_WITHHOLD_REQUEST,
  },
};

export function applicantAnswersFor(caseId: string): ApplicantAnswers {
  return answers[applicationFor(caseId)];
}
