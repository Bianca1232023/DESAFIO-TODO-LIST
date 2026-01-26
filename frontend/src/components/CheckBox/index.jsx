import React from 'react'
import './styles.css'
import { Checkbox as CheckIcon } from '../Icons'
import { useState } from 'react'
const CheckBox = () => {

    const [checked, setChecked] = useState(false);

  return (
    <div className='checkbox-container'>
        <input type="checkbox" className='checkbox' checked={checked} onChange={() => setChecked(!checked)} />
        {checked && <CheckIcon className='check-icon' />}
    </div>
  )
}

export default CheckBox