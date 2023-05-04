import React from 'react'
import css from './Nav.module.css'

const Nav = () => {
  return (<>
    <div className={css.nav}> 
    <div>
        <h1>Dogs</h1>
    </div>
    <ul className={css.list}>
        <li>Home</li>
        <li>info</li>
        <li>porque nosotros</li>
        <li>buscar</li>
    </ul>
    </div>
    </>
  )
}

export default Nav