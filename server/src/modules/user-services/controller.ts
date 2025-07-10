import { Request, Response } from "express";
import { UserServicesService } from "./service";


export class UserServicesController {
  private services = new UserServicesService();

  async create(req: Request, res: Response) {
    try {
      const user = await this.services.create(req.body);

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
      const users = await this.services.getAll();
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

      const userData = await this.services.getById(id);

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

    async getByUserId(req: Request, res: Response) {
    try {
      const userId = req.params.userId;

      const userData = await this.services.getByUserId(userId);

      if (!userData) {
        return res.status(404).json({
          statusCode: 404,
          message: "UserId not found",
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
      const userId = req.params.userId;

      if (!userId) {
        return res.status(400).json({
          statusCode: 400,
          message: "user ID is required",
        });
      }

      const updateUser = await this.services.update(userId, req.body);
       
      if (!updateUser) {
        return res.status(404).json({
          statusCode: 404,
          message: "user services not found",
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
      const deleteUser = await this.services.delete(req.params.id);

      if (!deleteUser) {
        return res.status(404).json({
          statusCode: 404,
          message: "user services not found",
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
