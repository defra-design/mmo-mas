// MAS D365 Screen Builder
// Generated code.js is built from this renderer and screen-descriptions.json.

const DESCRIPTIONS = {
  "meta": {
    "name": "MAS D365 Screen Builder",
    "viewport": {
      "width": 1640,
      "height": 1232
    },
    "source": "MAS React prototype, rendered application and supplied reference screenshots",
    "browserChromeExcluded": true
  },
  "shell": {
    "product": "Dynamics 365",
    "service": "Marine Applications System",
    "signedInUser": "Sam Evans",
    "navigation": [
      {
        "kind": "item",
        "label": "Home",
        "icon": "HomeRegular"
      },
      {
        "kind": "item",
        "label": "Recent",
        "icon": "ClockRegular",
        "chevron": true
      },
      {
        "kind": "item",
        "label": "Pinned",
        "icon": "PinRegular",
        "chevron": true
      },
      {
        "kind": "group",
        "label": "My work"
      },
      {
        "kind": "item",
        "label": "Applications dashboard",
        "icon": "DataBarVerticalRegular"
      },
      {
        "kind": "group",
        "label": "Customers"
      },
      {
        "kind": "item",
        "label": "Organisations",
        "icon": "ContactCardRegular"
      },
      {
        "kind": "item",
        "label": "Applicants",
        "icon": "PersonRegular"
      },
      {
        "kind": "group",
        "label": "Service"
      },
      {
        "kind": "item",
        "label": "Marine licence cases",
        "icon": "WrenchRegular",
        "selected": true
      },
      {
        "kind": "item",
        "label": "Exemption cases",
        "icon": "DocumentCopyRegular"
      },
      {
        "kind": "item",
        "label": "Case Coastal Operations Areas",
        "icon": "LocationRegular"
      },
      {
        "kind": "item",
        "label": "Case Marine Plan Areas",
        "icon": "LocationRegular"
      }
    ]
  },
  "caseList": {
    "frameName": "01 · Marine licence cases",
    "pageHeading": "Marine licence cases",
    "columns": [
      {
        "key": "reference",
        "label": "Reference",
        "width": 172,
        "sorted": true
      },
      {
        "key": "project",
        "label": "Application name",
        "width": 284
      },
      {
        "key": "assignee",
        "label": "Assigned to",
        "width": 182
      },
      {
        "key": "status",
        "label": "Status",
        "width": 255
      },
      {
        "key": "age",
        "label": "Case age (Days)",
        "width": 149,
        "align": "right"
      },
      {
        "key": "notification",
        "label": "Notifications",
        "width": 190
      }
    ],
    "rows": [
      {
        "reference": "MLA/2026/10001",
        "project": "Dawlish sea defence extension",
        "assignee": "",
        "status": "Awaiting allocation",
        "age": "1",
        "notification": ""
      },
      {
        "reference": "MLA/2026/10002",
        "project": "Exmouth Marina pontoon replacement",
        "assignee": "Sam Evans",
        "status": "Assessment in progress",
        "age": "1",
        "notification": ""
      },
      {
        "reference": "MLA/2026/10003",
        "project": "Installation of a navigation buoy, Poole Harbour",
        "assignee": "Rachel Patel",
        "status": "Assessment in progress",
        "age": "2",
        "notification": "Message received"
      },
      {
        "reference": "MLA/2026/10004",
        "project": "Torquay breakwater repair",
        "assignee": "Gary Whitfield",
        "status": "Awaiting applicant",
        "age": "16",
        "notification": ""
      },
      {
        "reference": "MLA/2026/10005",
        "project": "Plymouth Sound cable laying",
        "assignee": "",
        "status": "Awaiting allocation",
        "age": "1",
        "notification": ""
      },
      {
        "reference": "MLA/2026/10006",
        "project": "Falmouth port expansion phase 2",
        "assignee": "James Okafor",
        "status": "Consultation",
        "age": "62",
        "notification": "Message received"
      },
      {
        "reference": "MLA/2026/10012",
        "project": "Installation of safety ladders at Brixham Fish Quay",
        "assignee": "Sam Evans",
        "status": "Assessment in progress",
        "age": "1",
        "notification": ""
      },
      {
        "reference": "MLA/2026/10013",
        "project": "Salcombe Harbour navigation beacon installation",
        "assignee": "Sam Evans",
        "status": "Assessment in progress",
        "age": "1",
        "notification": ""
      },
      {
        "reference": "MLA/2026/10014",
        "project": "Installation of floating pontoon, Teignmouth Harbour, Devon",
        "assignee": "Sam Evans",
        "status": "Assessment in progress",
        "age": "1",
        "notification": ""
      },
      {
        "reference": "MLA/2026/10015",
        "project": "Installation of floating pontoon, Teignmouth Harbour, Devon",
        "assignee": "Sam Evans",
        "status": "Assessment in progress",
        "age": "1",
        "notification": ""
      }
    ]
  },
  "caseSummaryStates": [
    {
      "frameName": "04 · Case summary · Site check to do",
      "title": "Installation of floating pontoon, Teignmouth Harbour, Devon",
      "recordType": "Case",
      "meta": [
        {
          "label": "Reference",
          "value": "MLA/2026/10002"
        },
        {
          "label": "Status",
          "value": "Assessment in progress"
        },
        {
          "label": "Case age",
          "value": "1 day"
        },
        {
          "label": "Assigned to",
          "value": "Sam Evans",
          "avatar": true
        }
      ],
      "tabs": [
        "Case summary",
        "Application details",
        "Sites and activities",
        "Marine plan policies",
        "Water Framework Directive",
        "Other permissions",
        "Public register"
      ],
      "fields": [
        {
          "label": "Reference",
          "value": "MLA/2026/10002",
          "column": 1
        },
        {
          "label": "Application type",
          "value": "Marine licence application",
          "column": 1
        },
        {
          "label": "Submitted",
          "value": "08/09/2026",
          "column": 1
        },
        {
          "label": "Fee band",
          "value": "2A",
          "column": 1
        },
        {
          "label": "Applicant",
          "value": "Jenny Smith",
          "column": 2
        },
        {
          "label": "Organisation",
          "value": "South Devon Coast SUP Ltd",
          "column": 2
        }
      ],
      "tasks": [
        {
          "name": "Site check",
          "status": "To do"
        },
        {
          "name": "Public register",
          "status": "Cannot start yet"
        },
        {
          "name": "Water Framework Directive",
          "status": "Cannot start yet"
        },
        {
          "name": "Prepare for consultation",
          "status": "Cannot start yet"
        },
        {
          "name": "Marine plan policies",
          "status": "Cannot start yet"
        },
        {
          "name": "Public notice",
          "status": "Cannot start yet"
        }
      ]
    },
    {
      "frameName": "08 · Case summary · Tasks unlocked",
      "title": "Installation of floating pontoon, Teignmouth Harbour, Devon",
      "recordType": "Case",
      "meta": [
        {
          "label": "Reference",
          "value": "MLA/2026/10002"
        },
        {
          "label": "Status",
          "value": "Assessment in progress"
        },
        {
          "label": "Case age",
          "value": "1 day"
        },
        {
          "label": "Assigned to",
          "value": "Sam Evans",
          "avatar": true
        }
      ],
      "tabs": [
        "Case summary",
        "Application details",
        "Sites and activities",
        "Marine plan policies",
        "Water Framework Directive",
        "Other permissions",
        "Public register"
      ],
      "fields": [
        {
          "label": "Reference",
          "value": "MLA/2026/10002",
          "column": 1
        },
        {
          "label": "Application type",
          "value": "Marine licence application",
          "column": 1
        },
        {
          "label": "Submitted",
          "value": "08/09/2026",
          "column": 1
        },
        {
          "label": "Fee band",
          "value": "2A",
          "column": 1
        },
        {
          "label": "Applicant",
          "value": "Jenny Smith",
          "column": 2
        },
        {
          "label": "Organisation",
          "value": "South Devon Coast SUP Ltd",
          "column": 2
        }
      ],
      "tasks": [
        {
          "name": "Site check",
          "status": "Done"
        },
        {
          "name": "Public register",
          "status": "To do"
        },
        {
          "name": "Water Framework Directive",
          "status": "To do"
        },
        {
          "name": "Prepare for consultation",
          "status": "To do"
        },
        {
          "name": "Marine plan policies",
          "status": "To do"
        },
        {
          "name": "Public notice",
          "status": "To do"
        }
      ]
    }
  ],
  "siteCheckContent": {
    "groupHeading": "Site coordinates",
    "downloadLabel": "Download CSV",
    "sections": [
      {
        "key": "coordinates",
        "heading": "1. Coordinates and shape",
        "description": "Check that the coordinates accurately represent the location of the works, that the shape and size are appropriate for the activity, and that the site is within MMO jurisdiction.",
        "question": "Are the coordinates and shape correct and appropriate?",
        "type": "dropdown"
      },
      {
        "key": "withinWfd",
        "heading": "2. Site located in the Water Framework Directive assessment (WFD) area",
        "description": "Confirm whether the site is within the WFD assessment area. Within one nautical mile (1.85km) of the low water line, or in a tidal river or estuary - including the shore between low and Mean High Water Springs.",
        "question": "Is the site within the WFD assessment area?",
        "type": "dropdown"
      },
      {
        "key": "notes",
        "heading": "3. Notes from your site check",
        "question": "Record anything from your site check that is relevant to later stages of the assessment.",
        "type": "textarea"
      }
    ]
  },
  "siteCheckStates": [
    {
      "frameName": "05 · Site check · Initial state",
      "pageHeading": "Site check",
      "saveState": "Unsaved",
      "recordType": "Task",
      "coordinates": "---",
      "withinWfd": "---",
      "notes": "",
      "errors": []
    },
    {
      "frameName": "06 · Site check · Validation errors",
      "pageHeading": "Site check",
      "saveState": "Unsaved",
      "recordType": "Task",
      "coordinates": "---",
      "withinWfd": "---",
      "notes": "",
      "notification": "Coordinates and shape, WFD assessment area : Required fields must be filled in.",
      "errors": [
        {
          "field": "coordinates",
          "message": "Coordinates and shape: Required fields must be filled in."
        },
        {
          "field": "withinWfd",
          "message": "WFD assessment area: Required fields must be filled in."
        }
      ]
    },
    {
      "frameName": "07 · Site check · Completed",
      "pageHeading": "Site check",
      "saveState": "Saved",
      "recordType": "Task",
      "coordinates": "Yes",
      "withinWfd": "Yes",
      "notes": "Coordinates and shape checked against the application drawings. The site is within the WFD assessment area.",
      "errors": []
    }
  ],
  "publicRegister": {
    "frameName": "02 · Public register task · Initial state",
    "pageHeading": "Public register",
    "saveState": "Unsaved",
    "recordType": "Task",
    "sections": [
      {
        "heading": "1. The applicant's request",
        "rows": [
          {
            "type": "readonly",
            "question": "Did the applicant ask for information to be withheld?",
            "value": "Yes"
          },
          {
            "type": "readonly-multiline",
            "question": "What they want withheld and why",
            "value": "We would like two things withheld. First, the fees and financial figures in our proposed works summary, because they are commercially sensitive. A second operator is expected to bid for a concession in the same harbour next year, and if they can see what we are paying and what we expect to take they can pitch against us. Second, we would like the pontoon dimensions, the construction method and our working hours withheld. We spent two years getting this set-up right and we do not want another hire business copying it."
          }
        ]
      },
      {
        "heading": "2. Your assessment",
        "rows": [
          {
            "type": "dropdown",
            "question": "What does the request relate to?",
            "value": "---",
            "required": true
          }
        ]
      },
      {
        "heading": "3. Personal information check",
        "rows": [
          {
            "type": "dropdown",
            "question": "Does the application, or any supporting documents, contain personal information about someone else that must be removed before publishing?",
            "value": "---",
            "required": true
          },
          {
            "type": "help",
            "label": "Help with personal information"
          }
        ]
      },
      {
        "heading": "4. Redact the application",
        "rows": [
          {
            "type": "url",
            "question": "Select the link to redact the application. You will be able to choose which parts of the application to redact.",
            "value": "https://marine-licensing-url/redact/6a39375b0e7bc1f2d84a"
          }
        ]
      }
    ],
    "completionNote": "Any information for the applicant will be sent when the task is complete.",
    "completionLabel": "Select to mark the task as complete",
    "completed": true
  },
  "publicRegisterVariations": [
    {
      "frameName": "03 · Public register task · Conditional fields shown",
      "frameHeight": 1760,
      "pageHeading": "Public register",
      "saveState": "Unsaved",
      "recordType": "Task",
      "sections": [
        {
          "heading": "1. The applicant's request",
          "rows": [
            {
              "type": "readonly",
              "question": "Did the applicant ask for information to be withheld?",
              "value": "Yes"
            },
            {
              "type": "readonly-multiline",
              "question": "What they want withheld and why",
              "value": "We would like two things withheld. First, the fees and financial figures in our proposed works summary, because they are commercially sensitive. A second operator is expected to bid for a concession in the same harbour next year, and if they can see what we are paying and what we expect to take they can pitch against us. Second, we would like the pontoon dimensions, the construction method and our working hours withheld. We spent two years getting this set-up right and we do not want another hire business copying it."
            }
          ]
        },
        {
          "heading": "2. Your assessment",
          "rows": [
            {
              "type": "dropdown",
              "question": "What does the request relate to?",
              "value": "Commercial or industrial confidentiality",
              "required": true
            },
            {
              "type": "divider"
            },
            {
              "type": "subheading",
              "label": "Commercial or industrial confidentiality"
            },
            {
              "type": "dropdown",
              "question": "Do you agree with the applicant's request?",
              "value": "Agree - but only withhold some of it",
              "required": true
            },
            {
              "type": "help",
              "label": "Help with commercial or industrial confidentiality",
              "spaceAfter": 8
            },
            {
              "type": "textarea",
              "question": "What is your rationale?",
              "value": "The fees and detailed construction methods are confidential and publishing them would cause identifiable commercial harm. The general description of the works can be published.",
              "required": true
            },
            {
              "type": "textarea",
              "question": "What do you want to tell the applicant?",
              "value": "We will withhold the fee figures and detailed construction methods. The remaining information will be published.",
              "required": true
            }
          ]
        },
        {
          "heading": "3. Personal information check",
          "rows": [
            {
              "type": "dropdown",
              "question": "Does the application, or any supporting documents, contain personal information about someone else that must be removed before publishing?",
              "value": "Yes",
              "required": true
            },
            {
              "type": "help",
              "label": "Help with personal information",
              "spaceAfter": 8
            },
            {
              "type": "textarea",
              "question": "What personal information needs to be redacted, and why?",
              "value": "Remove personal signatures and direct contact details because they are not needed for the public to understand the application.",
              "required": true
            }
          ]
        },
        {
          "heading": "4. Redact the application",
          "rows": [
            {
              "type": "url",
              "question": "Select the link to redact the application. You will be able to choose which parts of the application to redact.",
              "value": "https://marine-licensing-url/redact/6a39375b0e7bc1f2d84a"
            }
          ]
        }
      ],
      "completionNote": "Any information for the applicant will be sent when the task is complete.",
      "completionLabel": "Select to mark the task as complete",
      "completed": false
    }
  ]
};
const FLUENT_ICONS = {
  "AddRegular": [
    "M10 2.5c.28 0 .5.22.5.5v6.5H17a.5.5 0 0 1 0 1h-6.5V17a.5.5 0 0 1-1 0v-6.5H3a.5.5 0 0 1 0-1h6.5V3c0-.28.22-.5.5-.5Z"
  ],
  "ArrowLeftRegular": [
    "M9.16 16.87a.5.5 0 1 0 .67-.74L3.67 10.5H17.5a.5.5 0 0 0 0-1H3.67l6.16-5.63a.5.5 0 0 0-.67-.74L2.24 9.44a.75.75 0 0 0 0 1.11l6.92 6.32Z"
  ],
  "ArrowDownloadRegular": [
    "M15.5 17a.5.5 0 0 1 .09 1H4.5a.5.5 0 0 1-.09-1H15.5ZM10 2a.5.5 0 0 1 .5.41V14.3l3.64-3.65a.5.5 0 0 1 .64-.06l.07.06c.17.17.2.44.06.63l-.06.07-4.5 4.5a.5.5 0 0 1-.25.14L10 16a.5.5 0 0 1-.4-.2l-4.46-4.45a.5.5 0 0 1 .64-.76l.07.06 3.65 3.64V2.5c0-.27.22-.5.5-.5Z"
  ],
  "ArrowUpRegular": [
    "M3.13 9.16a.5.5 0 1 0 .74.68L9.5 3.67V17.5a.5.5 0 1 0 1 0V3.67l5.63 6.17a.5.5 0 0 0 .74-.68l-6.32-6.92a.75.75 0 0 0-1.1 0L3.13 9.16Z"
  ],
  "ContactCardRegular": [
    "M8 8.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm-4 3.2c0-.53.42-.95.95-.95h3.1c.53 0 .95.42.95.95 0 .85-.58 1.58-1.4 1.79l-.06.01a4.3 4.3 0 0 1-2.08 0l-.06-.01c-.82-.2-1.4-.94-1.4-1.8ZM11.5 8a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1h-3Zm0 3a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1h-3ZM2 5.75C2 4.78 2.78 4 3.75 4h12.5c.97 0 1.75.78 1.75 1.75v8.5c0 .97-.78 1.75-1.75 1.75H3.75C2.78 16 2 15.22 2 14.25v-8.5ZM3.75 5a.75.75 0 0 0-.75.75v8.5c0 .41.34.75.75.75h12.5c.41 0 .75-.34.75-.75v-8.5a.75.75 0 0 0-.75-.75H3.75Z"
  ],
  "ChevronDownRegular": [
    "M15.85 7.65c.2.2.2.5 0 .7l-5.46 5.49a.55.55 0 0 1-.78 0L4.15 8.35a.5.5 0 1 1 .7-.7L10 12.8l5.15-5.16c.2-.2.5-.2.7 0Z"
  ],
  "ChevronRightRegular": [
    "M7.65 4.15c.2-.2.5-.2.7 0l5.49 5.46c.21.22.21.57 0 .78l-5.49 5.46a.5.5 0 0 1-.7-.7L12.8 10 7.65 4.85a.5.5 0 0 1 0-.7Z"
  ],
  "ClockRegular": [
    "M10 2a8 8 0 1 1 0 16 8 8 0 0 1 0-16Zm0 1a7 7 0 1 0 0 14 7 7 0 0 0 0-14Zm-.5 2a.5.5 0 0 1 .5.41V10h2.5a.5.5 0 0 1 .09 1H9.5a.5.5 0 0 1-.5-.41V5.5c0-.28.22-.5.5-.5Z"
  ],
  "DataBarVerticalRegular": [
    "M5 3a2 2 0 0 0-2 2v10a2 2 0 1 0 4 0V5a2 2 0 0 0-2-2ZM4 5a1 1 0 0 1 2 0v10a1 1 0 1 1-2 0V5Zm4 3a2 2 0 1 1 4 0v7a2 2 0 1 1-4 0V8Zm2-1a1 1 0 0 0-1 1v7a1 1 0 1 0 2 0V8a1 1 0 0 0-1-1Zm3 4a2 2 0 1 1 4 0v4a2 2 0 1 1-4 0v-4Zm2-1a1 1 0 0 0-1 1v4a1 1 0 1 0 2 0v-4a1 1 0 0 0-1-1Z"
  ],
  "DocumentCopyRegular": [
    "M6 4c0-1.1.9-2 2-2h3.59c.4 0 .78.16 1.06.44l3.91 3.91c.28.28.44.67.44 1.06V14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1V8h-3.5A1.5 1.5 0 0 1 11 6.5V3H8Zm4 .2v3.3c0 .28.22.5.5.5h3.3L12 3.2ZM4 5a1 1 0 0 1 1-1v10a3 3 0 0 0 3 3h7a1 1 0 0 1-1 1H7.94A3.94 3.94 0 0 1 4 14.06V5Z"
  ],
  "DismissCircleFilled": [
    "M10 2a8 8 0 1 1 0 16 8 8 0 0 1 0-16ZM7.8 7.11a.5.5 0 0 0-.63.06l-.06.07a.5.5 0 0 0 .06.64L9.3 10l-2.12 2.12-.06.07a.5.5 0 0 0 .06.64l.07.06c.2.13.47.11.64-.06L10 10.7l2.12 2.12.07.06c.2.13.46.11.64-.06l.06-.07a.5.5 0 0 0-.06-.64L10.7 10l2.12-2.12.06-.07a.5.5 0 0 0-.06-.64l-.07-.06a.5.5 0 0 0-.64.06L10 9.3 7.88 7.17l-.07-.06Z"
  ],
  "DismissSquareRegular": [
    "M7.15 7.15c.2-.2.5-.2.7 0L10 9.29l2.15-2.14a.5.5 0 0 1 .7.7L10.71 10l2.14 2.15a.5.5 0 0 1-.7.7L10 10.71l-2.15 2.14a.5.5 0 0 1-.7-.7L9.29 10 7.15 7.85a.5.5 0 0 1 0-.7ZM3 6a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V6Zm3-2a2 2 0 0 0-2 2v8c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H6Z"
  ],
  "ErrorCircleRegular": [
    "M10 2a8 8 0 1 1 0 16 8 8 0 0 1 0-16Zm0 1a7 7 0 1 0 0 14 7 7 0 0 0 0-14Zm0 9.5a.75.75 0 1 1 0 1.5.75.75 0 0 1 0-1.5ZM10 6a.5.5 0 0 1 .5.41V11a.5.5 0 0 1-1 .09V6.5c0-.28.22-.5.5-.5Z"
  ],
  "GlobeRegular": [
    "M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm0-15c.66 0 1.4.59 2.02 1.9.22.47.4 1.01.56 1.6H7.42c.15-.59.34-1.13.56-1.6C8.59 3.6 9.34 3 10 3ZM7.07 4.49c-.27.59-.5 1.27-.68 2.01H3.94A7.02 7.02 0 0 1 7.7 3.38c-.24.33-.45.7-.64 1.1ZM6.2 7.5a15.97 15.97 0 0 0 0 5H3.46a6.98 6.98 0 0 1 0-5h2.73Zm.2 6c.17.74.4 1.42.68 2.01.19.4.4.78.64 1.1a7.02 7.02 0 0 1-3.77-3.11h2.45Zm1.03 0h5.16a9.25 9.25 0 0 1-.56 1.6C11.41 16.4 10.66 17 10 17c-.66 0-1.4-.59-2.02-1.9-.22-.47-.4-1.01-.56-1.6Zm5.37-1H7.21a14.87 14.87 0 0 1 0-5h5.58a14.86 14.86 0 0 1 0 5Zm.82 1h2.45a7.02 7.02 0 0 1-3.77 3.12c.24-.33.45-.7.64-1.1.27-.6.5-1.28.68-2.02Zm2.93-1h-2.73a15.97 15.97 0 0 0 0-5h2.73a6.98 6.98 0 0 1 0 5Zm-4.25-9.12a7.02 7.02 0 0 1 3.77 3.12h-2.45a10.5 10.5 0 0 0-.68-2.01c-.19-.4-.4-.78-.64-1.1Z"
  ],
  "HomeRegular": [
    "M9 2.39a1.5 1.5 0 0 1 2 0l5.5 4.94c.32.28.5.69.5 1.12v7.05c0 .83-.67 1.5-1.5 1.5H13a1.5 1.5 0 0 1-1.5-1.5V12a.5.5 0 0 0-.5-.5H9a.5.5 0 0 0-.5.5v3.5c0 .83-.67 1.5-1.5 1.5H4.5A1.5 1.5 0 0 1 3 15.5V8.45c0-.43.18-.84.5-1.12L9 2.39Zm1.33.74a.5.5 0 0 0-.66 0l-5.5 4.94a.5.5 0 0 0-.17.38v7.05c0 .28.22.5.5.5H7a.5.5 0 0 0 .5-.5V12c0-.83.67-1.5 1.5-1.5h2c.83 0 1.5.67 1.5 1.5v3.5c0 .28.22.5.5.5h2.5a.5.5 0 0 0 .5-.5V8.45a.5.5 0 0 0-.17-.38l-5.5-4.94Z"
  ],
  "LightbulbRegular": [
    "M10 2c3.31 0 6 2.6 6 5.8 0 1.68-.75 3.22-2.2 4.6a.6.6 0 0 0-.15.2l-.02.09-.94 3.92a1.84 1.84 0 0 1-1.67 1.38l-.15.01H9.13c-.82 0-1.54-.52-1.78-1.26l-.04-.14-.93-3.91a.6.6 0 0 0-.17-.3A6.32 6.32 0 0 1 4 8.04L4 7.8v-.2A5.91 5.91 0 0 1 10 2Zm2.04 13H7.96l.31 1.33.03.1c.1.3.38.52.71.56l.12.01h1.81a.86.86 0 0 0 .75-.53l.03-.1.32-1.37ZM10 3a4.92 4.92 0 0 0-4.98 4.41L5 7.63V8c.06 1.3.68 2.52 1.9 3.67.18.17.32.4.4.64l.05.15.37 1.54h4.57l.38-1.61.05-.16c.09-.21.22-.4.39-.56C14.38 10.47 15 9.18 15 7.8A4.9 4.9 0 0 0 10 3Z"
  ],
  "LocationRegular": [
    "M5.05 4.05a7 7 0 1 1 9.9 9.9l-1.13 1.12-2.43 2.37a2 2 0 0 1-2.64.12l-.14-.12-2.04-1.99-1.52-1.5a7 7 0 0 1 0-9.9Zm9.2.7a6 6 0 0 0-8.67 8.32l.17.18.58.57 2.98 2.9.09.08a1 1 0 0 0 1.2 0l.1-.08 2.22-2.17 1.32-1.3.18-.18a6 6 0 0 0-.18-8.31ZM10 6.26a2.75 2.75 0 1 1 0 5.5 2.75 2.75 0 0 1 0-5.5Zm0 1a1.75 1.75 0 1 0 0 3.5 1.75 1.75 0 0 0 0-3.5Z"
  ],
  "LockClosedRegular": [
    "M10 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM6 6h1V5a3 3 0 0 1 6 0v1h1a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V9a3 3 0 0 1 3-3Zm4-3a2 2 0 0 0-2 2v1h4V5a2 2 0 0 0-2-2Zm6 6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v6c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V9Z"
  ],
  "OpenRegular": [
    "M6 4a2 2 0 0 0-2 2v8c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2v-2.5a.5.5 0 0 1 1 0V14a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3h2.5a.5.5 0 0 1 0 1H6Zm5-.5c0-.28.22-.5.5-.5h5c.28 0 .5.22.5.5v5a.5.5 0 0 1-1 0V4.7l-4.15 4.15a.5.5 0 0 1-.7-.7L15.29 4H11.5a.5.5 0 0 1-.5-.5Z"
  ],
  "PersonRegular": [
    "M10 2a4 4 0 1 0 0 8 4 4 0 0 0 0-8ZM7 6a3 3 0 1 1 6 0 3 3 0 0 1-6 0Zm-2 5a2 2 0 0 0-2 2c0 1.7.83 2.97 2.13 3.8A9.14 9.14 0 0 0 10 18c1.85 0 3.58-.39 4.87-1.2A4.35 4.35 0 0 0 17 13a2 2 0 0 0-2-2H5Zm-1 2a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1c0 1.3-.62 2.28-1.67 2.95A8.16 8.16 0 0 1 10 17a8.16 8.16 0 0 1-4.33-1.05A3.36 3.36 0 0 1 4 13Z"
  ],
  "PinRegular": [
    "M10.12 3.14a2 2 0 0 1 3.2-.52l4.06 4.05a2 2 0 0 1-.52 3.2l-3.46 1.74a1.5 1.5 0 0 0-.72.78L11.25 16a1 1 0 0 1-1.64.33L7 13.7 3.7 17H3v-.7L6.3 13l-2.62-2.61a1 1 0 0 1 .34-1.64L7.6 7.32c.34-.14.62-.4.78-.72l1.73-3.46Zm2.5.18a1 1 0 0 0-1.6.26L9.29 7.04a2.5 2.5 0 0 1-1.31 1.2L4.39 9.69l5.93 5.93 1.43-3.59a2.5 2.5 0 0 1 1.2-1.3l3.46-1.74a1 1 0 0 0 .26-1.6l-4.05-4.06Z"
  ],
  "QuestionRegular": [
    "M10 3a4 4 0 0 0-4 4 .5.5 0 0 0 1 0 3 3 0 0 1 6 0c0 1.25-.7 1.86-1.58 2.62l-.03.03c-.86.73-1.89 1.62-1.89 3.35v.5a.5.5 0 0 0 1 0V13c0-1.25.7-1.86 1.58-2.62l.03-.03C12.97 9.62 14 8.73 14 7a4 4 0 0 0-4-4Zm0 14a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
  ],
  "SaveRegular": [
    "M3 5c0-1.1.9-2 2-2h8.38a2 2 0 0 1 1.41.59l1.62 1.62A2 2 0 0 1 17 6.62V15a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5Zm2-1a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1v-4.5c0-.83.67-1.5 1.5-1.5h7c.83 0 1.5.67 1.5 1.5V16a1 1 0 0 0 1-1V6.62a1 1 0 0 0-.3-.7L14.1 4.28a1 1 0 0 0-.71-.29H13v2.5c0 .83-.67 1.5-1.5 1.5h-4A1.5 1.5 0 0 1 6 6.5V4H5Zm2 0v2.5c0 .28.22.5.5.5h4a.5.5 0 0 0 .5-.5V4H7Zm7 12v-4.5a.5.5 0 0 0-.5-.5h-7a.5.5 0 0 0-.5.5V16h8Z"
  ],
  "SearchRegular": [
    "M12.73 13.44a6.5 6.5 0 1 1 .7-.7l3.42 3.4a.5.5 0 0 1-.63.77l-.07-.06-3.42-3.41Zm-.71-.71A5.54 5.54 0 0 0 14 8.5a5.5 5.5 0 1 0-1.98 4.23Z"
  ],
  "SendRegular": [
    "M2.18 2.11a.5.5 0 0 1 .54-.06l15 7.5a.5.5 0 0 1 0 .9l-15 7.5a.5.5 0 0 1-.7-.58L3.98 10 2.02 2.63a.5.5 0 0 1 .16-.52Zm2.7 8.39-1.61 6.06L16.38 10 3.27 3.44 4.88 9.5h6.62a.5.5 0 1 1 0 1H4.88Z"
  ],
  "SettingsRegular": [
    "M1.91 7.38A8.5 8.5 0 0 1 3.7 4.3a.5.5 0 0 1 .54-.13l1.92.68a1 1 0 0 0 1.32-.76l.36-2a.5.5 0 0 1 .4-.4 8.53 8.53 0 0 1 3.55 0c.2.04.35.2.38.4l.37 2a1 1 0 0 0 1.32.76l1.92-.68a.5.5 0 0 1 .54.13 8.5 8.5 0 0 1 1.78 3.08c.06.2 0 .4-.15.54l-1.56 1.32a1 1 0 0 0 0 1.52l1.56 1.32a.5.5 0 0 1 .15.54 8.5 8.5 0 0 1-1.78 3.08.5.5 0 0 1-.54.13l-1.92-.68a1 1 0 0 0-1.32.76l-.37 2a.5.5 0 0 1-.38.4 8.53 8.53 0 0 1-3.56 0 .5.5 0 0 1-.39-.4l-.36-2a1 1 0 0 0-1.32-.76l-1.92.68a.5.5 0 0 1-.54-.13 8.5 8.5 0 0 1-1.78-3.08.5.5 0 0 1 .15-.54l1.56-1.32a1 1 0 0 0 0-1.52L2.06 7.92a.5.5 0 0 1-.15-.54Zm1.06 0 1.3 1.1a2 2 0 0 1 0 3.04l-1.3 1.1c.3.79.72 1.51 1.25 2.16l1.6-.58a2 2 0 0 1 2.63 1.53l.3 1.67a7.56 7.56 0 0 0 2.5 0l.3-1.67a2 2 0 0 1 2.64-1.53l1.6.58a7.5 7.5 0 0 0 1.24-2.16l-1.3-1.1a2 2 0 0 1 0-3.04l1.3-1.1a7.5 7.5 0 0 0-1.25-2.16l-1.6.58a2 2 0 0 1-2.63-1.53l-.3-1.67a7.55 7.55 0 0 0-2.5 0l-.3 1.67A2 2 0 0 1 5.81 5.8l-1.6-.58a7.5 7.5 0 0 0-1.24 2.16ZM7.5 10a2.5 2.5 0 1 1 5 0 2.5 2.5 0 0 1-5 0Zm1 0a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0Z"
  ],
  "WrenchRegular": [
    "M9 6.5a4.5 4.5 0 0 1 6.35-4.1.5.5 0 0 1 .15.8l-2.3 2.3 1.3 1.3 2.3-2.3a.5.5 0 0 1 .8.15A4.49 4.49 0 0 1 13.5 11a4.5 4.5 0 0 1-1.1-.14l-6.37 6.45a2.36 2.36 0 0 1-3.37-3.3l6.42-6.65A4.52 4.52 0 0 1 9 6.5ZM13.5 3a3.5 3.5 0 0 0-3.39 4.39.5.5 0 0 1-.12.47L3.38 14.7a1.36 1.36 0 0 0 1.94 1.9l6.57-6.66a.5.5 0 0 1 .51-.12 3.5 3.5 0 0 0 4.53-4.05l-2.08 2.07a.5.5 0 0 1-.7 0l-2-2a.5.5 0 0 1 0-.7l2.07-2.08A3.52 3.52 0 0 0 13.5 3Z"
  ]
};

const C = {
  navy: '#001640',
  brand: '#0078D4',
  canvas: '#FAFAFA',
  nav: '#F3F2F1',
  white: '#FFFFFF',
  text: '#323130',
  secondary: '#605E5C',
  disabled: '#A19F9D',
  stroke: '#E1DFDD',
  field: '#F3F2F1',
  hover: '#EDEBE9',
  red: '#C50F1F',
  errorBackground: '#FDE7E9',
  yellow: '#FFE399',
};

const STATUS = {
  'Awaiting allocation': { background: '#E5E6E7', text: '#282D30' },
  'Assessment in progress': { background: '#CFE4F8', text: '#0C2D4A' },
  'Awaiting applicant': { background: '#FDF2CC', text: '#5C4400' },
  Consultation: { background: '#FBE2C4', text: '#6B3B00' },
};

const AVATARS = {
  'Sam Evans': '#FFE399',
  'Rachel Patel': '#7BC67B',
  'Gary Whitfield': '#A83CC2',
  'James Okafor': '#4AA3DF',
};

const TEXT_SPECS = {
  body: { size: 14, line: 20, weight: 'regular' },
  small: { size: 12, line: 16, weight: 'regular' },
  label: { size: 14, line: 20, weight: 'semibold' },
  section: { size: 16, line: 22, weight: 'semibold' },
  title: { size: 24, line: 32, weight: 'semibold' },
  product: { size: 16, line: 22, weight: 'semibold' },
};

let fonts;
let styles;

function rgb(hex) {
  const value = hex.replace('#', '');
  return {
    r: parseInt(value.slice(0, 2), 16) / 255,
    g: parseInt(value.slice(2, 4), 16) / 255,
    b: parseInt(value.slice(4, 6), 16) / 255,
  };
}

function paint(hex, opacity = 1) {
  return [{ type: 'SOLID', color: rgb(hex), opacity }];
}

function readableTextOn(hex) {
  const color = rgb(hex);
  const linear = value => value <= 0.03928 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4);
  const luminance = (0.2126 * linear(color.r)) + (0.7152 * linear(color.g)) + (0.0722 * linear(color.b));
  return luminance > 0.42 ? C.text : C.white;
}

async function loadPreferredFonts() {
  const candidates = [
    {
      regular: { family: 'Segoe UI', style: 'Regular' },
      semibold: { family: 'Segoe UI', style: 'Semibold' },
    },
    {
      regular: { family: 'Inter', style: 'Regular' },
      semibold: { family: 'Inter', style: 'Semi Bold' },
    },
  ];

  for (const candidate of candidates) {
    try {
      await Promise.all([
        figma.loadFontAsync(candidate.regular),
        figma.loadFontAsync(candidate.semibold),
      ]);
      return candidate;
    } catch (_) {
      // Try the next locally available font family.
    }
  }
  throw new Error('Segoe UI or Inter must be available in Figma.');
}

function ensureTextStyle(name, spec, runLabel) {
  const fullName = `D365 / ${runLabel} / ${name}`;
  let style = figma.getLocalTextStyles().find(item => item.name === fullName);
  if (!style) style = figma.createTextStyle();
  style.name = fullName;
  style.fontName = fonts[spec.weight];
  style.fontSize = spec.size;
  style.lineHeight = { value: spec.line, unit: 'PIXELS' };
  return style;
}

function ensurePaintStyle(name, hex, runLabel) {
  const fullName = `D365 / ${runLabel} / ${name}`;
  let style = figma.getLocalPaintStyles().find(item => item.name === fullName);
  if (!style) style = figma.createPaintStyle();
  style.name = fullName;
  style.paints = paint(hex);
  return style;
}

function ensureStyles(runLabel) {
  const text = {};
  for (const [name, spec] of Object.entries(TEXT_SPECS)) {
    text[name] = ensureTextStyle(name, spec, runLabel);
  }
  return {
    text,
    paint: {
      brand: ensurePaintStyle('Brand', C.brand, runLabel),
      navy: ensurePaintStyle('Global header', C.navy, runLabel),
      canvas: ensurePaintStyle('Canvas', C.canvas, runLabel),
      nav: ensurePaintStyle('Navigation', C.nav, runLabel),
      field: ensurePaintStyle('Read-only field', C.field, runLabel),
      text: ensurePaintStyle('Text', C.text, runLabel),
      secondary: ensurePaintStyle('Secondary text', C.secondary, runLabel),
      stroke: ensurePaintStyle('Divider', C.stroke, runLabel),
    },
  };
}

function fillStyleFor(color) {
  if (!styles) return null;
  const matches = {
    [C.brand]: styles.paint.brand,
    [C.navy]: styles.paint.navy,
    [C.canvas]: styles.paint.canvas,
    [C.nav]: styles.paint.nav,
    [C.field]: styles.paint.field,
    [C.text]: styles.paint.text,
    [C.secondary]: styles.paint.secondary,
    [C.stroke]: styles.paint.stroke,
  };
  return matches[color] || null;
}

function makeText(name, value, styleName = 'body', color = C.text, width) {
  const node = figma.createText();
  node.name = name;
  node.fontName = fonts[TEXT_SPECS[styleName].weight];
  node.textStyleId = styles.text[styleName].id;
  node.fills = paint(color);
  const fillStyle = fillStyleFor(color);
  if (fillStyle) node.fillStyleId = fillStyle.id;
  node.characters = value;
  if (width) {
    node.resize(width, Math.max(TEXT_SPECS[styleName].line, 1));
    node.textAutoResize = 'HEIGHT';
  } else {
    node.textAutoResize = 'WIDTH_AND_HEIGHT';
  }
  return node;
}

function makeIcon(name, iconName, size = 20, color = C.text) {
  const paths = FLUENT_ICONS[iconName];
  if (!paths) throw new Error(`Unknown Fluent icon: ${iconName}`);
  const svg = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 20 20" fill="${color}">`,
    ...paths.map(path => `<path d="${path}"/>`),
    '</svg>',
  ].join('');
  const node = figma.createNodeFromSvg(svg);
  node.name = name;
  node.resize(size, size);
  return node;
}

function makeResizeGrip() {
  const svg = [
    '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">',
    `<path d="M11 4L4 11M11 8L8 11" stroke="${C.secondary}" stroke-width="1" stroke-linecap="round"/>`,
    '</svg>',
  ].join('');
  const node = figma.createNodeFromSvg(svg);
  node.name = 'Resize handle';
  node.resize(12, 12);
  return node;
}

function makeAppLauncher() {
  const frame = fixedFrame('App launcher', 24, 24);
  for (let row = 0; row < 3; row += 1) {
    for (let column = 0; column < 3; column += 1) {
      const dot = figma.createRectangle();
      dot.name = 'App launcher dot';
      dot.resize(3, 3);
      dot.x = 5 + column * 6;
      dot.y = 5 + row * 6;
      dot.cornerRadius = 1.5;
      dot.fills = paint(C.white);
      frame.appendChild(dot);
    }
  }
  return frame;
}

function makeEmptyCheckbox(name = 'Checkbox') {
  const frame = fixedFrame(name, 20, 20);
  const box = figma.createRectangle();
  box.name = 'Checkbox box';
  box.resize(16, 16);
  box.x = 2;
  box.y = 2;
  box.cornerRadius = 2;
  box.fills = [];
  box.strokes = paint(C.secondary);
  box.strokeWeight = 1;
  frame.appendChild(box);
  return frame;
}

function fixedFrame(name, width, height, fill = null) {
  const node = figma.createFrame();
  node.name = name;
  node.resize(width, height);
  node.clipsContent = false;
  node.fills = fill ? paint(fill) : [];
  const fillStyle = fill && fillStyleFor(fill);
  if (fillStyle) node.fillStyleId = fillStyle.id;
  return node;
}

function verticalFrame(name, width, gap = 0, padding = 0, fill = null) {
  const node = fixedFrame(name, width, 1, fill);
  node.layoutMode = 'VERTICAL';
  node.primaryAxisSizingMode = 'AUTO';
  node.counterAxisSizingMode = 'FIXED';
  node.itemSpacing = gap;
  node.paddingTop = padding;
  node.paddingRight = padding;
  node.paddingBottom = padding;
  node.paddingLeft = padding;
  return node;
}

function horizontalFrame(name, width, height, gap = 0, paddingX = 0, fill = null) {
  const node = fixedFrame(name, width, height, fill);
  node.layoutMode = 'HORIZONTAL';
  node.primaryAxisSizingMode = 'FIXED';
  node.counterAxisSizingMode = 'FIXED';
  node.itemSpacing = gap;
  node.paddingLeft = paddingX;
  node.paddingRight = paddingX;
  node.primaryAxisAlignItems = 'MIN';
  node.counterAxisAlignItems = 'CENTER';
  return node;
}

function applyCard(node) {
  node.fills = paint(C.white);
  node.cornerRadius = 4;
  node.strokes = paint(C.stroke);
  node.strokeWeight = 1;
  node.effects = [{
    type: 'DROP_SHADOW',
    color: { ...rgb('#000000'), a: 0.14 },
    offset: { x: 0, y: 3 },
    radius: 6,
    spread: 0,
    visible: true,
    blendMode: 'NORMAL',
  }];
}

function addLine(parent, name, width, color = C.stroke) {
  const line = figma.createRectangle();
  line.name = name;
  line.resize(width, 1);
  line.fills = paint(color);
  const fillStyle = fillStyleFor(color);
  if (fillStyle) line.fillStyleId = fillStyle.id;
  parent.appendChild(line);
  return line;
}

function setText(root, name, value) {
  const node = root.findOne(item => item.type === 'TEXT' && item.name === name);
  if (node) node.characters = value;
}

function initials(name) {
  return name.split(' ').filter(Boolean).map(part => part[0]).join('').slice(0, 2).toUpperCase();
}

function createCheckboxComponent(page) {
  const component = figma.createComponent();
  component.name = 'D365 / Checkbox / Checked';
  component.resize(20, 20);
  component.fills = [];
  const box = figma.createRectangle();
  box.name = 'Checkbox box';
  box.resize(16, 16);
  box.x = 2;
  box.y = 2;
  box.cornerRadius = 2;
  box.fills = paint(C.brand);
  const tick = makeText('Checkbox mark', '✓', 'small', C.white);
  tick.x = 4;
  tick.y = 1;
  component.appendChild(box);
  component.appendChild(tick);
  page.appendChild(component);
  return component;
}

function createAvatarComponent(page) {
  const component = figma.createComponent();
  component.name = 'D365 / User avatar';
  component.resize(24, 24);
  component.cornerRadius = 12;
  component.fills = paint(C.yellow);
  const label = makeText('Avatar initials', 'SE', 'small', C.text);
  label.textAlignHorizontal = 'CENTER';
  label.resize(24, 16);
  label.x = 0;
  label.y = 4;
  component.appendChild(label);
  page.appendChild(component);
  return component;
}

function createStatusComponent(page) {
  const component = figma.createComponent();
  component.name = 'D365 / Status label';
  component.resize(160, 26);
  component.layoutMode = 'HORIZONTAL';
  component.primaryAxisSizingMode = 'AUTO';
  component.counterAxisSizingMode = 'FIXED';
  component.counterAxisAlignItems = 'CENTER';
  component.paddingLeft = 8;
  component.paddingRight = 8;
  component.cornerRadius = 2;
  component.fills = paint(STATUS['Assessment in progress'].background);
  component.appendChild(makeText('Status', 'Assessment in progress', 'body', STATUS['Assessment in progress'].text));
  page.appendChild(component);
  return component;
}

function createDividerComponent(page) {
  const component = figma.createComponent();
  component.name = 'D365 / Section divider';
  component.resize(1278, 1);
  component.fills = paint(C.stroke);
  component.fillStyleId = styles.paint.stroke.id;
  page.appendChild(component);
  return component;
}

function createFieldComponents(page) {
  const readOnly = figma.createComponent();
  readOnly.name = 'D365 / Read-only field';
  readOnly.resize(900, 1);
  readOnly.layoutMode = 'VERTICAL';
  readOnly.primaryAxisSizingMode = 'AUTO';
  readOnly.counterAxisSizingMode = 'FIXED';
  readOnly.paddingTop = 8;
  readOnly.paddingRight = 12;
  readOnly.paddingBottom = 8;
  readOnly.paddingLeft = 12;
  readOnly.cornerRadius = 2;
  readOnly.fills = paint(C.field);
  readOnly.fillStyleId = styles.paint.field.id;
  readOnly.appendChild(makeText('Field value', 'Field value', 'body', C.text, 876));
  page.appendChild(readOnly);

  const dropdown = figma.createComponent();
  dropdown.name = 'D365 / Dropdown field';
  dropdown.resize(900, 32);
  dropdown.layoutMode = 'HORIZONTAL';
  dropdown.primaryAxisSizingMode = 'FIXED';
  dropdown.counterAxisSizingMode = 'FIXED';
  dropdown.primaryAxisAlignItems = 'SPACE_BETWEEN';
  dropdown.counterAxisAlignItems = 'CENTER';
  dropdown.paddingLeft = 12;
  dropdown.paddingRight = 10;
  dropdown.cornerRadius = 2;
  dropdown.fills = paint(C.field);
  dropdown.fillStyleId = styles.paint.field.id;
  const dropdownValue = makeText('Field value', '---', 'body', C.disabled, 842);
  dropdownValue.textTruncation = 'ENDING';
  dropdownValue.maxLines = 1;
  dropdown.appendChild(dropdownValue);
  dropdown.appendChild(makeIcon('Dropdown chevron', 'ChevronDownRegular', 16, C.secondary));
  page.appendChild(dropdown);

  const url = figma.createComponent();
  url.name = 'D365 / Read-only URL field';
  url.resize(900, 32);
  url.layoutMode = 'HORIZONTAL';
  url.primaryAxisSizingMode = 'FIXED';
  url.counterAxisSizingMode = 'FIXED';
  url.primaryAxisAlignItems = 'SPACE_BETWEEN';
  url.counterAxisAlignItems = 'CENTER';
  url.paddingLeft = 12;
  url.paddingRight = 8;
  url.cornerRadius = 2;
  url.fills = paint(C.field);
  url.fillStyleId = styles.paint.field.id;
  const urlText = makeText('Field value', 'https://example.invalid', 'body', C.brand, 830);
  urlText.textTruncation = 'ENDING';
  urlText.maxLines = 1;
  url.appendChild(urlText);
  url.appendChild(makeIcon('Open URL', 'GlobeRegular', 20, C.secondary));
  page.appendChild(url);

  const help = figma.createComponent();
  help.name = 'D365 / Help link';
  help.resize(1128, 24);
  help.layoutMode = 'HORIZONTAL';
  help.primaryAxisSizingMode = 'AUTO';
  help.counterAxisSizingMode = 'AUTO';
  help.counterAxisAlignItems = 'MIN';
  help.itemSpacing = 8;
  help.appendChild(makeIcon('Disclosure chevron', 'ChevronRightRegular', 20, C.brand));
  help.appendChild(makeText('Help text', 'Help with personal information', 'body', C.brand, 1100));
  page.appendChild(help);

  const validation = figma.createComponent();
  validation.name = 'D365 / Validation message';
  validation.resize(900, 20);
  validation.layoutMode = 'HORIZONTAL';
  validation.primaryAxisSizingMode = 'FIXED';
  validation.counterAxisSizingMode = 'AUTO';
  validation.counterAxisAlignItems = 'MIN';
  validation.itemSpacing = 8;
  validation.appendChild(makeIcon('Validation icon', 'ErrorCircleRegular', 20, C.red));
  validation.appendChild(makeText('Validation message', 'Enter a value before continuing.', 'body', C.red, 872));
  page.appendChild(validation);

  return { readOnly, dropdown, url, help, validation };
}

function createQuestionRow(page, name, fieldComponent, decoration, multiline = false, editable = false) {
  const component = figma.createComponent();
  component.name = `D365 / Form question row / ${name}`;
  component.resize(1278, 1);
  component.layoutMode = 'HORIZONTAL';
  component.primaryAxisSizingMode = 'FIXED';
  component.counterAxisSizingMode = 'AUTO';
  component.counterAxisAlignItems = 'MIN';
  component.itemSpacing = 0;

  // Figma's Segoe UI metrics wrap a little earlier than the browser. The extra
  // label width keeps the reference's three-line long question while retaining
  // the same 378px D365 label/decorations column before every control.
  const label = verticalFrame('Content', 336, 0, 0);
  label.appendChild(makeText('Question', multiline ? 'Question wrapping over two lines' : 'Question', 'body', C.text, 336));
  component.appendChild(label);

  component.appendChild(fixedFrame('Label spacing', 8, 1));

  const marker = horizontalFrame('Field decoration', 26, 32, 0, 0);
  marker.primaryAxisAlignItems = 'MAX';
  if (decoration === 'required') {
    marker.appendChild(makeText('Required indicator', '*', 'body', C.red));
  } else if (decoration === 'locked') {
    marker.appendChild(makeIcon('Read-only indicator', 'LockClosedRegular', 16, C.secondary));
  } else {
    marker.appendChild(fixedFrame('No field decoration', 16, 16));
  }
  component.appendChild(marker);

  component.appendChild(fixedFrame('Field spacing', 8, 1));

  const field = fieldComponent.createInstance();
  field.name = name === 'URL' ? 'Read-only URL field' : name.includes('Dropdown') ? 'Dropdown field' : 'Read-only field';
  if (editable) {
    field.name = 'Multiline text field';
    field.fills = paint(C.field);
    field.fillStyleId = styles.paint.field.id;
    field.strokes = [];
    field.strokeWeight = 0;
  }
  if (multiline) {
    const fieldHeight = editable ? 112 : 136;
    field.resize(900, fieldHeight);
    field.minHeight = fieldHeight;
  } else {
    field.resize(900, field.height);
  }
  component.appendChild(field);
  if (editable) {
    const grip = makeResizeGrip();
    component.appendChild(grip);
    grip.layoutPositioning = 'ABSOLUTE';
    grip.x = 1264;
    grip.y = 98;
    grip.constraints = { horizontal: 'MAX', vertical: 'MAX' };
  }
  page.appendChild(component);
  return component;
}

function createGlobalHeader(page, shell) {
  const component = figma.createComponent();
  component.name = 'D365 / Global header';
  component.resize(1640, 48);
  component.layoutMode = 'HORIZONTAL';
  component.primaryAxisSizingMode = 'FIXED';
  component.counterAxisSizingMode = 'FIXED';
  component.primaryAxisAlignItems = 'SPACE_BETWEEN';
  component.counterAxisAlignItems = 'CENTER';
  component.paddingLeft = 20;
  component.paddingRight = 20;
  component.fills = paint(C.navy);
  component.fillStyleId = styles.paint.navy.id;

  const left = horizontalFrame('Product', 500, 48, 12, 0);
  left.primaryAxisSizingMode = 'AUTO';
  left.fills = [];
  left.appendChild(makeAppLauncher());
  left.appendChild(makeText('Product name', shell.product, 'product', C.white));
  left.appendChild(makeText('Product divider', '|', 'product', '#9AA7BD'));
  left.appendChild(makeText('Service name', shell.service, 'product', C.white));
  component.appendChild(left);

  const right = horizontalFrame('Global actions', 280, 48, 20, 0);
  right.primaryAxisSizingMode = 'AUTO';
  right.fills = [];
  for (const icon of ['SearchRegular', 'LightbulbRegular', 'AddRegular', 'SettingsRegular', 'QuestionRegular']) {
    right.appendChild(makeIcon('Global action', icon, 20, C.white));
  }
  const avatar = fixedFrame('Signed-in user avatar', 32, 32, C.yellow);
  avatar.cornerRadius = 16;
  const avatarText = makeText('Signed-in user initials', initials(shell.signedInUser), 'body', C.text, 32);
  avatarText.textAlignHorizontal = 'CENTER';
  avatarText.y = 6;
  avatar.appendChild(avatarText);
  right.appendChild(avatar);
  component.appendChild(right);
  page.appendChild(component);
  return component;
}

function createLeftNav(page, shell) {
  const component = figma.createComponent();
  component.name = 'D365 / Left navigation';
  component.resize(248, 1184);
  component.layoutMode = 'VERTICAL';
  component.primaryAxisSizingMode = 'FIXED';
  component.counterAxisSizingMode = 'FIXED';
  component.paddingTop = 8;
  component.fills = paint(C.nav);
  component.fillStyleId = styles.paint.nav.id;
  component.strokes = paint(C.stroke);
  component.strokeRightWeight = 1;

  for (const item of shell.navigation) {
    if (item.kind === 'group') {
      const spacing = fixedFrame('Navigation group spacing', 248, 16);
      spacing.fills = [];
      component.appendChild(spacing);
      const group = horizontalFrame('Navigation group', 248, 40, 0, 16);
      group.fills = [];
      group.appendChild(makeText('Navigation group label', item.label, 'label', C.text));
      component.appendChild(group);
      continue;
    }
    const row = horizontalFrame(`Navigation item / ${item.label}`, 248, 40, 10, 0, item.selected ? C.white : null);
    const selectedBar = figma.createRectangle();
    selectedBar.name = 'Selected indicator';
    selectedBar.resize(item.selected ? 5 : 3, 40);
    selectedBar.fills = item.selected ? paint(C.brand) : [];
    row.appendChild(selectedBar);
    row.appendChild(makeIcon('Navigation icon', item.icon, 16, item.selected ? C.brand : C.secondary));
    const label = makeText('Navigation item label', item.label, 'body', C.text, item.chevron ? 162 : 190);
    label.textTruncation = 'ENDING';
    label.maxLines = 1;
    row.appendChild(label);
    if (item.chevron) row.appendChild(makeIcon('Navigation chevron', 'ChevronDownRegular', 16, C.text));
    component.appendChild(row);
  }
  page.appendChild(component);
  return component;
}

function createCommandBar(page, save) {
  const component = figma.createComponent();
  component.name = `D365 / Command bar / ${save ? 'Save and close' : 'List'}`;
  component.resize(1320, 40);
  component.layoutMode = 'HORIZONTAL';
  component.primaryAxisSizingMode = 'FIXED';
  component.counterAxisSizingMode = 'FIXED';
  component.counterAxisAlignItems = 'CENTER';
  component.itemSpacing = 12;
  component.paddingLeft = 16;
  component.paddingRight = 16;
  applyCard(component);
  component.appendChild(makeIcon('Back action', 'ArrowLeftRegular', 20, save ? C.text : C.disabled));
  component.appendChild(makeIcon('Open in new window', 'OpenRegular', 20, C.text));
  if (save) {
    const divider = figma.createRectangle();
    divider.name = 'Command divider';
    divider.resize(1, 20);
    divider.fills = paint(C.stroke);
    component.appendChild(divider);
    component.appendChild(makeIcon('Save icon', 'SaveRegular', 20, C.text));
    component.appendChild(makeText('Primary action', 'Save and close', 'body', C.text));
  }
  page.appendChild(component);
  return component;
}

function createCaseCommandBar(page) {
  const component = figma.createComponent();
  component.name = 'D365 / Command bar / Case summary';
  component.resize(1320, 40);
  component.layoutMode = 'HORIZONTAL';
  component.primaryAxisSizingMode = 'FIXED';
  component.counterAxisSizingMode = 'FIXED';
  component.counterAxisAlignItems = 'CENTER';
  component.itemSpacing = 10;
  component.paddingLeft = 16;
  component.paddingRight = 16;
  applyCard(component);
  component.appendChild(makeIcon('Back action', 'ArrowLeftRegular', 20, C.disabled));
  component.appendChild(makeIcon('Open in new window', 'OpenRegular', 20, C.text));
  component.appendChild(makeIcon('Transfer action icon', 'SendRegular', 20, C.text));
  component.appendChild(makeText('Primary action', 'Request transfer to MCMS', 'body', C.text));
  component.appendChild(makeIcon('Reject action icon', 'DismissSquareRegular', 20, C.text));
  component.appendChild(makeText('Secondary action', 'Reject application', 'body', C.text));
  page.appendChild(component);
  return component;
}

function createFormNotification(page) {
  const component = figma.createComponent();
  component.name = 'D365 / Form notification / Error';
  component.resize(1320, 40);
  component.layoutMode = 'HORIZONTAL';
  component.primaryAxisSizingMode = 'FIXED';
  component.counterAxisSizingMode = 'FIXED';
  component.counterAxisAlignItems = 'CENTER';
  component.itemSpacing = 8;
  component.paddingLeft = 12;
  component.paddingRight = 12;
  component.fills = paint(C.errorBackground);
  component.strokes = paint(C.stroke);
  component.strokeBottomWeight = 1;
  component.appendChild(makeIcon('Notification icon', 'DismissCircleFilled', 16, C.red));
  component.appendChild(makeText('Validation message', 'Required fields must be filled in.', 'body', C.text, 1268));
  page.appendChild(component);
  return component;
}

function createTaskListRow(page) {
  const component = figma.createComponent();
  component.name = 'D365 / Task list row';
  component.resize(240, 60);
  component.layoutMode = 'VERTICAL';
  component.primaryAxisSizingMode = 'FIXED';
  component.counterAxisSizingMode = 'FIXED';
  component.paddingTop = 10;
  component.paddingRight = 28;
  component.paddingBottom = 9;
  component.fills = [];
  component.appendChild(makeText('Task name', 'Site check', 'label', C.text, 204));
  component.appendChild(makeText('Task status', 'To do', 'body', C.secondary, 204));
  const more = makeText('Task actions', '⋯', 'body', C.text);
  component.appendChild(more);
  more.layoutPositioning = 'ABSOLUTE';
  more.x = 220;
  more.y = 10;
  const divider = addLine(component, 'Task row divider', 240);
  divider.layoutPositioning = 'ABSOLUTE';
  divider.x = 0;
  divider.y = 59;
  page.appendChild(component);
  return component;
}

function createCaseHeader(page, description) {
  const component = figma.createComponent();
  component.name = 'D365 / Case record header';
  component.resize(1320, 152);
  applyCard(component);

  const titleGroup = horizontalFrame('Case identity', 680, 72, 12, 0);
  titleGroup.x = 20;
  titleGroup.y = 12;
  const caseAvatar = fixedFrame('Case avatar', 48, 48, '#D9A7E8');
  caseAvatar.cornerRadius = 24;
  const caseInitial = makeText('Case avatar initial', 'I', 'title', C.white, 48);
  caseInitial.textAlignHorizontal = 'CENTER';
  caseInitial.y = 8;
  caseAvatar.appendChild(caseInitial);
  titleGroup.appendChild(caseAvatar);
  const titleText = verticalFrame('Case title group', 620, 0, 0);
  const title = makeText('Page heading', description.title, 'title', C.text, 620);
  titleText.appendChild(title);
  titleText.appendChild(makeText('Record type', description.recordType, 'body', C.text));
  titleGroup.appendChild(titleText);
  component.appendChild(titleGroup);

  const meta = horizontalFrame('Case metadata', 560, 64, 24, 0);
  meta.primaryAxisAlignItems = 'MAX';
  meta.x = 740;
  meta.y = 16;
  for (const item of description.meta) {
    const groupWidth = item.avatar
      ? 124
      : item.label === 'Status'
        ? 140
        : item.label === 'Reference'
          ? 120
          : 70;
    const group = verticalFrame(`Metadata / ${item.label}`, groupWidth, 0, 0);
    if (item.avatar) {
      const assigned = horizontalFrame('Assigned user', 124, 40, 8, 0);
      const avatar = fixedFrame('Assignee avatar', 32, 32, C.yellow);
      avatar.cornerRadius = 16;
      const initialsText = makeText('Avatar initials', initials(item.value), 'small', C.text, 32);
      initialsText.textAlignHorizontal = 'CENTER';
      initialsText.y = 8;
      avatar.appendChild(initialsText);
      assigned.appendChild(avatar);
      const assignedText = verticalFrame('Assigned user text', 84, 0, 0);
      assignedText.appendChild(makeText(`Meta value / ${item.label}`, item.value, 'body', C.text, 84));
      assignedText.appendChild(makeText(`Meta label / ${item.label}`, item.label, 'small', C.secondary));
      assigned.appendChild(assignedText);
      group.appendChild(assigned);
    } else {
      group.appendChild(makeText(`Meta value / ${item.label}`, item.value, 'body', C.text, groupWidth));
      group.appendChild(makeText(`Meta label / ${item.label}`, item.label, 'small', C.secondary));
    }
    meta.appendChild(group);
  }
  component.appendChild(meta);

  const tabs = horizontalFrame('Case tabs', 1280, 48, 28, 0);
  tabs.x = 20;
  tabs.y = 104;
  tabs.counterAxisAlignItems = 'CENTER';
  description.tabs.forEach((label, index) => {
    const tab = fixedFrame(`Tab / ${label}`, index === 0 ? 104 : Math.max(110, label.length * 8), 48);
    const tabText = makeText('Tab label', label, index === 0 ? 'label' : 'body', C.text);
    tabText.x = 0;
    tabText.y = 14;
    tab.appendChild(tabText);
    if (index === 0) {
      const indicator = addLine(tab, 'Selected tab indicator', 104, C.brand);
      indicator.resize(104, 3);
      indicator.x = 0;
      indicator.y = 45;
    }
    tabs.appendChild(tab);
  });
  component.appendChild(tabs);
  page.appendChild(component);
  return component;
}

function createTableComponents(page, checkbox, avatar, status) {
  const header = figma.createComponent();
  header.name = 'D365 / Table header';
  header.resize(1278, 44);
  header.layoutMode = 'HORIZONTAL';
  header.primaryAxisSizingMode = 'FIXED';
  header.counterAxisSizingMode = 'FIXED';
  header.fills = [];

  const select = horizontalFrame('Select column', 46, 44, 0, 12);
  select.appendChild(makeEmptyCheckbox('Select all'));
  header.appendChild(select);
  for (const column of DESCRIPTIONS.caseList.columns) {
    const cell = horizontalFrame(`Column / ${column.key}`, column.width, 44, 4, 12);
    cell.primaryAxisAlignItems = column.align === 'right' ? 'MAX' : 'MIN';
    cell.appendChild(makeText('Column label', column.label, 'label', C.text));
    if (column.sorted) cell.appendChild(makeIcon('Sort direction', 'ArrowUpRegular', 16, C.secondary));
    cell.appendChild(makeIcon('Column menu', 'ChevronDownRegular', 16, C.secondary));
    header.appendChild(cell);
  }
  const headerLine = addLine(header, 'Header divider', 1278);
  headerLine.layoutPositioning = 'ABSOLUTE';
  headerLine.x = 0;
  headerLine.y = 43;
  page.appendChild(header);

  const row = figma.createComponent();
  row.name = 'D365 / Table row';
  row.resize(1278, 45);
  row.layoutMode = 'HORIZONTAL';
  row.primaryAxisSizingMode = 'FIXED';
  row.counterAxisSizingMode = 'FIXED';
  row.fills = [];

  const checkCell = horizontalFrame('Select column', 46, 45, 0, 12);
  checkCell.appendChild(makeEmptyCheckbox('Row checkbox'));
  row.appendChild(checkCell);

  const reference = horizontalFrame('Reference column', 172, 45, 0, 12);
  reference.appendChild(makeText('Reference', 'MLA/2026/10001', 'body', C.brand, 148));
  row.appendChild(reference);

  const project = horizontalFrame('Application name column', 284, 45, 0, 12);
  const projectText = makeText('Application name', 'Application name', 'body', C.text, 260);
  projectText.textTruncation = 'ENDING';
  projectText.maxLines = 1;
  project.appendChild(projectText);
  row.appendChild(project);

  const assigned = horizontalFrame('Assigned to column', 182, 45, 8, 12);
  const avatarInstance = avatar.createInstance();
  avatarInstance.name = 'Assignee avatar';
  assigned.appendChild(avatarInstance);
  const assigneeText = makeText('Assigned to', 'Sam Evans', 'body', C.text, 118);
  assigneeText.textTruncation = 'ENDING';
  assigneeText.maxLines = 1;
  assigned.appendChild(assigneeText);
  row.appendChild(assigned);

  const statusCell = horizontalFrame('Status column', 255, 45, 0, 12);
  const statusInstance = status.createInstance();
  statusInstance.name = 'Status label';
  statusCell.appendChild(statusInstance);
  row.appendChild(statusCell);

  const age = horizontalFrame('Case age column', 149, 45, 0, 12);
  age.primaryAxisAlignItems = 'MAX';
  age.appendChild(makeText('Case age', '1', 'body', C.text));
  row.appendChild(age);

  const notification = horizontalFrame('Notifications column', 190, 45, 0, 12);
  notification.appendChild(makeText('Notifications', 'Message received', 'body', C.text, 166));
  row.appendChild(notification);
  const rowLine = addLine(row, 'Row divider', 1278);
  rowLine.layoutPositioning = 'ABSOLUTE';
  rowLine.x = 0;
  rowLine.y = 44;
  page.appendChild(row);
  return { header, row };
}

function nextHorizontalPosition(page, minimum = 80, gap = 160) {
  if (!page.children.length) return minimum;
  const furthestRight = page.children.reduce((right, node) => Math.max(right, node.x + node.width), 0);
  return Math.max(minimum, furthestRight + gap);
}

function createComponentLibrary(page, runLabel) {
  page.backgrounds = paint('#F5F5F5');
  const firstNewNode = page.children.length;
  const batchX = nextHorizontalPosition(page);

  const checkbox = createCheckboxComponent(page);
  const avatar = createAvatarComponent(page);
  const status = createStatusComponent(page);
  const divider = createDividerComponent(page);
  const fields = createFieldComponents(page);
  const rows = {
    readOnly: createQuestionRow(page, 'Read only', fields.readOnly, 'locked'),
    readOnlyMultiline: createQuestionRow(page, 'Read only multiline', fields.readOnly, 'locked', true),
    dropdown: createQuestionRow(page, 'Dropdown', fields.dropdown, 'required'),
    textarea: createQuestionRow(page, 'Multiline text', fields.readOnly, 'required', true, true),
    textareaOptional: createQuestionRow(page, 'Multiline text optional', fields.readOnly, 'none', true, true),
    url: createQuestionRow(page, 'URL', fields.url, 'locked'),
  };
  const globalHeader = createGlobalHeader(page, DESCRIPTIONS.shell);
  const leftNav = createLeftNav(page, DESCRIPTIONS.shell);
  const commandList = createCommandBar(page, false);
  const commandSave = createCommandBar(page, true);
  const commandCase = createCaseCommandBar(page);
  const formNotification = createFormNotification(page);
  const taskListRow = createTaskListRow(page);
  const caseHeader = createCaseHeader(page, DESCRIPTIONS.caseSummaryStates[0]);
  const table = createTableComponents(page, checkbox, avatar, status);

  const card = figma.createComponent();
  card.name = 'D365 / Content card';
  card.resize(520, 120);
  applyCard(card);
  page.appendChild(card);

  const created = page.children.slice(firstNewNode);
  let x = batchX;
  let y = 100;
  for (const node of created) {
    node.x = x;
    node.y = y;
    y += node.height + 48;
    if (y > 2800) { y = 100; x += 1740; }
  }
  const batchLabel = makeText(`Generated ${runLabel}`, `Generated ${runLabel}`, 'section', C.text);
  batchLabel.x = batchX;
  batchLabel.y = 48;
  page.appendChild(batchLabel);
  return {
    checkbox,
    avatar,
    status,
    divider,
    fields,
    rows,
    globalHeader,
    leftNav,
    commandList,
    commandSave,
    commandCase,
    formNotification,
    taskListRow,
    caseHeader,
    table,
    card,
  };
}

function addShell(screen, components, save, screenHeight = 1232, commandComponent = null) {
  const background = fixedFrame('Application canvas', 1640, screenHeight, C.canvas);
  screen.appendChild(background);

  const header = components.globalHeader.createInstance();
  header.name = 'Global header';
  header.x = 0;
  header.y = 0;
  screen.appendChild(header);

  const nav = components.leftNav.createInstance();
  nav.name = 'Left navigation';
  nav.resize(248, screenHeight - 48);
  nav.x = 0;
  nav.y = 48;
  screen.appendChild(nav);

  const rail = fixedFrame('Right utility rail', 30, screenHeight - 48, C.nav);
  rail.x = 1610;
  rail.y = 48;
  rail.strokes = paint(C.stroke);
  rail.strokeLeftWeight = 1;
  screen.appendChild(rail);

  const commandSource = commandComponent || (save ? components.commandSave : components.commandList);
  const command = commandSource.createInstance();
  command.name = 'Command bar';
  command.x = 268;
  command.y = 60;
  screen.appendChild(command);
  return { command };
}

function applyRowData(instance, data) {
  setText(instance, 'Reference', data.reference);
  setText(instance, 'Application name', data.project);
  setText(instance, 'Assigned to', data.assignee);
  setText(instance, 'Status', data.status);
  setText(instance, 'Case age', data.age);
  setText(instance, 'Notifications', data.notification);

  const avatar = instance.findOne(item => item.type === 'INSTANCE' && item.name === 'Assignee avatar');
  if (avatar) {
    avatar.visible = Boolean(data.assignee);
    const avatarColor = AVATARS[data.assignee] || C.yellow;
    avatar.fills = paint(avatarColor);
    setText(avatar, 'Avatar initials', initials(data.assignee));
    const avatarLabel = avatar.findOne(item => item.type === 'TEXT' && item.name === 'Avatar initials');
    if (avatarLabel) avatarLabel.fills = paint(readableTextOn(avatarColor));
  }
  const status = instance.findOne(item => item.type === 'INSTANCE' && item.name === 'Status label');
  if (status) {
    const palette = STATUS[data.status] || STATUS['Awaiting allocation'];
    status.fills = paint(palette.background);
    const label = status.findOne(item => item.type === 'TEXT' && item.name === 'Status');
    if (label) label.fills = paint(palette.text);
  }
}

function createCaseListScreen(page, components) {
  const desc = DESCRIPTIONS.caseList;
  const screen = fixedFrame(desc.frameName, 1640, 1232, C.canvas);
  screen.clipsContent = true;
  addShell(screen, components, false);

  const card = verticalFrame('Cases card', 1320, 0, 20, C.white);
  card.x = 268;
  card.y = 114;
  applyCard(card);
  const titleRow = horizontalFrame('View heading row', 1280, 40, 6, 0);
  titleRow.fills = [];
  titleRow.appendChild(makeText('Page heading', desc.pageHeading, 'title', C.text));
  titleRow.appendChild(makeIcon('View selector', 'ChevronDownRegular', 16, C.text));
  card.appendChild(titleRow);
  const tableHeader = components.table.header.createInstance();
  tableHeader.name = 'Table headers';
  card.appendChild(tableHeader);
  for (const data of desc.rows) {
    const row = components.table.row.createInstance();
    row.name = `Table row / ${data.reference}`;
    applyRowData(row, data);
    card.appendChild(row);
  }
  screen.appendChild(card);
  page.appendChild(screen);
  return screen;
}

function configureCaseHeader(instance, description) {
  setText(instance, 'Page heading', description.title);
  setText(instance, 'Record type', description.recordType);
  for (const item of description.meta) {
    setText(instance, `Meta value / ${item.label}`, item.value);
  }
}

function createCaseSummaryField(components, field) {
  const row = horizontalFrame(`Case field / ${field.label}`, 484, 32, 0, 0);
  row.appendChild(makeText('Field label', field.label, 'body', C.text, 140));
  const decoration = horizontalFrame('Field decoration', 26, 32, 0, 0);
  decoration.primaryAxisAlignItems = 'MAX';
  decoration.appendChild(makeIcon('Read-only indicator', 'LockClosedRegular', 16, C.secondary));
  row.appendChild(decoration);
  row.appendChild(fixedFrame('Field spacing', 8, 1));
  const value = components.fields.readOnly.createInstance();
  value.name = 'Read-only field';
  value.resize(310, value.height);
  setText(value, 'Field value', field.value);
  const valueText = value.findOne(node => node.type === 'TEXT' && node.name === 'Field value');
  if (valueText) valueText.resize(286, valueText.height);
  row.appendChild(value);
  return row;
}

function createTasksCard(components, tasks) {
  const card = verticalFrame('Tasks card', 280, 0, 16, C.white);
  applyCard(card);
  const heading = horizontalFrame('Tasks heading', 248, 36, 0, 0);
  heading.primaryAxisAlignItems = 'SPACE_BETWEEN';
  heading.appendChild(makeText('Section heading', 'Tasks', 'section', C.text));
  heading.appendChild(makeText('Sort tasks', '⇅', 'section', C.text));
  card.appendChild(heading);
  addLine(card, 'Tasks heading divider', 248);
  for (const task of tasks) {
    const row = components.taskListRow.createInstance();
    row.name = `Task / ${task.name}`;
    setText(row, 'Task name', task.name);
    setText(row, 'Task status', task.status);
    card.appendChild(row);
  }
  const footer = horizontalFrame('Tasks footer', 248, 44, 0, 0);
  footer.primaryAxisAlignItems = 'SPACE_BETWEEN';
  footer.appendChild(makeText('Pagination summary', `1 - ${tasks.length} of ${tasks.length}`, 'body', C.secondary));
  footer.appendChild(makeText('Pagination', '‹  Page 1  ›', 'body', C.secondary));
  card.appendChild(footer);
  return card;
}

function createCaseSummaryScreen(page, components, description) {
  const screen = fixedFrame(description.frameName, 1640, 1232, C.canvas);
  screen.clipsContent = true;
  addShell(screen, components, false, 1232, components.commandCase);

  const header = components.caseHeader.createInstance();
  header.name = 'Case record header';
  configureCaseHeader(header, description);
  header.x = 268;
  header.y = 112;
  screen.appendChild(header);

  const summary = verticalFrame('Case summary card', 1028, 20, 20, C.white);
  summary.x = 268;
  summary.y = 280;
  applyCard(summary);
  summary.appendChild(makeText('Section heading', 'Case summary', 'section', C.text));
  const columns = horizontalFrame('Case field columns', 988, 1, 20, 0);
  columns.counterAxisSizingMode = 'AUTO';
  const left = verticalFrame('Case fields / Left column', 484, 16, 0);
  const right = verticalFrame('Case fields / Right column', 484, 16, 0);
  for (const field of description.fields) {
    (field.column === 2 ? right : left).appendChild(createCaseSummaryField(components, field));
  }
  columns.appendChild(left);
  columns.appendChild(right);
  summary.appendChild(columns);
  screen.appendChild(summary);

  const tasks = createTasksCard(components, description.tasks);
  tasks.x = 1308;
  tasks.y = 280;
  screen.appendChild(tasks);
  page.appendChild(screen);
  return screen;
}

function createIndentedValidation(components, message) {
  const row = fixedFrame('Field validation row', 1278, 1);
  row.layoutMode = 'HORIZONTAL';
  row.primaryAxisSizingMode = 'FIXED';
  row.counterAxisSizingMode = 'AUTO';
  row.appendChild(fixedFrame('Validation alignment', 378, 1));
  const validation = components.fields.validation.createInstance();
  validation.name = 'Validation message';
  setText(validation, 'Validation message', message);
  row.appendChild(validation);
  return row;
}

function createSiteCheckSection(components, content, state) {
  const section = verticalFrame(`Section / ${content.heading}`, 1278, 16, 0);
  section.appendChild(makeText('Section heading', content.heading, 'section', C.text, 1278));
  if (content.description) {
    section.appendChild(makeText('Help text', content.description, 'body', C.secondary, 1278));
  }
  const isTextarea = content.type === 'textarea';
  const source = isTextarea ? components.rows.textareaOptional : components.rows.dropdown;
  const row = source.createInstance();
  row.name = `Form question / ${content.question}`;
  configureQuestionRow(row, {
    type: content.type,
    question: content.question,
    value: state[content.key],
  });
  section.appendChild(row);
  const error = (state.errors || []).find(item => item.field === content.key);
  if (error) section.appendChild(createIndentedValidation(components, error.message));
  return section;
}

function createSiteCheckScreen(page, components, state) {
  const screen = fixedFrame(state.frameName, 1640, 1232, C.canvas);
  screen.clipsContent = true;
  const { command } = addShell(screen, components, true);
  const offset = state.notification ? 40 : 0;
  if (state.notification) {
    const notification = components.formNotification.createInstance();
    notification.name = 'Form notification';
    setText(notification, 'Validation message', state.notification);
    notification.x = 268;
    notification.y = 60;
    screen.appendChild(notification);
    command.y += offset;
  }

  const headerCard = verticalFrame('Task header card', 1320, 12, 20, C.white);
  headerCard.x = 268;
  headerCard.y = 125 + offset;
  applyCard(headerCard);
  const headingLine = horizontalFrame('Task title', 1280, 32, 6, 0);
  headingLine.primaryAxisSizingMode = 'AUTO';
  headingLine.appendChild(makeText('Page heading', state.pageHeading, 'title', C.text));
  headingLine.appendChild(makeText('Save state', `- ${state.saveState}`, 'body', C.secondary));
  headerCard.appendChild(headingLine);
  headerCard.appendChild(makeText('Record type', state.recordType, 'body', C.text));
  screen.appendChild(headerCard);

  const body = verticalFrame('Task form card', 1320, 24, 20, C.white);
  body.x = 268;
  body.y = 238 + offset;
  applyCard(body);
  const siteHeading = horizontalFrame('Site coordinates heading', 1278, 32, 10, 0);
  siteHeading.primaryAxisSizingMode = 'AUTO';
  siteHeading.appendChild(makeText('Section heading', DESCRIPTIONS.siteCheckContent.groupHeading, 'section', C.text));
  siteHeading.appendChild(makeIcon('Download icon', 'ArrowDownloadRegular', 16, C.brand));
  siteHeading.appendChild(makeText('Primary action', DESCRIPTIONS.siteCheckContent.downloadLabel, 'body', C.brand));
  body.appendChild(siteHeading);
  DESCRIPTIONS.siteCheckContent.sections.forEach((content, index) => {
    body.appendChild(components.divider.createInstance());
    body.appendChild(createSiteCheckSection(components, content, state));
  });
  screen.appendChild(body);
  page.appendChild(screen);
  return screen;
}

function configureQuestionRow(instance, row) {
  setText(instance, 'Question', row.question);
  setText(instance, 'Field value', row.value);
  if (row.type === 'dropdown') {
    const value = instance.findOne(item => item.type === 'TEXT' && item.name === 'Field value');
    if (value) {
      const color = row.value === '---' ? C.disabled : C.text;
      value.fills = paint(color);
      const fillStyle = fillStyleFor(color);
      if (fillStyle) value.fillStyleId = fillStyle.id;
    }
  }
}

function createFormSection(components, section) {
  const wrapper = verticalFrame(`Section / ${section.heading}`, 1278, 16, 0);
  wrapper.appendChild(makeText('Section heading', section.heading, 'section', C.text));
  for (const row of section.rows) {
    if (row.type === 'divider') {
      const divider = components.divider.createInstance();
      divider.name = 'Conditional section divider';
      wrapper.appendChild(divider);
      continue;
    }
    if (row.type === 'subheading') {
      wrapper.appendChild(makeText('Conditional section heading', row.label, 'label', C.text));
      continue;
    }
    if (row.type === 'help') {
      const help = components.fields.help.createInstance();
      help.name = 'Help link';
      setText(help, 'Help text', row.label);
      wrapper.appendChild(help);
      if (row.spaceAfter) {
        wrapper.appendChild(fixedFrame('Help spacing', 1, row.spaceAfter));
      }
      continue;
    }
    const source = row.type === 'dropdown'
      ? components.rows.dropdown
      : row.type === 'textarea'
        ? components.rows.textarea
      : row.type === 'readonly-multiline'
        ? components.rows.readOnlyMultiline
        : row.type === 'url'
          ? components.rows.url
          : components.rows.readOnly;
    const instance = source.createInstance();
    instance.name = `Form question / ${row.question}`;
    configureQuestionRow(instance, row);
    wrapper.appendChild(instance);
  }
  return wrapper;
}

function createPublicRegisterScreen(page, components, desc = DESCRIPTIONS.publicRegister) {
  const screenHeight = desc.frameHeight || 1232;
  const screen = fixedFrame(desc.frameName, 1640, screenHeight, C.canvas);
  screen.clipsContent = true;
  addShell(screen, components, true, screenHeight);

  const headerCard = verticalFrame('Task header card', 1320, 12, 20, C.white);
  headerCard.x = 268;
  headerCard.y = 125;
  applyCard(headerCard);
  const headingLine = horizontalFrame('Task title', 1280, 32, 6, 0);
  headingLine.primaryAxisSizingMode = 'AUTO';
  headingLine.fills = [];
  headingLine.appendChild(makeText('Page heading', desc.pageHeading, 'title', C.text));
  headingLine.appendChild(makeText('Save state', `- ${desc.saveState}`, 'body', C.secondary));
  headerCard.appendChild(headingLine);
  headerCard.appendChild(makeText('Record type', desc.recordType, 'body', C.text));
  screen.appendChild(headerCard);

  const body = verticalFrame('Task form card', 1320, 24, 20, C.white);
  body.x = 268;
  body.y = 238;
  applyCard(body);
  desc.sections.forEach((section, index) => {
    if (index > 0) {
      const divider = components.divider.createInstance();
      divider.name = 'Section divider';
      body.appendChild(divider);
    }
    body.appendChild(createFormSection(components, section));
  });
  const finalDivider = components.divider.createInstance();
  finalDivider.name = 'Section divider';
  body.appendChild(finalDivider);
  body.appendChild(makeText('Help text', desc.completionNote, 'body', C.text, 1278));
  const completion = horizontalFrame('Completion field', 1278, 32, 8, 0);
  completion.fills = [];
  const checkbox = components.checkbox.createInstance();
  checkbox.name = 'Checkbox';
  if (!desc.completed) {
    const mark = checkbox.findOne(item => item.type === 'TEXT');
    const box = checkbox.findOne(item => item.type === 'RECTANGLE');
    if (mark) mark.visible = false;
    if (box) { box.fills = []; box.strokes = paint(C.secondary); box.strokeWeight = 1; }
  }
  completion.appendChild(checkbox);
  completion.appendChild(makeText('Question', desc.completionLabel, 'body', C.text));
  body.appendChild(completion);
  screen.appendChild(body);

  page.appendChild(screen);
  return screen;
}

function nextRunNumber() {
  const pattern = /Run (\d+)/;
  let highest = 0;
  for (const page of figma.root.children) {
    const pageMatch = page.name.match(pattern);
    if (pageMatch) highest = Math.max(highest, Number(pageMatch[1]));
    for (const child of page.children) {
      const childMatch = child.name.match(pattern);
      if (childMatch) highest = Math.max(highest, Number(childMatch[1]));
    }
  }
  return highest + 1;
}

function getOrCreatePage(name) {
  let page = figma.root.children.find(item => item.name === name);
  if (!page) page = figma.createPage();
  page.name = name;
  return page;
}

function getOrCreateScreensPage() {
  const name = '01 - MAS D365 Screens';
  let page = figma.root.children.find(item => item.name === name);
  if (page) return page;

  page = figma.root.children.find(item => item.name === '01 · Screens');
  if (!page) page = figma.createPage();
  page.name = name;
  return page;
}

const SCREEN_GROUPS = [
  {
    id: 'case-list',
    label: 'Marine licence cases',
    screens: [
      { id: 'case-list', label: DESCRIPTIONS.caseList.frameName },
    ],
  },
  {
    id: 'public-register',
    label: 'Public register states',
    screens: [
      { id: 'public-register-initial', label: DESCRIPTIONS.publicRegister.frameName },
      ...DESCRIPTIONS.publicRegisterVariations.map((description, index) => ({
        id: `public-register-variation-${index}`,
        label: description.frameName,
      })),
    ],
  },
  {
    id: 'assessment-journey',
    label: 'First assessment journey',
    screens: [
      { id: 'case-summary-initial', label: DESCRIPTIONS.caseSummaryStates[0].frameName },
      ...DESCRIPTIONS.siteCheckStates.map((state, index) => ({
        id: `site-check-${index}`,
        label: state.frameName,
      })),
      { id: 'case-summary-unlocked', label: DESCRIPTIONS.caseSummaryStates[1].frameName },
    ],
  },
];

const ALL_SCREEN_IDS = SCREEN_GROUPS.flatMap(group => group.screens.map(screen => screen.id));

function renderScreenById(id, page, components) {
  if (id === 'case-list') return createCaseListScreen(page, components);
  if (id === 'public-register-initial') {
    return createPublicRegisterScreen(page, components, DESCRIPTIONS.publicRegister);
  }
  if (id.startsWith('public-register-variation-')) {
    const index = Number(id.slice('public-register-variation-'.length));
    const description = DESCRIPTIONS.publicRegisterVariations[index];
    if (description) return createPublicRegisterScreen(page, components, description);
  }
  if (id === 'case-summary-initial') {
    return createCaseSummaryScreen(page, components, DESCRIPTIONS.caseSummaryStates[0]);
  }
  if (id.startsWith('site-check-')) {
    const index = Number(id.slice('site-check-'.length));
    const state = DESCRIPTIONS.siteCheckStates[index];
    if (state) return createSiteCheckScreen(page, components, state);
  }
  if (id === 'case-summary-unlocked') {
    return createCaseSummaryScreen(page, components, DESCRIPTIONS.caseSummaryStates[1]);
  }
  throw new Error(`Unknown screen selection: ${id}`);
}

async function generateScreens(screenIds) {
  const uniqueIds = [...new Set(screenIds)];
  if (!uniqueIds.length) throw new Error('Select at least one screen to generate.');
  const unknownId = uniqueIds.find(id => !ALL_SCREEN_IDS.includes(id));
  if (unknownId) throw new Error(`Unknown screen selection: ${unknownId}`);

  const runLabel = `Run ${String(nextRunNumber()).padStart(2, '0')}`;
  fonts = await loadPreferredFonts();
  styles = ensureStyles(runLabel);

  const componentsPage = getOrCreatePage('00 · D365 components');
  figma.currentPage = componentsPage;
  const components = createComponentLibrary(componentsPage, runLabel);
  const screensPage = getOrCreateScreensPage();
  figma.currentPage = screensPage;
  screensPage.backgrounds = paint('#EDEBE9');
  const batchX = nextHorizontalPosition(screensPage);
  const batchLabel = makeText(`Generated ${runLabel}`, `Generated ${runLabel}`, 'section', C.text);
  batchLabel.x = batchX;
  batchLabel.y = 32;
  screensPage.appendChild(batchLabel);

  const generatedScreens = [];
  let screenX = batchX;
  const appendScreen = screen => {
    screen.x = screenX;
    screen.y = 80;
    screenX += 1720;
    generatedScreens.push(screen);
  };
  uniqueIds.forEach(id => appendScreen(renderScreenById(id, screensPage, components)));

  figma.currentPage = screensPage;
  figma.viewport.scrollAndZoomIntoView(generatedScreens);
  figma.notify(`Added ${runLabel}: ${generatedScreens.length} editable ${generatedScreens.length === 1 ? 'screen' : 'screens'} to 01 - MAS D365 Screens. Existing layers were left unchanged.`);
  figma.closePlugin();
}

function reportFailure(error, notifyUi = false) {
  console.error(error);
  try {
    const page = getOrCreateScreensPage();
    figma.currentPage = page;
    const marker = verticalFrame('MAS D365 Screen Builder error', 760, 12, 20, C.errorBackground);
    marker.x = nextHorizontalPosition(page);
    marker.y = 80;
    marker.strokes = paint(C.red);
    marker.strokeWeight = 1;
    marker.appendChild(makeText('Error heading', 'MAS D365 Screen Builder failed', 'section', C.red));
    marker.appendChild(makeText('Error message', error.message || String(error), 'body', C.text, 720));
    page.appendChild(marker);
    figma.viewport.scrollAndZoomIntoView([marker]);
  } catch (markerError) {
    console.error(markerError);
  }
  if (notifyUi && figma.ui) {
    figma.ui.postMessage({ type: 'error', message: error.message || String(error) });
  }
  figma.notify(`MAS D365 Screen Builder failed: ${error.message}`, { error: true, timeout: 30000 });
  if (!notifyUi) figma.closePlugin();
}

function showPicker() {
  figma.showUI(__html__, { width: 420, height: 640, themeColors: true });
  figma.ui.postMessage({ type: 'catalog', groups: SCREEN_GROUPS });
  figma.ui.onmessage = async message => {
    if (message?.type === 'cancel') {
      figma.closePlugin();
      return;
    }
    if (message?.type !== 'generate') return;
    try {
      await generateScreens(Array.isArray(message.screenIds) ? message.screenIds : []);
    } catch (error) {
      reportFailure(error, true);
    }
  };
}

if (figma.command === 'choose-screens') {
  showPicker();
} else {
  generateScreens(ALL_SCREEN_IDS).catch(error => reportFailure(error));
}
