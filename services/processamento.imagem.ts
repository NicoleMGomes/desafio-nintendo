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
    const b = computePixel(image, 2, x, y);
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

function getPixelColor(value: number) {

  if(value > 255) {
    return 255
  }

  if(value < 0) {
    return 0
  } 

  return value 
}

function computePixel(image:Jimp, channel:number, x:number, y:number) :number {

  const xMask = [[1, 0, -1], [2, 0, -2], [1, 0, -1]];
  const yMask = [[1, 2, 1], [0, 0, 0], [-1, -2, -1]];
  let gradientX = 0;
  let gradientY = 0;

  for (let lx = 0; lx < 3; lx++) {
    for (let ly = 0; ly < 3; ly++) {
        const pixelColor = Jimp.intToRGBA(image.getPixelColor(x + lx - 1, y + ly - 1))
        const pixelColorNumber = channel === 0 ? pixelColor.r : channel === 1 ? pixelColor.g : pixelColor.b;
        gradientX += pixelColorNumber * xMask[lx][ly]
        gradientY += pixelColorNumber * yMask[lx][ly]
    }
  }
  
  const value = Math.floor(Math.sqrt(Math.pow(gradientX, 2) + Math.pow(gradientY, 2)));
  return getPixelColor(value);
}

export function mediana(image: Jimp): Jimp {
  const response = image.clone()

  for (const { x, y } of image.scanIterator(
    0,
    0,
    image.bitmap.width,
    image.bitmap.height
  )) {
    //TODO: ajustar implementação
    const pixelColor = Jimp.intToRGBA(image.getPixelColor(x, y))

    const novoValorPixel: any = calculaMedianaVizinhos(x, y, image)

    response.setPixelColor(
      Jimp.rgbaToInt(
        novoValorPixel.red,
        novoValorPixel.green,
        novoValorPixel.blue,
        pixelColor.a
      ),
      x,
      y
    )
  }

  return response
}

function calculaMedianaVizinhos(x: number, y: number, image: Jimp): any {
  const valoresVerde: Array<number> = []
  const valoresVermelho: Array<number> = []
  const valoresAzul: Array<number> = []
  let index = 0

  //matriz  3x3
  for (let lx = x - 1; lx <= x + 1; lx++) {
    for (let ly = y - 1; ly <= y + 1; ly++) {
      //se o pixel n está em (0,0) ou (tam, tam) - bordas
      if (x > 0 || y > 0 || x < image.getWidth() || y < image.getHeight()) {
        const pixelColor = Jimp.intToRGBA(image.getPixelColor(lx, ly))
        valoresVerde[index] = pixelColor.g
        valoresVermelho[index] = pixelColor.r
        valoresAzul[index] = pixelColor.b

        index++
      }
    }
  }

  return calculaValorCentral(valoresVerde, valoresVermelho, valoresAzul)
}

function calculaValorCentral(
  valoresVerde: Array<number>,
  valoresVermelho: Array<number>,
  valoresAzul: Array<number>
): any {
  valoresAzul.sort()
  valoresVerde.sort()
  valoresVermelho.sort()

  return {
    red: valoresVermelho[Math.floor(valoresVermelho.length / 2)],
    green: valoresVerde[Math.floor(valoresVerde.length / 2)],
    blue: valoresAzul[Math.floor(valoresAzul.length / 2)],
  }
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