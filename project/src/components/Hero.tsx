import React from 'react'
import { FileText, Zap, Shield, Globe } from 'lucide-react'

export default function Hero() {
  return (
    <div className="relative bg-gradient-to-br from-blue-50 via-white to-teal-50 pt-16 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Your Complete
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-600"> PDF Toolkit</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Edit, compress, split, merge, and convert your PDF files with our professional-grade tools. 
            Fast, secure, and completely free.
          </p>
          <a
            href="#tools"
            className="inline-flex items-center bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Get Started
            <FileText className="ml-2 h-5 w-5" />
          </a>
        </div>

        {/* Feature highlights */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Lightning Fast</h3>
            <p className="text-gray-600">Process your PDFs in seconds with our optimized algorithms</p>
          </div>

          <div className="text-center p-6 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow">
            <div className="bg-teal-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-teal-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">100% Secure</h3>
            <p className="text-gray-600">Your files are processed securely and never stored on our servers</p>
          </div>

          <div className="text-center p-6 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow">
            <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Globe className="h-8 w-8 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Works Everywhere</h3>
            <p className="text-gray-600">Access all tools from any device, anywhere in the world</p>
          </div>
        </div>
      </div>
    </div>
  )
}