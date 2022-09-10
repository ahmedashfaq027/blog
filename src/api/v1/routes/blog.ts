import { Request, Response, Router } from 'express';
import { TokenType } from '../../../core/types';
import { getPopularPosts } from '../controllers/BlogController';
import { validateAccessToken } from '../middlewares/auth';
import { internalServerError } from '../utils/responses';

const router = Router();

// Protected routes
router.patch('/edit/id', validateAccessToken, async (req: Request, res: Response) => {
    try {

    } catch (err: any) {
        internalServerError(res, err as Error);
    }
});

router.post('/add', validateAccessToken, async (req: Request, res: Response) => {
    try {

    } catch (err: any) {
        internalServerError(res, err as Error);
    }
});

router.get('/all', validateAccessToken, async (req: Request, res: Response) => {
    try {

    } catch (err: any) {
        internalServerError(res, err as Error);
    }
});

// Public routes
router.post('/view', async (req: Request, res: Response) => {
    try {

    } catch (err: any) {
        internalServerError(res, err as Error);
    }
});

router.get('/popular', async (req: Request, res: Response) => {
    try {
        console.log('Hi');

        await getPopularPosts(req, res);
    } catch (err: any) {
        internalServerError(res, err as Error);
    }
})

router.get('/blog/:id', async (req: Request, res: Response) => {
    try {

    } catch (err: any) {
        internalServerError(res, err as Error);
    }
})

router.get('/related', async (req: Request, res: Response) => {
    try {

    } catch (err: any) {
        internalServerError(res, err as Error);
    }
})

export default router;