export interface LegalRequestExportRequest {
  nationalIdentityNumber: string;
  organizationNumber?: string;
  from: string;
  to: string;
  categories?: string[];
  caseReference: string;
}
