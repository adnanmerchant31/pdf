import { corsHeaders } from '../_shared/cors.ts'

interface ShareRequest {
  fileName: string
  fileData: string // base64 encoded file
  permissions: string[]
  expiryDays: number
  maxAccess?: number
  password?: string
  emailRecipients?: string[]
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    const { 
      fileName, 
      fileData, 
      permissions, 
      expiryDays, 
      maxAccess, 
      password,
      emailRecipients 
    }: ShareRequest = await req.json()

    // Generate unique share token
    const shareToken = crypto.randomUUID()
    
    // Calculate expiry date
    const expiresAt = new Date(Date.now() + expiryDays * 24 * 60 * 60 * 1000)

    // In a real implementation:
    // 1. Upload file to Supabase Storage
    // 2. Hash password if provided
    // 3. Store share record in database
    // 4. Send email notifications if recipients provided

    const shareUrl = `${req.headers.get('origin')}/share/${shareToken}`

    // Simulate email sending
    if (emailRecipients && emailRecipients.length > 0) {
      console.log('Sending share notifications to:', emailRecipients)
    }

    const response = {
      success: true,
      shareUrl,
      shareToken,
      expiresAt: expiresAt.toISOString(),
      permissions,
      maxAccess
    }

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})