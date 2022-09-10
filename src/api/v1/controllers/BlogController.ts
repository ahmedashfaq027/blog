import { Request, Response } from "express";
import Blog from "../models/blog";

export const getPopularPosts = async (req: Request, res: Response) => {
    const queryParams = req.query;
    const page: number = Number(queryParams.page as string ?? 1);
    const limit: number = Number(queryParams.limit as string ?? 10);

    // const data = await Blog.find()
    //     .sort({ views: "desc" })
    //     .limit(limit * 1);

    // console.log(data)

    return res.send('Hi')
}