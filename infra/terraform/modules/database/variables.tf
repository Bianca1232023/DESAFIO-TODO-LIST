variable "resource_group_name" {
  type = string
}

variable "location" {
  type = string
}

variable "database_name" {
  default = "todolist"
}

variable "database_user" {
  default = "postgresadmin"
}

variable "database_password" {
  type      = string
  sensitive = true
}