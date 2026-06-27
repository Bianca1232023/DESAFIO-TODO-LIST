resource "azurerm_kubernetes_cluster" "aks" {
  name                = "devops-aks"
  location            = var.location
  resource_group_name = var.resource_group_name
  dns_prefix          = "devops-aks"

  default_node_pool {
    name           = "default"
    node_count     = 2
    vm_size        = "Standard_B2s"
    vnet_subnet_id = var.subnet_id
  }

  identity {
    type = "SystemAssigned"
  }

  network_profile {
    network_plugin = "azure"
  }

  tags = {
    project = "devops-todolist"
  }
}
