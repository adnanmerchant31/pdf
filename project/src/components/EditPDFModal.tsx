import React, { useState, useRef, useEffect } from 'react'
import { X, Type, Image, Square, Circle, Minus, Save, Undo, Redo } from 'lucide-react'

interface EditPDFModalProps {
  isOpen: boolean
  onClose: () => void
  file: File
}

interface Annotation {
  id: string
  type: 'text' | 'rectangle' | 'circle' | 'line'
  x: number
  y: number
  width?: number
  height?: number
  text?: string
  color: string
  fontSize?: number
}

export default function EditPDFModal({ isOpen, onClose, file }: EditPDFModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [annotations, setAnnotations] = useState<Annotation[]>([])
  const [selectedTool, setSelectedTool] = useState<string>('text')
  const [selectedColor, setSelectedColor] = useState('#000000')
  const [fontSize, setFontSize] = useState(16)
  const [isDrawing, setIsDrawing] = useState(false)
  const [currentAnnotation, setCurrentAnnotation] = useState<Annotation | null>(null)
  const [history, setHistory] = useState<Annotation[][]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)

  useEffect(() => {
    if (isOpen && file) {
      loadPDFToCanvas()
    }
  }, [isOpen, file])

  const loadPDFToCanvas = async () => {
    // In a real implementation, you would use PDF.js to render the PDF
    // For demo purposes, we'll create a simple canvas
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = 800
    canvas.height = 1000

    // Draw a white background
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw some sample content
    ctx.fillStyle = '#000000'
    ctx.font = '16px Arial'
    ctx.fillText('Sample PDF Content - Click to edit', 50, 100)
    ctx.fillText('This is a demonstration of PDF editing capabilities', 50, 150)
  }

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    if (selectedTool === 'text') {
      const text = prompt('Enter text:')
      if (text) {
        const newAnnotation: Annotation = {
          id: Date.now().toString(),
          type: 'text',
          x,
          y,
          text,
          color: selectedColor,
          fontSize
        }
        addAnnotation(newAnnotation)
      }
    }
  }

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (selectedTool === 'text') return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    setIsDrawing(true)
    const newAnnotation: Annotation = {
      id: Date.now().toString(),
      type: selectedTool as 'rectangle' | 'circle' | 'line',
      x,
      y,
      width: 0,
      height: 0,
      color: selectedColor
    }
    setCurrentAnnotation(newAnnotation)
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !currentAnnotation) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const updatedAnnotation = {
      ...currentAnnotation,
      width: x - currentAnnotation.x,
      height: y - currentAnnotation.y
    }
    setCurrentAnnotation(updatedAnnotation)
    redrawCanvas()
  }

  const handleMouseUp = () => {
    if (isDrawing && currentAnnotation) {
      addAnnotation(currentAnnotation)
      setCurrentAnnotation(null)
    }
    setIsDrawing(false)
  }

  const addAnnotation = (annotation: Annotation) => {
    const newAnnotations = [...annotations, annotation]
    setAnnotations(newAnnotations)
    
    // Add to history
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(newAnnotations)
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
    
    redrawCanvas()
  }

  const redrawCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear and redraw background
    loadPDFToCanvas()

    // Draw all annotations
    const allAnnotations = currentAnnotation ? [...annotations, currentAnnotation] : annotations
    
    allAnnotations.forEach(annotation => {
      ctx.strokeStyle = annotation.color
      ctx.fillStyle = annotation.color
      ctx.lineWidth = 2

      switch (annotation.type) {
        case 'text':
          ctx.font = `${annotation.fontSize}px Arial`
          ctx.fillText(annotation.text || '', annotation.x, annotation.y)
          break
        case 'rectangle':
          ctx.strokeRect(annotation.x, annotation.y, annotation.width || 0, annotation.height || 0)
          break
        case 'circle':
          const radius = Math.sqrt(Math.pow(annotation.width || 0, 2) + Math.pow(annotation.height || 0, 2)) / 2
          ctx.beginPath()
          ctx.arc(annotation.x + (annotation.width || 0) / 2, annotation.y + (annotation.height || 0) / 2, radius, 0, 2 * Math.PI)
          ctx.stroke()
          break
        case 'line':
          ctx.beginPath()
          ctx.moveTo(annotation.x, annotation.y)
          ctx.lineTo(annotation.x + (annotation.width || 0), annotation.y + (annotation.height || 0))
          ctx.stroke()
          break
      }
    })
  }

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1)
      setAnnotations(history[historyIndex - 1])
      redrawCanvas()
    }
  }

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1)
      setAnnotations(history[historyIndex + 1])
      redrawCanvas()
    }
  }

  const saveEdits = () => {
    // In a real implementation, you would save the edited PDF
    alert('PDF edits saved successfully!')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Edit PDF</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex h-[calc(90vh-80px)]">
          {/* Toolbar */}
          <div className="w-64 bg-gray-50 p-4 border-r border-gray-200 overflow-y-auto">
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Tools</h3>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setSelectedTool('text')}
                    className={`p-3 rounded-lg border-2 transition-colors ${
                      selectedTool === 'text' 
                        ? 'border-blue-500 bg-blue-50 text-blue-700' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Type className="h-5 w-5 mx-auto" />
                    <span className="text-xs mt-1 block">Text</span>
                  </button>
                  <button
                    onClick={() => setSelectedTool('rectangle')}
                    className={`p-3 rounded-lg border-2 transition-colors ${
                      selectedTool === 'rectangle' 
                        ? 'border-blue-500 bg-blue-50 text-blue-700' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Square className="h-5 w-5 mx-auto" />
                    <span className="text-xs mt-1 block">Rectangle</span>
                  </button>
                  <button
                    onClick={() => setSelectedTool('circle')}
                    className={`p-3 rounded-lg border-2 transition-colors ${
                      selectedTool === 'circle' 
                        ? 'border-blue-500 bg-blue-50 text-blue-700' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Circle className="h-5 w-5 mx-auto" />
                    <span className="text-xs mt-1 block">Circle</span>
                  </button>
                  <button
                    onClick={() => setSelectedTool('line')}
                    className={`p-3 rounded-lg border-2 transition-colors ${
                      selectedTool === 'line' 
                        ? 'border-blue-500 bg-blue-50 text-blue-700' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Minus className="h-5 w-5 mx-auto" />
                    <span className="text-xs mt-1 block">Line</span>
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Color</h3>
                <input
                  type="color"
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  className="w-full h-10 rounded-lg border border-gray-300"
                />
              </div>

              {selectedTool === 'text' && (
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Font Size</h3>
                  <input
                    type="range"
                    min="8"
                    max="48"
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    className="w-full"
                  />
                  <span className="text-sm text-gray-600">{fontSize}px</span>
                </div>
              )}

              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Actions</h3>
                <div className="space-y-2">
                  <button
                    onClick={undo}
                    disabled={historyIndex <= 0}
                    className="w-full flex items-center justify-center px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Undo className="h-4 w-4 mr-2" />
                    Undo
                  </button>
                  <button
                    onClick={redo}
                    disabled={historyIndex >= history.length - 1}
                    className="w-full flex items-center justify-center px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Redo className="h-4 w-4 mr-2" />
                    Redo
                  </button>
                  <button
                    onClick={saveEdits}
                    className="w-full flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Canvas Area */}
          <div className="flex-1 overflow-auto bg-gray-100 p-4">
            <div className="flex justify-center">
              <canvas
                ref={canvasRef}
                onClick={handleCanvasClick}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                className="border border-gray-300 bg-white shadow-lg cursor-crosshair"
                style={{ maxWidth: '100%', height: 'auto' }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}