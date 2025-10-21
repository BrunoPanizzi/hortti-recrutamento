# Backend - API de Gestão de Produtos

API RESTful desenvolvida com NestJS e TypeScript para gerenciamento de produtos com autenticação JWT e upload de imagens. Este projeto faz parte do desafio técnico da Hortti.

## 🚀 Tecnologias

- **[NestJS](https://nestjs.com/)** - Framework Node.js progressivo
- **[TypeScript](https://www.typescriptlang.org/)** - Tipagem estática
- **[TypeORM](https://typeorm.io/)** - ORM para TypeScript e JavaScript
- **[PostgreSQL](https://www.postgresql.org/)** - Banco de dados relacional
- **[JWT (JSON Web Tokens)](https://jwt.io/)** - Autenticação stateless
- **[bcrypt](https://www.npmjs.com/package/bcrypt)** - Hashing de senhas
- **[AWS SDK S3](https://aws.amazon.com/sdk-for-javascript/)** - Cliente S3 para upload de imagens
- **[MinIO](https://min.io/)** - Armazenamento de objetos compatível com S3
- **[class-validator](https://github.com/typestack/class-validator)** - Validação de DTOs
- **[class-transformer](https://github.com/typestack/class-transformer)** - Transformação de objetos

## ✨ Funcionalidades

- 🔐 **Autenticação JWT** com refresh tokens
- 👤 **Gestão de usuários** (registro e login)
- 📦 **CRUD completo de produtos**
- 🖼️ **Upload de imagens** para produtos (MinIO/S3)
- 🔍 **Busca e filtros** por nome e categoria
- 📊 **Ordenação** por nome ou preço
- 🔒 **Guards de autenticação** para rotas protegidas
- ✅ **Validação de dados** com class-validator
- 🗄️ **Migrations automáticas** com TypeORM

## 🏗️ Arquitetura

### Estrutura de Pastas

```
src/
├── auth/                    # Módulo de autenticação
│   ├── auth.controller.ts   # Endpoints de login/registro
│   ├── auth.service.ts      # Lógica de autenticação
│   ├── auth.guard.ts        # Guard JWT
│   ├── auth.module.ts       # Configuração do módulo
│   ├── types.ts             # Types e interfaces
│   └── dto/                 # DTOs de autenticação
├── user/                    # Módulo de usuários
│   ├── user.entity.ts       # Entidade User (TypeORM)
│   ├── user.service.ts      # Lógica de usuários
│   ├── user.repository.ts   # Repositório de usuários
│   ├── user.module.ts       # Configuração do módulo
│   └── dto/                 # DTOs de usuário
├── product/                 # Módulo de produtos
│   ├── product.controller.ts # Endpoints CRUD de produtos
│   ├── product.service.ts   # Lógica de negócio
│   ├── product.repository.ts # Repositório de produtos
│   ├── product.entity.ts    # Entidade Product (TypeORM)
│   ├── product.dto.ts       # DTOs de produto
│   └── product.module.ts    # Configuração do módulo
├── storage/                 # Módulo de armazenamento
│   ├── storage.service.ts   # Serviço S3/MinIO
│   ├── storage.repository.ts # Gerenciamento de buckets
│   ├── storage.config.ts    # Configuração S3
│   └── storage.module.ts    # Configuração do módulo
├── app.module.ts            # Módulo principal
└── main.ts                  # Entry point da aplicação
```

### Padrão de Arquitetura

A aplicação segue o padrão **MVC adaptado** com camadas bem definidas:

#### 1. **Controllers (Camada de Apresentação)**
- Recebem requisições HTTP
- Validam DTOs automaticamente
- Delegam lógica para Services
- Retornam respostas padronizadas

```typescript
@Controller('products')
export class ProductController {
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  create(@Body() body: CreateProductDTO, @UploadedFile() image?: Express.Multer.File) {
    return this.service.create(body, image);
  }
}
```

#### 2. **Services (Camada de Negócio)**
- Contém lógica de negócio
- Orquestra operações entre repositórios
- Trata erros e exceções
- Não conhece detalhes de HTTP

```typescript
@Injectable()
export class ProductService {
  async create(data: CreateProductDTO, image?: Express.Multer.File) {
    if (image) {
      data.imageKey = await this.storageService.uploadFile(image, 'products');
    }
    return this.productRepository.create(data);
  }
}
```

#### 3. **Repositories (Camada de Dados)**
- Encapsula operações de banco de dados
- Usa TypeORM Query Builder
- Isola lógica de persistência

```typescript
@Injectable()
export class ProductRepository {
  async findAll(page = 1, limit = 10, search?: string, sortBy?: string) {
    const qb = this.repo.createQueryBuilder('p');
    if (search) {
      qb.andWhere('(p.name ILIKE :search OR p.category ILIKE :search)', {
        search: `%${search}%`,
      });
    }
    return qb.skip((page - 1) * limit).take(limit).getMany();
  }
}
```

#### 4. **Entities (Camada de Modelo)**
- Definem estrutura das tabelas
- Decorators do TypeORM
- Relações entre entidades

```typescript
@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Product, (product) => product.user)
  products: Product[];
}
```

### Módulos

#### Auth Module
- **Estratégia JWT** com JwtStrategy
- **Guards** para proteção de rotas
- **Hashing de senhas** com bcrypt
- **Geração e validação de tokens**

#### User Module
- Cadastro de usuários
- Validação de email único
- Relação com produtos (1:N)

#### Product Module
- CRUD completo
- Upload de imagens opcional
- Busca e filtros
- Ordenação customizada

#### Storage Module
- Integração com MinIO (S3-compatible)
- Upload e delete de arquivos
- Geração de URLs públicas
- Gerenciamento automático de buckets

## 📋 Pré-requisitos

- Node.js e npm
- Docker e Docker Compose (recomendado para banco e MinIO)

## 🔧 Instalação

1. **Clone o repositório e entre na pasta do backend:**

```bash
cd backend
```

2. **Instale as dependências:**

```bash
npm install
```

3. **Configure as variáveis de ambiente:**

Copie o arquivo `.env.example` para `.env`:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:

```env
# Banco de Dados PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=postgres
DB_NAME=hortti_db

# JWT
JWT_SECRET=seu_secret_super_seguro_aqui
JWT_EXPIRES_IN=12h

# MinIO/S3
S3_ENDPOINT=http://localhost:9000
S3_REGION=us-east-1
S3_ACCESS_KEY_ID=minioadmin
S3_SECRET_ACCESS_KEY=minioadmin
S3_BUCKET_NAME=hortti-products
S3_FORCE_PATH_STYLE=true
```

4. **Suba o banco de dados e o MinIO com Docker Compose:**

```bash
# Na raiz do projeto
docker-compose up -d db minio
```

Isso irá iniciar:
- PostgreSQL na porta `5432`
- MinIO na porta `9000` (API) e `9001` (Console)

5. **Verifique se os serviços estão rodando:**

```bash
docker-compose ps
```

## 🚀 Executando o Projeto

### Modo Desenvolvimento

```bash
npm run start:dev
```

A API estará disponível em [http://localhost:3000](http://localhost:3000)

### Modo Produção

```bash
npm run build
npm run start:prod
```

### Modo Debug

```bash
npm run start:debug
```

## 📚 Documentação da API

### Autenticação

#### POST `/auth/signup`
Cria uma nova conta de usuário.

**Body:**
```json
{
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "senha123"
}
```

**Resposta:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### POST `/auth/signin`
Realiza login e retorna um token JWT.

**Body:**
```json
{
  "email": "joao@email.com",
  "password": "senha123"
}
```

**Resposta:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Produtos

> **Nota:** Todas as rotas de produtos requerem autenticação (Bearer Token no header)

#### GET `/products`
Lista produtos com paginação, busca e ordenação.

**Query Params:**
- `page` - Número da página (padrão: 1)
- `limit` - Itens por página (padrão: 10)
- `search` - Busca por nome ou categoria
- `category` - Filtro por categoria
- `sortBy` - Campo para ordenação (`name` ou `price`)
- `sortOrder` - Ordem (`asc` ou `desc`)

**Exemplo:**
```
GET /products?search=tomate&sortBy=price&sortOrder=asc
```

**Resposta:**
```json
[
  {
    "id": 1,
    "name": "Tomate",
    "category": "Hortaliça",
    "price": 5.50,
    "stock": 100,
    "volume": null,
    "weight": null,
    "imageKey": "products/abc123.jpg",
    "imageUrl": "http://localhost:9000/hortti-products/products/abc123.jpg"
  }
]
```

#### GET `/products/:id`
Busca um produto específico por ID.

**Resposta:**
```json
{
  "id": 1,
  "name": "Tomate",
  "category": "Hortaliça",
  "price": 5.50,
  "stock": 100,
  "volume": null,
  "weight": 1.5,
  "imageKey": "products/abc123.jpg",
  "imageUrl": "http://localhost:9000/hortti-products/products/abc123.jpg"
}
```

#### POST `/products`
Cria um novo produto (com upload de imagem opcional).

**Body (multipart/form-data):**
```
name: "Alface"
category: "Hortaliça"
price: 2.30
stock: 200
volume: 0.5 (opcional)
weight: 0.3 (opcional)
image: [arquivo] (opcional)
```

**Resposta:**
```json
{
  "id": 2,
  "name": "Alface",
  "category": "Hortaliça",
  "price": 2.30,
  "stock": 200,
  "volume": 0.5,
  "weight": 0.3,
  "imageKey": "products/def456.jpg",
  "imageUrl": "http://localhost:9000/hortti-products/products/def456.jpg"
}
```

#### PUT `/products/:id`
Atualiza um produto existente.

**Body (multipart/form-data):**
```
name: "Alface Americana" (opcional)
category: "Hortaliça" (opcional)
price: 2.50 (opcional)
stock: 180 (opcional)
volume: 0.6 (opcional)
weight: 0.35 (opcional)
image: [arquivo] (opcional)
```

**Resposta:** Status 200 OK

#### DELETE `/products/:id`
Remove um produto e sua imagem associada.

**Resposta:** Status 200 OK

## 🔐 Autenticação

A API utiliza **JWT (JSON Web Tokens)** para autenticação. Após o login ou registro, inclua o token em todas as requisições protegidas:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Fluxo de Autenticação

1. Usuário faz registro (`POST /auth/signup`) ou login (`POST /auth/signin`)
2. Backend valida credenciais e retorna um token JWT
3. Cliente armazena o token (localStorage/cookies)
4. Cliente envia o token no header `Authorization` em requisições subsequentes
5. O `AuthGuard` valida o token e injeta os dados do usuário na requisição

## 🗄️ Banco de Dados

### Schema

O TypeORM cria as tabelas automaticamente (`synchronize: true` em desenvolvimento).

**Tabela: user**
```sql
CREATE TABLE "user" (
  id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL,
  email VARCHAR UNIQUE NOT NULL,
  password VARCHAR NOT NULL
);
```

**Tabela: product**
```sql
CREATE TABLE "product" (
  id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL,
  category VARCHAR NOT NULL,
  price DECIMAL(10,2) DEFAULT 0,
  stock INTEGER DEFAULT 0,
  volume DECIMAL(10,2),
  weight DECIMAL(10,2),
  "imageKey" VARCHAR,
  "userId" INTEGER REFERENCES "user"(id)
);
```

### Relacionamentos

- **User → Product**: Um usuário pode ter vários produtos (1:N)
- Deleção em cascata não configurada (produtos permanecem órfãos se usuário for deletado)

## 📦 Upload de Imagens

### MinIO (S3-Compatible Storage)

O projeto utiliza MinIO como alternativa self-hosted ao AWS S3.

#### Acessar Console do MinIO

- **URL:** http://localhost:9001
- **Usuário:** minioadmin
- **Senha:** minioadmin

#### Como Funciona

1. Cliente envia imagem via `multipart/form-data`
2. NestJS intercepta com `FileInterceptor('image')`
3. `StorageService` faz upload para o MinIO
4. Retorna `imageKey` (path do arquivo)
5. Ao buscar produtos, `imageUrl` é gerada dinamicamente

#### Gerenciamento Automático

- **Buckets são criados automaticamente** na primeira requisição
- Imagens antigas são **deletadas automaticamente** ao atualizar/remover produtos
- URLs são geradas via `getFileUrl()` do StorageService


## 🐳 Docker

### Subir todos os serviços (backend, frontend, DB, MinIO)

```bash
# Na raiz do projeto
docker-compose up
```


Desenvolvido como parte do desafio técnico da Hortti 🌱
