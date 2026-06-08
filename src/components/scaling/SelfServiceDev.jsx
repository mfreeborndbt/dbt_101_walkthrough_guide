import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import WizardSection from '../WizardSection'
import CanvasSection from '../CanvasSection'

const subtabs = [
  { key: 'wizard', label: 'Wizard' },
  { key: 'canvas', label: 'Canvas' },
]

const subtabDescs = {
  wizard: 'Guided model creation for users who want to build without writing SQL from scratch.',
  canvas: 'A visual, drag-and-drop interface for building and exploring dbt models and lineage.',
}

export default function SelfServiceDev() {
  const [activeSubtab, setActiveSubtab] = useState('wizard')

  return (
    <div className="section-container py-8">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-3">
          <h2 className="text-2xl font-bold text-gray-900">Self-service analytics</h2>
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
        {activeSubtab === 'wizard' && (
          <motion.div key="wizard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <div className="bg-white border border-gray-200/60 rounded-2xl p-6 shadow-sm">
              <WizardSection />
            </div>
          </motion.div>
        )}
        {activeSubtab === 'canvas' && (
          <motion.div key="canvas" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <div className="bg-white border border-gray-200/60 rounded-2xl p-6 shadow-sm">
              <CanvasSection />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
