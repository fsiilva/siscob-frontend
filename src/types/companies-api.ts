export interface CompanyApiResponse {
  id: string;
  code: string | null;
  name: string;
  active: boolean;
}

export interface CompanyListResponse {
  data: CompanyApiResponse[];
}

export interface CompanyListParams {
  active?: boolean;
  search?: string;
}
