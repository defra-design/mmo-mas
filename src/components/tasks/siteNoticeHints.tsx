// src/components/tasks/siteNoticeHints.tsx
// Caseworker guidance for the Site notice task, collapsed behind a "Help with ..."
// disclosure. Same custom HTML injection as the Public register guidance — not an
// OOB field description. The two worked examples are inset text rather than
// italics: at this length italics are hard to read, and the left rule marks the
// quoted copy just as clearly.
import TaskHint from './TaskHint';

export function SummaryHint() {
  return (
    <TaskHint spaceAbove title="Help with writing the summary">
      <p><strong>Write a summary for the notice</strong></p>
      <p>
        The notice needs a short, plain English description of the proposed activity, for
        members of the public to read.
      </p>
      <p>
        You can base this on the applicant's proposed works summary, but it must be shorter
        and more to the point. The notice has limited space, so keep it as brief as possible
        while still giving an accurate description of what's being proposed.
      </p>
      <p>Your summary should cover:</p>
      <ul>
        <li>what the activity is</li>
        <li>where it will take place</li>
      </ul>
      <p>Do not include:</p>
      <ul>
        <li>
          technical detail, methodology, or justification — this is available in full on the
          Public Register
        </li>
        <li>information the applicant has asked to withhold, unless this has been resolved</li>
      </ul>
      <p><strong>Example</strong></p>
      <p>Proposed works summary (from the application):</p>
      <blockquote>
        "The seabed stabilisation works will support the construction of Coastal Offshore Wind
        Farm. The works consist of depositing material in the form of rock bags, geotextile
        sand containers, loose rock, and rock mattresses on the seabed to stabilise the surface
        for jack-up vessel operations. This will take place within the wind farm's array area
        in 20 distinct locations."
      </blockquote>
      <p>Notice summary (shortened for the notice):</p>
      <blockquote>
        "Seabed stabilisation works to support construction of Coastal Offshore Wind Farm,
        within the wind farm's array area."
      </blockquote>
    </TaskHint>
  );
}

export function GroupsHint() {
  return (
    <TaskHint spaceAbove title="What the applicant sees">
      <p><strong>Marine users</strong></p>
      <p>
        This means people who use the water nearby, such as boat users, sailors, or fishing
        vessels. Prominent locations for this group include:
      </p>
      <ul>
        <li>Harbour noticeboards</li>
        <li>Port noticeboards</li>
        <li>Marinas</li>
        <li>Yacht clubs</li>
        <li>Fishing clubs</li>
      </ul>
      <p><strong>Community users</strong></p>
      <p>
        This means people nearby on land, such as residents and visitors. Prominent locations
        for this group include:
      </p>
      <ul>
        <li>Beach access points</li>
        <li>Coastal path access points</li>
        <li>Community noticeboards</li>
        <li>Visitor information points</li>
      </ul>
    </TaskHint>
  );
}
