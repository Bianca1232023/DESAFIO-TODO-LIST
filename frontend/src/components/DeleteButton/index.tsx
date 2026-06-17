import React from 'react'
import './styles.css'
import { DeleteIcon } from '../Icons'

interface DeleteButtonProps {
  "onClickDelete": () => void;
}

const ButtonDelete = (props: DeleteButtonProps) => {

  const { onClickDelete } = props;
  
  return (
    <div className="delete-button">
        <button className='delete-task' onClick={onClickDelete} ><DeleteIcon className="delete-icon"/></button>
    </div>
  )
}

export default ButtonDelete