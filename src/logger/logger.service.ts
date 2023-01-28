import { Inject, Injectable, Logger } from '@nestjs/common';
import { winstonLogger } from 'src/utils/winston.util';
// import { Logger } from 'winston';

// @Injectable()
// export class LoggerService {
//     constructor(
//       @Inject(winstonLogger)
//       private logger: Logger,
//       @Inject(winstonLogger)
//     ) {}
//     error(message,from){
//       return this.logger.log("log",)
//     }
//     log(dto){
//       // return this.logger.error()
//     }
// }
