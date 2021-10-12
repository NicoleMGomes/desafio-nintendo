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
      response = brilho(image, -51)
      break
    case 'deteccao_borda':
      response = sobel(image)
      break
    case 'contraste':
      response = contraste(image, 0.7)
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
    const response = image.clone()
  
    //transforma o response em tons de cinza
    for (const { x, y } of image.scanIterator(
      0,
      0,
      image.bitmap.width,
      image.bitmap.height
    )) {
      const pixelColor = Jimp.intToRGBA(image.getPixelColor(x, y))
      const cinza = Math.round((pixelColor.r + pixelColor.b + pixelColor.g) / 3)
      response.setPixelColor(
        Jimp.rgbaToInt(cinza, cinza, cinza, pixelColor.a),
        x,
        y
      )
    }
  
    //aplica filtro de gauss no response em tons de cinza
    for (const { x, y } of response.scanIterator(
      1,
      1,
      response.bitmap.width - 1,
      response.bitmap.height - 1
    )) {
      const pixelColor = Jimp.intToRGBA(response.getPixelColor(x, y))
      const novoValor = computePixelGauss(response, x, y)
      response.setPixelColor(
        Jimp.rgbaToInt(novoValor, novoValor, novoValor, pixelColor.a),
        x,
        y
      )
    }
  
    return response
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

export function sobel(image: Jimp): Jimp {
  const response = image.clone()

  for (const { x, y } of image.scanIterator(
    0,
    0,
    image.bitmap.width,
    image.bitmap.height
  )) {
    const pixelColor = Jimp.intToRGBA(image.getPixelColor(x, y))
    const r = computePixel(image, 0, x, y)
    const g = computePixel(image, 1, x, y)
    const b = computePixel(image, 2, x, y)
    response.setPixelColor(Jimp.rgbaToInt(r, g, b, pixelColor.a), x, y)
  }

  return response
}

export function mediana(image: Jimp): Jimp {
  const response = image.clone()

  for (const { x, y } of image.scanIterator(
    1,
    1,
    image.bitmap.width - 1,
    image.bitmap.height - 1
  )) {
    const red: Array<number> = []
    const green: Array<number> = []
    const blue: Array<number> = []
    let index = 0

    for (let lx = x - 1; lx <= x + 1; lx++) {
      for (let ly = y - 1; ly <= y + 1; ly++) {
        const pixelColor = Jimp.intToRGBA(image.getPixelColor(lx, ly))
        red[index] = pixelColor.r
        green[index] = pixelColor.g
        blue[index] = pixelColor.b
        index++
      }
    }

    red.sort()
    green.sort()
    blue.sort()

    const r = red[Math.floor(red.length / 2)]
    const g = green[Math.floor(green.length / 2)]
    const b = blue[Math.floor(blue.length / 2)]
    const a = Jimp.intToRGBA(image.getPixelColor(x, y)).a

    response.setPixelColor(Jimp.rgbaToInt(r, g, b, a), x, y)
  }

  return response
}

export function negativo(image: Jimp): Jimp {
  const response = image.clone()

  for (const { x, y } of image.scanIterator(
    0,
    0,
    image.bitmap.width,
    image.bitmap.height
  )) {
    const pixelColor = Jimp.intToRGBA(image.getPixelColor(x, y))
    response.setPixelColor(
      Jimp.rgbaToInt(
        255 - pixelColor.r,
        255 - pixelColor.g,
        255 - pixelColor.b,
        pixelColor.a
      ),
      x,
      y
    )
  }

  return response
}

function getPixelColor(value: number) {
  if (value > 255) {
    return 255
  }

  if (value < 0) {
    return 0
  }

  return value
}

function computePixel(
  image: Jimp,
  channel: number,
  x: number,
  y: number
): number {
  const xMask = [
    [1, 0, -1],
    [2, 0, -2],
    [1, 0, -1],
  ]
  const yMask = [
    [1, 2, 1],
    [0, 0, 0],
    [-1, -2, -1],
  ]
  let gradientX = 0
  let gradientY = 0

  for (let lx = 0; lx < 3; lx++) {
    for (let ly = 0; ly < 3; ly++) {
      const pixelColor = Jimp.intToRGBA(
        image.getPixelColor(x + lx - 1, y + ly - 1)
      )
      const pixelColorNumber =
        channel === 0
          ? pixelColor.r
          : channel === 1
          ? pixelColor.g
          : pixelColor.b
      gradientX += pixelColorNumber * xMask[lx][ly]
      gradientY += pixelColorNumber * yMask[lx][ly]
    }
  }

  const value = Math.floor(
    Math.sqrt(Math.pow(gradientX, 2) + Math.pow(gradientY, 2))
  )
  return getPixelColor(value)
}

function computePixelGauss(image: Jimp, x: number, y: number): number {
  const mask = [
    [1, 2, 1],
    [2, 4, 2],
    [1, 2, 1],
  ]
  const constanteDivisora = 16
  let novoValor = 0

  for (let lx = 0; lx < 3; lx++) {
    for (let ly = 0; ly < 3; ly++) {
      const pixelColor = Jimp.intToRGBA(
        image.getPixelColor(x + lx - 1, y + ly - 1)
      )
      const pixelColorNumber = pixelColor.r
      novoValor += pixelColorNumber * mask[lx][ly]
    }
  }

  const value = novoValor / constanteDivisora
  return getPixelColor(value)
}