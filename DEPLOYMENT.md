# Инструкция по развертыванию

## Frontend на GitHub Pages

### Шаг 1: Подготовка репозитория

1. Создайте репозиторий на GitHub (если ещё не создан)
2. Запушьте код:
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### Шаг 2: Настройка GitHub Pages

1. Перейдите в Settings → Pages
2. В разделе "Build and deployment" выберите источник: **GitHub Actions**
3. Страница обновится автоматически

### Шаг 3: Добавление секретов

1. Перейдите в Settings → Secrets and variables → Actions
2. Нажмите "New repository secret"
3. Добавьте секрет:
   - Name: `VITE_API_URL`
   - Value: `https://your-domain.com/api` (или `http://your-server-ip/api`)

### Шаг 4: Деплой

При каждом пуше в ветку `main` приложение будет автоматически собираться и деплоиться на GitHub Pages.

URL будет доступен по адресу: `https://your-username.github.io/secret-santa/`

---

## Backend на Ubuntu Server

### Предварительные требования

- Ubuntu 22.04 x64
- Root или sudo доступ
- Открытые порты 80, 443 (для HTTP/HTTPS)

### Шаг 1: Подключение к серверу

```bash
ssh root@your-server-ip
```

### Шаг 2: Обновление системы

```bash
apt update && apt upgrade -y
```

### Шаг 3: Установка Node.js 20

```bash
# Добавляем репозиторий NodeSource
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

# Устанавливаем Node.js
apt-get install -y nodejs

# Проверяем установку
node --version
npm --version
```

### Шаг 4: Установка PM2

PM2 - это процесс-менеджер для Node.js приложений.

```bash
npm install -g pm2
```

### Шаг 5: Установка Git (если ещё не установлен)

```bash
apt install git -y
```

### Шаг 6: Клонирование репозитория

```bash
# Создаём директорию для приложения
mkdir -p /var/www
cd /var/www

# Клонируем репозиторий
git clone https://github.com/your-username/secret-santa.git
cd secret-santa/backend
```

### Шаг 7: Установка зависимостей и сборка

```bash
npm install
npm run build
```

### Шаг 8: Настройка переменных окружения

```bash
# Создаём файл .env
nano .env
```

Добавьте следующее содержимое:
```
PORT=3001
JWT_SECRET=your-very-secure-random-string-min-32-characters
```

**ВАЖНО:** Сгенерируйте случайный JWT_SECRET! Можно использовать:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Сохраните и закройте файл (Ctrl+X, затем Y, затем Enter).

### Шаг 9: Запуск приложения с PM2

```bash
# Запускаем приложение
pm2 start ecosystem.config.js

# Сохраняем список процессов
pm2 save

# Настраиваем автозапуск при перезагрузке сервера
pm2 startup
# Выполните команду, которую PM2 выведет
```

Полезные команды PM2:
```bash
pm2 status              # Статус приложений
pm2 logs                # Просмотр логов
pm2 restart secret-santa-api  # Перезапуск
pm2 stop secret-santa-api     # Остановка
pm2 delete secret-santa-api   # Удаление из списка
```

### Шаг 10: Установка и настройка Nginx

```bash
# Устанавливаем Nginx
apt install nginx -y

# Создаём конфигурационный файл
nano /etc/nginx/sites-available/secret-santa
```

Добавьте следующую конфигурацию:
```nginx
server {
    listen 80;
    server_name your-domain.com;  # Замените на ваш домен или IP

    location /api {
        proxy_pass http://localhost:3001/api;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Сохраните и закройте файл.

### Шаг 11: Активация конфигурации Nginx

```bash
# Создаём символическую ссылку
ln -s /etc/nginx/sites-available/secret-santa /etc/nginx/sites-enabled/

# Проверяем конфигурацию
nginx -t

# Перезапускаем Nginx
systemctl restart nginx

# Включаем автозапуск Nginx
systemctl enable nginx
```

### Шаг 12: Настройка файрвола (UFW)

```bash
# Разрешаем SSH (важно!)
ufw allow OpenSSH

# Разрешаем HTTP и HTTPS
ufw allow 'Nginx Full'

# Включаем файрвол
ufw enable

# Проверяем статус
ufw status
```

### Шаг 13: (Опционально) Установка SSL сертификата

Для использования HTTPS установите Let's Encrypt:

```bash
# Устанавливаем Certbot
apt install certbot python3-certbot-nginx -y

# Получаем SSL сертификат
certbot --nginx -d your-domain.com

# Certbot автоматически настроит Nginx и добавит HTTPS
```

После этого ваш API будет доступен по `https://your-domain.com/api`

Certbot автоматически обновляет сертификаты. Проверить можно командой:
```bash
certbot renew --dry-run
```

---

## Обновление приложения

### Обновление Backend

```bash
cd /var/www/secret-santa
git pull origin main
cd backend
npm install
npm run build
pm2 restart secret-santa-api
```

### Обновление Frontend

Frontend обновляется автоматически при пуше в ветку `main` через GitHub Actions.

---

## Проверка работоспособности

### Проверка Backend

```bash
# Локально на сервере
curl http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test123"}'

# Извне (замените на ваш домен/IP)
curl http://your-domain.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test123"}'
```

### Проверка Frontend

Откройте браузер и перейдите по адресу GitHub Pages:
`https://your-username.github.io/secret-santa/`

---

## Устранение неполадок

### Backend не запускается

```bash
# Проверьте логи PM2
pm2 logs secret-santa-api

# Проверьте статус
pm2 status
```

### Nginx выдаёт ошибку

```bash
# Проверьте конфигурацию
nginx -t

# Проверьте логи Nginx
tail -f /var/log/nginx/error.log
```

### Порты заняты

```bash
# Проверьте, что слушает порт 3001
netstat -tulpn | grep 3001

# Или используйте lsof
lsof -i :3001
```

### Проблемы с CORS

Убедитесь, что в настройках GitHub Pages секрет `VITE_API_URL` указывает на правильный URL вашего API (с протоколом http:// или https://).

---

## Мониторинг

### Просмотр логов приложения

```bash
pm2 logs secret-santa-api
```

### Мониторинг ресурсов

```bash
pm2 monit
```

### Просмотр логов Nginx

```bash
# Логи доступа
tail -f /var/log/nginx/access.log

# Логи ошибок
tail -f /var/log/nginx/error.log
```

---

## Резервное копирование

База данных хранится в файле `/var/www/secret-santa/backend/data.json`

Рекомендуется регулярно создавать резервные копии:

```bash
# Ручное копирование
cp /var/www/secret-santa/backend/data.json /var/www/secret-santa/backend/data.json.backup

# Или настроить cron для автоматического бэкапа
crontab -e
```

Добавьте строку для ежедневного бэкапа в 2 часа ночи:
```
0 2 * * * cp /var/www/secret-santa/backend/data.json /var/www/secret-santa/backend/data.json.$(date +\%Y\%m\%d)
```

---

## Безопасность

### Рекомендации

1. **Используйте сильный JWT_SECRET** - минимум 32 случайных символа
2. **Настройте SSH ключи** вместо паролей
3. **Обновляйте систему** регулярно: `apt update && apt upgrade`
4. **Используйте HTTPS** (SSL сертификат от Let's Encrypt)
5. **Ограничьте доступ к серверу** через файрвол
6. **Регулярно делайте бэкапы** базы данных

### Отключение входа по паролю SSH (опционально)

После настройки SSH ключей:
```bash
nano /etc/ssh/sshd_config
```

Измените:
```
PasswordAuthentication no
```

Перезапустите SSH:
```bash
systemctl restart sshd
```

---


