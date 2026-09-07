import { useState } from 'react'
import type { FormEvent } from 'react'

export type NewDealInput = {
  client: string
  company: string
  contact: string
  amount: number | null
  note: string
}

type Props = {
  onCancel: () => void
  onSave: (input: NewDealInput) => Promise<void>
}

export default function DealForm({ onCancel, onSave }: Props) {
  const [client, setClient] = useState('')
  const [company, setCompany] = useState('')
  const [contact, setContact] = useState('')
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setSaving(true)

    try {
      await onSave({
        client,
        company,
        contact,
        amount: amount === '' ? null : Number(amount),
        note,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось сохранить сделку')
      setSaving(false)
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
        <h2 className="text-lg font-bold text-gray-900">Новая сделка</h2>

        <div className="mt-4 space-y-4">
          <div>
            <label
              htmlFor="client"
              className="block text-sm font-medium text-gray-700"
            >
              Клиент*
            </label>
            <input
              id="client"
              required
              value={client}
              onChange={(e) => setClient(e.target.value)}
              className={field}
            />
          </div>

          <div>
            <label
              htmlFor="company"
              className="block text-sm font-medium text-gray-700"
            >
              Компания
            </label>
            <input
              id="company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className={field}
            />
          </div>

          <div>
            <label
              htmlFor="contact"
              className="block text-sm font-medium text-gray-700"
            >
              Контакт
            </label>
            <input
              id="contact"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              className={field}
            />
          </div>

          <div>
            <label
              htmlFor="amount"
              className="block text-sm font-medium text-gray-700"
            >
              Сумма
            </label>
            <input
              id="amount"
              type="number"
              min={0}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={field}
            />
          </div>

          <div>
            <label
              htmlFor="note"
              className="block text-sm font-medium text-gray-700"
            >
              Заметка
            </label>
            <textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className={field}
              rows={3}
            />
          </div>
        </div>

        {error && (
          <p className="mt-4 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
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
      </form>
    </div>
  )
}
