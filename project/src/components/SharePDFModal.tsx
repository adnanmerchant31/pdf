import React, { useState, useEffect } from 'react'
import { X, Link, Copy, Mail, Calendar, Eye, Download, Shield, Clock } from 'lucide-react'
import { supabase } from '../lib/supabase'

interface SharePDFModalProps {
  isOpen: boolean
  onClose: () => void
  file: File
}

interface ShareLink {
  id: string
  url: string
  expiresAt: string
  permissions: string[]
  accessCount: number
  maxAccess?: number
}

export default function SharePDFModal({ isOpen, onClose, file }: SharePDFModalProps) {
  const [shareLinks, setShareLinks] = useState<ShareLink[]>([])
  const [isCreating, setIsCreating] = useState(false)
  const [permissions, setPermissions] = useState({
    view: true,
    download: false,
    comment: false
  })
  const [expiryDays, setExpiryDays] = useState(7)
  const [maxAccess, setMaxAccess] = useState<number | undefined>(undefined)
  const [password, setPassword] = useState('')
  const [emailRecipients, setEmailRecipients] = useState('')

  useEffect(() => {
    if (isOpen) {
      loadShareLinks()
    }
  }, [isOpen])

  const loadShareLinks = async () => {
    // In a real implementation, fetch existing share links from database
    const mockLinks: ShareLink[] = [
      {
        id: '1',
        url: 'https://pdfpro.com/share/abc123',
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        permissions: ['view', 'download'],
        accessCount: 5,
        maxAccess: 10
      }
    ]
    setShareLinks(mockLinks)
  }

  const createShareLink = async () => {
    setIsCreating(true)
    
    try {
      // In a real implementation, upload file to storage and create share link
      const expiresAt = new Date(Date.now() + expiryDays * 24 * 60 * 60 * 1000)
      const shareId = Math.random().toString(36).substring(2, 15)
      
      const newLink: ShareLink = {
        id: shareId,
        url: `https://pdfpro.com/share/${shareId}`,
        expiresAt: expiresAt.toISOString(),
        permissions: Object.entries(permissions)
          .filter(([_, enabled]) => enabled)
          .map(([permission]) => permission),
        accessCount: 0,
        maxAccess
      }

      setShareLinks([...shareLinks, newLink])

      // Send emails if recipients provided
      if (emailRecipients) {
        await sendShareEmails(newLink, emailRecipients.split(',').map(email => email.trim()))
      }

    } catch (error) {
      console.error('Error creating share link:', error)
    } finally {
      setIsCreating(false)
    }
  }

  const sendShareEmails = async (shareLink: ShareLink, emails: string[]) => {
    // In a real implementation, send emails via edge function
    console.log('Sending share link to:', emails)
  }

  const copyToClipboard = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url)
      alert('Link copied to clipboard!')
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const revokeLink = async (linkId: string) => {
    setShareLinks(shareLinks.filter(link => link.id !== linkId))
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <Link className="h-6 w-6 text-blue-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">Share PDF</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* File Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center">
              <div className="bg-red-100 p-2 rounded-lg mr-3">
                <svg className="h-6 w-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{file.name}</h3>
                <p className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
          </div>

          {/* Create New Share Link */}
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Create Share Link</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Permissions
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={permissions.view}
                      onChange={(e) => setPermissions({...permissions, view: e.target.checked})}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <Eye className="h-4 w-4 ml-2 mr-1 text-gray-500" />
                    <span className="text-sm text-gray-700">View</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={permissions.download}
                      onChange={(e) => setPermissions({...permissions, download: e.target.checked})}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <Download className="h-4 w-4 ml-2 mr-1 text-gray-500" />
                    <span className="text-sm text-gray-700">Download</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={permissions.comment}
                      onChange={(e) => setPermissions({...permissions, comment: e.target.checked})}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 ml-6">Comment</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiry
                </label>
                <select
                  value={expiryDays}
                  onChange={(e) => setExpiryDays(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={1}>1 day</option>
                  <option value={7}>7 days</option>
                  <option value={30}>30 days</option>
                  <option value={90}>90 days</option>
                  <option value={365}>1 year</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Access Count (Optional)
                </label>
                <input
                  type="number"
                  value={maxAccess || ''}
                  onChange={(e) => setMaxAccess(e.target.value ? Number(e.target.value) : undefined)}
                  placeholder="Unlimited"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password Protection (Optional)
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Recipients (Optional)
              </label>
              <textarea
                value={emailRecipients}
                onChange={(e) => setEmailRecipients(e.target.value)}
                placeholder="Enter email addresses separated by commas"
                rows={2}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <button
              onClick={createShareLink}
              disabled={isCreating}
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isCreating ? 'Creating...' : 'Create Share Link'}
            </button>
          </div>

          {/* Existing Share Links */}
          {shareLinks.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Share Links</h3>
              <div className="space-y-4">
                {shareLinks.map((link) => (
                  <div key={link.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <Link className="h-4 w-4 text-gray-500" />
                        <span className="font-mono text-sm text-gray-600 truncate max-w-md">
                          {link.url}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => copyToClipboard(link.url)}
                          className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                          title="Copy link"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => revokeLink(link.id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                          title="Revoke link"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center text-gray-600">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>Expires: {formatDate(link.expiresAt)}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Eye className="h-4 w-4 mr-1" />
                        <span>Views: {link.accessCount}{link.maxAccess ? `/${link.maxAccess}` : ''}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Shield className="h-4 w-4 mr-1" />
                        <span>Permissions: {link.permissions.join(', ')}</span>
                      </div>
                      <div className="flex items-center">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          new Date(link.expiresAt) > new Date() 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {new Date(link.expiresAt) > new Date() ? 'Active' : 'Expired'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}