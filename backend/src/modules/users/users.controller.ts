import { Request, Response } from "express";
import { userService } from "../../services/user.service";

export const usersController = {
  async list(_req: Request, res: Response) {
    const users = await userService.list();
    return res.json(users);
  },

  async create(req: Request, res: Response) {
    const user = await userService.create(req.body);
    return res.status(201).json(user);
  },

  async update(req: Request, res: Response) {
    const user = await userService.update(req.params.id, req.body);
    return res.json(user);
  },

  async remove(req: Request, res: Response) {
    await userService.remove(req.params.id);
    return res.status(204).send();
  }
};
