resource "azurerm_managed_disk" "postgres_disk" {

  name = "postgres-disk"

  location = var.location

  resource_group_name = var.resource_group_name

  storage_account_type = "Standard_LRS"

  create_option = "Empty"

  disk_size_gb = 20
}