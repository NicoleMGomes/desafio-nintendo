import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 20%;
  width: 100%;

  #with-link-btn {
    margin-top: 4px;
  }
`
interface IProps {
  color: string
  disabled: boolean
}
export const Drop = styled.div<IProps>`
  opacity: ${(props) => (props.disabled ? '0.2' : '1')};
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 30%;
  width: 100%;
  padding: 20px;
  border-width: 4px;
  border-radius: 2px;
  border-color: ${(props) => props.color};
  border-style: dashed;
  background-color: var(--light-white);
  color: var(--secondary-dark);
  font-size: 14px;
  outline: none;
  transition: border 0.24s ease-in-out;
  &:hover {
    cursor: pointer;
    border-color: var(--success);
  }
`
