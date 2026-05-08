import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Select } from "../../components/ui/select";
import { purgeRefunds } from "../../services/refunds";
import { createUser, listUsers, removeUser } from "../../services/users";
import type { User, UserRole } from "../../types";

const schema = z.object({
  nome: z.string().min(2, "Nome obrigatorio"),
  email: z.string().email("Email invalido"),
  senha: z.string().min(6, "Senha minima"),
  perfil: z.enum(["COLABORADOR", "GESTOR", "FINANCEIRO", "ADMIN"])
});

type FormData = z.infer<typeof schema>;

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const loadUsers = async () => {
    const data = await listUsers();
    setUsers(data);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const onSubmit = async (data: FormData) => {
    await createUser(data);
    toast.success("Usuario criado");
    reset();
    loadUsers();
  };

  const handleRemove = async (id: string) => {
    await removeUser(id);
    toast.success("Usuario removido");
    loadUsers();
  };

  const handlePurgeRefunds = async () => {
    const confirmed = window.confirm("Tem certeza que deseja remover TODAS as solicitacoes de reembolso?");
    if (!confirmed) return;
    const result = await purgeRefunds();
    toast.success(`Solicitacoes removidas: ${result.deleted.refunds}`);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Novo usuario</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium">Nome</label>
              <Input {...register("nome")} />
              {errors.nome && <p className="text-xs text-red-500 mt-1">{errors.nome.message}</p>}
            </div>
            <div>
              <label className="text-sm font-medium">Email</label>
              <Input type="email" {...register("email")} />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className="text-sm font-medium">Senha</label>
              <Input type="password" {...register("senha")} />
              {errors.senha && <p className="text-xs text-red-500 mt-1">{errors.senha.message}</p>}
            </div>
            <div>
              <label className="text-sm font-medium">Perfil</label>
              <Select {...register("perfil")}
              >
                <option value="">Selecione</option>
                {["COLABORADOR", "GESTOR", "FINANCEIRO", "ADMIN"].map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </Select>
              {errors.perfil && <p className="text-xs text-red-500 mt-1">{errors.perfil.message}</p>}
            </div>
            <div className="md:col-span-2">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Salvando..." : "Criar usuario"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Usuarios cadastrados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {users.map((user) => (
              <div key={user.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200/70 p-4">
                <div>
                  <p className="font-semibold">{user.nome}</p>
                  <p className="text-xs text-slate-500">{user.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase tracking-wide text-slate-500">{user.perfil as UserRole}</span>
                  <Button size="sm" variant="danger" onClick={() => handleRemove(user.id)}>
                    Remover
                  </Button>
                </div>
              </div>
            ))}
            {!users.length && <p className="text-sm text-slate-500">Nenhum usuario.</p>}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Zona de risco</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-semibold">Excluir todas as solicitacoes</p>
              <p className="text-xs text-slate-500">Remove solicitacoes, anexos e historico.</p>
            </div>
            <Button variant="danger" onClick={handlePurgeRefunds}>
              Apagar reembolsos
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
