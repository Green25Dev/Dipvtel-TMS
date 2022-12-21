import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Role, RoleRelations, RolePrivilege, User} from '../models';
import {RolePrivilegeRepository} from './role-privilege.repository';

export class RoleRepository extends DefaultCrudRepository<
  Role,
  typeof Role.prototype.id,
  RoleRelations
> {

  public readonly rolePrivileges: HasManyRepositoryFactory<RolePrivilege, typeof Role.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('RolePrivilegeRepository') protected rolePrivilegeRepositoryGetter: Getter<RolePrivilegeRepository>,
  ) {
    super(Role, dataSource);
    this.rolePrivileges = this.createHasManyRepositoryFactoryFor('rolePrivileges', rolePrivilegeRepositoryGetter,);
    this.registerInclusionResolver('rolePrivileges', this.rolePrivileges.inclusionResolver);
  }

  async getPrivileges(
      roleId: typeof Role.prototype.id,
  ): Promise<RolePrivilege[] | undefined> {
    return this.rolePrivileges(roleId)
        .find()
        .catch(err => {
          if (err.code === 'ENTITY_NOT_FOUND') return undefined;
          throw err;
        });
  }

  async getPermissions(roleId: number) {
      let result : number[] = []
      const privileges = await this.getPrivileges(roleId)
      if (privileges) {
          result = privileges.map(item => item.privilege_id)
      }

      return result
  }
}
