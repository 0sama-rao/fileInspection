import fs from 'fs'
import path from 'path'

import crypto from 'crypto' // For file hash
import multer from 'multer'

import os from 'os' // For system details
import sizeOf from 'image-size' // For image dimensions

import config from '../../config/uploads'
import translate from '../../helpers/translate'

/**
 * Upload file
 * @description This method will upload file and capture metadata.
 * @input data of file to be uploaded
 * @return (Object)
 */
export const upload = async (request, response) => {
    const dateNow = Date.now()
    const storage = multer.diskStorage({
        destination: (req, file, callback) => {
            const typeConfig = config[req?.body?.type]

            if (!typeConfig) {
                return response.status(422).json({
                    message: translate('validations', 'valid', {
                        ':attribute': 'Type',
                    }),
                })
            }

            let folder = typeConfig.folder
            folder =
                folder && req?.body?.id
                    ? folder.replace('{id}', req?.body?.id)
                    : folder

            if (!fs.existsSync(`storage/images/${folder}`)) {
                fs.mkdirSync(`storage/images/${folder}`, { recursive: true })
            }

            callback(null, path.join(`./storage/images/${folder}/`))
        },
        filename: (req, file, callback) => {
            const filename = `${file?.fieldname}-${dateNow}${path?.extname(file?.originalname)}`
            callback(null, filename)
        },
    })

    const multipleUpload = multer({ storage }).array('files', 5)

    multipleUpload(request, response, (error) => {
        if (error) {
            return response.status(422).json({ message: error.message })
        }

        const typeConfig = config[request?.body?.type]
        const files = request?.files

        if (!request?.body?.type) {
            return response.status(422).json({
                message: translate('validations', 'valid', {
                    ':attribute': 'Type',
                }),
            })
        }
        // eslint-disable-next-line no-console
        console.log(
            files,
            'files?.lengthfiles?.lengthfiles?.length',
            request?.body
        )

        if (!files?.length) {
            return response.status(422).json({
                message: translate('validations', 'required', {
                    ':attribute': 'Files',
                }),
            })
        }

        if (typeConfig?.isIdRequired && !request?.body?.id) {
            return response.status(422).json({
                message: translate('validations', 'required', {
                    ':attribute': 'Id',
                }),
            })
        }

        const data = []

        for (let i = 0; i < files?.length; i++) {
            const item = files[i]
            const supportedFileRegex = new RegExp(typeConfig?.fileSupported)
            const supportedMimeType = new RegExp(typeConfig?.mimeTypeSupported)
            const fileExt = item?.originalname.split('.').pop()?.toLowerCase()

            if (
                (fileExt && !supportedFileRegex.test(fileExt)) ||
                !supportedMimeType.test(item.mimetype)
            ) {
                return response.status(422).json({
                    message: translate('validations', 'valid', {
                        ':attribute': 'File format',
                    }),
                })
            }

            if (item?.size > typeConfig?.maxSize) {
                return response.status(422).json({
                    message: translate('validations', 'fileSize', {
                        ':size': Math.round(
                            typeConfig?.maxSize / 1024 / 1024
                        ).toString(),
                    }),
                })
            }

            // File metadata extraction
            const fileResponse = {
                originalName: item?.originalname,
                fileName: item?.filename,
                fileURL: `${process.env.API_URL}${item?.path}`,
                size: item.size,
                mimeType: item.mimetype,
                creationDate: new Date().toISOString(),
                lastModified: fs.statSync(item.path).mtime.toISOString(),
            }

            // Calculate file hash (SHA-256)
            const hash = crypto.createHash('sha256')
            const fileBuffer = fs.readFileSync(item.path)
            hash.update(fileBuffer)
            fileResponse.fileHash = hash.digest('hex')

            // Get image dimensions for image files
            if (['png', 'jpeg', 'jpg'].includes(fileExt)) {
                try {
                    const dimensions = sizeOf(item.path)
                    fileResponse.dimensions = dimensions
                } catch (err) {
                    // Handle non-image files gracefully
                    fileResponse.dimensions = null
                }
            }

            // Add additional metadata
            fileResponse.owner = request?.user?.id || 'Unknown' // Assuming user info exists in request
            fileResponse.computer = os.hostname() // Add computer hostname

            data.push(fileResponse)
        }

        return response.json({
            message: translate('messages', 'success', {
                ':attribute': 'File has',
                ':action': 'uploaded',
            }),
            data,
        })
    })
}
