import { Router } from 'express';
import { RestController } from '@/controllers/rest.controller';
const router = Router();

const { postData, getData } = new RestController();

router.post('/post', postData);
router.get('/get', getData);

export default router;
