import React from 'react'
import { Increment } from '../Icons'
import './styles.css'

const Input = ({ value, onChange, onclickCriar }) => {
  return (
    <div className='input-container'>
        <input 
          type="text" 
          placeholder="Adicione uma nova tarefa" 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && onclickCriar()}
        />
        <button className='create-task' onClick={onclickCriar}>Criar<Increment className="increment-icon"/></button>
    </div>
  )
}

export default Input