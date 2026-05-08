import { ChangeEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Button } from "../../components/ui/button";
import { Select } from "../../components/ui/select";
import { listCategories } from "../../services/categories";
import { createRefund } from "../../services/refunds";
import type { Category } from "../../types";
import { toast } from "sonner";

const schema = z.object({
  categoriaId: z.string().uuid("Categoria obrigatoria"),
  descricao: z.string().min(5, "Descricao obrigatoria"),
  valor: z.coerce.number().positive("Valor deve ser positivo"),
  dataDespesa: z.string().min(1, "Data obrigatoria")
});

type FormData = z.infer<typeof schema>;

export default function NewRefund() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<FormData>({ resolver: zodResolver(schema) });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  useEffect(() => {
    listCategories().then((cats) => {
      const unique = Array.from(new Map(cats.map((cat) => [cat.nome, cat])).values());
      setCategories(unique);
    });
  }, []);

  const handleFilesChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (!files.length) return;
    setSelectedFiles((current) => [...current, ...files]);
    event.target.value = "";
  };

  const removeSelectedFile = (index: number) => {
    setSelectedFiles((current) => current.filter((_, currentIndex) => currentIndex !== index));
  };

  const onSubmit = async (data: FormData) => {
    await createRefund(data, selectedFiles);
    toast.success("Solicitacao criada");
    navigate("/minhas-solicitacoes");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nova solicitacao</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Categoria</label>
            <Select {...register("categoriaId")}
            >
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
              <h3 className="text-sm font-semibold">Anexos</h3>
            </div>
            <Input type="file" multiple onChange={handleFilesChange} />
            {selectedFiles.length ? (
              <div className="space-y-2">
                {selectedFiles.map((file, index) => (
                  <div key={`${file.name}-${index}`} className="flex items-center justify-between rounded border border-slate-200 px-3 py-2">
                    <div>
                      <p className="text-sm font-medium">{file.name}</p>
                      <p className="text-xs text-slate-500">{file.type || "tipo desconhecido"}</p>
                    </div>
                    <Button type="button" variant="ghost" size="sm" onClick={() => removeSelectedFile(index)}>
                      Remover
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500">Nenhum arquivo selecionado.</p>
            )}
          </div>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Salvando..." : "Criar solicitacao"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
