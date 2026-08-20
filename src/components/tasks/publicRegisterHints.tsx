// src/components/tasks/publicRegisterHints.tsx
// Caseworker guidance shown full-width under Public register fields. Same custom
// HTML injection as the WFD excluded-activity list — not an OOB field description.
import TaskHint from './TaskHint';

export function PersonalInfoHint() {
  return (
    <TaskHint>
      <p>
        Withhold or redact personal data if publishing it would break data protection law
        (including UK GDPR and the Data Protection Act 2018), or reveal more about a person
        than necessary.
      </p>
      <p>Withhold or redact if:</p>
      <ul>
        <li>
          the Marine Licensing (Register of Licensing Information) Regulations 2011 do not
          require it to be published
        </li>
        <li>publishing it would harm the person's privacy</li>
        <li>publishing it would go against our data protection obligations</li>
        <li>it could reveal information that needs extra protection</li>
      </ul>
      <p>
        Examples include personal contact details, personal identifiers, signatures and
        authentication information, information about private individuals, special category
        or sensitive personal information.
      </p>
      <p>
        Do not withhold information just because it identifies someone. The Regulations
        require us to publish some personal details, including the names and addresses of
        applicants, licence holders, agents, contractors and subcontractors, where applicable.
        Only redact the minimum amount of personal data needed, and only where it is not
        needed for the public to understand the application or licence.
      </p>
    </TaskHint>
  );
}

export function CommercialRationaleHint() {
  return (
    <TaskHint>
      <p>
        Withhold information if it is genuinely confidential and publishing it would damage a
        real business interest. All of these should normally apply:
      </p>
      <ul>
        <li>the information is commercial or industrial in nature</li>
        <li>the information is not already publicly available</li>
        <li>the information is subject to a legally recognised duty of confidentiality</li>
        <li>disclosure would harm a legitimate commercial interest</li>
        <li>the harm would be real and identifiable, not speculative</li>
      </ul>
      <p>
        Examples include commercial agreements and procurement, intellectual property and
        proprietary methods, future commercial plans and strategy and commercially sensitive
        operational information.
      </p>
      <p>
        Information is not commercially confidential simply because it relates to business
        operations. Be satisfied that the information is genuinely confidential, that
        confidentiality is protected by law and that disclosure would harm a legitimate
        commercial interest.
      </p>
    </TaskHint>
  );
}

export function SecurityRationaleHint() {
  return (
    <TaskHint>
      <p>Withhold information if publishing it would put national security at risk. This includes a likely risk to:</p>
      <ul>
        <li>national security</li>
        <li>defence</li>
        <li>critical national infrastructure</li>
        <li>national resilience</li>
        <li>protection against hostile acts</li>
      </ul>
      <p>
        Examples include defence and military information, critical national infrastructure,
        security arrangements, sensitive location information, resilience and vulnerability
        information.
      </p>
      <p>
        Do not withhold information solely because it's controversial, likely to attract
        public scrutiny or operationally sensitive without a corresponding national security
        risk.
      </p>
    </TaskHint>
  );
}
