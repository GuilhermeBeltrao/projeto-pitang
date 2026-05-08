export const openapiSpec = {
  openapi: "3.0.0",
  info: {
    title: "API de Reembolsos",
    version: "1.0.0"
  },
  servers: [{ url: "http://localhost:4000" }],
  paths: {
    "/auth/login": {
      post: { summary: "Login" }
    },
    "/users": {
      get: { summary: "Listar usuarios" },
      post: { summary: "Criar usuario" }
    },
    "/users/{id}": {
      put: { summary: "Atualizar usuario" },
      delete: { summary: "Remover usuario" }
    },
    "/categories": {
      get: { summary: "Listar categorias" },
      post: { summary: "Criar categoria" }
    },
    "/categories/{id}": {
      put: { summary: "Atualizar categoria" },
      delete: { summary: "Remover categoria" }
    },
    "/refunds": {
      get: { summary: "Listar solicitacoes" },
      post: { summary: "Criar solicitacao" }
    },
    "/refunds/{id}": {
      get: { summary: "Detalhar solicitacao" },
      put: { summary: "Atualizar solicitacao" },
      delete: { summary: "Remover solicitacao" }
    },
    "/refunds/{id}/send": {
      patch: { summary: "Enviar solicitacao" }
    },
    "/refunds/{id}/approve": {
      patch: { summary: "Aprovar solicitacao" }
    },
    "/refunds/{id}/reject": {
      patch: { summary: "Rejeitar solicitacao" }
    },
    "/refunds/{id}/pay": {
      patch: { summary: "Marcar como paga" }
    },
    "/refunds/{id}/history": {
      get: { summary: "Historico da solicitacao" }
    }
  }
};
