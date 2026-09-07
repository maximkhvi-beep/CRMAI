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

export async function updateDealStage(
  dealId: string,
  stage: DealStage,
): Promise<void> {
  const { error } = await supabase
    .from('deals')
    .update({ stage })
    .eq('id', dealId)

  if (error) {
    throw new Error(error.message)
  }
}

export async function updateDeal(
  dealId: string,
  input: {
    client: string
    company: string
    contact: string
    amount: number | null
    note: string
  },
): Promise<Deal> {
  const { data, error } = await supabase
    .from('deals')
    .update({
      client: input.client,
      company: input.company,
      contact: input.contact,
      amount: input.amount,
      note: input.note,
    })
    .eq('id', dealId)
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data as Deal
}

export async function deleteDeal(dealId: string): Promise<void> {
  const { error } = await supabase.from('deals').delete().eq('id', dealId)

  if (error) {
    throw new Error(error.message)
  }
}
