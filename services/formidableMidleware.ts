import IncomingForm from 'formidable/Formidable'
import { NextApiRequest } from 'next'

export default (req: NextApiRequest, fn: IncomingForm): any => {
  return new Promise((resolve, reject) => {
    fn.parse(req, (err, fields, files) => {
      if (err) {
        return reject(err)
      }
      return resolve({ fields, files: files.files })
    })
  })
}
