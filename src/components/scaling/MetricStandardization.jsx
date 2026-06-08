import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ProblemItSolves, HowItsConfigured, HowItWorks } from '../SemanticLayer'

const slTabs = [
  { key: 'problem', label: 'Problem it solves' },
  { key: 'config', label: "How it's configured" },
  { key: 'how', label: 'How it works' },
]

const slTabDescs = {
  problem: 'Without a Semantic Layer, metrics live everywhere and nowhere. With one, every consumer gets the same answer.',
  config: 'Define your metrics alongside your models. Same repo, same review process, same CI pipeline.',
  how: 'The Semantic Layer translates simple questions into correct SQL through a governed metrics catalog.',
}

export default function MetricStandardization() {
  const [activeSlTab, setActiveSlTab] = useState('problem')

  return (
    <div className="section-container py-8">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-3">
          <h2 className="text-2xl font-bold text-gray-900">Metric standardization</h2>
        </div>

        <p className="text-sm text-gray-500 mt-2">
          A governed metrics catalog that turns questions into correct SQL for BI, apps, and AI.
        </p>

        <div className="inline-flex bg-gray-100 rounded-xl p-1 mt-4">
          {slTabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveSlTab(tab.key)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeSlTab === tab.key
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
            key={activeSlTab}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="text-sm text-gray-500 mt-3"
          >
            {slTabDescs[activeSlTab]}
          </motion.p>
        </AnimatePresence>
      </div>

      <div className="bg-white border border-gray-200/60 rounded-2xl p-6 shadow-sm">
        <AnimatePresence mode="wait">
          {activeSlTab === 'problem' && (
            <motion.div key="problem" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
              <ProblemItSolves />
            </motion.div>
          )}
          {activeSlTab === 'config' && (
            <motion.div key="config" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
              <HowItsConfigured />
            </motion.div>
          )}
          {activeSlTab === 'how' && (
            <motion.div key="how" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
              <HowItWorks />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
