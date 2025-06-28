import { Request, Response } from "express";
import { UserService } from "./service";

export class UserController {
  private userService = new UserService();

  constructor() {
    this.userService = new UserService();
  }

  async create(req: Request, res: Response) {
    try {
      const user = await this.userService.create(req.body);

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
      const users = await this.userService.getAll();
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

      const userData = await this.userService.getById(id);

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
          message: "User ID is required",
        });
      }

      const updateUser = await this.userService.update(id, req.body);

      if (!updateUser) {
        return res.status(404).json({
          statusCode: 404,
          message: "User not found or inactive",
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
      const deleteUser = await this.userService.delete(req.params.id);

      if (!deleteUser) {
        return res.status(404).json({
          statusCode: 404,
          message: "User not found or already inactive",
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

  async getByPhone(req: Request, res: Response) {
    try {
      const phone = req.params.phone;

      const phoneData = await this.userService.getByPhone(phone);

      if (!phoneData) {
        return res.status(404).json({
          statusCode: 404,
          message: "Phone number not found",
        });
      }
      return res.status(200).json({
        statusCode: 200,
        message: "success",
        data: phoneData,
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
