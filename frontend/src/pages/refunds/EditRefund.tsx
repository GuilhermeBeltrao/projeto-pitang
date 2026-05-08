import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Button } from "../../components/ui/button";
import { Select } from "../../components/ui/select";
import { listCategories } from "../../services/categories";
import { getRefund, updateRefund } from "../../services/refunds";
import type { Category } from "../../types";
import { toast } from "sonner";
import LoadingState from "../../components/LoadingState";

const schema = z.object({
  categoriaId: z.string().uuid("Categoria obrigatoria"),
  descricao: z.string().min(5, "Descricao obrigatoria"),
  valor: z.coerce.number().positive("Valor deve ser positivo"),
  dataDespesa: z.string().min(1, "Data obrigatoria"),
  anexos: z
    .array(
      z.object({
        nomeArquivo: z.string().min(2, "Nome obrigatorio"),
        urlArquivo: z.string().min(3, "URL obrigatoria"),
        tipoArquivo: z.string().min(2, "Tipo obrigatorio")
      })
    )
    .optional()
});

type FormData = z.infer<typeof schema>;

export default function EditRefund() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const { fields, append, remove } = useFieldArray({ control, name: "anexos" });

  useEffect(() => {
    if (!id) return;
    Promise.all([listCategories(), getRefund(id)]).then(([cats, refund]) => {
      const unique = Array.from(new Map(cats.map((cat) => [cat.nome, cat])).values());
      setCategories(unique);
      reset({
        categoriaId: refund.categoriaId,
        descricao: refund.descricao,
        valor: refund.valor,
        dataDespesa: refund.dataDespesa.slice(0, 10),
        anexos: refund.anexos?.map((anexo) => ({
          nomeArquivo: anexo.nomeArquivo,
          urlArquivo: anexo.urlArquivo,
          tipoArquivo: anexo.tipoArquivo
        }))
      });
      setLoading(false);
    });
  }, [id, reset]);

  const onSubmit = async (data: FormData) => {
    if (!id) return;
    await updateRefund(id, data);
    toast.success("Solicitacao atualizada");
    navigate("/minhas-solicitacoes");
  };

  if (loading) {
    return <LoadingState />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Editar solicitacao</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Categoria</label>
            <Select {...register("categoriaId")}>
              <option value="">Selecione</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.nome}
                </option>
              ))}
            </Select>
            {errors.categoriaId && <p className="text-xs text-red-500 mt-1">{errors.categoriaId.message}</p>}
          </div>
          <div>
            <label className="text-sm font-medium">Descricao</label>
            <Textarea {...register("descricao")} />
            {errors.descricao && <p className="text-xs text-red-500 mt-1">{errors.descricao.message}</p>}
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium">Valor</label>
              <Input type="number" step="0.01" {...register("valor")} />
              {errors.valor && <p className="text-xs text-red-500 mt-1">{errors.valor.message}</p>}
            </div>
            <div>
              <label className="text-sm font-medium">Data da despesa</label>
              <Input type="date" {...register("dataDespesa")} />
              {errors.dataDespesa && <p className="text-xs text-red-500 mt-1">{errors.dataDespesa.message}</p>}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">Anexos (fake upload)</h3>
              <Button type="button" variant="subtle" size="sm" onClick={() => append({ nomeArquivo: "", urlArquivo: "", tipoArquivo: "" })}>
                Adicionar anexo
              </Button>
            </div>
            {fields.map((field, index) => (
              <div key={field.id} className="grid gap-3 md:grid-cols-3">
                <Input placeholder="Nome" {...register(`anexos.${index}.nomeArquivo` as const)} />
                <Input placeholder="URL" {...register(`anexos.${index}.urlArquivo` as const)} />
                <div className="flex gap-2">
                  <Input placeholder="Tipo" {...register(`anexos.${index}.tipoArquivo` as const)} />
                  <Button type="button" variant="ghost" size="sm" onClick={() => remove(index)}>
                    Remover
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Salvando..." : "Salvar alteracoes"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
