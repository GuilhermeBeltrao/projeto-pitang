import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import AppLayout from "../layouts/AppLayout";
import AuthLayout from "../layouts/AuthLayout";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import MyRefunds from "../pages/refunds/MyRefunds";
import NewRefund from "../pages/refunds/NewRefund";
import EditRefund from "../pages/refunds/EditRefund";
import RefundDetails from "../pages/refunds/RefundDetails";
import PendingRefunds from "../pages/manager/PendingRefunds";
import ApprovedRefunds from "../pages/finance/ApprovedRefunds";
import Users from "../pages/admin/Users";
import Categories from "../pages/admin/Categories";
import Unauthorized from "../pages/Unauthorized";
import NotFound from "../pages/NotFound";

export default function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <AuthLayout>
            <Login />
          </AuthLayout>
        }
      />
      <Route path="/unauthorized" element={<Unauthorized />} />

      <Route element={<PrivateRoute />}
      >
        <Route element={<AppLayout />}>
          <Route path="/" element={<Dashboard />} />

          <Route element={<PrivateRoute roles={["COLABORADOR"]} />}
          >
            <Route path="/minhas-solicitacoes" element={<MyRefunds />} />
            <Route path="/solicitacoes/nova" element={<NewRefund />} />
            <Route path="/solicitacoes/:id/editar" element={<EditRefund />} />
            <Route path="/solicitacoes/:id" element={<RefundDetails />} />
          </Route>

          <Route element={<PrivateRoute roles={["GESTOR"]} />}
          >
            <Route path="/gestor/pendentes" element={<PendingRefunds />} />
          </Route>

          <Route element={<PrivateRoute roles={["FINANCEIRO"]} />}
          >
            <Route path="/financeiro/aprovadas" element={<ApprovedRefunds />} />
          </Route>

          <Route element={<PrivateRoute roles={["ADMIN"]} />}
          >
            <Route path="/admin/usuarios" element={<Users />} />
            <Route path="/admin/categorias" element={<Categories />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
