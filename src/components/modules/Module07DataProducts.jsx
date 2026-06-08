import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { IntermediateTopic, MartsTopic } from '../DataModeling'

const layers = [
  { key: 'silver', label: 'Intermediate' },
  { key: 'gold', label: 'Marts' },
]

const layerDescs = {
  silver: 'Shared transformations that multiple data products can reuse.',
  gold: 'The final, consumable data products your stakeholders query.',
}

export default function Module07DataProducts() {
  const [activeLayer, setActiveLayer] = useState('silver')

  return (
    <div className="section-container py-8">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-sm font-bold text-white bg-gray-900 px-3 py-1 rounded-full">Module 07</span>
          <h2 className="text-2xl font-bold text-gray-900">Data products</h2>
        </div>

        <div className="inline-flex bg-gray-100 rounded-xl p-1 mt-2">
          {layers.map(layer => (
            <button
              key={layer.key}
              onClick={() => setActiveLayer(layer.key)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeLayer === layer.key
                  ? 'bg-gray-900 text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {layer.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.p
            key={activeLayer}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="text-sm text-gray-500 mt-3"
          >
            {layerDescs[activeLayer]}
          </motion.p>
        </AnimatePresence>
      </div>

      <div className="bg-white border border-gray-200/60 rounded-2xl p-6 shadow-sm">
        <AnimatePresence mode="wait">
          {activeLayer === 'silver' && (
            <motion.div key="silver" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
              <IntermediateTopic />
            </motion.div>
          )}
          {activeLayer === 'gold' && (
            <motion.div key="gold" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
              <MartsTopic />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
