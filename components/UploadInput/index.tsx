import React, { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Container, Drop } from './styles'

const getColor = (props: any) => {
  if (props.isDragAccept) {
    return 'var(--success)'
  }
  if (props.isDragReject) {
    return 'var(--danger)'
  }
  return 'var(--secondary)'
}

interface Props {
  onImageUpload: (formData: FormData, imageFile: File) => void
  disabled?: boolean
  maxFiles?: number
}

const DropUpload: React.FC<Props> = ({ onImageUpload, maxFiles, disabled }) => {
  const [loading, setLoading] = useState(false)
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    disabled: disabled,
    maxFiles: maxFiles || 1,
    accept: 'image/jpeg, image/png',
    onDropAccepted: async (acceptedFiles: File[]) => {
      setLoading(true)
      const formData = new FormData()
      acceptedFiles.forEach((file: any) => formData.append('files', file))
      try {
        onImageUpload(formData, acceptedFiles[0])
      } catch (e) {
        alert(e)
      } finally {
        setLoading(false)
      }
    },
  })

  return (
    <Container>
      <Drop
        color={getColor({ isDragActive, isDragAccept, isDragReject })}
        {...getRootProps({ className: 'dropzone' })}
        disabled={disabled || false}
      >
        <input {...getInputProps()} />
        {isDragAccept && <p>Imagem válida</p>}
        {isDragReject && <p>Arquivo inválido</p>}
        {!isDragActive && <p>Arraste e solte a imagem aqui</p>}
        {loading && <p>Carregando imagem...</p>}
      </Drop>
    </Container>
  )
}

export default DropUpload
