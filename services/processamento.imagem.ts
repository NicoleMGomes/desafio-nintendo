import Jimp from 'jimp'
import formidable from 'formidable'

export async function aplicaEfeitoImagem(
  efeito: string,
  file: formidable.File
): Promise<string> {
  const image = await Jimp.read(file.path)
  let response

  switch (efeito) {
    case 'espelhar_verticalmente':
      response = espelhamentoVertical(image)
      break
    case 'espelhar_horizontalmente':
      response = espelhamentoHorizonal(image)
      break
    case 'deslocar_horizontalmente':
      response = deslocamento(image, 100, 0)
      break
    case 'aumentar':
      response = redimensionamento(image, 2, 2)
      break
    case 'reduzir':
      response = redimensionamento(image, 1 / 2, 1 / 2)
      break
    case 'rotacionar':
      response = rotacionamento(image, 45)
      break
    default:
      response = espelhamentoVertical(image)
      break
  }

  const url = `/output/${efeito}-${file.name}`
  response.write('./public' + url)

  return url
}

export function redimensionamento(
  image: Jimp,
  sizeX: number,
  sizeY: number
): Jimp {
  return transform(image, [
    [1 / sizeX, 0, 0],
    [0, 1 / sizeY, 0],
    [0, 0, 1],
  ])
}

export function espelhamentoHorizonal(image: Jimp): Jimp {
  return transform(image, [
    [-1, 0, 0],
    [0, 1, 0],
    [0, 0, 1],
  ])
}

export function espelhamentoVertical(image: Jimp): Jimp {
  return transform(image, [
    [1, 0, 0],
    [0, -1, 0],
    [0, 0, 1],
  ])
}

export function rotacionamento(image: Jimp, angle: number): Jimp {
  return transform(image, [
    [Math.cos(toRad(angle)), Math.sin(toRad(angle)), 0],
    [-Math.sin(toRad(angle)), Math.cos(toRad(angle)), 0],
    [0, 0, 1],
  ])
}

export function deslocamento(image: Jimp, x: number, y: number): Jimp {
  return transform(image, [
    [1, 0, -x],
    [0, 1, -y],
    [0, 0, 1],
  ])
}

function transform(image: Jimp, kernel: number[][]): Jimp {
  const response = image.clone()

  for (const { x, y } of image.scanIterator(
    0,
    0,
    image.bitmap.width,
    image.bitmap.height
  )) {
    response.setPixelColor(Jimp.cssColorToHex('#ffffff'), x, y)
    applyKernel(image, response, kernel, x, y)
  }

  return response
}

function toRad(Value: number) {
  return (Value * Math.PI) / 180
}

function applyKernel(
  image: Jimp,
  response: Jimp,
  kernel: number[][],
  x: number,
  y: number
) {
  const halfX = image.getWidth() / 2
  const halfY = image.getHeight() / 2
  const tmpX = x - halfX
  const tmpY = y - halfY

  let newX = Math.round(
    tmpX * kernel[0][0] + tmpY * kernel[0][1] + 1 * kernel[0][2]
  )

  let newY = Math.round(
    tmpX * kernel[1][0] + tmpY * kernel[1][1] + 1 * kernel[1][2]
  )

  newX += halfX
  newY += halfY

  if (
    newX < image.getWidth() &&
    newY < image.getHeight() &&
    newX >= 0 &&
    newY >= 0
  ) {
    response.setPixelColor(image.getPixelColor(newX, newY), x, y)
  }
}
