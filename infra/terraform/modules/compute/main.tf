resource "azurerm_linux_virtual_machine" "vm" {
  name                = "trabalho-devops-vm"
  resource_group_name = var.resource_group_name
  location            = var.location

  size = "Standard_B2ats_v2"

  admin_username = "azureuser"

  network_interface_ids = [
    var.nic_id
  ]

  admin_ssh_key {
    username   = "azureuser"
    public_key = file(var.public_key_path)
  }

  os_disk {
    caching              = "ReadWrite"
    storage_account_type = "Standard_LRS"
  }

  source_image_reference {
    publisher = "Canonical"
    offer     = "0001-com-ubuntu-server-jammy"
    sku       = "22_04-lts"
    version   = "latest"
  }
}