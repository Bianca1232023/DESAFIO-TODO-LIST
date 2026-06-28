resource "azurerm_api_management" "gateway" {

  name                = "todolist-apim"

  location            = var.location

  resource_group_name = var.resource_group_name

  publisher_name  = var.publisher_name

  publisher_email = var.publisher_email

  sku_name = "Consumption_0"
}

# API 1 — Backend Node.js (prefixo /api)
resource "azurerm_api_management_api" "backend" {
  name                = "todolist-backend"
  resource_group_name = var.resource_group_name
  api_management_name = azurerm_api_management.gateway.name
  revision            = "1"
  display_name        = "TodoList Backend API"
  path                = "api"
  protocols           = ["https"]
  service_url         = "http://${var.backend_host}:3000"
}

# API 2 — Frontend React/nginx (prefixo /app)
resource "azurerm_api_management_api" "frontend" {
  name                = "todolist-frontend"
  resource_group_name = var.resource_group_name
  api_management_name = azurerm_api_management.gateway.name
  revision            = "1"
  display_name        = "TodoList Frontend"
  path                = "app"
  protocols           = ["https"]
  service_url         = "http://${var.backend_host}:80"
}

# Policy Backend
resource "azurerm_api_management_api_policy" "backend_policy" {
  api_name            = azurerm_api_management_api.backend.name
  api_management_name = azurerm_api_management.gateway.name
  resource_group_name = var.resource_group_name

  xml_content = <<-XML
    <policies>
      <inbound>
        <base />
        <set-backend-service base-url="http://${var.backend_host}:3000" />
        <cors allow-credentials="false">
          <allowed-origins><origin>*</origin></allowed-origins>
          <allowed-methods><method>GET</method><method>POST</method><method>PUT</method><method>DELETE</method></allowed-methods>
          <allowed-headers><header>*</header></allowed-headers>
        </cors>
      </inbound>
      <backend><base /></backend>
      <outbound><base /></outbound>
      <on-error><base /></on-error>
    </policies>
  XML
}

# Policy Frontend
resource "azurerm_api_management_api_policy" "frontend_policy" {
  api_name            = azurerm_api_management_api.frontend.name
  api_management_name = azurerm_api_management.gateway.name
  resource_group_name = var.resource_group_name

  xml_content = <<-XML
    <policies>
      <inbound>
        <base />
        <set-backend-service base-url="http://${var.backend_host}:80" />
      </inbound>
      <backend><base /></backend>
      <outbound><base /></outbound>
      <on-error><base /></on-error>
    </policies>
  XML
}