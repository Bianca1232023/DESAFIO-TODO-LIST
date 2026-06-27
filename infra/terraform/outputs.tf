output "vm_id" {
  value = module.compute.vm_id
}

output "vm_name" {
  value = module.compute.vm_name
}

output "vm_public_ip" {
  value = module.compute.public_ip
}

output "nic_id" {
  value = module.network.nic_id
}

output "public_ip" {
  value = module.network.public_ip
}

output "gateway_url" {

  value = module.gateway.gateway_gateway_url
}

output "gateway_name" {

  value = module.gateway.gateway_name
}