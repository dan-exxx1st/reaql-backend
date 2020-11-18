import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Session, User } from 'shared/models';
import { Repository } from 'typeorm';

import { v4 } from 'uuid';
import { sign } from 'jsonwebtoken';

import config from 'shared/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Session)
    private sessionRepository: Repository<Session>,
  ) {}

  async createRefreshToken(userId: string) {
    const id = v4();
    const refreshToken = v4();

    const expiresIn = Number(Math.floor(Date.now() / 1000) + 60 * 60 * 48);

    const newRefreshToken: Session = {
      id,
      token: refreshToken,
      user: userId,
      expiresIn,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await this.sessionRepository.save(newRefreshToken);

    return {
      id,
      refreshToken,
    };
  }

  createAccessToken(userId: string, email: string) {
    const token = sign(
      { id: userId, email, exp: Math.floor(Date.now() / 1000) + 60 * 60 },
      config.jwtSecret,
    );

    return token;
  }
}
