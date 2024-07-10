import { Model, Includeable, ModelStatic } from 'sequelize';

class BaseService {
  protected generateIncludables<T extends Model>(
    model: ModelStatic<T>,
    alias: string,
    attributes?: string[],
    include?: Includeable[],
  ) {
    return {
      model,
      as: alias,
      attributes,
      ...(include && { include }),
    };
  }
}

export default BaseService;
