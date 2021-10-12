import React from 'react'

import { Container } from './styles'

const Header: React.FC = () => {
  return (
    <Container>
      <img src="/logo.png" alt="Logo de quadro"></img>
      <h1>Desafio da Nintendo</h1>
    </Container>
  )
}

export default Header
