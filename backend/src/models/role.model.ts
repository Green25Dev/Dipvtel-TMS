import {Entity, model, property, hasMany} from '@loopback/repository';
import {RolePrivilege} from './role-privilege.model';

@model()
export class Role extends Entity {
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
  })
  description?: string;

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

  @hasMany(() => RolePrivilege, {keyTo: 'role_id'})
  rolePrivileges: RolePrivilege[];

  constructor(data?: Partial<Role>) {
    super(data);
  }
}

export interface RoleRelations {
  // describe navigational properties here
}

export type RoleWithRelations = Role & RoleRelations;
