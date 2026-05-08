import { Request, Response } from "express";
import { categoryService } from "../../services/category.service";

export const categoriesController = {
  async list(_req: Request, res: Response) {
    const categories = await categoryService.list();
    return res.json(categories);
  },

  async create(req: Request, res: Response) {
    const category = await categoryService.create(req.body);
    return res.status(201).json(category);
  },

  async update(req: Request, res: Response) {
    const category = await categoryService.update(req.params.id, req.body);
    return res.json(category);
  },

  async remove(req: Request, res: Response) {
    await categoryService.remove(req.params.id);
    return res.status(204).send();
  }
};
