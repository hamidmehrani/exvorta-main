import { CollectionConfig, Plugin } from 'payload'
import { v2 as cloudinary } from 'cloudinary'
import { UploadApiOptions } from 'cloudinary'

export interface CloudinaryStorageOptions {
  config: {
    cloud_name: string
    api_key: string
    api_secret: string
  }
  collections: {
    [slug: string]: {
      folder?: string
    } | boolean
  }
}

export const cloudinaryStorage = (options: CloudinaryStorageOptions): Plugin => {
  // Configure Cloudinary SDK
  cloudinary.config({
    cloud_name: options.config.cloud_name,
    api_key: options.config.api_key,
    api_secret: options.config.api_secret,
  })

  return (incomingConfig) => {
    const collections = incomingConfig.collections?.map((collection) => {
      const collectionOptions = options.collections[collection.slug]
      if (!collectionOptions) return collection

      const folder = typeof collectionOptions === 'object' ? collectionOptions.folder : undefined

      // Modify the collection configuration for Cloudinary storage
      const modifiedCollection: CollectionConfig = {
        ...collection,
        hooks: {
          ...collection.hooks,
          beforeChange: [
            ...(collection.hooks?.beforeChange || []),
            async ({ data, req }) => {
              const file = req.file
              if (!file) return data

              const fileWithBuffer = file as any
              const fileBuffer = fileWithBuffer.buffer || (typeof fileWithBuffer.arrayBuffer === 'function' ? Buffer.from(await fileWithBuffer.arrayBuffer()) : null)
              if (!fileBuffer) return data

              // Upload to Cloudinary using standard stream upload
              const uploadOptions: UploadApiOptions = {
                folder: folder || 'payload-media',
                public_id: file.name.split('.').slice(0, -1).join('.'),
                resource_type: 'auto',
              }

              return new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                  uploadOptions,
                  (error, result) => {
                    if (error) {
                      req.payload.logger.error(error, 'Cloudinary upload error')
                      return reject(error)
                    }
                    if (result) {
                      // Map Cloudinary results back to Payload's file schema
                      data.url = result.secure_url
                      data.filename = result.public_id
                      data.filesize = result.bytes
                      data.width = result.width
                      data.height = result.height
                      data.mimeType = fileWithBuffer.type || fileWithBuffer.mimetype || fileWithBuffer.mimeType
                      resolve(data)
                    }
                  }
                )
                uploadStream.end(fileBuffer)
              })
            },
          ],
          afterDelete: [
            ...(collection.hooks?.afterDelete || []),
            async ({ doc, req }) => {
              if (doc.filename) {
                try {
                  await cloudinary.uploader.destroy(doc.filename)
                } catch (error) {
                  req.payload.logger.error(`Failed to delete Cloudinary file: ${error}`)
                }
              }
            },
          ],
        },
        upload: typeof collection.upload === 'object' ? {
          ...collection.upload,
          disableLocalStorage: true,
        } : collection.upload,
      }

      return modifiedCollection
    })

    return {
      ...incomingConfig,
      collections: collections || [],
    }
  }
}
export default cloudinaryStorage
