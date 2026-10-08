// Organisation (Account) records behind the Organisation lookup. The details are
// invented for the prototype: phone numbers come from Ofcom's ranges reserved
// for drama, so none of them reach a real line.
import records from '../mock-data/organisation-details.json';

export type OrganisationRecord = (typeof records)[number];

export const organisationById = (id: string): OrganisationRecord | undefined =>
  records.find(record => record.id === id);

export const organisationByName = (name: string): OrganisationRecord | undefined =>
  records.find(record => record.name === name);
