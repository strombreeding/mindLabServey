import { Headers, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { getClientOs } from 'src/utils/usefulFn';
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    const os = getClientOs(req.headers['user-agent']);
    const nextResult = { ip: req.ip, os };
    req.body = { ...req.body, ...nextResult };
    next();
  }
}
