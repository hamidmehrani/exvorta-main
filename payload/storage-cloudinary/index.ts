/* eslint-disable @typescript-eslint/no-require-imports */
import { CollectionConfig, Plugin } from 'payload'
import { v2 as cloudinary } from 'cloudinary'
import { UploadApiOptions, ConfigOptions } from 'cloudinary'

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
  const proxyUrl = process.env.https_proxy || process.env.HTTPS_PROXY
  const cloudinaryConfig: ConfigOptions & { timeout?: number, api_proxy?: string } = {
    cloud_name: options.config.cloud_name,
    api_key: options.config.api_key,
    api_secret: options.config.api_secret,
    timeout: 600000, // 10 minutes global timeout!
  }
  
  if (proxyUrl) {
    cloudinaryConfig.api_proxy = proxyUrl
  }

  // Configure Cloudinary SDK
  cloudinary.config(cloudinaryConfig)

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

              const fileWithBuffer = file as { 
                buffer?: Buffer;
                data?: Buffer;
                arrayBuffer?: () => Promise<ArrayBuffer>; 
                type?: string; 
                mimetype?: string; 
                mimeType?: string 
              }
              const fileBuffer = fileWithBuffer.data || fileWithBuffer.buffer || (typeof fileWithBuffer.arrayBuffer === 'function' ? Buffer.from(await fileWithBuffer.arrayBuffer()) : null)
              if (!fileBuffer) return data

              const base64Data = fileBuffer.toString('base64')
              const dataUri = `data:${fileWithBuffer.type || fileWithBuffer.mimetype || fileWithBuffer.mimeType || 'image/webp'};base64,${base64Data}`

              // Upload to Cloudinary using standard base64 upload
              const uploadOptions: UploadApiOptions = {
                folder: folder || 'payload-media',
                public_id: file.name.split('.').slice(0, -1).join('.'),
                resource_type: 'auto',
                timeout: 60000, // 60 seconds hard timeout per file!
              }

              let proxyAgent = null
              const proxyUrl = process.env.https_proxy || process.env.HTTPS_PROXY
              if (proxyUrl) {
                try {
                  const { HttpsProxyAgent } = require('https-proxy-agent')
                  proxyAgent = new HttpsProxyAgent(proxyUrl)
                  Object.assign(uploadOptions, { agent: proxyAgent })
                } catch {
                  req.payload.logger.error('Failed to load https-proxy-agent')
                }
              }

              const maxRetries = 3
              const retryDelays = [2000, 5000, 10000]
              
              for (let attempt = 0; attempt <= maxRetries; attempt++) {
                try {
                  const result = await cloudinary.uploader.upload(dataUri, uploadOptions)
                  data.url = result.secure_url
                  data.filename = result.public_id
                  data.filesize = result.bytes
                  data.width = result.width
                  data.height = result.height
                  data.mimeType = fileWithBuffer.type || fileWithBuffer.mimetype || fileWithBuffer.mimeType
                  return data
                } catch (error: unknown) {
                  const err = error as { http_code?: number, name?: string, message?: string, code?: string }
                  const isTransient = (err?.http_code ?? 0) >= 500 || err?.name === 'TimeoutError' || err?.message?.includes('Timeout') || err?.code === 'ECONNRESET' || err?.code === 'ETIMEDOUT'
                  
                  if (isTransient && attempt < maxRetries) {
                    req.payload.logger.warn(`Cloudinary upload transient error (attempt ${attempt + 1}/${maxRetries}): ${err.message}. Retrying in ${retryDelays[attempt]}ms...`)
                    await new Promise(resolve => setTimeout(resolve, retryDelays[attempt]))
                    continue
                  }
                  
                  req.payload.logger.error(error, `Cloudinary upload failed permanently after ${attempt} retries`)
                  throw error
                }
              }
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
          afterRead: [
            ...(collection.hooks?.afterRead || []),
            ({ doc }) => {
              if (doc.filename) {
                let ext = ''
                if (doc.mimeType === 'image/webp') ext = '.webp'
                else if (doc.mimeType === 'image/jpeg' || doc.mimeType === 'image/jpg') ext = '.jpg'
                else if (doc.mimeType === 'image/png') ext = '.png'
                else if (doc.mimeType === 'image/svg+xml') ext = '.svg'
                else if (doc.mimeType === 'image/gif') ext = '.gif'
                
                doc.url = `https://res.cloudinary.com/${options.config.cloud_name}/image/upload/f_auto,q_auto/${doc.filename}${ext}`
              }
              return doc
            }
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
