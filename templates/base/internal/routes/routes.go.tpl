package routes

import (
	"{{PROJECT_NAME}}/internal/controller"
	"{{PROJECT_NAME}}/internal/middleware"

	"github.com/gin-gonic/gin"
)

func RegisterRoutes(r *gin.Engine, jwtSecret string) {

	// Public route
	r.GET("/ping", controller.Ping)

	// Protected group
	protected := r.Group("/secure")
	protected.Use(middleware.AuthMiddleware(jwtSecret))
	{
		protected.GET("/ping", controller.Ping)
	}
}