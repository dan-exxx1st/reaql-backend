import { Controller, Get, Res } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  index(@Res() res) {
    res.status(404).redirect('/graphql');
  }

  @Get('/health-check')
  healthCheck() {
    return {
      message: 'All good. App is ready to accept connections.',
    };
  }
}
