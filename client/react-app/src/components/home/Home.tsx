import React from 'react'

import './Home.scss'
import { Logo } from '../'

export function Home() {
  return (
    <div className="home">
      <div className="home__hero">
        <div className="home__logo">
          <Logo />
        </div>
        <p>Welcome to KChat!</p>
      </div>
    </div>
  )
}

