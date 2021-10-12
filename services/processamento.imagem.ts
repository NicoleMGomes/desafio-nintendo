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

  grayscale(image, response)
  gauss(image, response)

  return response
}

export function grayscale(image: Jimp, response: Jimp): Jimp {
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

  return response
}

export function gauss(image: Jimp, response: Jimp): Jimp {
  for (const { x, y } of response.scanIterator(
    1,
    1,
    response.bitmap.width - 1,
    response.bitmap.height - 1
  )) {
    const pixelColor = Jimp.intToRGBA(response.getPixelColor(x, y))

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
    const newPixelColor = getPixelColor(value)

    response.setPixelColor(
      Jimp.rgbaToInt(newPixelColor, newPixelColor, newPixelColor, pixelColor.a),
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
    const gradientX: Array<number> = [0, 0, 0]
    const gradientY: Array<number> = [0, 0, 0]

    for (let lx = 0; lx < 3; lx++) {
      for (let ly = 0; ly < 3; ly++) {
        const pixelColor = Jimp.intToRGBA(
          image.getPixelColor(x + lx - 1, y + ly - 1)
        )
        gradientX[0] += pixelColor.r * xMask[lx][ly]
        gradientY[0] += pixelColor.r * yMask[lx][ly]
        gradientX[1] += pixelColor.g * xMask[lx][ly]
        gradientY[1] += pixelColor.g * yMask[lx][ly]
        gradientX[2] += pixelColor.b * xMask[lx][ly]
        gradientY[2] += pixelColor.b * yMask[lx][ly]
      }
    }

    const r = computeGradient(gradientX[0], gradientY[0])
    const g = computeGradient(gradientX[1], gradientY[1])
    const b = computeGradient(gradientX[2], gradientY[2])
    const a = Jimp.intToRGBA(image.getPixelColor(x, y)).a

    response.setPixelColor(Jimp.rgbaToInt(r, g, b, a), x, y)
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

    for (let lx = 0; lx < 3; lx++) {
      for (let ly = 0; ly < 3; ly++) {
        const pixelColor = Jimp.intToRGBA(
          image.getPixelColor(x + lx - 1, y + ly - 1)
        )
        red[index] = pixelColor.r
        green[index] = pixelColor.g
        blue[index] = pixelColor.b
        index++
      }
    }

    red.sort((a, b) => a - b)
    green.sort((a, b) => a - b)
    blue.sort((a, b) => a - b)

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
  const valMax = 255

  for (const { x, y } of image.scanIterator(
    0,
    0,
    image.bitmap.width,
    image.bitmap.height
  )) {
    const pixelColor = Jimp.intToRGBA(image.getPixelColor(x, y))
    const r = valMax - pixelColor.r
    const g = valMax - pixelColor.g
    const b = valMax - pixelColor.b
    response.setPixelColor(Jimp.rgbaToInt(r, g, b, pixelColor.a), x, y)
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

function computeGradient(gradientX: number, gradientY: number) {
  const value = Math.floor(
    Math.sqrt(Math.pow(gradientX, 2) + Math.pow(gradientY, 2))
  )

  return getPixelColor(value)
}
