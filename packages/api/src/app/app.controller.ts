import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller()
export class AppController {
  @Get()
  index(@Res() res: Response) {
    res.status(404).redirect('/graphql');
  }

  @Get('/health-check')
  healthCheck() {
    return {
      message: 'All good. App is ready to accept connections.',
    };
  }
}
