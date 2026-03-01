package main

import (
	"log"

	"{{PROJECT_NAME}}/internal/config"
	"{{PROJECT_NAME}}/internal/helpers"
	"{{PROJECT_NAME}}/internal/middleware"
	"{{PROJECT_NAME}}/internal/routes"

	"github.com/gin-gonic/gin"
)

func main() {

	cfg := helpers.LoadConfig()

	helpers.InitLogger(cfg.LogPath)

	config.InitDB(cfg.DBConnection)

	r := gin.Default()

	r.Use(middleware.CORSMiddleware())

	// Pass JWT secret from config
	routes.RegisterRoutes(r, cfg.JWTSecret)

	log.Println("API started on :" + cfg.Port)

	r.Run(":" + cfg.Port)
}