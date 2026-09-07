import { supabase } from './supabaseClient'
import type { Deal, DealStage } from '../types/deal'

export async function fetchDeals(userId: string): Promise<Deal[]> {
  const { data, error } = await supabase
    .from('deals')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true })

  if (error) {
    throw new Error(error.message)
  }

  return data as Deal[]
}

export async function createDeal(input: {
  client: string
  company: string
  contact: string
  amount: number | null
  note: string
  stage: DealStage
  userId: string
}): Promise<Deal> {
  const { data, error } = await supabase
    .from('deals')
    .insert({
      client: input.client,
      company: input.company,
      contact: input.contact,
      amount: input.amount,
      note: input.note,
      stage: input.stage,
      user_id: input.userId,
    })
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data as Deal
}
