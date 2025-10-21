import { Request } from 'express';

export type JWTPayload = {
  sub: number;
  email: string;
  name: string;
};

export type RequestWithUser = Request & { user: JWTPayload };
