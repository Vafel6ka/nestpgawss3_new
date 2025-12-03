# ================================================
# Deploy Script for NestJS + Prisma + Windows
# Directory: C:\Users\Administrator\Desktop\test_web3_serv
# ================================================

# ================================
# 0️⃣ Шляхи
# ================================
$APP_DIR = "C:/Users/Administrator/Desktop/test_web3_serv"
$RELEASE_DIR = "$APP_DIR/tmp_release"
$CURRENT_DIR = "$APP_DIR/current"
$BACKUP_DIR = "$APP_DIR/backup"
$LOG_FILE = "$APP_DIR/logs/deploy.log"

# ================================
# 1️⃣ Завантаження .env
# ================================
$envFilePath = "$APP_DIR/.env"
if (Test-Path $envFilePath) {
    Write-Host "Loading environment variables from $envFilePath"
    Get-Content $envFilePath | ForEach-Object {
        if ($_ -match "^\s*([^#][^=]+)=(.*)$") {
            $name = $matches[1].Trim()
            $value = $matches[2].Trim().Trim('"')
            [System.Environment]::SetEnvironmentVariable($name, $value, "Process")
            Write-Host "Set $name=$value"
        }
    }
} else {
    Write-Warning ".env file not found!"
}

# ================================
# 2️⃣ Default environment variables
# ================================
if (-not $env:REACT_APP_NODE_ENV) { $env:REACT_APP_NODE_ENV = "dev" }
if (-not $env:REACT_APP_LISTEN_PORT) { $env:REACT_APP_LISTEN_PORT = "4000" }
if (-not $env:REACT_APP_PORT) { $env:REACT_APP_PORT = "3000" }

# ================================
# 3️⃣ Backup current release
# ================================
Write-Host "📦 Створюємо backup поточної версії..."
if (Test-Path $CURRENT_DIR) {
    Remove-Item -Recurse -Force $BACKUP_DIR
    Copy-Item $CURRENT_DIR $BACKUP_DIR -Recurse -Force
}

# ================================
# 4️⃣ Deploy new release
# ================================
Write-Host "🚀 Деплой нової версії..."
if (Test-Path $RELEASE_DIR) {
    Remove-Item -Recurse -Force $CURRENT_DIR
    Copy-Item $RELEASE_DIR/* $CURRENT_DIR/ -Recurse -Force
} else {
    Write-Host "❌ Tmp release не знайдено!"
    exit 1
}

# ================================
# 5️⃣ Install dependencies
# ================================
Write-Host "📦 Встановлюємо залежності..."
cd $CURRENT_DIR
pnpm install

# ================================
# 6️⃣ Prisma migrate
# ================================
Write-Host "🔧 Перевірка Prisma міграцій..."
try {
    $migrationStatus = npx prisma migrate status --json | ConvertFrom-Json
    if ($migrationStatus.databaseIsBehind -eq $true) {
        Write-Host "📌 Нові міграції виявлено. Виконуємо deploy..."
        npx prisma migrate deploy
    } else {
        Write-Host "👌 Міграцій немає"
    }
} catch {
    Write-Warning "❌ Не вдалося перевірити Prisma міграції"
}

# ================================
# 7️⃣ Start / Restart server через PM2
# ================================
Write-Host "🔄 Перезапуск сервера через PM2..."
try {
    pm2 delete nestapp -s
} catch {}
pm2 start dist/main.js --name "nestapp"
pm2 save

# ================================
# 8️⃣ Health-check
# ================================
Write-Host "🩺 Перевірка доступності сервера..."
if (-not $env:REACT_APP_BASE_URL) {
    Write-Host "⚠️ REACT_APP_BASE_URL не встановлено!"
    exit 1
}
$HEALTH_URL = "$($env:REACT_APP_BASE_URL)/"
Write-Host "🔗 Health-check URL: $HEALTH_URL"

try {
    Start-Sleep -Seconds 3
    $response = Invoke-WebRequest -Uri $HEALTH_URL -TimeoutSec 5
    if ($response.StatusCode -ne 200) { throw "Bad status code: $($response.StatusCode)" }
    Write-Host "✅ Health-check успішно пройдено!"
} catch {
    Write-Host "❌ Health-check провалено. Робимо rollback..."
    Remove-Item -Recurse -Force $CURRENT_DIR/*
    Copy-Item $BACKUP_DIR/* $CURRENT_DIR/ -Recurse -Force
    pm2 delete nestapp
    pm2 start dist/main.js --name "nestapp"
    pm2 save
    "ROLLBACK at $(Get-Date)" | Out-File -FilePath $LOG_FILE -Append
    exit 1
}

Write-Host "✅ Deploy завершено!"
"$(Get-Date) - Deploy завершено" | Out-File -FilePath $LOG_FILE -Append
