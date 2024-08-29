import { Response, Request } from 'express';

export interface IRestController {
  postData(req: Request, res: Response): Promise<void>;
  getData(req: Request, res: Response): Promise<void>;
}
