variable "resource_group_name" {
  type = string
}

variable "location" {
  type = string
}

variable "publisher_name" {
  type = string
}

variable "publisher_email" {
  type = string
}

variable "backend_host" {
  type        = string
  description = "IP ou hostname da VM que hospeda as APIs"
}