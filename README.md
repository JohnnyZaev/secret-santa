# 🎅 Secret Santa

Веб-приложение для организации игры "Тайный Санта" среди друзей.

## Возможности

- 🔐 Регистрация и авторизация пользователей
- 🏠 Создание и присоединение к комнатам
- 📝 Написание списка желаний для Тайного Санты
- 🎲 Автоматическое распределение участников
- 👑 Панель администратора комнаты
- 🎁 Просмотр назначенного получателя и его списка желаний

## Технологии

### Frontend
- React 18
- TypeScript
- React Router
- Axios
- Vite

### Backend
- Node.js
- Express
- TypeScript
- JWT аутентификация
- Bcrypt для хеширования паролей
- JSON файл как база данных

## Установка и запуск

### Backend

1. Перейдите в директорию backend:
```bash
cd backend
```

2. Установите зависимости:
```bash
npm install
```

3. Создайте файл `.env`:
```bash
cp .env.example .env
```

4. Отредактируйте `.env` и установите `JWT_SECRET` на случайную строку

5. Запустите в режиме разработки:
```bash
npm run dev
```

Или соберите и запустите в продакшене:
```bash
npm run build
npm start
```

### Frontend

1. Перейдите в директорию frontend:
```bash
cd frontend
```

2. Установите зависимости:
```bash
npm install
```

3. Создайте файл `.env` (опционально):
```bash
echo "VITE_API_URL=http://localhost:3001/api" > .env
```

4. Запустите в режиме разработки:
```bash
npm run dev
```

Или соберите для продакшена:
```bash
npm run build
```

## Развертывание

### Frontend на GitHub Pages

1. В настройках репозитория GitHub перейдите в Settings → Pages
2. В разделе "Build and deployment" выберите "GitHub Actions"
3. Добавьте секрет `VITE_API_URL` в Settings → Secrets and variables → Actions
   - Значение должно быть URL вашего backend API (например: `https://your-server.com/api`)
4. При пуше в ветку `main` сайт автоматически задеплоится

### Backend на Ubuntu Server (Vultr)

1. Подключитесь к серверу:
```bash
ssh root@your-server-ip
```

2. Установите Node.js 20:
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

3. Установите PM2 глобально:
```bash
sudo npm install -g pm2
```

4. Клонируйте репозиторий:
```bash
cd /var/www
git clone https://github.com/your-username/secret-santa.git
cd secret-santa/backend
```

5. Установите зависимости и соберите:
```bash
npm install
npm run build
```

6. Создайте файл `.env`:
```bash
nano .env
```

Добавьте:
```
PORT=3001
JWT_SECRET=your-very-secure-random-string
```

7. Запустите с помощью PM2:
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

8. Настройте Nginx как reverse proxy:
```bash
sudo apt install nginx
sudo nano /etc/nginx/sites-available/secret-santa
```

Добавьте конфигурацию:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location /api {
        proxy_pass http://localhost:3001/api;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

9. Активируйте конфигурацию:
```bash
sudo ln -s /etc/nginx/sites-available/secret-santa /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

10. (Опционально) Установите SSL с помощью Let's Encrypt:
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

### Обновление приложения

Backend:
```bash
cd /var/www/secret-santa
git pull
cd backend
npm install
npm run build
pm2 restart secret-santa-api
```

Frontend деплоится автоматически через GitHub Actions при пуше в main.

## Структура проекта

```
secret-santa/
├── backend/                 # Backend API
│   ├── src/
│   │   ├── index.ts        # Точка входа
│   │   ├── auth.ts         # Аутентификация
│   │   ├── routes.ts       # API роуты
│   │   ├── storage.ts      # Работа с JSON БД
│   │   ├── secretSanta.ts  # Алгоритм распределения
│   │   └── types.ts        # TypeScript типы
│   ├── package.json
│   └── tsconfig.json
├── frontend/               # React приложение
│   ├── src/
│   │   ├── components/    # React компоненты
│   │   ├── api.ts         # API клиент
│   │   ├── AuthContext.tsx # Контекст авторизации
│   │   ├── App.tsx        # Главный компонент
│   │   └── main.tsx       # Точка входа
│   ├── package.json
│   └── vite.config.ts
└── .github/
    └── workflows/
        └── deploy.yml     # GitHub Actions для деплоя
```

## API Endpoints

### Auth
- `POST /api/auth/register` - Регистрация
- `POST /api/auth/login` - Вход
- `GET /api/auth/me` - Получить текущего пользователя

### Rooms
- `POST /api/rooms` - Создать комнату
- `GET /api/rooms` - Получить все комнаты пользователя
- `GET /api/rooms/:id` - Получить комнату по ID
- `POST /api/rooms/join` - Присоединиться к комнате

### Wishlist
- `POST /api/wishlist` - Сохранить список желаний
- `GET /api/wishlist/:roomId` - Получить свой список желаний

### Game
- `POST /api/game/start` - Запустить игру (только админ)
- `GET /api/game/assignment/:roomId` - Получить назначенного получателя

## Лицензия

MIT

