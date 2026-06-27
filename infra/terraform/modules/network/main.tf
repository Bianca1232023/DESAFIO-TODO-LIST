resource "azurerm_virtual_network" "vnet" {
  name                = "trabalho-devops-vnet"
  address_space       = ["10.0.0.0/16"]

  location            = var.location
  resource_group_name = var.resource_group_name
}

resource "azurerm_subnet" "subnet" {
  name                 = "devops-subnet"

  resource_group_name  = var.resource_group_name

  virtual_network_name = azurerm_virtual_network.vnet.name

  address_prefixes     = ["10.0.1.0/24"]
}

resource "azurerm_subnet" "aks_subnet" {
  name                 = "aks-subnet"
  resource_group_name  = var.resource_group_name
  virtual_network_name = azurerm_virtual_network.vnet.name
  address_prefixes     = ["10.0.2.0/24"]
}

resource "azurerm_public_ip" "public_ip" {
  name                = "devops-public-ip"

  location            = var.location

  resource_group_name = var.resource_group_name

  allocation_method   = "Static"

  sku                 = "Standard"
}

resource "azurerm_network_security_group" "nsg" {
  name                = "devops-nsg"

  location            = var.location

  resource_group_name = var.resource_group_name
}

resource "azurerm_network_security_rule" "ssh" {

  name = "SSH"

  priority = 1000

  direction = "Inbound"

  access = "Allow"

  protocol = "Tcp"

  source_port_range = "*"

  destination_port_range = "22"

  source_address_prefix = "*"

  destination_address_prefix = "*"

  resource_group_name = var.resource_group_name

  network_security_group_name = azurerm_network_security_group.nsg.name
}

resource "azurerm_network_security_rule" "http" {

  name = "HTTP"

  priority = 1010

  direction = "Inbound"

  access = "Allow"

  protocol = "Tcp"

  source_port_range = "*"

  destination_port_range = "80"

  source_address_prefix = "*"

  destination_address_prefix = "*"

  resource_group_name = var.resource_group_name

  network_security_group_name = azurerm_network_security_group.nsg.name
}

resource "azurerm_network_security_rule" "https" {

  name = "HTTPS"

  priority = 1020

  direction = "Inbound"

  access = "Allow"

  protocol = "Tcp"

  source_port_range = "*"

  destination_port_range = "443"

  source_address_prefix = "*"

  destination_address_prefix = "*"

  resource_group_name = var.resource_group_name

  network_security_group_name = azurerm_network_security_group.nsg.name
}

resource "azurerm_network_interface" "nic" {

  name = "devops-nic"

  location = var.location

  resource_group_name = var.resource_group_name

  ip_configuration {

    name = "internal"

    subnet_id = azurerm_subnet.subnet.id

    private_ip_address_allocation = "Dynamic"

    public_ip_address_id = azurerm_public_ip.public_ip.id
  }
}

resource "azurerm_network_interface_security_group_association" "association" {

  network_interface_id = azurerm_network_interface.nic.id

  network_security_group_id = azurerm_network_security_group.nsg.id
}