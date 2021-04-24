import { Injectable, CanActivate, ExecutionContext, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { VALIDATE_TOKEN } from 'shared/types/auth';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(@Inject('AUTH_SERVICE') private readonly authService: ClientProxy) {}

  canActivate(context: ExecutionContext): Observable<boolean> | boolean {
    const ctx = GqlExecutionContext.create(context).getContext();
    const authorization: string | undefined = ctx.req.headers?.authorization;

    if (!authorization) {
      return false;
    }

    const splitedToken = authorization.split(' ');
    if (splitedToken[0] !== 'Bearer') {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }

    return this.authService.send(VALIDATE_TOKEN, splitedToken[1]).pipe(
      map((next: boolean | { message: string }) => {
        if (typeof next != 'boolean') throw new HttpException(next.message, HttpStatus.UNAUTHORIZED);
        if (!next) throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
        return Boolean(next);
      }),
      catchError((err: Error) => {
        throw new HttpException(err.message, HttpStatus.UNAUTHORIZED);
      }),
    );
  }
}
