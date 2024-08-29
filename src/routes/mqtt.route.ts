import { Router } from 'express';
import { RestController } from '@/controllers/rest.controller';
import { MQTTController } from '@/controllers/mqtt.controller';
const router = Router();

const { getPublisherPage, getSubscriberPage, publishMQTTMessage } = new MQTTController();

router.get('/subscriber', getSubscriberPage);
router.get('/publisher', getPublisherPage);
router.post('/', publishMQTTMessage);

export default router;
