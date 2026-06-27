output "database_name" {
  value = azurerm_postgresql_flexible_server.postgres.name
}

output "database_fqdn" {
  value = azurerm_postgresql_flexible_server.postgres.fqdn
}