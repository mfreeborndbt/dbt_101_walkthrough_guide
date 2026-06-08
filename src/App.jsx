import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Modules
import Module01 from './components/modules/Module01'
import Module02 from './components/modules/Module02'
import Module03Models from './components/modules/Module03Models'
import Module04Staging from './components/modules/Module04Staging'
import Module05Building from './components/modules/Module05Building'
import Module06DocsTesting from './components/modules/Module06DocsTesting'
import Module07DataProducts from './components/modules/Module07DataProducts'
import Module08AdvConfig from './components/modules/Module08AdvConfig'

// Logo
import dbtIconTransparent from './assets/dbt-icon-transparent.png'

/* --- Navigation config --- */

const modules = [
  { key: 'm01', label: '01 Architecture & setup', component: Module01 },
  { key: 'm02', label: '02 Sources', component: Module02 },
  { key: 'm03', label: '03 Models 101', component: Module03Models },
  { key: 'm04', label: '04 Staging', component: Module04Staging },
  { key: 'm05', label: '05 Building', component: Module05Building },
  { key: 'm06', label: '06 Docs & testing', component: Module06DocsTesting },
  { key: 'm07', label: '07 Data products', component: Module07DataProducts },
  { key: 'm08', label: '08 Advanced configs', component: Module08AdvConfig },
]

const pageTransition = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, y: -6, transition: { duration: 0.3, ease: [0.4, 0, 1, 1] } },
}

/* --- Main App --- */

export default function App() {
  const [activeModule, setActiveModule] = useState('m01')

  const ModuleComponent = modules.find(m => m.key === activeModule)?.component

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [activeModule])

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-emerald-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(249,115,22,0.08)_0%,_transparent_60%)]" />
        <div className="section-container py-8 md:py-10 text-center">
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <button onClick={() => setActiveModule('m01')} className="inline-flex items-center gap-2 mb-4">
              <img src={dbtIconTransparent} alt="dbt" className="h-10" />
              <span className="text-white font-bold text-xl">dbt <span className="font-normal">fundamentals</span></span>
            </button>

            <p className="text-white/50 text-sm mb-5">An interactive guide to building a governed dbt project from scratch</p>
          </motion.div>
        </div>
      </div>

      {/* Module navigation */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="section-container py-2 overflow-x-auto">
          <div className="flex gap-1 min-w-max">
            {modules.map(mod => (
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

      {/* Module content */}
      <AnimatePresence mode="wait">
        <motion.div key={activeModule} {...pageTransition}>
          {ModuleComponent && <ModuleComponent />}
        </motion.div>
      </AnimatePresence>

    </div>
  )
}
