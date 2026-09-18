export interface ResourceName {
  languageCode: string;
  value: string;
}

export interface ServiceResource {
  id: string;
  isDelegable: boolean;
  minimumAuthenticationLevel: number;
  name: ResourceName[];
}

export interface ServiceOwner {
  orgNumber: string;
  code: string;
  name: ResourceName[];
}

export interface DialogDto {
  dialogId: string;
  instanceRef: string;
  party: string;
  serviceResource: ServiceResource;
  serviceOwner: ServiceOwner;
  title: ResourceName[] | null;
  nonSensitiveTitle: ResourceName[] | null;
}

export interface DialogDetails {
  id: string;
  deletedAt?: string | null;
  [key: string]: unknown;
}

export interface DeleteDialogRequest {
  dialogId: string;
  revision: string;
  /** true = purge (permanent), false = soft delete */
  hardDelete: boolean;
}

export interface DeleteDialogResponse {
  statusCode: number;
  responseHeader?: string | null;
  responseBody?: string | null;
  requestBody?: string | null;
}
