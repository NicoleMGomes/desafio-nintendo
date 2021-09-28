import styled from 'styled-components'

export const Container = styled.header`
  position: relative;
  display: flex;
  width: 100vw;
  height: 64px;
  background-color: #fff;
  text-align: center;
  font-size: 1.2rem;
  padding: 20px;
  align-items: center;
  border-bottom: 1px solid rgb(224, 224, 224);
  img {
    width: auto;
    height: 48px;
    margin-right: 20px;
  }

  h1 {
    color: var(--secondary);
  }

  #info-icon {
    position: absolute;
    right: 20px;
  }
`
