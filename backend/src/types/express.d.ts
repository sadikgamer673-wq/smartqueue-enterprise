import { ITokenPayload } from './auth.types';

declare global {
  namespace Express {
    interface Request {
      user?: ITokenPayload;
      file?: Express.Multer.File;
    }
  }
}
