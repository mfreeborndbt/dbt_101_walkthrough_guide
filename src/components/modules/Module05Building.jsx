import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PreDbtOrchestration from '../PreDbtOrchestration'
import HowDbtWorks from '../HowDbtWorks'
import DbtRunAnimation from '../DbtRunAnimation'

const tabs = [
  { key: 'problem', label: 'Manual orchestration' },
  { key: 'how', label: 'How dbt works' },
  { key: 'solution', label: 'How dbt helps' },
]

const tabDescs = {
  problem: 'Without dbt, you have to manually declare the order every model runs in.',
  how: <>
    <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono text-emerald-700">ref()</code> replaces hardcoded table names and tells dbt about dependencies between models.
  </>,
  solution: <>dbt reads <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono text-emerald-700">ref()</code> functions and automatically determines the correct build order.</>,
}

export default function Module05Building() {
  const [activeTab, setActiveTab] = useState('problem')

  return (
    <div className="section-container py-8">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-sm font-bold text-white bg-gray-900 px-3 py-1 rounded-full">Module 05</span>
          <h2 className="text-2xl font-bold text-gray-900">Dependency management</h2>
        </div>

        <div className="inline-flex bg-gray-100 rounded-xl p-1 mt-2">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === tab.key
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
            <motion.p key={activeTab} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.2 }} className="text-sm text-gray-500">
              {tabDescs[activeTab]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      <div className="bg-white border border-gray-200/60 rounded-2xl p-6 shadow-sm">
        <AnimatePresence mode="wait">
          {activeTab === 'problem' && (
            <motion.div key="problem" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
              <PreDbtOrchestration />
            </motion.div>
          )}
          {activeTab === 'how' && (
            <motion.div key="how" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
              <HowDbtWorks />
            </motion.div>
          )}
          {activeTab === 'solution' && (
            <motion.div key="solution" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
              <DbtRunAnimation />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
