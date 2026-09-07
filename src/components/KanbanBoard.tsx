import type { Deal } from '../types/deal'
import { STAGES } from '../types/deal'

type Props = {
  deals: Deal[]
}

function formatAmount(amount: number | null): string {
  if (amount === null) return ''
  return new Intl.NumberFormat('ru-RU').format(amount)
}

export default function KanbanBoard({ deals }: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {STAGES.map((stage) => {
        const columnDeals = deals.filter((d) => d.stage === stage.value)
        return (
          <div
            key={stage.value}
            className="flex flex-col rounded-xl border border-gray-200 bg-gray-50 p-3"
          >
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-700">
                {stage.label}
              </h3>
              <span className="rounded-full bg-gray-200 px-2 py-0.5 text-xs font-medium text-gray-600">
                {columnDeals.length}
              </span>
            </div>

            <div className="flex flex-col gap-3">
              {columnDeals.length === 0 && (
                <p className="rounded-lg border border-dashed border-gray-300 p-3 text-center text-xs text-gray-400">
                  Пусто
                </p>
              )}
              {columnDeals.map((deal) => (
                <div
                  key={deal.id}
                  className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm"
                >
                  <p className="font-semibold text-gray-900">{deal.client}</p>
                  <p className="mt-0.5 text-sm text-gray-500">{deal.company}</p>
                  {deal.amount !== null && (
                    <p className="mt-1 text-sm font-medium text-gray-700">
                      {formatAmount(deal.amount)} ₽
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
