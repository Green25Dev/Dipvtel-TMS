import {Entity, model, property} from '@loopback/repository';

@model()
export class Company extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
    required: true,
  })
  code: string;

  @property({
    type: 'string',
    required: true,
  })
  resp_org_id: string;

  @property({
    type: 'string',
    required: true,
  })
  role_code: string;

  @property({
    type: 'string',
    required: true,
  })
  company_email: string;

  @property({
    type: 'string',
  })
  address?: string;

  @property({
    type: 'string',
  })
  city?: string;

  @property({
    type: 'string',
  })
  state?: string;

  @property({
    type: 'string',
  })
  zip_code?: string;

  @property({
    type: 'string',
    required: true,
  })
  first_name: string;

  @property({
    type: 'string',
    required: true,
  })
  last_name: string;

  @property({
    type: 'string',
  })
  contact_email?: string;

  @property({
    type: 'string',
  })
  contact_phone?: string;

  @property({
    type: 'string',
    required: true,
  })
  ro_id: string;

  @property({
    type: 'boolean',
    required: true,
    default: false,
  })
  status: boolean;

  @property({
    type: 'number',
  })
  created_by?: number;

  @property({
    type: 'date',
  })
  created_at?: string;

  @property({
    type: 'number',
  })
  updated_by?: number;

  @property({
    type: 'date',
  })
  updated_at?: string;

  constructor(data?: Partial<Company>) {
    super(data);
  }
}

export interface CompanyRelations {
  // describe navigational properties here
}

export type CompanyWithRelations = Company & CompanyRelations;
