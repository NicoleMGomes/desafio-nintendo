import { createGlobalStyle } from 'styled-components'

export default createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  html {
    min-height: 100%;
    font-size: 62.5%;
    background: white;
  }
  *, button, input {
    font-family: Roboto;
    border: 0;
    background: none;
    -webkit-tap-highlight-color: transparent;
    &:focus {
    outline: 0;
    outline: none;
    } 
  }
  ul {
    list-style: none;
  }
  :root {
    ${(props) => {
      const theme = props.theme

      let append = ''
      Object.entries(theme).forEach(([prop, value]) => {
        append += `--${prop}: ${value};`
      })

      return append
    }}
  }
`
