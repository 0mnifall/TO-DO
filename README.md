# TO-DO

## Українською

TO-DO - це full-stack застосунок для керування особистими задачами. Проєкт складається з ASP.NET Core backend API та Angular frontend.

### Можливості

- Реєстрація, вхід, вихід і перевірка поточного користувача.
- Авторизація через JWT, що зберігається в HTTP-only cookies.
- Створення, перегляд, редагування, видалення, завершення та повторне відкриття задач.
- Фільтрація задач за пошуком, статусом і категорією.
- Пагінація списку задач.
- Створення, перегляд і видалення категорій.
- Прив'язка задач до категорій і очищення категорії для задачі.

### Технології

- Backend: ASP.NET Core 9, Entity Framework Core, PostgreSQL, JWT authentication, Swagger.
- Frontend: Angular 22, TypeScript, RxJS, Bootstrap, Vitest.

### Структура проєкту

```text
backend/   ASP.NET Core API, EF Core models, repositories, services, controllers
frontend/  Angular application
```

### Передумови

- .NET SDK 9.
- Node.js і npm.
- PostgreSQL.

### Налаштування backend

Backend очікує конфігурацію в `backend/appsettings.Development.json` або через environment variables:

- `ConnectionStrings:DefaultConnection` - connection string до PostgreSQL.
- `Jwt:Key` - секретний ключ для підпису JWT.
- `Jwt:Issuer` - issuer токена.
- `Jwt:Audience` - audience токена.

Застосуйте міграції бази даних:

```bash
dotnet ef database update --project backend/backend.csproj
```

Запустіть backend:

```bash
dotnet run --project backend/backend.csproj
```

За замовчуванням API запускається на:

```text
http://localhost:5299
```

У Development-режимі Swagger доступний за адресою:

```text
http://localhost:5299/swagger
```

### Запуск frontend

Перейдіть у папку frontend і встановіть залежності:

```bash
cd frontend
npm install
```

Запустіть Angular dev server:

```bash
npm start
```

Frontend буде доступний на:

```text
http://localhost:4200
```

Frontend за замовчуванням звертається до API на `http://localhost:5299`.

### Збірка

Backend:

```bash
dotnet build backend/backend.sln
```

Frontend:

```bash
cd frontend
npm run build
```

### Тести

Frontend unit tests:

```bash
cd frontend
npm test
```

## English

TO-DO is a full-stack application for managing personal tasks. The project consists of an ASP.NET Core backend API and an Angular frontend.

### Features

- Registration, login, logout, and current user status checks.
- JWT authorization stored in HTTP-only cookies.
- Create, view, edit, delete, complete, and reopen tasks.
- Filter tasks by search text, status, and category.
- Paginated task list.
- Create, view, and delete categories.
- Assign tasks to categories and clear a task category.

### Tech Stack

- Backend: ASP.NET Core 9, Entity Framework Core, PostgreSQL, JWT authentication, Swagger.
- Frontend: Angular 22, TypeScript, RxJS, Bootstrap, Vitest.

### Project Structure

```text
backend/   ASP.NET Core API, EF Core models, repositories, services, controllers
frontend/  Angular application
```

### Requirements

- .NET SDK 9.
- Node.js and npm.
- PostgreSQL.

### Backend Setup

The backend expects configuration in `backend/appsettings.Development.json` or through environment variables:

- `ConnectionStrings:DefaultConnection` - PostgreSQL connection string.
- `Jwt:Key` - secret key for signing JWTs.
- `Jwt:Issuer` - token issuer.
- `Jwt:Audience` - token audience.

Apply database migrations:

```bash
dotnet ef database update --project backend/backend.csproj
```

Run the backend:

```bash
dotnet run --project backend/backend.csproj
```

By default, the API runs at:

```text
http://localhost:5299
```

In Development mode, Swagger is available at:

```text
http://localhost:5299/swagger
```

### Frontend Setup

Go to the frontend folder and install dependencies:

```bash
cd frontend
npm install
```

Start the Angular dev server:

```bash
npm start
```

The frontend will be available at:

```text
http://localhost:4200
```

By default, the frontend calls the API at `http://localhost:5299`.

### Build

Backend:

```bash
dotnet build backend/backend.sln
```

Frontend:

```bash
cd frontend
npm run build
```

### Tests

Frontend unit tests:

```bash
cd frontend
npm test
```
