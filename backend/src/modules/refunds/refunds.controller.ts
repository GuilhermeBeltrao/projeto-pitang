import { Request, Response } from "express";
import { refundService } from "../../services/refund.service";

export const refundsController = {
  async list(req: Request, res: Response) {
    const result = await refundService.list(req.user, req.query as {
      page?: number;
      pageSize?: number;
      status?: "RASCUNHO" | "ENVIADO" | "APROVADO" | "REJEITADO" | "PAGO";
      categoriaId?: string;
      solicitanteId?: string;
    });
    return res.json(result);
  },

  async getById(req: Request, res: Response) {
    const refund = await refundService.getById(req.params.id, req.user);
    return res.json(refund);
  },

  async create(req: Request, res: Response) {
    const refund = await refundService.create({
      solicitanteId: req.user!.id,
      ...req.body
    });
    return res.status(201).json(refund);
  },

  async update(req: Request, res: Response) {
    const refund = await refundService.update(req.params.id, req.user, req.body);
    return res.json(refund);
  },

  async remove(req: Request, res: Response) {
    await refundService.remove(req.params.id, req.user);
    return res.status(204).send();
  },

  async send(req: Request, res: Response) {
    const refund = await refundService.send(req.params.id, req.user);
    return res.json(refund);
  },

  async approve(req: Request, res: Response) {
    const refund = await refundService.approve(req.params.id, req.user);
    return res.json(refund);
  },

  async reject(req: Request, res: Response) {
    const refund = await refundService.reject(req.params.id, req.user, req.body.justificativa);
    return res.json(refund);
  },

  async pay(req: Request, res: Response) {
    const refund = await refundService.pay(req.params.id, req.user);
    return res.json(refund);
  },

  async purge(_req: Request, res: Response) {
    const result = await refundService.purgeAll();
    return res.json({ deleted: result });
  }
};
