resource "azurerm_resource_group" "rg" {
  name     = var.resource_group_name
  location = var.location
}

module "network" {
  source = "./modules/network"

  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
}

module "compute" {

  source = "./modules/compute"

  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location

  public_key_path = var.public_key_path

  nic_id = module.network.nic_id

  vm_size = var.vm_size

  admin_username = var.admin_username
}

module "storage" {

  source = "./modules/storage"

  resource_group_name = azurerm_resource_group.rg.name

  location = azurerm_resource_group.rg.location
}

module "database" {

  source = "./modules/database"

  resource_group_name = azurerm_resource_group.rg.name

  location = azurerm_resource_group.rg.location

  database_password = var.database_password
}

module "gateway" {

  source = "./modules/gateway"

  resource_group_name = azurerm_resource_group.rg.name

  location = azurerm_resource_group.rg.location

  publisher_name = "CEFET"

  publisher_email = "16640171783@cefet-rj.br"
}