import { Controller, Get, Res } from '@nestjs/common';

@Controller()
export class AppController {
    @Get()
    index(@Res() res) {
        res.status(302).redirect('/graphql');
    }

    @Get('/api/hello')
    api() {
        return 'Hello from nest and docker-compose!';
    }
}
