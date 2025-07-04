import { plainToInstance } from 'class-transformer';

export class Mapper {
  static toEntity<T>(dto: any, entityClass: new () => T): T {
    return plainToInstance(entityClass, dto, {
      excludeExtraneousValues: true,
      exposeDefaultValues: true,
    });
  }
}