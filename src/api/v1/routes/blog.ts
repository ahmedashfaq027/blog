import { Request, Response, Router } from 'express';
import multer from 'multer';
import { addBlogPost, getAllPosts, getCoverImage, getPopularPosts, getPost, getRelatedPosts, postView, updateBlogPost } from '../controllers/BlogController';
import { validateAccessToken } from '../middlewares/auth';
import { internalServerError } from '../utils/responses';
import path from 'path';

const router = Router();
const storage = multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb) => {
        cb(null, path.join(__dirname, '../../../../uploads'));
    },
    filename: (req: Request, file: Express.Multer.File, cb) => {
        cb(null, file.fieldname + '-' + Date.now());
    }
});

const upload = multer({ storage: storage });

// Protected routes
router.patch('/admin/edit/:id', validateAccessToken, upload.single('coverImage'), async (req: Request, res: Response) => {
    try {
        await updateBlogPost(req, res);
    } catch (err: any) {
        internalServerError(res, err as Error);
    }
});

router.post('/admin/add', validateAccessToken, upload.single('coverImage'), async (req: Request, res: Response) => {
    try {
        await addBlogPost(req, res);
    } catch (err: any) {
        internalServerError(res, err as Error);
    }
});

router.get('/admin/all', validateAccessToken, async (req: Request, res: Response) => {
    try {
        await getAllPosts(req, res);
    } catch (err: any) {
        internalServerError(res, err as Error);
    }
});

router.get('/admin/:id', validateAccessToken, async (req: Request, res: Response) => {
    try {
        await getPost(req, res, true);
    } catch (err: any) {
        internalServerError(res, err as Error);
    }
})

// Public routes
router.post('/view/:id', async (req: Request, res: Response) => {
    try {
        await postView(req, res);
    } catch (err: any) {
        internalServerError(res, err as Error);
    }
});

router.get('/popular', async (req: Request, res: Response) => {
    try {
        await getPopularPosts(req, res);
    } catch (err: any) {
        internalServerError(res, err as Error);
    }
});

router.get('/:id', async (req: Request, res: Response) => {
    try {
        await getPost(req, res, false);
    } catch (err: any) {
        internalServerError(res, err as Error);
    }
});

router.get('/cover/:id', async (req: Request, res: Response) => {
    try {
        await getCoverImage(req, res);
    } catch (err: any) {
        internalServerError(res, err as Error);
    }
});

router.get('/related/:id', async (req: Request, res: Response) => {
    try {
        await getRelatedPosts(req, res);
    } catch (err: any) {
        internalServerError(res, err as Error);
    }
});

export default router;