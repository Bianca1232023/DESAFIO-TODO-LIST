import React from 'react'
import { Increment } from '../Icons'
import './styles.css'

const Input = (props) => {

    const {onclickCriar } = props;

  return (
    <div className='input-container'>
        <input type="text" placeholder="Add a new task" />
        <button className='create-task' onClick={onclickCriar} >Criar<Increment className="increment-icon"/></button>
    </div>
  )
}

export default Input