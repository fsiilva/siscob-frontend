export interface PortfolioResponse {
  id: string;
  code: string;
  name: string;
  companyId: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PortfolioListParams {
  company?: string;
  active?: boolean;
}

export interface CreatePortfolioRequest { code: string; name: string; companyId: string; active?: boolean; }
export interface UpdatePortfolioRequest { code?: string; name?: string; }
