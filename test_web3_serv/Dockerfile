# Використовуємо офіційний Node.js 24 образ
FROM node:24

# Встановлюємо робочу директорію в контейнері!
WORKDIR /app

# Встановлюємо pnpm
RUN npm install -g pnpm

# Копіюємо package.json та pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Встановлюємо залежності через pnpm
RUN pnpm install

# Копіюємо весь проект в контейнер
COPY . .

# Використовуємо xcopy для Windows (для копіювання файлів у Windows)
RUN xcopy src\\generated dist\\generated /E /I /Y

# Створення бінарного файлу для проекту
RUN pnpm run build

# Відкриваємо порт 4000
EXPOSE 4000

# Команда для запуску NestJS (продуктивна версія)
CMD ["pnpm", "run", "start:prod"]
