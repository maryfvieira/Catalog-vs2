import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { Request, Response, NextFunction } from 'express';

export function validationMiddleware<T>(type: any): any {
  return (req: Request, res: Response, next: NextFunction) => {
    const dto = plainToInstance(type, req.body);
    validate(dto).then(errors => {
      if (errors.length > 0) {
        const messages = errors.map(err => Object.values(err.constraints || {})).flat();
        return res.status(400).json({ errors: messages });
      }
      next();
    });
  };
}