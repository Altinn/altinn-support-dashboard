export interface Organization {
  name: string;
  organizationNumber: string;
  unitType: string;
  isDeleted: boolean;
  headUnit?: Organization;
}

export interface PersonalContact {
  personalContactId: string;
  name: string;
  socialSecurityNumber: string;
  displayedSocialSecurityNumber: string;
  ssnToken: string;
  mobileNumber: string;
  mobileNumberChanged: string;
  eMailAddress: string;
  eMailAddressChanged: string;
  _links: PersonalContactLink[];
}

export interface OfficialContact {
  mobileNumber: string;
  mobileNumberChanged: string;
  eMailAddress: string;
  eMailAddressChanged: string;
  fratraadt?: boolean;
  erDoed?: boolean;
}

export interface PersonalContactLink {
  rel: string;
  href: string;
  title: string;
  fileNameWithExtension: string;
  mimeType: string;
  isTemplated: boolean;
  encrypted: boolean;
  signingLocked: boolean;
  signedByDefault: boolean;
  fileSize: number;
}

export interface Subunit {
  navn: string;
  organisasjonsnummer: string;
  overordnetEnhet: string;
  organisasjonsform?: organisasjonsform;
}
export interface organisasjonsform {
  kode: string;
}

export interface ERRoles {
  type: {
    kode: string;
    beskrivelse: string;
  };
  sistEndret: string;
  roller: ErRole[];
}

export interface ErRole {
  type: ErType;
  person: person;
  enhet?: enhet;
  fratraadt: boolean;
  rekkefolge?: number;
}

export interface ErType {
  kode: string;
  beskrivelse: string;
}

export interface enhet {
  organisasjonsnummer: string;
  organisasjonsform: {
    kode: string;
    beskrivelse: string;
  };
  navn: string[];
  erSlettet: boolean;
}
export interface person {
  fodselsdato?: string;
  navn: {
    fornavn: string;
    mellomnavn: string | null;
    etternavn: string;
  };
  erDoed: boolean;
}

export interface ErRoleTableItem {
  sistEndret: string;
  type: ErType;
  enhet?: enhet;
  person?: person;
  fratraadt: boolean;

  groupType: ErType;
}

export interface Role {
  roleId?: number;
  roleType: string;
  roleDefinitionId: number;
  roleName: string;
  roleDescription: string;
  roleDefinitionCode: string;
}
export interface SelectedOrg {
  Name: string;
  OrganizationNumber: string;
}

export interface NotificationAdresses {
  notificationAddressId: number;
  countryCode?: string;
  email?: string;
  phone?: string;
  sourceOrgNumber: string;
  requestedOrgNumber: string;
  lastChanged?: string;
}

export interface PersonalContactAltinn3 {
  orgNr?: string;
  nationalIdentityNumber?: string;
  name?: string;
  email?: string;
  phone?: string;
  lastChanged?: string;
  displayedSocialSecurityNumber?: string;
  ssnToken?: string;
}
