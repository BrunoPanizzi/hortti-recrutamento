# Frontend - Aplicação de Gestão de Produtos

Frontend da aplicação de gestão de produtos desenvolvido com Next.js 15, React 19 e TypeScript. Este projeto faz parte do desafio técnico da Hortti.

## 🚀 Tecnologias

- **[Next.js 15](https://nextjs.org/)** - Framework React com App Router
- **[React 19](https://react.dev/)** - Biblioteca para construção de interfaces
- **[TypeScript](https://www.typescriptlang.org/)** - Tipagem estática
- **[TanStack Query (React Query)](https://tanstack.com/query/latest)** - Gerenciamento de estado assíncrono e cache
- **[Zod](https://zod.dev/)** - Validação de schemas e type safety
- **[Tailwind CSS](https://tailwindcss.com/)** - Framework CSS utility-first
- **[Radix UI](https://www.radix-ui.com/)** - Componentes acessíveis e sem estilo
- **[Lucide React](https://lucide.dev/)** - Ícones
- **[Biome](https://biomejs.dev/)** - Linter e formatter

## ✨ Funcionalidades

- 🔐 **Autenticação completa** com JWT (login, registro e logout)
- 📦 **CRUD de produtos** com validação de dados
- 🖼️ **Upload de imagens** para produtos
- 🔍 **Busca em tempo real** com debounce
- 📊 **Ordenação** por nome ou preço (crescente/decrescente)
- 🎨 **Interface responsiva** e moderna
- 🛡️ **Type safety** com Zod em todas as requisições
- ⚡ **Gerenciamento de cache** inteligente com React Query

## 🏗️ Arquitetura


### Camadas da Aplicação

#### 1. **Services (Camada de Dados)**
- Encapsula toda comunicação com a API
- Valida respostas com Zod schemas
- Gerencia tokens de autenticação
- Trata erros de forma consistente

```typescript
// Exemplo: ProductService
class ProductService {
  async findAll(params?: FindAllParams): Promise<Product[]> {
    const response = await fetch(`${API_BASE_URL}/products?${queryParams}`);
    const data = await response.json();
    return paginatedProductsResponseSchema.parse(data); // Validação com Zod
  }
}
```

#### 2. **Hooks (Camada de Lógica)**
- Abstraem lógica de estado e side effects
- Integram React Query para cache e sincronização
- Fornecem interface simples para componentes

```typescript
// Exemplo: useProducts
export function useProducts(params?: FindAllParams) {
  return useQuery({
    queryKey: productKeys.list(params),
    queryFn: () => productService.findAll(params),
    staleTime: 0,
    gcTime: 0,
  });
}
```

#### 3. **Components (Camada de Apresentação)**
- Componentes reutilizáveis e bem organizados
- Separação entre UI components e feature components
- Props tipadas com TypeScript

### Type Safety com Zod

Todos os dados vindos da API são validados com Zod, garantindo type safety em runtime:

```typescript
const productSchema = z.object({
  id: z.number(),
  name: z.string(),
  category: z.string(),
  price: z.coerce.number(),
  stock: z.number(),
  volume: z.number().nullable(),
  weight: z.number().nullable(),
  imageKey: z.string().nullable(),
  imageUrl: z.string().nullable(),
});

type Product = z.infer<typeof productSchema>;
```

### Gerenciamento de Estado

- **React Query** para dados do servidor (produtos, autenticação)
- **useState** para estado local de UI
- **localStorage** para persistência do token JWT

## 📋 Pré-requisitos

- Node.js e npm (ou yarn/pnpm)
- Backend rodando na porta 3000

## 🔧 Instalação

1. **Instale as dependências:**

```bash
npm install
```

2. **(Opcional) Configure as variáveis de ambiente:**

Crie um arquivo `.env.local` na raiz do projeto:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

> **Nota:** Se não configurar, o padrão é `http://localhost:3000`

## 🚀 Executando o Projeto

### Modo Desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em [http://localhost:3001](http://localhost:3001)

### Build de Produção

```bash
npm run build
npm start
```

### Linting e Formatação

```bash
# Verificar problemas de código
npm run lint

# Formatar código
npm run format
```

## 🔐 Fluxo de Autenticação

1. Usuário faz login/cadastro em `/login` ou `/signup`
2. Backend retorna um token JWT
3. Token é armazenado no `localStorage`
4. Todas as requisições subsequentes incluem o token no header `Authorization`
5. Hook `useAuth` protege rotas e redireciona usuários não autenticados

## 📱 Páginas e Funcionalidades

### `/` - Página Inicial
- Lista todos os produtos do usuário autenticado
- Busca em tempo real (com debounce de 300ms)
- Ordenação por nome ou preço
- Menu dropdown para editar/excluir produtos
- Botão para criar novo produto

### `/login` - Login
- Autenticação com email e senha
- Redirecionamento automático após login
- Link para página de cadastro

### `/signup` - Cadastro
- Criação de nova conta
- Validação de dados
- Link para página de login

### `/novo-produto` - Criar Produto
- Formulário para cadastro de produto
- Upload de imagem opcional
- Campos: nome, categoria, preço, estoque, volume, peso
- Validação em tempo real

### `/editar-produto/[id]` - Editar Produto
- Formulário pré-preenchido com dados do produto
- Mesmas funcionalidades da página de criação
- Atualização de imagem opcional

## 🎨 Componentização

### Componentes Reutilizáveis

- **ProductForm** - Formulário compartilhado entre criar e editar
- **Button** - Botão com variantes (default, outline, destructive)
- **Input** - Input estilizado e acessível
- **DropdownMenu** - Menu dropdown do Radix UI

### Exemplo de Reutilização

```tsx
// Criar produto
<ProductForm
  title="Criar Novo Produto"
  onSubmit={handleCreate}
  submitButtonText="Criar Produto"
/>

// Editar produto
<ProductForm
  title="Editar Produto"
  initialValues={product}
  onSubmit={handleUpdate}
  submitButtonText="Atualizar Produto"
/>
```

## 🔄 Integração com Backend

A aplicação se comunica com o backend através de query parameters:

```
GET /products?search=termo&sortBy=price&sortOrder=desc
```

Parâmetros suportados:
- `search` - Busca por nome ou categoria
- `sortBy` - Campo para ordenação (`name` ou `price`)
- `sortOrder` - Ordem (`asc` ou `desc`)
- `page` - Número da página (paginação)
- `limit` - Itens por página


Desenvolvido como parte do desafio técnico da Hortti 🌱
