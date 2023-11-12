import React from 'react';
import s from './Input.module.css'

const Input = React.forwardRef((props, ref) => {
    return (
        <input className={s.myInt}
               value={props.value}
               type={props.type}
               placeholder={props.placeholder}
               onChange={(event) => props.setValue(event.target.value)}
        />
    )
})

export default Input;