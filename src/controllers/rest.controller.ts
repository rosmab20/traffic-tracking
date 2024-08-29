import { Request, Response } from 'express';
import { IRestController } from '@/interfaces/rest.interface';
import { StatusCodes } from 'http-status-codes';
import { response } from '@/lib/response.lib';

let testContent = '';

export class RestController implements IRestController {
  async postData(req: Request, res: Response): Promise<void> {
    try {
      const value = req.body.value;

      if (!value) {
        throw new Error('Value is required');
      }

      testContent = req.body.value;
      res.status(StatusCodes.OK).json(response(StatusCodes.OK, 'Value updated successfully', { value: testContent }));
    } catch (error: any) {
      res.status(StatusCodes.BAD_REQUEST).json(response(StatusCodes.BAD_REQUEST, error.message, null));
    }
  }

  async getData(req: Request, res: Response): Promise<void> {
    try {
      res.status(StatusCodes.OK).json(response(StatusCodes.OK, 'Fetched current value', { value: testContent }));
    } catch (error: any) {
      res.status(StatusCodes.BAD_REQUEST).json(response(StatusCodes.BAD_REQUEST, error.message, null));
    }
  }
}
