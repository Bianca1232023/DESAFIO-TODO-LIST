import React from 'react'
import { Increment } from '../Icons'
import './styles.css'

interface InputProps {
  "value": string;
  "onChange": (value: string) => void;
  "onClickCriar": () => void;
}

const Input: React.FC<InputProps> = ({ value, onChange, onClickCriar }) => {
  return (
    <div className='input-container'>
        <input 
          type="text" 
          placeholder="Adicione uma nova tarefa" 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && onClickCriar()}
        />
        <button className='create-task' onClick={onClickCriar}>Criar<Increment className="increment-icon"/></button>
    </div>
  )
}

export default Input