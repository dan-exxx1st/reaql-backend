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

  async find(token: string): Promise<Session> {
    return this.sessionRepository.findOne({ relations: ['user'], where: { token } });
  }

  async createRefreshToken(user: User): Promise<Session> {
    const id = v4();
    const refreshToken = v4();

    const expiresIn = Number(Math.floor(Date.now() / 1000) + 60 * 60 * 48);

    const newRefreshToken: Session = {
      id,
      token: refreshToken,
      user,
      expiresIn,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await this.sessionRepository.save(newRefreshToken);
    return newRefreshToken;
  }

  createAccessToken(userId: string, email: string): string {
    const token = sign({ id: userId, email, exp: Math.floor(Date.now() / 1000) + 60 * 60 }, config.jwtSecret);

    return token;
  }

  async deleteRefreshToken(token: string): Promise<boolean> {
    const refreshTokenForDelete = await this.sessionRepository.find({
      token,
    });
    await this.sessionRepository.remove(refreshTokenForDelete);
    return true;
  }
}
