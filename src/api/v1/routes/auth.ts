import { Request, Response, Router } from 'express';
import { loginWithEmail, registerWithEmail } from '../controllers/AuthController';
import { validateLoginFields, validateRegisterFields } from '../middlewares/auth';
import { internalServerError } from '../utils/responses';

const router = Router();

router.post('/register', validateRegisterFields, async (req: Request, res: Response) => {
    try {
        await registerWithEmail(req, res)
    } catch (err: any) {
        internalServerError(res, err as Error);
    }
})

router.post('/login', validateLoginFields, async (req: Request, res: Response) => {
    try {
        await loginWithEmail(req, res);
    } catch (err: any) {
        internalServerError(res, err as Error);
    }
})

export default router;