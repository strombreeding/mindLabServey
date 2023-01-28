import { Controller, Get, Req } from '@nestjs/common';
import { AppService } from './app.service';
import * as ip from 'request-ip';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
