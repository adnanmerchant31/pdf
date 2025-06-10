import React, { useState } from 'react'
import { X, Download, Loader } from 'lucide-react'
import FileUpload from './FileUpload'
import EditPDFModal from './EditPDFModal'
import SharePDFModal from './SharePDFModal'
import { processPDF } from '../utils/pdfProcessor'

interface ProcessingModalProps {
  tool: {
    id: string
    title: string
    description: string
    icon: any
    color: string
  }
  onClose: () => void
}

export default function ProcessingModal({ tool, onClose }: ProcessingModalProps) {
  const [file, setFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [processedFile, setProcessedFile] = useState<Blob | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)

  const handleFileSelect = async (selectedFile: File) => {
    setFile(selectedFile)
    setError(null)

    // Handle special tools that open their own modals
    if (tool.id === 'edit') {
      setShowEditModal(true)
      return
    }

    if (tool.id === 'share') {
      setShowShareModal(true)
      return
    }

    // Process other tools normally
    setIsProcessing(true)

    try {
      const result = await processPDF(selectedFile, tool.id)
      setProcessedFile(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Processing failed')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDownload = () => {
    if (processedFile) {
      const url = URL.createObjectURL(processedFile)
      const a = document.createElement('a')
      a.href = url
      a.download = `processed_${file?.name || 'document.pdf'}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center">
              <tool.icon className="h-6 w-6 text-blue-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">{tool.title}</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-6">
            <p className="text-gray-600 mb-6">{tool.description}</p>

            {!file ? (
              <FileUpload onFileSelect={handleFileSelect} />
            ) : (
              <div className="space-y-6">
                {isProcessing && (
                  <div className="flex items-center justify-center py-8">
                    <Loader className="h-8 w-8 animate-spin text-blue-600 mr-3" />
                    <span className="text-gray-700">Processing your PDF...</span>
                  </div>
                )}

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-800">{error}</p>
                  </div>
                )}

                {processedFile && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                    <div className="flex items-center justify-center mb-4">
                      <Download className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-green-800 mb-2">
                      Processing Complete!
                    </h3>
                    <p className="text-green-700 mb-4">
                      Your file has been processed successfully.
                    </p>
                    <button
                      onClick={handleDownload}
                      className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Download Processed File
                    </button>
                  </div>
                )}

                <button
                  onClick={() => {
                    setFile(null)
                    setProcessedFile(null)
                    setError(null)
                  }}
                  className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Process Another File
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit PDF Modal */}
      {showEditModal && file && (
        <EditPDFModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false)
            onClose()
          }}
          file={file}
        />
      )}

      {/* Share PDF Modal */}
      {showShareModal && file && (
        <SharePDFModal
          isOpen={showShareModal}
          onClose={() => {
            setShowShareModal(false)
            onClose()
          }}
          file={file}
        />
      )}
    </>
  )
}