export type DealStage =
  | 'lead'
  | 'work'
  | 'negotiation'
  | 'success'
  | 'lost'

export type Deal = {
  id: string
  client: string
  company: string
  contact: string
  amount: number | null
  note: string | null
  stage: DealStage
  user_id: string
  created_at: string
}

export const STAGES: { value: DealStage; label: string }[] = [
  { value: 'lead', label: 'Новый лид' },
  { value: 'work', label: 'В работе' },
  { value: 'negotiation', label: 'Переговоры' },
  { value: 'success', label: 'Успех' },
  { value: 'lost', label: 'Отказ' },
]
