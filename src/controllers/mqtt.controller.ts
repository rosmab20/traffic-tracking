import { Request, Response } from 'express';
import { IRestController } from '@/interfaces/rest.interface';
import { StatusCodes } from 'http-status-codes';
import { response } from '@/lib/response.lib';
import { IMqttController } from '@/interfaces/mqtt.interface';
const mqttService = require('../lib/mqtt.lib');

const host = `mqtt://${process.env.MQTT_HOST}:${process.env.MQTT_PORT}`;

const mqttClient = new mqttService(host);
mqttClient.connectToBroker();

export class MQTTController implements IMqttController {
  async getPublisherPage(req: Request, res: Response): Promise<void> {
    try {
      res.render('pages/publisher');
    } catch (error: any) {
      res.status(StatusCodes.BAD_REQUEST).json(response(StatusCodes.BAD_REQUEST, error.message, null));
    }
  }

  async getSubscriberPage(req: Request, res: Response): Promise<void> {
    try {
      res.render('pages/subscriber');
    } catch (error: any) {
      res.status(StatusCodes.BAD_REQUEST).json(response(StatusCodes.BAD_REQUEST, error.message, null));
    }
  }

  async publishMQTTMessage(req: Request, res: Response): Promise<void> {
    try {
      const topic = req.body.topic;
      const message = req.body.message;

      console.log(`Request Topic :: ${topic}`);
      console.log(`Request Message :: ${message}`);

      mqttClient.publish(topic, message, {});
      res.status(StatusCodes.OK).json(response(StatusCodes.OK, 'Message published successfully', null));
    } catch (error: any) {
      res.status(StatusCodes.BAD_REQUEST).json(response(StatusCodes.BAD_REQUEST, error.message, null));
    }
  }
}
