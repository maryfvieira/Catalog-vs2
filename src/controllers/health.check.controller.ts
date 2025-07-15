
import { controller, httpGet } from 'inversify-express-utils';
import { Request, Response } from 'express';            
//import { inject } from 'inversify';
//import { TYPES } from '../inversify/types';
//import { ILogger } from '../interfaces/logger.interface';
@controller('/health')
export class HealthCheckController {
	//constructor(@inject(TYPES.Logger) private logger: ILogger) {}
    constructor() {}

	@httpGet('/')
	public healthCheck(req: Request, res: Response): void {
		//this.logger.info('Health check requested');
        console.log('Health check requested');
		res.status(200).json({ message: 'ok' });
	}
}