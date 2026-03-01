package helpers

import (
	"encoding/json"
	"log"
	"os"
)

type Config struct {
	Port         string `json:"port"`
	LogPath      string `json:"log_path"`
	JWTSecret    string `json:"jwt_secret"`
	DBType       string `json:"db_type"`
	DBConnection string `json:"db_connection"`
}

func LoadConfig() Config {
	file, err := os.Open("config.json")
	if err != nil {
		log.Fatal("Cannot load config:", err)
	}
	defer file.Close()

	var config Config
	json.NewDecoder(file).Decode(&config)
	return config
}