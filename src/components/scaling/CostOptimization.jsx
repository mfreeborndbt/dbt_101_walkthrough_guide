import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import StateAwareOrchestration from '../StateAwareOrchestration'
import DeferralAnimation from '../DeferralAnimation'
import LiveCompileDemo from '../LiveCompileDemo'
import StateModifiedAnimation from '../StateModifiedAnimation'

const subtabs = [
  { key: 'state', label: 'dbt State' },
  { key: 'compile', label: 'Live Compile' },
  { key: 'statemod', label: 'state:modified', mono: true },
  { key: 'deferral', label: 'Deferral' },
]

const subtabDescs = {
  state: 'dbt can detect which sources have new data and only rebuild what is necessary.',
  compile: 'The dbt Fusion engine catches column and syntax errors locally, before any query reaches the warehouse.',
  statemod: 'When you change a model\u2019s code, state:modified rebuilds and re-tests only what changed and what depends on it \u2014 not your whole project.',
  deferral: 'Reference production artifacts for unmodified models so dev builds only touch what changed.',
}

export default function CostOptimization() {
  const [activeSubtab, setActiveSubtab] = useState('state')

  return (
    <div className="section-container py-8">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-3">
          <h2 className="text-2xl font-bold text-gray-900">Cost optimization</h2>
        </div>

        <div className="inline-flex bg-gray-100 rounded-xl p-1 mt-2">
          {subtabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveSubtab(tab.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeSubtab === tab.key
                  ? 'bg-gray-900 text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.p
            key={activeSubtab}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="text-sm text-gray-500 mt-3"
          >
            {subtabDescs[activeSubtab]}
          </motion.p>
        </AnimatePresence>
      </div>

      <AnimatePresence mode="wait">
        {activeSubtab === 'state' && (
          <motion.div key="state" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <div className="bg-white border border-gray-200/60 rounded-2xl p-6 shadow-sm">
              <StateAwareOrchestration />
            </div>
          </motion.div>
        )}
        {activeSubtab === 'compile' && (
          <motion.div key="compile" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <div className="bg-white border border-gray-200/60 rounded-2xl p-6 shadow-sm">
              <LiveCompileDemo />
            </div>
          </motion.div>
        )}
        {activeSubtab === 'statemod' && (
          <motion.div key="statemod" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <div className="bg-white border border-gray-200/60 rounded-2xl p-6 shadow-sm">
              <StateModifiedAnimation />
            </div>
          </motion.div>
        )}
        {activeSubtab === 'deferral' && (
          <motion.div key="deferral" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <div className="bg-white border border-gray-200/60 rounded-2xl p-6 shadow-sm">
              <DeferralAnimation />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
