import Jimp from 'jimp'
import formidable from 'formidable'

export async function aplicaEfeitoImagem(
  efeito: string,
  file: formidable.File
): Promise<string> {
  const image = await Jimp.read(file.path)
  let response

  switch (efeito) {
    case 'grayscale_gauss':
      response = grayscaleGauss(image)
      break
    case 'brilho':
      response = brilho(image, -20)
      break
    case 'deteccao_borda':
      response = sobel(image)
      break
    case 'contraste':
      response = contraste(image, -30)
      break
    case 'mediana':
      response = mediana(image)
      break
    case 'negativo':
      response = negativo(image)
      break
    default:
      response = grayscaleGauss(image)
      break
  }

  const url = `/output/${efeito}-${file.name}`
  response.write('./public' + url)

  return url
}

export function grayscaleGauss(image: Jimp): Jimp {
  return image
}

export function brilho(image: Jimp, brightness: number): Jimp {
  
  const response = image.clone()

  for (const { x, y } of image.scanIterator(
    0,
    0,
    image.bitmap.width,
    image.bitmap.height
  )) {
    const pixelColor = Jimp.intToRGBA(image.getPixelColor(x, y))
    const r = getPixelColor(pixelColor.r + brightness)
    const g = getPixelColor(pixelColor.g + brightness)
    const b = getPixelColor(pixelColor.b + brightness)
    response.setPixelColor(Jimp.rgbaToInt(r, g, b, pixelColor.a), x, y)
  }
  
  return response
}

export function sobel(image: Jimp): Jimp {
  return image
}

export function contraste(image: Jimp, contrast: number): Jimp {
  return image
}

export function mediana(image: Jimp): Jimp {
  return image
}

export function negativo(image: Jimp): Jimp {
  return image
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

function getPixelColor(value: number) {

  if(value > 255) {
    return 255
  }

  if(value < 0) {
    return 0
  } 

  return value 
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
