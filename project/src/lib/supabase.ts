import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface ProcessingHistory {
  id: string
  user_id: string
  operation_type: string
  file_name: string
  file_size: number
  processed_at: string
  status: 'processing' | 'completed' | 'failed'
}