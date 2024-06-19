declare namespace Express {
  export interface Request {
    user: {
      type: string;
      zid: string;
      email: string;
      name: string;
      userId: string;
    };
  }
}
