import { Request, Response } from "express";
import { CommunityService } from "./service";
import { IPost } from "../../types";

export class CommunityController {
  private communityService = new CommunityService();

  constructor() {
    this.communityService = new CommunityService();
  }

  async create(req: Request, res: Response) {
    try {
      const community = await this.communityService.create(req.body);

      return res.status(200).json({
        statusCode: 200,
        message: "success",
        data: community,
      });
    } catch (error: any) {
      return res.status(400).json({
        statusCode: 400,
        message: "failed",
        error: error.message,
      });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const keyword = req.query.search as string | undefined;

      const feeds = await this.communityService.getAll(keyword);

      return res.status(200).json({
        statusCode: 200,
        message: "succes",
        data: feeds,
      });
    } catch (error: any) {
      return res.status(400).json({
        statusCode: 400,
        message: "failed",
        error: error.message,
      });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const id = req.params.id;

      const feedsData = await this.communityService.getById(id);
      if (!feedsData) {
        return res.status(404).json({
          statusCode: 404,
          message: "Id not found",
        });
      }
      return res.status(200).json({
        statusCode: 200,
        message: "success",
        data: feedsData,
      });
    } catch (error: any) {
      return res.status(400).json({
        statusCode: 400,
        message: "failed",
        error: error.message,
      });
    }
  }




async update(req: Request, res: Response) {
  try {
    const postId = req.params.id;
    const { content, imageUrl, videoUrl, description, share, comments } = req.body;

    const existingPost = await this.communityService.getById(postId);
    if (!existingPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    const dataToUpdate: Partial<IPost> = {
      content: content ?? existingPost.content,
      imageUrl: imageUrl ?? existingPost.imageUrl,
      videoUrl: videoUrl ?? existingPost.videoUrl,
      description: description ?? existingPost.description,
      share: share ?? existingPost.share,
    };

    // If there are comments to add, filter duplicates before adding
    if (comments && Array.isArray(comments) && comments.length > 0) {
      const validComments = comments
        .filter(comment => comment.user && comment.content)
        .map(comment => ({
          user: comment.user,
          content: comment.content.trim(),
          replyTo: comment.replyTo ?? null,
          parentCommentId: comment.parentCommentId ?? null,
          createdAt: new Date(),
          edited: false,
          updatedAt: null,
        }));

      const newCommentKeys = new Set(
        validComments.map(c => `${c.user.toString()}-${c.content}`)
      );

      const filteredExisting = existingPost.comments.filter(c => {
        const key = `${c.user.toString()}-${c.content}`;
        return !newCommentKeys.has(key);
      });

      dataToUpdate.comments = [...filteredExisting, ...validComments];
    }

const updatedPost = await this.communityService.update(postId, dataToUpdate);

    return res.status(200).json({
      message: "Post updated successfully",
      data: updatedPost,
    });

  } catch (error) {
    console.error("Error updating post:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}


  async delete(req: Request, res: Response) {
    try {
      const deleteFeed = await this.communityService.delete(req.params.id);
      if (!deleteFeed) {
        return res.status(404).json({
          statusCode: 404,
          message: "Community feed is not found",
        });
      }
      return res.status(200).json({
        statusCode: 200,
        message: "success",
        data: req.params.id,
      });
    } catch (error: any) {
      return res.status(400).json({
        statusCode: 400,
        message: "failed",
        error: error.message,
      });
    }
  }

  async getFeedByUserId(req: Request, res: Response) {
    try {
      const userId = req.params.userId;
      if (!userId) {
        return res.status(404).json({
          statusCode: 404,
          message: "User Id not found",
        });
      }
      const userData = await this.communityService.getFeedByUserId(userId);

      if (!userData) {
        return res.status(404).json({
          statusCode: 404,
          message: "Community feed is not found",
        });
      }

      return res.status(200).json({
        statusCode: 200,
        message: "success",
        data: userData,
      });
    } catch (error: any) {
      return res.status(400).json({
        statusCode: 400,
        message: "failed",
        error: error.message,
      });
    }
  }
}
