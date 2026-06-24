import React from 'react'
import './styles.css'
import { Clipboard } from '../Icons'

const EmptyState = () => (
  <div className="empty-state">
    <Clipboard className="empty-icon" />
    <span className="empty-text">Você ainda não tem tarefas</span>
  </div>
)

export default EmptyState