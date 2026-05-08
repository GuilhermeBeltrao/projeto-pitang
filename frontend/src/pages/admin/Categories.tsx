import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { createCategory, listCategories, removeCategory, updateCategory } from "../../services/categories";
import type { Category } from "../../types";

const schema = z.object({
  nome: z.string().min(2, "Nome obrigatorio")
});

type FormData = z.infer<typeof schema>;

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const loadCategories = async () => {
    const data = await listCategories();
    setCategories(data);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const onSubmit = async (data: FormData) => {
    await createCategory({ nome: data.nome });
    toast.success("Categoria criada");
    reset();
    loadCategories();
  };

  const handleToggle = async (category: Category) => {
    await updateCategory(category.id, { ativo: !category.ativo });
    toast.success("Categoria atualizada");
    loadCategories();
  };

  const handleRemove = async (id: string) => {
    await removeCategory(id);
    toast.success("Categoria removida");
    loadCategories();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Nova categoria</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[240px]">
              <Input placeholder="Nome" {...register("nome")} />
              {errors.nome && <p className="text-xs text-red-500 mt-1">{errors.nome.message}</p>}
            </div>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : "Criar"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Categorias ativas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {categories.map((category) => (
              <div key={category.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200/70 p-4">
                <div>
                  <p className="font-semibold">{category.nome}</p>
                  <p className="text-xs text-slate-500">{category.ativo ? "Ativa" : "Inativa"}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleToggle(category)}>
                    {category.ativo ? "Desativar" : "Ativar"}
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => handleRemove(category.id)}>
                    Remover
                  </Button>
                </div>
              </div>
            ))}
            {!categories.length && <p className="text-sm text-slate-500">Nenhuma categoria.</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
