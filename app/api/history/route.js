// app/api/history/route.js

import { createClient } from '@supabase/supabase-js'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
}

// GET /api/history — fetch last 20 entries
export async function GET() {
  try {
    const supabase = getSupabase()
    const { data, error } = await supabase
      .from('stress_history')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20)

    if (error) throw error
    return Response.json({ history: data })
  } catch (err) {
    console.error('History GET error:', err)
    return Response.json({ error: 'Could not fetch history.' }, { status: 500 })
  }
}

// POST /api/history — save a new entry
export async function POST(request) {
  try {
    const body = await request.json()
    const { user_text, score, level, level_label, insight, main_stressor } = body

    const supabase = getSupabase()
    const { data, error } = await supabase
      .from('stress_history')
      .insert([{ user_text, score, level, level_label, insight, main_stressor }])
      .select()

    if (error) throw error
    return Response.json({ saved: data[0] })
  } catch (err) {
    console.error('History POST error:', err)
    return Response.json({ error: 'Could not save entry.' }, { status: 500 })
  }
}
