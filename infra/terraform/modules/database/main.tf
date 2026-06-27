resource "azurerm_postgresql_flexible_server" "postgres" {

  name                = "todolist-postgres"

  resource_group_name = var.resource_group_name

  location            = var.location

  version             = "16"

  administrator_login    = var.database_user
  administrator_password = var.database_password

  storage_mb = 32768

  sku_name = "B_Standard_B1ms"

  backup_retention_days = 7

  public_network_access_enabled = true
}