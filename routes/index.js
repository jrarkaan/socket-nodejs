import { Router } from "express";
import { getPage, getPageChat } from '../controllers/indexControllers.js';

const router = Router();

router.route('/login-chat')
        .get(getPageChat);

router.route('/send-chat')
    .get(getPage);

export default router;