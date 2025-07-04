import { Request, Response, NextFunction } from 'express';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { ValidationError } from 'class-validator';

export function validationMiddleware(type: any) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const input = plainToInstance(type, req.body);
    const errors = await validate(input, {
      skipMissingProperties: req.method === 'PUT',
      whitelist: true,
      forbidNonWhitelisted: true
    });

    if (errors.length > 0) {
      next(errors);
    } else {
      req.body = input; // Objeto validado e transformado
      next();
    }
  };
}

export function classValidatorError(
  errors: ValidationError[],
  req: Request,
  res: Response,
  next: NextFunction
) {
  const formattedErrors = errors.map(error => ({
    property: error.property,
    constraints: error.constraints,
    ...(error.children && error.children.length > 0 ? { children: error.children } : {})
  }));

  res.status(400).json({
    status: 'error',
    message: 'Validation failed',
    errors: formattedErrors
  });
}