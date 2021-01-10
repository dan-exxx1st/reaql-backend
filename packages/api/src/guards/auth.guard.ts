import { Injectable } from '@nestjs/common/decorators';
import { Context } from '@nestjs/graphql';

@Injectable()
export class AuthGuard {
  canActivate(@Context() context: any): boolean | Promise<boolean> {
    const request = context.args[2].req.headers.authorization;
    console.log(request);
    // return validateRequest(request);
    return true;
  }
}
