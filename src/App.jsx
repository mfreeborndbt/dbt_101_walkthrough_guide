import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Workshop modules (Part 1)
import Module00Overview from './components/modules/Module00Overview'
import Module01 from './components/modules/Module01'
import Module02 from './components/modules/Module02'
import Module03Models from './components/modules/Module03Models'
import Module04Staging from './components/modules/Module04Staging'
import Module05Building from './components/modules/Module05Building'
import Module06DocsTesting from './components/modules/Module06DocsTesting'
import Module07DataProducts from './components/modules/Module07DataProducts'
import Module08AdvConfig from './components/modules/Module08AdvConfig'

// Scaling pillars (Part 2)
import OrgWideStandards from './components/scaling/OrgWideStandards'
import CostOptimization from './components/scaling/CostOptimization'
import SelfServiceDev from './components/scaling/SelfServiceDev'
import MetricStandardization from './components/scaling/MetricStandardization'
// Logo
import dbtIconTransparent from './assets/dbt-icon-transparent.png'

/* --- Navigation config --- */

const topTabs = [
  { key: 'part1', label: 'Intro & Development' },
  { key: 'part2', label: 'Scaling & Advanced Topics' },
]

const workshopModules = [
  { key: 'm00', label: '00 Overview', component: Module00Overview },
  { key: 'm01', label: '01 Architecture & setup', component: Module01 },
  { key: 'm02', label: '02 Sources', component: Module02 },
  { key: 'm03', label: '03 Models 101', component: Module03Models },
  { key: 'm04', label: '04 Staging', component: Module04Staging },
  { key: 'm05', label: '05 Building', component: Module05Building },
  { key: 'm06', label: '06 Docs & testing', component: Module06DocsTesting },
  { key: 'm07', label: '07 Data products', component: Module07DataProducts },
  { key: 'm08', label: '08 Advanced configs', component: Module08AdvConfig },
]

const scalingPillars = [
  { key: 'standards', label: 'Org-wide standards', component: OrgWideStandards },
  { key: 'cost', label: 'Cost optimization', component: CostOptimization },
  { key: 'selfservice', label: 'Self-service analytics', component: SelfServiceDev },
  { key: 'metrics', label: 'Metric standardization', component: MetricStandardization },
]

const topTabDescriptions = {
  part1: 'Hands-on fundamentals: building a governed dbt project from scratch.',
  part2: 'Scaling dbt platform across the organization with governance, cost efficiency, self-service, and metrics.',
}

const pageTransition = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, y: -6, transition: { duration: 0.3, ease: [0.4, 0, 1, 1] } },
}

/* --- Part 2 wrapper --- */

function Part2Page({ activePillar }) {
  const pillar = scalingPillars.find(p => p.key === activePillar)
  const PillarComponent = pillar?.component
  return PillarComponent ? <PillarComponent /> : null
}

/* --- Main App --- */

export default function App() {
  const [activeTab, setActiveTab] = useState('part1')
  const [activeModule, setActiveModule] = useState('m00')
  const [activePillar, setActivePillar] = useState('standards')

  const ModuleComponent = workshopModules.find(m => m.key === activeModule)?.component

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [activeTab, activeModule, activePillar])

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-emerald-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(249,115,22,0.08)_0%,_transparent_60%)]" />
        <div className="section-container py-8 md:py-10 text-center">
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <button onClick={() => { setActiveTab('part1'); setActiveModule('m00') }} className="inline-flex items-center gap-3 mb-5">
              <img src={dbtIconTransparent} alt="dbt" className="h-14" />
              <span className="text-white font-bold text-3xl md:text-4xl">dbt <span className="font-normal">fundamentals</span></span>
            </button>

            {/* Top-level tabs */}
            <div className="inline-flex bg-white/10 backdrop-blur-sm rounded-xl p-1 mb-4">
              {topTabs.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-4 md:px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeTab === tab.key
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-white/60 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.p
                key={activeTab}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
                className="text-white/40 text-sm max-w-2xl mx-auto leading-relaxed"
              >
                {topTabDescriptions[activeTab]}
              </motion.p>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* Sub-navigation for Part 1 */}
      {activeTab === 'part1' && (
        <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="section-container py-2 overflow-x-auto">
            <div className="flex gap-1 min-w-max justify-center">
              {workshopModules.map(mod => (
                <button
                  key={mod.key}
                  onClick={() => setActiveModule(mod.key)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 whitespace-nowrap ${
                    activeModule === mod.key
                      ? 'bg-gray-900 text-white shadow-sm'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {mod.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Sub-navigation for Part 2 */}
      {activeTab === 'part2' && (
        <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="section-container py-2 overflow-x-auto">
            <div className="flex gap-1 min-w-max justify-center">
              {scalingPillars.map(pillar => (
                <button
                  key={pillar.key}
                  onClick={() => setActivePillar(pillar.key)}
                  className={`px-4 py-2 rounded-lg text-xs font-medium transition-all duration-200 whitespace-nowrap ${
                    activePillar === pillar.key
                      ? 'bg-gray-900 text-white shadow-sm'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {pillar.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Page content */}
      <AnimatePresence mode="wait">
        {activeTab === 'part1' && (
          <motion.div key={`part1-${activeModule}`} {...pageTransition}>
            {ModuleComponent && <ModuleComponent />}
          </motion.div>
        )}
        {activeTab === 'part2' && (
          <motion.div key={`part2-${activePillar}`} {...pageTransition}>
            <Part2Page activePillar={activePillar} />
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}
