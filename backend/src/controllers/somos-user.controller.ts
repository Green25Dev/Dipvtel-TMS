import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {SomosUser} from '../models';
import {SomosUserRepository} from '../repositories';
import {authenticate} from "@loopback/authentication";

@authenticate('jwt')
export class SomosUserController {
  constructor(
    @repository(SomosUserRepository)
    public somosUserRepository : SomosUserRepository,
  ) {}

  @post('/somos-users')
  @response(200, {
    description: 'SomosUser model instance',
    content: {'application/json': {schema: getModelSchemaRef(SomosUser)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(SomosUser, {
            title: 'NewSomosUser',
            exclude: ['id', 'created_at', 'created_by', 'updated_at', 'updated_by'],
          }),
        },
      },
    })
    somosUser: Omit<SomosUser, 'id,created_at,created_by,updated_at,updated_by'>,
  ): Promise<SomosUser> {
    return this.somosUserRepository.create(somosUser);
  }

  @get('/somos-users/count')
  @response(200, {
    description: 'SomosUser model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(SomosUser) where?: Where<SomosUser>,
  ): Promise<Count> {
    return this.somosUserRepository.count(where);
  }

  @get('/somos-users')
  @response(200, {
    description: 'Array of SomosUser model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(SomosUser, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(SomosUser) filter?: Filter<SomosUser>,
  ): Promise<SomosUser[]> {
    return this.somosUserRepository.find(filter);
  }

  @patch('/somos-users')
  @response(200, {
    description: 'SomosUser PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(SomosUser, {partial: true}),
        },
      },
    })
    somosUser: SomosUser,
    @param.where(SomosUser) where?: Where<SomosUser>,
  ): Promise<Count> {
    return this.somosUserRepository.updateAll(somosUser, where);
  }

  @get('/somos-users/{id}')
  @response(200, {
    description: 'SomosUser model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(SomosUser, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(SomosUser, {exclude: 'where'}) filter?: FilterExcludingWhere<SomosUser>
  ): Promise<SomosUser> {
    return this.somosUserRepository.findById(id, filter);
  }

  @patch('/somos-users/{id}')
  @response(204, {
    description: 'SomosUser PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(SomosUser, {partial: true}),
        },
      },
    })
    somosUser: SomosUser,
  ): Promise<void> {
    await this.somosUserRepository.updateById(id, somosUser);
  }

  @put('/somos-users/{id}')
  @response(204, {
    description: 'SomosUser PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() somosUser: SomosUser,
  ): Promise<void> {
    await this.somosUserRepository.replaceById(id, somosUser);
  }

  @del('/somos-users/{id}')
  @response(204, {
    description: 'SomosUser DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.somosUserRepository.deleteById(id);
  }
}
