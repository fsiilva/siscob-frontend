export interface Operator {
  id: string;
  name: string;
  email: string;
}

export interface OperatorsResponse {
  items: Operator[];
}

export interface OperatorFilters {
  search: string;
}
