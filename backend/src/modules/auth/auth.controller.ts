import { Request, Response } from "express";
import { authService } from "../../services/auth.service";

export const authController = {
  async login(req: Request, res: Response) {
    const { email, senha } = req.body;
    const result = await authService.login(email, senha);
    return res.json(result);
  }
};
