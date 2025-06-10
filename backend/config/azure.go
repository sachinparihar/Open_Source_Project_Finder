package config

import (
	"fmt"
	"os"
)

type AzureADConfig struct {
	TenantID     string
	ClientID     string
	Issuer       string
}

var AzureConfig AzureADConfig

func LoadAzureADConfig() {
	AzureConfig = AzureADConfig{
		TenantID: os.Getenv("AZURE_TENANT_ID"),
		ClientID: os.Getenv("AZURE_CLIENT_ID"),
		Issuer:   fmt.Sprintf("https://login.microsoftonline.com/%s/v2.0", os.Getenv("AZURE_TENANT_ID")),
	}
}
