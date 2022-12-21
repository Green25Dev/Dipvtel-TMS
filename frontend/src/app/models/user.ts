export interface IUserLogin {
  username: string;
  password: string;
}

export interface IUserToken {
  token: string;
  user_id: number;
  rememberedIf: boolean;
}

export interface IUser {
  id: number;
  role_id: number;

  company?: ICompany,
  somos?: ISomosUser,

  username: string,
  password: string,

  email: string,
  first_name: string,
  last_name: string,
  ro: string,
  status: boolean,

  permissions?: number[],
  uiSettings: string;
  customerId: number;
}

export interface ICompany {
  id: number,
  name: string,
  code?: string,
  resp_org_id?: string,
  role_code?: string,
  company_email?: string,
  address?: string,
  city?: string,
  state?: string,
  zip_code?: string,
  first_name?: string,
  last_name?: string,
  contact_email?: string,
  contact_phone?: string,
  ro_id?: string,
  status: boolean,
  created_at: any,
  updated_at: any,
  created_by: any,
  updated_by: any
}

export interface ISomosUser {
  id: number,
  username: string,
  password?: string,
  client_key?: string,
  client_password?: string,
  created_at: any,
  updated_at: any,
  created_by: any,
  updated_by: any
}

export interface IRole {
  id: number,
  name: string,
  description: string,
  customerId: number,
  Customer: ICustomer,
  created: Date,
  modified: Date,
  created_at: any,
  updated_at: any,
  created_by: any,
  updated_by: any
}

export interface ICustomer {
  id: number;
  balance: number;
  enabled: number | boolean;
  vatNumber: string;
  companyName: string;
  companyId: string;
  firstName: string;
  lastName: string;
  contactEmail: string;
  billingEmail: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  token: string;
  settings: string;
}

