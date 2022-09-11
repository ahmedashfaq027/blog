import { Request, Response, Router } from 'express';
import multer from 'multer';
import { addBlogPost, getAllPosts, getCoverImage, getPopularPosts, getPost, getRelatedPosts, postView, updateBlogPost } from '../controllers/BlogController';
import { checkAndValidateAccessToken, validateAccessToken } from '../middlewares/auth';
import { internalServerError } from '../utils/responses';
import path from 'path';

const router = Router();
const storage = multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb) => {
        cb(null, path.join(__dirname, '../../../../uploads'));
    },
    filename: (req: Request, file: Express.Multer.File, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    fileFilter(req: Request, file: Express.Multer.File, cb) {
        const ext = path.extname(file.originalname);
        if (ext === '.png' || ext === '.jpg' || ext === '.gif' || ext === '.jpeg') {
            return cb(null, true);
        }

        return cb(new Error('Only images are allowed'));
    },
}).single('coverImage');

// Protected routes
router.patch('/admin/edit/:id', checkAndValidateAccessToken, upload, async (req: Request, res: Response) => {
    try {
        await updateBlogPost(req, res);
    } catch (err: any) {
        internalServerError(res, err as Error);
    }
});

router.post('/admin/add', checkAndValidateAccessToken, upload, async (req: Request, res: Response) => {
    try {
        await addBlogPost(req, res);
    } catch (err: any) {
        internalServerError(res, err as Error);
    }
});

router.get('/admin/all', checkAndValidateAccessToken, async (req: Request, res: Response) => {
    try {
        await getAllPosts(req, res);
    } catch (err: any) {
        internalServerError(res, err as Error);
    }
});

router.get('/admin/:id', checkAndValidateAccessToken, async (req: Request, res: Response) => {
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