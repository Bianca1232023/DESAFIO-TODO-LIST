import React from 'react'
import './styles.css'
import { Checkbox as CheckIcon } from '../Icons'


interface CheckBoxProps {
  "checked": boolean;
  "onChange": () => void;
}

const CheckBox = ({ checked, onChange }: CheckBoxProps) => {
  return (
    <div className='checkbox-container'>
        <input type="checkbox" className='checkbox' checked={checked} onChange={onChange} />
        {checked && <CheckIcon className='check-icon' />}
    </div>
  )
}

export default CheckBox