import { Router } from 'express';
import restRoutes from './rest.route';
import mqttRoutes from './mqtt.route';

const router = Router();

router.use('/rest', restRoutes);
router.use('/mqtt', mqttRoutes);

export default router;
