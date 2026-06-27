variable "resource_group_name" {
  description = "Nome do Resource Group onde a VM será provisionada"
  type        = string
}

variable "location" {
  description = "Região do Azure onde a VM será criada"
  type        = string
}

variable "nic_id" {
  description = "ID da Network Interface Card (NIC) a ser associada à VM"
  type        = string
}

variable "public_key_path" {
  description = "Caminho para a chave pública SSH usada no acesso à VM"
  type        = string
}
