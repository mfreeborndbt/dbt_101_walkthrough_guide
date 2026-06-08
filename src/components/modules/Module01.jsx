import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import InteractiveArchitecture from '../InteractiveArchitecture'
import EnvironmentsSection from '../EnvironmentsSection'
import ProjectArchitectureVisual from '../ProjectArchitectureVisual'
import { DevelopPhaseOnly } from '../DevelopmentWorkflow'
import TypicalWorkflow from '../TypicalWorkflow'

const subtabs = [
  { key: 'architecture', label: 'Architecture' },
  { key: 'environments', label: 'Environments' },
  { key: 'envCodebases', label: 'Environments & codebases' },
  { key: 'devWorkflow', label: 'Development workflow' },
]

const subtabDescs = {
  architecture: 'How dbt connects your git repository, transformation logic, and data platform.',
  environments: 'A dbt environment defines how and where dbt connects, writes, and runs.',
  envCodebases: 'How environments interact with a dbt project — same code, different destinations.',
  devWorkflow: 'The end-to-end development process from credentials to pull request.',
}

export default function Module01() {
  const [activeSubtab, setActiveSubtab] = useState('architecture')

  return (
    <div className="py-8">
      {/* Module header */}
      <div className="section-container mb-6">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-sm font-bold text-white bg-gray-900 px-3 py-1 rounded-full">Module 01</span>
          <h2 className="text-2xl font-bold text-gray-900">Architecture overview and setup</h2>
        </div>

        {/* Subtab navigation */}
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

      {/* Subtab content */}
      <AnimatePresence mode="wait">
        {activeSubtab === 'architecture' && (
          <motion.div key="arch" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <InteractiveArchitecture />
          </motion.div>
        )}

        {activeSubtab === 'environments' && (
          <motion.div key="env" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <div className="section-container">
              <div className="bg-white border border-gray-200/60 rounded-2xl p-6 shadow-sm">
                <EnvironmentsSection />
              </div>
            </div>
          </motion.div>
        )}

        {activeSubtab === 'envCodebases' && (
          <motion.div key="envCode" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <div className="section-container">
              <div className="bg-white border border-gray-200/60 rounded-2xl p-6 shadow-sm">
                <ProjectArchitectureVisual />
              </div>
            </div>
          </motion.div>
        )}

        {activeSubtab === 'devWorkflow' && (
          <motion.div key="devWf" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <div className="section-container space-y-6">
              {/* Overview diagram */}
              <div className="bg-white border border-gray-200/60 rounded-2xl p-6 shadow-sm">
                <TypicalWorkflow />
              </div>
              {/* Step-by-step (Develop phase only) */}
              <div className="bg-white border border-gray-200/60 rounded-2xl p-6 shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-1">Step-by-step walkthrough</h3>
                <p className="text-sm text-gray-500 mb-5">Follow the development workflow from adding credentials to opening a pull request.</p>
                <DevelopPhaseOnly />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
