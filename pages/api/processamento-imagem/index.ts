import type { NextApiRequest, NextApiResponse } from 'next'
import { aplicaEfeitoImagem } from '../../../services/processamento.imagem'
import formidable from 'formidable'
import { IEfeitoResponse } from '../../../@types/processamento-imagem.types'
import Cors from 'cors'
import runMidleware from '../../../services/runMidleware'
import formidableMidleware from '../../../services/formidableMidleware'

export const config = {
  api: {
    bodyParser: false,
  },
}

const cors = Cors()

export default async (
  req: NextApiRequest,
  res: NextApiResponse<IEfeitoResponse>
) => {
  await runMidleware(req, res, cors)
  if (req.method === 'POST') {
    const form = new formidable.IncomingForm({ uploadDir: './public/input' })
    const { fields, files } = await formidableMidleware(req, form)
    const url = await aplicaEfeitoImagem(fields.efeito, files)
    res.status(200).json({ url })
  }
}
