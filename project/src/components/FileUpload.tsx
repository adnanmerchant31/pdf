import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, FileText, X, Check } from 'lucide-react'

interface FileUploadProps {
  onFileSelect: (file: File) => void
  accept?: string
  maxSize?: number
  title?: string
  description?: string
}

export default function FileUpload({ 
  onFileSelect, 
  accept = '.pdf',
  maxSize = 10 * 1024 * 1024, // 10MB
  title = "Upload your PDF",
  description = "Drag and drop your file here, or click to browse"
}: FileUploadProps) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      setUploadedFile(file)
      setIsProcessing(true)
      onFileSelect(file)
      // Simulate processing delay
      setTimeout(() => setIsProcessing(false), 1000)
    }
  }, [onFileSelect])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxSize,
    multiple: false
  })

  const removeFile = () => {
    setUploadedFile(null)
    setIsProcessing(false)
  }

  if (uploadedFile) {
    return (
      <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center bg-gray-50">
        <div className="flex items-center justify-center mb-4">
          {isProcessing ? (
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          ) : (
            <Check className="h-8 w-8 text-green-600" />
          )}
        </div>
        
        <div className="flex items-center justify-center mb-4">
          <FileText className="h-6 w-6 text-gray-600 mr-2" />
          <span className="text-gray-700 font-medium">{uploadedFile.name}</span>
          <button
            onClick={removeFile}
            className="ml-2 p-1 text-gray-400 hover:text-red-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        
        <p className="text-sm text-gray-500">
          {isProcessing ? 'Processing...' : 'File ready for processing'}
        </p>
      </div>
    )
  }

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${
        isDragActive 
          ? 'border-blue-400 bg-blue-50' 
          : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
      }`}
    >
      <input {...getInputProps()} />
      
      <div className="flex flex-col items-center">
        <Upload className={`h-12 w-12 mb-4 ${isDragActive ? 'text-blue-600' : 'text-gray-400'}`} />
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        
        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Choose File
        </button>
        
        <p className="text-xs text-gray-500 mt-4">
          Maximum file size: {Math.round(maxSize / (1024 * 1024))}MB
        </p>
      </div>
    </div>
  )
}