package config

import (
	"be/utils"
	"time"
)

var (
	CLIENT_URL             = utils.GetEnvString("CLIENT_URL", "http://localhost:3000")
	DB_PATH                = utils.GetEnvString("DB_PATH", "./database.db")
	DB_HOST                = utils.GetEnvString("DB_HOST", "localhost")
	DB_PORT                = utils.GetEnvNumber("DB_PORT", 3306)
	DB_USER                = utils.GetEnvString("DB_USER", "root")
	DB_PASSWORD            = utils.GetEnvString("DB_PASSWORD", "your_password")
	DB_NAME                = utils.GetEnvString("DB_NAME", "ecommerce")
	PORT                   = utils.GetEnvNumber("PORT", 8080)
	JWT_SECRET             = utils.GetEnvString("JWT_SECRET", "your-secret")
	JWT_CLAIMS_KEY_USER_ID = "userID"
	JWT_CLAIMS_KEY_EMAIL   = "email"
	JWT_EXPIRES_DURATION   = time.Hour
	JWT_EXPIRES_IN         = int(time.Hour.Seconds())
)
