import { Request, Response } from 'express';

export interface IMqttController {
  getPublisherPage(req: Request, res: Response): Promise<void>;
  getSubscriberPage(req: Request, res: Response): Promise<void>;
  publishMQTTMessage(req: Request, res: Response): Promise<void>;
}
