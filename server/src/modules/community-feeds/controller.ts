import { Request, Response } from "express";
import { CommunityService } from "./service";

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
      const feeds = await this.communityService.getAll();
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
      if (!id) {
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
      const id = req.params.id;

      const updateCommunity = await this.communityService.update(id, req.body);

      if (!id) {
        return res.status(404).json({
          statusCode: 404,
          message: "Id not found",
        });
      }
      return res.status(200).json({
        statusCode: 200,
        message: "success",
        data: updateCommunity,
      });
    } catch (error: any) {
      return res.status(400).json({
        sttausCode: 400,
        message: "failed",
        error: error.message,
      });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const deleteFeed = await this.communityService.delete(req.params.id);
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

  async getAllFeeds(req: Request, res: Response) {
    try {
      const { search } = req.query;
      const feeds = await this.communityService.getAllSearch(
        search as string
      );
     return res.status(200).json({
        statusCode: 200,
        message: "success",
        data: feeds,
      });;
    } catch (error: any) {
       return res.status(400).json({
        statusCode: 400,
        message: "failed",
        error: error.message,
      });
    }
  }
}
