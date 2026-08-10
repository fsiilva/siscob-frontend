export interface Customer {
  id: number;
  name: string;
  tradeName: string | null;
  personType: string | null;
  cpf: string | null;
  cnpj: string | null;
  email: string | null;
  mobilePhone: string | null;
  phone: string | null;
  city: string | null;
  state: string | null;
  active: boolean;
}

export interface CustomerReceivablesSummary {
  openCount: number;
  overdueCount: number;
  openAmount: number;
  overdueAmount: number;
  averageDelayDays: number;
  oldestDelayDays: number;
  nextDueDate: string | null;
}

export interface CustomerSummary {
  customerId: number;
  receivables: CustomerReceivablesSummary;
}

export interface CustomersResponse {
  data: Customer[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface CustomersQuery {
  search: string;
  page: number;
  pageSize: number;
}
