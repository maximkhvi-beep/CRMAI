import { useCallback, useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from './lib/supabaseClient'
import { fetchDeals, createDeal, updateDealStage } from './lib/dealsService'
import type { Deal, DealStage } from './types/deal'
import type { NewDealInput } from './components/DealForm'
import LoginScreen from './components/LoginScreen'
import KanbanBoard from './components/KanbanBoard'
import DealForm from './components/DealForm'

function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [deals, setDeals] = useState<Deal[]>([])
  const [dealsLoading, setDealsLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  const loadDeals = useCallback(async () => {
    if (!session) return
    setDealsLoading(true)
    try {
      const data = await fetchDeals(session.user.id)
      setDeals(data)
    } catch {
      setDeals([])
    } finally {
      setDealsLoading(false)
    }
  }, [session])

  useEffect(() => {
    loadDeals()
  }, [loadDeals])

  async function handleSaveDeal(input: NewDealInput) {
    if (!session) return
    const deal = await createDeal({
      ...input,
      stage: 'lead',
      userId: session.user.id,
    })
    setDeals((prev) => [...prev, deal])
    setShowForm(false)
  }

  async function handleMoveDeal(dealId: string, stage: DealStage) {
    const previous = deals
    setDeals((prev) =>
      prev.map((d) => (d.id === dealId ? { ...d, stage } : d)),
    )
    try {
      await updateDealStage(dealId, stage)
    } catch {
      setDeals(previous)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Загрузка…</p>
      </div>
    )
  }

  if (!session) {
    return <LoginScreen />
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">Моя CRM</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">
              {session.user.email}
            </span>
            <button
              type="button"
              onClick={async () => {
                setDeals([])
                await supabase.auth.signOut()
              }}
              className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Выйти
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">Доска сделок</h2>
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
          >
            + Новая сделка
          </button>
        </div>

        {dealsLoading && (
          <p className="mb-4 text-sm text-gray-400">Загрузка сделок…</p>
        )}
        <KanbanBoard deals={deals} onMove={handleMoveDeal} />
      </main>

      {showForm && (
        <DealForm onCancel={() => setShowForm(false)} onSave={handleSaveDeal} />
      )}
    </div>
  )
}

export default App
