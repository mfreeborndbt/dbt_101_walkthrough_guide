import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import DbtMesh from '../DbtMesh'
import { QAStep3 } from '../DevelopmentWorkflow'
import ProjectEvaluatorAnimation from '../ProjectEvaluatorAnimation'

const subtabs = [
  { key: 'sharing', label: 'Sharing data products' },
  { key: 'bestpractices', label: 'Automate best practices' },
  { key: 'ci', label: 'Advanced CI' },
]

const subtabDescs = {
  sharing: 'Share governed data products across teams and projects with dbt Mesh.',
  bestpractices: 'Codify and enforce standards so every project follows the same patterns.',
  ci: 'Contract enforcement, cross-project validation, and advanced CI checks.',
}

export default function OrgWideStandards() {
  const [activeSubtab, setActiveSubtab] = useState('sharing')

  return (
    <div className="section-container py-8">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-3">
          <h2 className="text-2xl font-bold text-gray-900">Org-wide standards</h2>
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
        {activeSubtab === 'sharing' && (
          <motion.div key="sharing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <div className="bg-white border border-gray-200/60 rounded-2xl p-6 shadow-sm">
              <DbtMesh />
            </div>
          </motion.div>
        )}
        {activeSubtab === 'bestpractices' && (
          <motion.div key="bestpractices" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <div className="bg-white border border-gray-200/60 rounded-2xl p-6 shadow-sm">
              <ProjectEvaluatorAnimation />
            </div>
          </motion.div>
        )}
        {activeSubtab === 'ci' && (
          <motion.div key="ci" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <div className="bg-white border border-gray-200/60 rounded-2xl p-6 shadow-sm">
              <QAStep3 />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
