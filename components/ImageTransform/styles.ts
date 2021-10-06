import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 80vh;
  padding: 3rem;

  img {
    margin: 30px;
    width: auto;
    height: 40vh;
  }

  select {
    margin-top: 30px;
  }

  h2 {
    color: var(--secondary);
    font-size: 2rem;
  }

  button {
    border: 1px solid black;
    border-radius: 5px;
    padding: 10px;
    margin-top: 30px;
  }
`
interface ContainerImagesProps {
  loading: boolean
}
export const ContainerImages = styled.div<ContainerImagesProps>`
  opacity: ${(props) => (props.loading ? '30%' : '100%')};
  display: flex;
  position: relative;
`
export const ContainerLoader = styled.div`
  display: flex;
  position: absolute;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
`

export const ContainerOpcoes = styled.div`
  display: flex;
`
export const SelectEfeito = styled.select`
  border: 1px solid black;
  border-radius: 5px;
  padding: 10px;
  margin-top: 30px;
  margin-right: 15px;
`
