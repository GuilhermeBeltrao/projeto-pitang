import { Request, Response } from "express";
import { refundService } from "../../services/refund.service";

export const historyController = {
  async list(req: Request, res: Response) {
    const history = await refundService.history(req.params.id, req.user);
    return res.json(history);
  }
};
