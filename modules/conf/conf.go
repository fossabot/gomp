package conf

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"net/url"
	"os"
	"strings"
)

type Config struct {
	RootURL  string `mapstructure:"root_url"`
	Port     int    `mapstructure:"port"`
	DataPath string `mapstructure:"data_path"`
}

var C Config

// Load reads the configuration file from disk, if present
func init() {
	file, err := ioutil.ReadFile("conf/app.json")
	if err != nil && os.IsNotExist(err) {
		C.RootURL = "http://localhost:4000/"
		C.Port = 4000
		C.DataPath = "data"
		return
	} else if err != nil {
		log.Fatal("Failed to read in app.json", err)
	}

	err = json.Unmarshal(file, &C)
	if err != nil {
		log.Fatal("Failed to marshal configuration settings", err)
	}
}

// GetRootURLPath returns just the path portion of the RootUrl value,
// without any trailing slashes.
func (c *Config) GetRootURLPath() string {
	// Check if root url has a sub-path
	url, err := url.Parse(c.RootURL)
	if err != nil {
		panic("Invalid root_url")
	}
	return strings.TrimSuffix(url.Path, "/")
}
