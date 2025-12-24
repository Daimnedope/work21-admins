# CLAUDE.md — Инструкции для AI-ассистента

## Обзор проекта

**work21-admin** — это админ-панель для платформы WORK21, построенная на React + Refine + Ant Design.

## Технический стек

- **React 18** + **TypeScript**
- **Refine** — фреймворк для админ-панелей (data providers, auth)
- **Ant Design** — UI компоненты
- **Vite** — сборщик
- **Recharts** — графики на дашборде
- **Axios** — HTTP клиент

## Структура проекта

```
src/
├── pages/           # Страницы приложения
│   ├── dashboard/   # Главный дашборд со статистикой
│   ├── users/       # CRUD пользователей + сброс пароля
│   ├── projects/    # CRUD проектов
│   ├── applications/# Список заявок
│   ├── contracts/   # Список договоров
│   ├── ratings/     # Список рейтингов
│   └── login/       # Страница входа
│
├── providers/       # Refine провайдеры
│   ├── authProvider.ts  # JWT аутентификация
│   └── dataProvider.ts  # REST API
│
├── types/           # TypeScript интерфейсы
│   └── index.ts     # IUser, IProject, enums и т.д.
│
├── utils/
│   └── constants.ts # Метки, цвета, форматтеры
│
├── App.tsx          # Роутинг и конфигурация Refine
├── main.tsx         # Entry point
└── index.css        # Глобальные стили
```

## Ключевые файлы

### Провайдеры

- `authProvider.ts` — логин через /api/v1/auth/login, проверка роли admin, JWT в localStorage
- `dataProvider.ts` — REST API с /api/v1/admin/* endpoints

### Типы

- `UserRole` — student, customer, admin
- `ProjectStatus` — draft, open, in_progress, review, completed, cancelled
- `ApplicationStatus` — pending, accepted, rejected
- Интерфейсы: `IUser`, `IProject`, `IApplication`, `IContract`, `IRating`, `IStats`

## API Endpoints (ожидаемые)

Backend должен реализовать:

```
POST   /auth/login
GET    /admin/stats
GET    /admin/users
GET    /admin/users/:id
PATCH  /admin/users/:id
POST   /admin/users/:id/reset-password
POST   /admin/users/:id/block
POST   /admin/users/:id/unblock
GET    /admin/projects
GET    /admin/projects/:id
PATCH  /admin/projects/:id
DELETE /admin/projects/:id
GET    /admin/applications
PATCH  /admin/applications/:id
GET    /admin/contracts
GET    /admin/ratings
DELETE /admin/ratings/:id
```

## Команды разработки

```bash
npm install    # Установка зависимостей
npm run dev    # Dev сервер на :3000
npm run build  # Production сборка
npm run lint   # ESLint проверка
```

## Переменные окружения

- `VITE_API_URL` — URL бэкенда (default: http://localhost:8000/api/v1)
- `VITE_APP_TITLE` — Название в sidebar

## Важные паттерны

1. **Refine hooks**: `useTable`, `useShow`, `useForm`, `useCustom`
2. **Фильтрация**: через `onSearch` в `useTable`
3. **Кастомные actions**: axios напрямую для reset-password, block/unblock
4. **Форматирование**: `formatCurrency`, `formatDate` из utils/constants.ts

## При добавлении новых сущностей

1. Добавить интерфейс в `types/index.ts`
2. Добавить константы в `utils/constants.ts`
3. Создать папку в `pages/` с list.tsx, show.tsx, edit.tsx
4. Зарегистрировать resource в `App.tsx`
5. Добавить роут в Routes

## Деплой

Docker образ собирается через multi-stage build:
1. Node.js builder → npm ci && npm run build
2. Nginx alpine → serve static files

Nginx настроен для SPA routing (try_files → /index.html).

