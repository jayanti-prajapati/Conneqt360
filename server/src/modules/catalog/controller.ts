import { Request, Response } from "express";
import { CatalogService } from "./service";


export class CatalogController {
  private catalogService = new CatalogService();

  constructor() {
    this.catalogService = new CatalogService();
  }

  async create(req: Request, res: Response) {
    try {
      const user = await this.catalogService.create(req.body);

      return res.status(200).json({
        statusCode: 200,
        message: "success",
        data: {
          user,
        },
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
      const users = await this.catalogService.getAll();
      return res.status(200).json({
        statusCode: 200,
        message: "success",
        data: users,
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

      const userData = await this.catalogService.getById(id);

      if (!userData) {
        return res.status(404).json({
          statusCode: 404,
          message: "Id not found",
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

  async update(req: Request, res: Response) {
    try {
      const id = req.params.id;

      if (!id) {
        return res.status(400).json({
          statusCode: 400,
          message: "catalog ID is required",
        });
      }

      const updateUser = await this.catalogService.update(id, req.body);

      if (!updateUser) {
        return res.status(404).json({
          statusCode: 404,
          message: "catalog not found",
        });
      }

      return res.status(200).json({
        statusCode: 200,
        message: "success",
        data: updateUser,
      });
    } catch (error: any) {
      return res.status(400).json({
        statusCode: 400,
        message: "failed",
        error: error.message,
      });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const deleteUser = await this.catalogService.delete(req.params.id);

      if (!deleteUser) {
        return res.status(404).json({
          statusCode: 404,
          message: "catalog not found",
        });
      }

      return res.status(200).json({
        statusCode: 200,
        message: "success",
        data: deleteUser.id,
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
