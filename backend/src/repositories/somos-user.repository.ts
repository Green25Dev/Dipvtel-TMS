import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {SomosUser, SomosUserRelations} from '../models';

export class SomosUserRepository extends DefaultCrudRepository<
  SomosUser,
  typeof SomosUser.prototype.id,
  SomosUserRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(SomosUser, dataSource);
  }
}
