import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const tests = [
  {
    name: 'unique',
    desc: 'Finds duplicate values in a column',
    sql: `select
  order_id,
  count(*) as duplicates
from analytics.stg_orders
group by order_id
having count(*) > 1`,
    passResult: { columns: ['order_id', 'duplicates'], rows: [] },
    failResult: {
      columns: ['order_id', 'duplicates'],
      rows: [
        ['1001', '3'],
        ['2047', '2'],
      ],
    },
  },
  {
    name: 'not_null',
    desc: 'Finds rows where a column is null',
    sql: `select order_id, customer_id
from analytics.stg_orders
where customer_id is null`,
    passResult: { columns: ['order_id', 'customer_id'], rows: [] },
    failResult: {
      columns: ['order_id', 'customer_id'],
      rows: [
        ['1042', 'NULL'],
        ['1087', 'NULL'],
        ['1103', 'NULL'],
      ],
    },
  },
  {
    name: 'accepted_values',
    desc: 'Finds values not in an approved list',
    sql: `select status, count(*) as occurrences
from analytics.stg_orders
where status not in (
  'placed', 'shipped', 'returned'
)
group by status`,
    passResult: { columns: ['status', 'occurrences'], rows: [] },
    failResult: {
      columns: ['status', 'occurrences'],
      rows: [
        ['cancelled', '14'],
        ['pending', '7'],
      ],
    },
  },
  {
    name: 'relationships',
    desc: 'Finds foreign keys that don\'t exist in the parent table',
    sql: `select o.order_id, o.customer_id
from analytics.stg_orders o
left join analytics.stg_customers c
  on o.customer_id = c.customer_id
where c.customer_id is null`,
    passResult: { columns: ['order_id', 'customer_id'], rows: [] },
    failResult: {
      columns: ['order_id', 'customer_id'],
      rows: [
        ['3012', '9999'],
        ['3045', '8888'],
      ],
    },
  },
]

function ResultTable({ result, isFail }) {
  const isEmpty = result.rows.length === 0
  return (
    <div className={`rounded-lg border overflow-hidden ${isFail ? 'border-red-200' : 'border-emerald-200'}`}>
      <table className="w-full text-xs font-mono">
        <thead>
          <tr className={isFail ? 'bg-red-50' : 'bg-emerald-50'}>
            {result.columns.map(col => (
              <th key={col} className={`px-3 py-1.5 text-left font-semibold ${isFail ? 'text-red-800' : 'text-emerald-800'}`}>
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isEmpty ? (
            <tr>
              <td colSpan={result.columns.length} className="px-3 py-3 text-center text-emerald-600 bg-emerald-50/30">
                0 rows returned, test passes
              </td>
            </tr>
          ) : (
            result.rows.map((row, i) => (
              <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-red-50/30'}>
                {row.map((cell, j) => (
                  <td key={j} className={`px-3 py-1.5 ${cell === 'NULL' ? 'text-red-400 italic' : 'text-gray-700'}`}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
      {!isEmpty && (
        <div className="bg-red-50 px-3 py-1.5 text-[10px] text-red-600 border-t border-red-200">
          {result.rows.length} row{result.rows.length > 1 ? 's' : ''} returned, test fails
        </div>
      )}
    </div>
  )
}

export default function TestingExplanation() {
  const [activeTest, setActiveTest] = useState(0)
  const test = tests[activeTest]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left: concept + test selector */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-3">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          Tests Are Just SQL Queries
        </h3>
        <p className="text-sm text-gray-600 leading-relaxed mb-4">
          Every dbt test compiles down to a <code className="bg-gray-100 px-1 py-0.5 rounded text-xs font-mono text-emerald-700">SELECT</code> statement. If the query returns rows, those rows are failures. Zero rows means the test passes.
        </p>

        <div className="space-y-1.5">
          {tests.map((t, i) => (
            <button
              key={t.name}
              onClick={() => setActiveTest(i)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-150 ${
                activeTest === i
                  ? 'bg-emerald-50 border border-emerald-200 ring-1 ring-emerald-200'
                  : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
              }`}
            >
              <code className={`text-xs font-mono font-semibold px-2 py-0.5 rounded shrink-0 ${
                activeTest === i ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'
              }`}>
                {t.name}
              </code>
              <span className="text-xs text-gray-600">{t.desc}</span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Right: SQL + results */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTest}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            <div>
              <div className="text-xs font-medium text-gray-500 mb-1.5 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                Compiled SQL
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-4 font-mono text-[11px] leading-relaxed">
                <pre className="text-gray-700">{test.sql}</pre>
              </div>
            </div>

            <div>
              <div className="text-xs font-medium text-emerald-700 mb-1.5 flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Pass: no rows returned
              </div>
              <ResultTable result={test.passResult} isFail={false} />
            </div>

            <div>
              <div className="text-xs font-medium text-red-700 mb-1.5 flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
                Fail: rows returned are failures
              </div>
              <ResultTable result={test.failResult} isFail={true} />
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
