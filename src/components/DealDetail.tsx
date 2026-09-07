import { useState } from 'react'
import type { FormEvent } from 'react'
import type { Deal, DealStage } from '../types/deal'
import { STAGES } from '../types/deal'

export type DealEditInput = {
  client: string
  company: string
  contact: string
  amount: number | null
  note: string
  stage: DealStage
}

type Props = {
  deal: Deal
  onSave: (dealId: string, input: DealEditInput) => Promise<void>
  onDelete: (dealId: string) => Promise<void>
  onClose: () => void
}

export default function DealDetail({
  deal,
  onSave,
  onDelete,
  onClose,
}: Props) {
  const [client, setClient] = useState(deal.client)
  const [company, setCompany] = useState(deal.company ?? '')
  const [contact, setContact] = useState(deal.contact ?? '')
  const [amount, setAmount] = useState(
    deal.amount === null ? '' : String(deal.amount),
  )
  const [note, setNote] = useState(deal.note ?? '')
  const [stage, setStage] = useState<DealStage>(deal.stage)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setSaving(true)
    try {
      await onSave(deal.id, {
        client,
        company,
        contact,
        amount: amount === '' ? null : Number(amount),
        note,
        stage,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось сохранить')
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!window.confirm('Удалить сделку?')) return
    setError(null)
    setDeleting(true)
    try {
      await onDelete(deal.id)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось удалить')
      setDeleting(false)
    }
  }

  const field =
    'mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm'

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-black/40">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Сделка</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded px-2 py-1 text-lg leading-none text-gray-400 hover:bg-gray-100 hover:text-gray-700"
            aria-label="Закрыть"
          >
            ×
          </button>
        </div>

        <div className="mt-4 space-y-4">
          <div>
            <label
              htmlFor="detail-client"
              className="block text-sm font-medium text-gray-700"
            >
              Клиент*
            </label>
            <input
              id="detail-client"
              required
              value={client}
              onChange={(e) => setClient(e.target.value)}
              className={field}
            />
          </div>

          <div>
            <label
              htmlFor="detail-company"
              className="block text-sm font-medium text-gray-700"
            >
              Компания
            </label>
            <input
              id="detail-company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className={field}
            />
          </div>

          <div>
            <label
              htmlFor="detail-contact"
              className="block text-sm font-medium text-gray-700"
            >
              Контакт
            </label>
            <input
              id="detail-contact"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              className={field}
            />
          </div>

          <div>
            <label
              htmlFor="detail-amount"
              className="block text-sm font-medium text-gray-700"
            >
              Сумма
            </label>
            <input
              id="detail-amount"
              type="number"
              min={0}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={field}
            />
          </div>

          <div>
            <label
              htmlFor="detail-note"
              className="block text-sm font-medium text-gray-700"
            >
              Заметка
            </label>
            <textarea
              id="detail-note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className={field}
              rows={3}
            />
          </div>

          <div>
            <label
              htmlFor="detail-stage"
              className="block text-sm font-medium text-gray-700"
            >
              Этап
            </label>
            <select
              id="detail-stage"
              value={stage}
              onChange={(e) => setStage(e.target.value as DealStage)}
              className={field}
            >
              {STAGES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <p className="mt-4 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}

        <div className="mt-6 flex items-center justify-between">
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="rounded-md border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
          >
            {deleting ? 'Удаление…' : 'Удалить'}
          </button>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-50"
            >
              {saving ? 'Сохранение…' : 'Сохранить'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
