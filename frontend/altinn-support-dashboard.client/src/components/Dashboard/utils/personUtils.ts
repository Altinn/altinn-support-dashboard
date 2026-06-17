import { ERRoles } from "../../../models/models";

interface PersonName {
  fornavn?: string;
  mellomnavn?: string | null;
  etternavn?: string;
}

interface PersonInfo {
  navn?: PersonName;
  fodselsdato?: string;
  erDoed?: boolean;
}

export const formatFullName = (person?: PersonInfo): string => {
  if (!person?.navn) return "";
  const { fornavn = "", mellomnavn = "", etternavn = "" } = person.navn;
  return `${fornavn} ${mellomnavn ? mellomnavn + " " : ""}${etternavn}`.trim();
};

export const formatPersonStatus = (person?: PersonInfo): string => {
  if (!person) return "";
  return person.erDoed ? " (Død)" : "";
};

export const formatRolePersonInfo = (role: ERRoles): string => {
  if (!role.roller?.[0]?.person) return "";
  const person = role.roller[0].person;
  const name = formatFullName(person);
  const status = formatPersonStatus(person);
  return `${name}${status}`;
};

export const formatRoleTypeInfo = (role: ERRoles): string => {
  if (!role.type?.beskrivelse) return "";
  return role.type.beskrivelse;
};

export const formatRoleDescription = (role: ERRoles): string => {
  const type = formatRoleTypeInfo(role);
  const person = formatRolePersonInfo(role);
  return `${type}: ${person}`.trim();
};
