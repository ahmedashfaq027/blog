import { Request, Response } from "express";
import fs from 'fs';
import { error, HTTP, HTTP_DESC, ResponseV1, Status, success } from "../../../types";
import Blog from "../models/blog";
import { BlogStatus } from "../types/blog";
import { generateIdFromTitle } from "../utils/helper";

export const addBlogPost = async (req: Request, res: Response) => {
    if (!req.file) {
        return res.status(HTTP.BAD_REQUEST).json({
            status: Status.Error,
            statusCode: HTTP.FORBIDDEN,
            statusMessage: HTTP_DESC.FORBIDDEN,
            data: { message: 'Cover Image is not found/uploaded' } as error
        } as ResponseV1);
    }

    const image = fs.readFileSync(req.file.path);
    const coverImage = {
        data: Buffer.from(image.toString('base64'), 'base64'),
        contentType: req.file.mimetype
    };
    const { title, content, tags } = req.body;
    const status: keyof typeof BlogStatus = req.body.status;

    const newBlog = new Blog({
        id: generateIdFromTitle(title),
        title: title,
        content: content,
        tags: tags.split(','),
        coverImage: coverImage,
        status: status ?? BlogStatus.DRAFT
    });

    await newBlog.save((err, result) => {
        if (err) {
            console.error(err);
            return res.status(HTTP.FORBIDDEN).json({
                status: Status.Error,
                statusCode: HTTP.FORBIDDEN,
                statusMessage: HTTP_DESC.FORBIDDEN,
                data: { message: 'Failed to add the blog', error: err } as error
            } as ResponseV1);
        }

        return res.status(HTTP.OK).json({
            status: Status.Success,
            statusCode: HTTP.OK,
            statusMessage: HTTP_DESC.OK,
            data: { message: 'Blog saved successfully', data: result.id } as success
        } as ResponseV1);
    })
}

export const updateBlogPost = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, content, tags } = req.body;
    const status: keyof typeof BlogStatus = req.body.status;

    let updatedBlog: any = {
        title: title,
        content: content,
        tags: tags.split(",")
    };

    if (req.file) {
        const image = fs.readFileSync(req.file.path);
        const coverImage = {
            data: Buffer.from(image.toString('base64'), 'base64'),
            contentType: req.file.mimetype
        };
        updatedBlog.coverImage = coverImage;
    }

    await Blog.findOneAndUpdate({ id: id }, updatedBlog, {}, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(HTTP.FORBIDDEN).json({
                status: Status.Error,
                statusCode: HTTP.FORBIDDEN,
                statusMessage: HTTP_DESC.FORBIDDEN,
                data: { message: 'Failed to add the blog', error: err } as error
            } as ResponseV1);
        }

        return res.status(HTTP.OK).json({
            status: Status.Success,
            statusCode: HTTP.OK,
            statusMessage: HTTP_DESC.OK,
            data: { message: 'Blog updated successfully' } as success
        } as ResponseV1);
    });
}

export const getAllPosts = async (req: Request, res: Response) => {
    const queryParams = req.query;
    const page: number = Number(queryParams.page as string ?? 1);
    const limit: number = Number(queryParams.limit as string ?? 10);

    const posts = await Blog.find({}, { _id: 0, __v: 0, coverImage: 0 })
        .sort({ updatedAt: "desc" })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();

    return res.status(HTTP.OK).json({
        status: Status.Success,
        statusCode: HTTP.OK,
        statusMessage: HTTP_DESC.OK,
        data: { data: posts, message: 'Successfully fetched all posts' } as success
    } as ResponseV1);
}

export const getPost = async (req: Request, res: Response, all: boolean) => {
    const { id } = req.params;
    const query = all ? { id: id } : { id: id, status: BlogStatus.PUBLISHED }
    const existingPost = await Blog.findOne(query, { _id: 0, __v: 0, coverImage: 0 });

    if (!existingPost) {
        return res.status(HTTP.NOT_FOUND).json({
            status: Status.Error,
            statusCode: HTTP.NOT_FOUND,
            statusMessage: HTTP_DESC.NOT_FOUND,
            data: { message: 'Cannot get the blog post', error: new Error('Failed') } as error
        } as ResponseV1);
    }

    return res.status(HTTP.OK).json({
        status: Status.Success,
        statusCode: HTTP.OK,
        statusMessage: HTTP_DESC.OK,
        data: { data: existingPost, message: 'Successfully fetched all posts' } as success
    } as ResponseV1);
}

export const getPopularPosts = async (req: Request, res: Response) => {
    const queryParams = req.query;
    const page: number = Number(queryParams.page as string ?? 1);
    const limit: number = Number(queryParams.limit as string ?? 10);

    const data = await Blog.find({}, { _id: 0, __v: 0, views: 0, coverImage: 0 })
        .sort({ views: "desc" })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();

    return res.status(HTTP.OK).json({
        status: Status.Success,
        statusCode: HTTP.OK,
        statusMessage: HTTP_DESC.OK,
        data: { data: data, message: 'Successfully fetched popular posts' } as success
    } as ResponseV1);
}

export const getCoverImage = async (req: Request, res: Response) => {
    const { id } = req.params;
    const data = await Blog.findOne({ id: id }, { _id: 0, __v: 0, views: 0, content: 0, status: 0, tags: 0, title: 0, createdAt: 0, updatedAt: 0 });
    const img = data?.coverImage;

    if (img && img.data && img.contentType) {
        return res.status(HTTP.OK)
            .header('Content-Type', img.contentType)
            .end(new Buffer(img.data));
    }

    return res.status(HTTP.NOT_FOUND).json({
        status: Status.Error,
        statusCode: HTTP.NOT_FOUND,
        statusMessage: HTTP_DESC.NOT_FOUND,
        data: { message: 'Cannot get the cover image', error: new Error('Failed') } as error
    } as ResponseV1);
}

export const postView = async (req: Request, res: Response) => {
    const { id } = req.params;

    await Blog.findOneAndUpdate({ id: id }, { $inc: { views: 1 } })
        .exec((err, result) => {
            if (err) {
                console.error(err);
                return res.status(HTTP.FORBIDDEN).json({
                    status: Status.Error,
                    statusCode: HTTP.FORBIDDEN,
                    statusMessage: HTTP_DESC.FORBIDDEN,
                    data: { message: 'Failed to post the view', error: err } as error
                } as ResponseV1);
            }

            return res.status(HTTP.OK).json({
                status: Status.Success,
                statusCode: HTTP.OK,
                statusMessage: HTTP_DESC.OK,
                data: { message: 'View posted successfully' } as success
            } as ResponseV1);
        });
}

export const getRelatedPosts = async (req: Request, res: Response) => {
    const { id } = req.params;
    const existingPost = await Blog.findOne({ id: id }, { _id: 0, __v: 0, coverImage: 0, title: 0, content: 0, views: 0, status: 0 });

    if (!existingPost) {
        return res.status(HTTP.NOT_FOUND).json({
            status: Status.Error,
            statusCode: HTTP.NOT_FOUND,
            statusMessage: HTTP_DESC.NOT_FOUND,
            data: { message: `Cannot find the blog post with id ${id}`, error: new Error('Failed') } as error
        } as ResponseV1);
    }

    if (!existingPost.tags || existingPost.tags.length === 0) {
        return res.status(HTTP.NOT_FOUND).json({
            status: Status.Error,
            statusCode: HTTP.NOT_FOUND,
            statusMessage: HTTP_DESC.NOT_FOUND,
            data: { message: `No tags found on the blog post with id ${id}`, error: new Error('Failed') } as error
        } as ResponseV1);
    }

    const tags: string[] = existingPost.tags as string[];
    const relatedBlogPosts = await Blog.aggregate([
        {
            $match: {
                $and: [
                    { tags: { $in: tags } },
                    { status: BlogStatus.PUBLISHED }
                ]
            }
        },
        {
            $project: {
                _id: 0, __v: 0, coverImage: 0, content: 0, views: 0, status: 0
            }
        }
    ]);

    return res.status(HTTP.OK).json({
        status: Status.Success,
        statusCode: HTTP.OK,
        statusMessage: HTTP_DESC.OK,
        data: { data: relatedBlogPosts, message: 'Successfully fetched related posts' } as success
    } as ResponseV1);;
}