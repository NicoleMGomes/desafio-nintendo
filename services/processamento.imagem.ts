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
      response = contraste(image, 0.3)
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

  const response = image.clone()

  for (const { x, y } of image.scanIterator(
    0,
    0,
    image.bitmap.width,
    image.bitmap.height
  )) {
    const pixelColor = Jimp.intToRGBA(image.getPixelColor(x, y))
    const r = getPixelColor(pixelColor.r * contrast)
    const g = getPixelColor(pixelColor.g * contrast)
    const b = getPixelColor(pixelColor.b * contrast)
    response.setPixelColor(Jimp.rgbaToInt(r, g, b, pixelColor.a), x, y)
  }
  
  return response
}

export function mediana(image: Jimp): Jimp {
  return image
}

export function negativo(image: Jimp): Jimp {
  return image
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