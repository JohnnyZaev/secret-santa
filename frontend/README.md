# Secret Santa Frontend

React приложение для Тайного Санты.

## Установка

```bash
npm install
```

## Разработка

```bash
npm run dev
```

Приложение откроется на http://localhost:3000

## Сборка

```bash
npm run build
```

Результат сборки будет в папке `dist/`.

## Переменные окружения

Создайте файл `.env` (опционально):

```
VITE_API_URL=http://localhost:3001/api
```

По умолчанию используется `http://localhost:3001/api`.

## Деплой на GitHub Pages

Приложение автоматически деплоится на GitHub Pages при пуше в ветку `main`.

Убедитесь, что в настройках репозитория:
1. Pages включены и настроены на GitHub Actions
2. Добавлен секрет `VITE_API_URL` с URL вашего backend API

