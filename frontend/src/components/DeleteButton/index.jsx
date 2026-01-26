import React from 'react'
import './styles.css'
import { DeleteIcon } from '../Icons'

const ButtonDelete = (props) => {

  const { onClickDelete } = props;
  

  return (
    <div className="delete-button">
        <button className='delete-task' onClick={onClickDelete} ><DeleteIcon className="delete-icon"/></button>
    </div>
  )
}

export default ButtonDelete