import {Entity, model, property} from '@loopback/repository';

@model({
  name: 'sms_user'
})
export class SomosUser extends Entity {
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
  username: string;

  @property({
    type: 'string',
  })
  password?: string;

  @property({
    type: 'string',
  })
  client_key?: string;

  @property({
    type: 'string',
  })
  client_password?: string;

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

  constructor(data?: Partial<SomosUser>) {
    super(data);
  }
}

export interface SomosUserRelations {
  // describe navigational properties here
}

export type SomosUserWithRelations = SomosUser & SomosUserRelations;
