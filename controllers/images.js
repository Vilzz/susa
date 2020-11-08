const fs = require('fs')
const ErrorResponse = require('../utils/errorResponse')
const path = require('path')

//*************************************/
// @desc Загрузить изображение
// @route POST /api/v1/images
// @access Закрытый ('User', 'Super')
//*************************************/
exports.imageUpload = (req, res, next) => {
  if (!req.files) {
    return next(new ErrorResponse('Добавь файл с изображением', 400))
  }
  const folder = req.body.folder || 'img'
  if (!fs.existsSync(`.${process.env.FILE_UPLOAD_PATH}/${folder}`)) {
    fs.mkdirSync(`.${process.env.FILE_UPLOAD_PATH}/${folder}`)
  }

  const file = req.files.file

  if (!file.mimetype.startsWith('image')) {
    return next(new ErrorResponse('Требуется файл изображения', 400))
  }

  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Размер файла изображения не более ${process.env.MAX_FILE_UPLOAD}`,
        400
      )
    )
  }
  const newfilename = `${req.user._id}.${path.parse(file.name).name}${
    path.parse(file.name).ext
  }`
  const fullpath = `${process.env.FILE_UPLOAD_PATH}/${folder}/${newfilename}`
  if (fs.existsSync(`.${fullpath}`)) {
    fs.unlink(`.${fullpath}`, (err) => {
      if (err) {
        return next(
          new ErrorResponse('Невозможно удалить файл изображения', 400)
        )
      }
      file.mv(`.${fullpath}`, (err) => {
        if (err) {
          console.error(err)
          return next(new ErrorResponse(`Проблема при загрузке файла`, 500))
        }

        res.status(200).json({
          success: true,
          data: fullpath,
        })
      })
    })
  } else {
    file.mv(`.${fullpath}`, (err) => {
      if (err) {
        console.error(err)
        return next(new ErrorResponse(`Проблема при загрузке файла`, 500))
      }
      res.status(200).json({
        success: true,
        data: fullpath,
      })
    })
  }
}

//*************************************/
// @desc Удалить изображение
// @route DELETE /api/v1/images
// @access Закрытый ('User', 'Super')
//*************************************/

exports.imageDelete = (req, res, next) => {
  const { pathtofile } = req.body
  if (fs.existsSync(`.${pathtofile}`)) {
    const file = path.parse(pathtofile)
    if (
      file.name.split('.')[0] !== req.user._id.toString() &&
      req.user.role !== 'Super'
    ) {
      return next(
        new ErrorResponse('Недостаточно прав для удаления изображения', 403)
      )
    }
    fs.unlink(`.${pathtofile}`, (err) => {
      if (err) {
        return next(
          new ErrorResponse('Невозможно удалить файл изображения', 404)
        )
      }
      res.status(200).json({
        success: true,
        data: {},
      })
    })
  } else {
    return next(new ErrorResponse('Невозможно удалить файл изображения', 404))
  }
}
