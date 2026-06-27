output "nic_id" {
  value = azurerm_network_interface.nic.id
}

output "public_ip" {
  value = azurerm_public_ip.public_ip.ip_address
}

output "aks_subnet_id" {
  value = azurerm_subnet.aks_subnet.id
}