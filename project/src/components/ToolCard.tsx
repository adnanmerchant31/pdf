import React from 'react'
import { DivideIcon as LucideIcon } from 'lucide-react'

interface ToolCardProps {
  title: string
  description: string
  icon: LucideIcon
  color: string
  onClick: () => void
}

export default function ToolCard({ title, description, icon: Icon, color, onClick }: ToolCardProps) {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
    teal: 'from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700',
    orange: 'from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700',
    purple: 'from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700',
    red: 'from-red-500 to-red-600 hover:from-red-600 hover:to-red-700',
    green: 'from-green-500 to-green-600 hover:from-green-600 hover:to-green-700',
  }

  return (
    <div
      onClick={onClick}
      className="group cursor-pointer bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border border-gray-100"
    >
      <div className={`h-2 bg-gradient-to-r ${colorClasses[color as keyof typeof colorClasses]}`} />
      
      <div className="p-6">
        <div className="flex items-center mb-4">
          <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${colorClasses[color as keyof typeof colorClasses]} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 ml-3">{title}</h3>
        </div>
        
        <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
        
        <div className="mt-4 flex items-center text-sm text-gray-500 group-hover:text-gray-700 transition-colors">
          <span>Click to start</span>
          <svg className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>
  )
}