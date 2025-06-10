import React, { useState } from 'react'
import { 
  Minimize2, 
  Scissors, 
  Merge, 
  Trash2, 
  Crop, 
  FileText, 
  PenTool,
  Download,
  Edit3,
  Share2
} from 'lucide-react'
import ToolCard from './ToolCard'
import ProcessingModal from './ProcessingModal'

export default function ToolsSection() {
  const [selectedTool, setSelectedTool] = useState<string | null>(null)

  const tools = [
    {
      id: 'compress',
      title: 'Compress PDF',
      description: 'Reduce PDF file size while maintaining quality',
      icon: Minimize2,
      color: 'blue'
    },
    {
      id: 'split',
      title: 'Split PDF', 
      description: 'Divide your PDF into multiple separate files',
      icon: Scissors,
      color: 'teal'
    },
    {
      id: 'merge',
      title: 'Merge PDFs',
      description: 'Combine multiple PDF files into one document',
      icon: Merge,
      color: 'orange'
    },
    {
      id: 'delete',
      title: 'Delete Pages',
      description: 'Remove unwanted pages from your PDF',
      icon: Trash2,
      color: 'red'
    },
    {
      id: 'crop',
      title: 'Crop PDF',
      description: 'Trim and resize your PDF pages',
      icon: Crop,
      color: 'purple'
    },
    {
      id: 'convert',
      title: 'PDF to Word',
      description: 'Convert PDF documents to editable Word files',
      icon: FileText,
      color: 'green'
    },
    {
      id: 'word-to-pdf',
      title: 'Word to PDF',
      description: 'Convert Word documents to PDF format',
      icon: Download,
      color: 'blue'
    },
    {
      id: 'sign',
      title: 'Fill & Sign',
      description: 'Add text, signatures, and annotations to PDFs',
      icon: PenTool,
      color: 'teal'
    },
    {
      id: 'edit',
      title: 'Edit PDF',
      description: 'Edit text, images, and content in your PDF',
      icon: Edit3,
      color: 'purple'
    },
    {
      id: 'share',
      title: 'Share PDF',
      description: 'Generate secure links to share your PDFs',
      icon: Share2,
      color: 'green'
    }
  ]

  const handleToolClick = (toolId: string) => {
    setSelectedTool(toolId)
  }

  const closeModal = () => {
    setSelectedTool(null)
  }

  return (
    <section id="tools" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Powerful PDF Tools
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to work with PDF files. Fast, secure, and easy to use.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tools.map((tool) => (
            <ToolCard
              key={tool.id}
              title={tool.title}
              description={tool.description}
              icon={tool.icon}
              color={tool.color}
              onClick={() => handleToolClick(tool.id)}
            />
          ))}
        </div>
      </div>

      {selectedTool && (
        <ProcessingModal
          tool={tools.find(t => t.id === selectedTool)!}
          onClose={closeModal}
        />
      )}
    </section>
  )
}