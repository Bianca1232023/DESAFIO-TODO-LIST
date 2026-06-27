variable "resource_group_name" {
  description = "Nome do Resource Group"
  default     = "teste-rg"
}

variable "location" {
  description = "Região do Azure"
  default     = "North Central US"
}

variable "public_key_path" {
  description = "Caminho para a chave pública SSH"
  type        = string
  default     = "~/.ssh/bianca_projetos.pub"
}