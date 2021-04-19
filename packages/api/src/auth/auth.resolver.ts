import { Inject } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { ClientProxy } from '@nestjs/microservices';
import { Observable, of } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';
import { UserAndSession, SignInInput, SignUpInput } from 'shared/graphql';
import { SIGN_UP_TYPE, SIGN_IN_TYPE, REFRESH_SESSION_TYPE } from 'shared/types/auth';

@Resolver()
export class AuthResolver {
  constructor(@Inject('AUTH_SERVICE') private readonly authService: ClientProxy) {}

  @Mutation()
  signUp(@Args('input') signUpInput: SignUpInput): Observable<UserAndSession | string> {
    return this.authService.send<UserAndSession>(SIGN_UP_TYPE, signUpInput).pipe(
      timeout(5000),
      catchError((err: string) => of(err)),
    );
  }

  @Mutation()
  signIn(@Args('input') signInInput: SignInInput): Observable<UserAndSession | string> {
    return this.authService.send<UserAndSession>(SIGN_IN_TYPE, signInInput).pipe(
      timeout(5000),
      catchError((err: string) => of(err)),
    );
  }

  @Mutation()
  refreshSession(@Args('refreshToken') refreshToken: string) {
    return this.authService.send(REFRESH_SESSION_TYPE, { refreshToken }).pipe(
      timeout(5000),
      catchError((err: string) => of(err)),
    );
  }
}
