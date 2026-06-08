import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import TestingExplanation from '../TestingExplanation'
import SettingUpTests from '../SettingUpTests'
import DbtBuildSimulator from '../DbtBuildSimulator'

const sections = [
  { key: 'docs', label: 'Documentation' },
  { key: 'testing', label: 'Testing' },
]

const testTabs = [
  { key: 'concept', label: 'How testing works' },
  { key: 'setup', label: 'Setting up tests' },
  { key: 'simulator', label: 'See it in action' },
]

const testTabDescs = {
  concept: 'dbt tests your data at every layer so bad data never reaches downstream models.',
  setup: 'Start with simple assertions, then layer on severity, thresholds, and stored failures.',
  simulator: <>Watch <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono text-emerald-700">dbt build</code> run each model, test it, then proceed. If a test fails, downstream models are skipped.</>,
}

export default function Module06DocsTesting() {
  const [activeSection, setActiveSection] = useState('docs')
  const [activeTestTab, setActiveTestTab] = useState('concept')

  return (
    <div className="section-container py-8">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-sm font-bold text-white bg-gray-900 px-3 py-1 rounded-full">Module 06</span>
          <h2 className="text-2xl font-bold text-gray-900">Documentation and testing</h2>
        </div>

        {/* Section toggle */}
        <div className="inline-flex bg-gray-100 rounded-xl p-1 mt-2">
          {sections.map(s => (
            <button
              key={s.key}
              onClick={() => setActiveSection(s.key)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeSection === s.key
                  ? 'bg-gray-900 text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* Documentation */}
        {activeSection === 'docs' && (
          <motion.div key="docs" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* Left — YAML source */}
              <motion.div whileHover={{ y: -3, boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }} transition={{ type: 'spring', stiffness: 400, damping: 25 }} className="bg-white border border-gray-200/60 rounded-2xl shadow-sm overflow-hidden">
                <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">schema.yml</span>
                  <span className="text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded font-semibold">YAML</span>
                </div>
                <div className="p-5 font-mono text-xs leading-relaxed overflow-x-auto bg-gray-50">
                  <div><span className="text-purple-600">version</span><span className="text-gray-500">: </span><span className="text-emerald-600">2</span></div>
                  <div className="h-2" />
                  <div><span className="text-purple-600">models</span><span className="text-gray-500">:</span></div>
                  <div className="pl-4"><span className="text-gray-500">- </span><span className="text-purple-600">name</span><span className="text-gray-500">: </span><span className="text-emerald-600">fct_orders</span></div>
                  <div className="pl-6"><span className="text-purple-600">description</span><span className="text-gray-500">: </span><span className="text-emerald-600">"Order grain fact table with customer and product details"</span></div>
                  <div className="pl-6"><span className="text-purple-600">columns</span><span className="text-gray-500">:</span></div>
                  <div className="pl-8 bg-blue-50 -mx-5 px-5 py-0.5 border-l-2 border-blue-400"><span className="text-gray-500">- </span><span className="text-purple-600">name</span><span className="text-gray-500">: </span><span className="text-emerald-600">order_id</span></div>
                  <div className="pl-10 bg-blue-50 -mx-5 px-5 py-0.5 border-l-2 border-blue-400"><span className="text-purple-600">description</span><span className="text-gray-500">: </span><span className="text-emerald-600">"Primary key — unique order identifier"</span></div>
                  <div className="pl-10 bg-blue-50 -mx-5 px-5 py-0.5 border-l-2 border-blue-400"><span className="text-purple-600">data_tests</span><span className="text-gray-500">:</span></div>
                  <div className="pl-12 bg-blue-50 -mx-5 px-5 py-0.5 border-l-2 border-blue-400"><span className="text-gray-500">- </span><span className="text-emerald-600">unique</span></div>
                  <div className="pl-12 bg-blue-50 -mx-5 px-5 py-0.5 border-l-2 border-blue-400"><span className="text-gray-500">- </span><span className="text-emerald-600">not_null</span></div>
                  <div className="h-1" />
                  <div className="pl-8"><span className="text-gray-500">- </span><span className="text-purple-600">name</span><span className="text-gray-500">: </span><span className="text-emerald-600">customer_id</span></div>
                  <div className="pl-10"><span className="text-purple-600">description</span><span className="text-gray-500">: </span><span className="text-emerald-600">"Foreign key to dim_customers"</span></div>
                  <div className="pl-10"><span className="text-purple-600">data_tests</span><span className="text-gray-500">:</span></div>
                  <div className="pl-12"><span className="text-gray-500">- </span><span className="text-emerald-600">not_null</span></div>
                  <div className="pl-12"><span className="text-purple-600">relationships</span><span className="text-gray-500">:</span></div>
                  <div className="pl-14"><span className="text-purple-600">to</span><span className="text-gray-500">: </span><span className="text-emerald-600">ref('dim_customers')</span></div>
                  <div className="pl-14"><span className="text-purple-600">field</span><span className="text-gray-500">: </span><span className="text-emerald-600">customer_id</span></div>
                  <div className="h-1" />
                  <div className="pl-8"><span className="text-gray-500">- </span><span className="text-purple-600">name</span><span className="text-gray-500">: </span><span className="text-emerald-600">order_date</span></div>
                  <div className="pl-10"><span className="text-purple-600">description</span><span className="text-gray-500">: </span><span className="text-emerald-600">"Date the order was placed"</span></div>
                  <div className="h-1" />
                  <div className="pl-8"><span className="text-gray-500">- </span><span className="text-purple-600">name</span><span className="text-gray-500">: </span><span className="text-emerald-600">order_total</span></div>
                  <div className="pl-10"><span className="text-purple-600">description</span><span className="text-gray-500">: </span><span className="text-emerald-600">"Total order amount in USD"</span></div>
                </div>
              </motion.div>

              {/* Right — Catalog output */}
              <motion.div whileHover={{ y: -3, boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }} transition={{ type: 'spring', stiffness: 400, damping: 25 }} className="bg-white border border-gray-200/60 rounded-2xl shadow-sm overflow-hidden">
                <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">dbt platform catalog</span>
                  <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded font-semibold">Output</span>
                </div>
                <div className="p-5 space-y-4">
                  <div>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <span>Production</span><span>/</span><span>Models</span><span>/</span><span className="text-gray-700 font-medium">fct_orders</span>
                    </div>
                    <h4 className="text-lg font-bold text-gray-900 mt-1">fct_orders</h4>
                    <p className="text-xs text-gray-500 mt-0.5">Order grain fact table with customer and product details</p>
                    <div className="flex items-center gap-3 mt-2 text-[10px] text-gray-400">
                      <span className="bg-gray-100 px-2 py-0.5 rounded">Table</span>
                      <span>24,310 rows</span>
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-lg divide-y divide-gray-100 text-sm">
                    <div className="px-4 py-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-gray-800">order_id</span>
                          <span className="text-[9px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-semibold">PK</span>
                        </div>
                        <span className="text-[10px] text-gray-400 font-mono">NUMBER</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Primary key — unique order identifier</p>
                      <div className="flex gap-2 mt-1.5">
                        <span className="flex items-center gap-1 text-[10px] text-green-700 bg-green-50 px-1.5 py-0.5 rounded"><span>&#10003;</span> not_null</span>
                        <span className="flex items-center gap-1 text-[10px] text-green-700 bg-green-50 px-1.5 py-0.5 rounded"><span>&#10003;</span> unique</span>
                      </div>
                    </div>
                    <div className="px-4 py-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-gray-800">customer_id</span>
                          <span className="text-[9px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-semibold">FK</span>
                        </div>
                        <span className="text-[10px] text-gray-400 font-mono">NUMBER</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Foreign key to dim_customers</p>
                      <div className="flex gap-2 mt-1.5">
                        <span className="flex items-center gap-1 text-[10px] text-green-700 bg-green-50 px-1.5 py-0.5 rounded"><span>&#10003;</span> not_null</span>
                        <span className="flex items-center gap-1 text-[10px] text-green-700 bg-green-50 px-1.5 py-0.5 rounded"><span>&#10003;</span> relationships</span>
                      </div>
                    </div>
                    <div className="px-4 py-3">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-gray-800">order_date</span>
                        <span className="text-[10px] text-gray-400 font-mono">DATE</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Date the order was placed</p>
                    </div>
                    <div className="px-4 py-3">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-gray-800">order_total</span>
                        <span className="text-[10px] text-gray-400 font-mono">NUMBER</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Total order amount in USD</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Column lineage — order_id</p>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 overflow-x-auto">
                      <svg viewBox="0 0 520 60" className="w-full h-auto" style={{ minWidth: 400 }}>
                        <defs>
                          <marker id="doc-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth={5} markerHeight={5} orient="auto-start-auto">
                            <path d="M 0 0 L 10 5 L 0 10 z" fill="#9ca3af" />
                          </marker>
                        </defs>
                        <line x1="115" y1="30" x2="148" y2="30" stroke="#d1d5db" strokeWidth="1.5" markerEnd="url(#doc-arrow)" />
                        <line x1="275" y1="30" x2="308" y2="30" stroke="#d1d5db" strokeWidth="1.5" markerEnd="url(#doc-arrow)" />
                        <line x1="430" y1="30" x2="463" y2="30" stroke="#d1d5db" strokeWidth="1.5" markerEnd="url(#doc-arrow)" />
                        {[
                          { x: 5, label: 'raw_orders', sub: 'SOURCE', color: '#059669', bg: '#f0fdf4', border: '#86efac' },
                          { x: 150, label: 'stg_orders', sub: 'RENAME', color: '#6366f1', bg: '#eef2ff', border: '#a5b4fc' },
                          { x: 310, label: 'int_orders', sub: 'PASSTHROUGH', color: '#7c3aed', bg: '#f5f3ff', border: '#c4b5fd' },
                          { x: 465, label: 'fct_orders', sub: 'PASSTHROUGH', color: '#d97706', bg: '#fffbeb', border: '#fde68a' },
                        ].map(n => (
                          <g key={n.label}>
                            <rect x={n.x} y={10} width={110} height={40} rx={6} fill={n.bg} stroke={n.border} strokeWidth={1.5} />
                            <text x={n.x + 55} y={28} textAnchor="middle" fontSize={9} fontWeight={700} fill={n.color} fontFamily="ui-monospace,monospace">{n.label}</text>
                            <text x={n.x + 55} y={42} textAnchor="middle" fontSize={7} fill={n.color} fontFamily="ui-sans-serif,system-ui,sans-serif" opacity={0.7}>{n.sub}</text>
                          </g>
                        ))}
                      </svg>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Testing */}
        {activeSection === 'testing' && (
          <motion.div key="testing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <div className="mb-4">
              <div className="inline-flex bg-gray-100 rounded-xl p-1">
                {testTabs.map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTestTab(tab.key)}
                    className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      activeTestTab === tab.key
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              <div className="mt-3">
                <AnimatePresence mode="wait">
                  <motion.p key={activeTestTab} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.2 }} className="text-sm text-gray-500">
                    {testTabDescs[activeTestTab]}
                  </motion.p>
                </AnimatePresence>
              </div>
            </div>

            <div className="bg-white border border-gray-200/60 rounded-2xl p-6 shadow-sm">
              <AnimatePresence mode="wait">
                {activeTestTab === 'concept' && (
                  <motion.div key="test-concept" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
                    <TestingExplanation />
                  </motion.div>
                )}
                {activeTestTab === 'setup' && (
                  <motion.div key="test-setup" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
                    <SettingUpTests />
                  </motion.div>
                )}
                {activeTestTab === 'simulator' && (
                  <motion.div key="test-sim" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
                    <DbtBuildSimulator />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
