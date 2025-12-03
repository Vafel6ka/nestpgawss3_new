# ================================
# PowerShell скрипт для запуску NestJS
# ================================

# 1️⃣ Шлях до .env файлу
$envFilePath = ".env"

if (Test-Path $envFilePath) {
    Write-Host "Loading environment variables from $envFilePath"
    Get-Content $envFilePath | ForEach-Object {
        if ($_ -match "^\s*([^#][^=]+)=(.*)$") {
            $name = $matches[1].Trim()
            $value = $matches[2].Trim().Trim('"')  # прибираємо лапки
            # Динамічне присвоєння змінної оточення
            [System.Environment]::SetEnvironmentVariable($name, $value, "Process")
            Write-Host "Set $name=$value"
        }
    }
} else {
    Write-Warning ".env file not found! Make sure required environment variables are set manually."
}

# 2️⃣ Дефолтні значення для критичних змінних
if (-not $env:REACT_APP_NODE_ENV) { $env:REACT_APP_NODE_ENV = "dev" }
if (-not $env:REACT_APP_LISTEN_PORT) { $env:REACT_APP_LISTEN_PORT = "4000" }
if (-not $env:REACT_APP_PORT) { $env:REACT_APP_PORT = "3000" }

Write-Host "Environment summary:"
Write-Host "REACT_APP_NODE_ENV=$env:REACT_APP_NODE_ENV"
Write-Host "REACT_APP_LISTEN_PORT=$env:REACT_APP_LISTEN_PORT"
Write-Host "REACT_APP_PORT=$env:REACT_APP_PORT"
Write-Host "DATABASE_URL=$env:DATABASE_URL"
Write-Host "PGSSLROOTCERT=$env:PGSSLROOTCERT"

# ================================
# 3️⃣ Перевірка Prisma міграцій
# ================================

Write-Host "Checking Prisma migration status..."

$migrationStatusJson = npx prisma migrate status --json

try {
    $migrationStatus = $migrationStatusJson | ConvertFrom-Json
} catch {
    Write-Warning "Failed to parse Prisma migration status JSON"
    Write-Warning $migrationStatusJson
}

if ($migrationStatus.databaseIsBehind -eq $true) {
    Write-Host "📌 New migrations detected. Applying..."
    npx prisma migrate deploy
    Write-Host "✅ Migrations applied successfully."
} else {
    Write-Host "👌 No pending migrations."
}


# 4️⃣ Запуск NestJS сервера
Write-Host "Starting NestJS server..."
pnpm start:dev
