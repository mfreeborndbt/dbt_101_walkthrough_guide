import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence, Reorder } from 'framer-motion'
import { Layers, Workflow, Server, Users, CloudDownload, BarChart3 } from 'lucide-react'
import dbtIcon from '../../assets/dbt-icon-transparent.png'

// Platform logos
import snowflakeLogo from '../../assets/platforms/Snowflake-Symbol.png'
import databricksLogo from '../../assets/platforms/Databricks-Symbol.png'
import bigqueryLogo from '../../assets/platforms/google_bigquery_logo_icon_168150.webp'
import redshiftLogo from '../../assets/platforms/Amazon-Redshift-Logo.svg.png'
import fabricLogo from '../../assets/platforms/Fabric_256.svg'
import starburstLogo from '../../assets/platforms/images.png'
import postgresLogo from '../../assets/platforms/Postgresql_elephant.svg.png'

/* ── Stage definitions ── */
const stages = [
  { key: 'baseline', label: 'Baseline', caption: 'A data platform with raw data flowing in and consumers waiting downstream, but a gap in the middle.' },
  { key: 'transform', label: 'Transform', caption: 'dbt fills the gap. The transformation layer that turns raw data into trusted, usable data.' },
  { key: 'control', label: 'Control plane', caption: "dbt isn't just transformation. It powers the control plane: orchestration, observability, cost, catalog, and semantics." },
  { key: 'personas', label: 'All personas', caption: "And it's built for everyone. Engineers, AI agents, and business stakeholders alike." },
]

/* ── Canonical platform order ── */
const CANONICAL_PLATFORMS = [
  { id: 'fabric', name: 'Fabric', logo: fabricLogo },
  { id: 'redshift', name: 'Redshift', logo: redshiftLogo },
  { id: 'databricks', name: 'Databricks', logo: databricksLogo },
  { id: 'snowflake', name: 'Snowflake', logo: snowflakeLogo },
  { id: 'bigquery', name: 'BigQuery', logo: bigqueryLogo },
  { id: 'starburst', name: 'Starburst', logo: starburstLogo },
  { id: 'postgres', name: 'Postgres', logo: postgresLogo },
]

const metadataItems = ['Orchestration', 'Observability', 'Cost Management', 'Catalog', 'Semantics']
const personaItems = ['Data / analytics engineers', 'AI agents', 'Analysts / business stakeholders']

const DRAG_THRESHOLD = 5 // px

/* ── PlatformCard ── */
function PlatformCard({ platform, cardState, onClickToggle, isDragging }) {
  const pointerStart = useRef(null)
  const didDrag = useRef(false)

  const glowing = cardState === 1
  const emphasized = cardState === 2

  return (
    <Reorder.Item
      value={platform}
      dragListener={true}
      onPointerDown={(e) => {
        pointerStart.current = { x: e.clientX, y: e.clientY }
        didDrag.current = false
      }}
      onPointerMove={(e) => {
        if (!pointerStart.current) return
        const dx = Math.abs(e.clientX - pointerStart.current.x)
        const dy = Math.abs(e.clientY - pointerStart.current.y)
        if (dx > DRAG_THRESHOLD || dy > DRAG_THRESHOLD) {
          didDrag.current = true
        }
      }}
      onPointerUp={() => {
        if (!didDrag.current) {
          onClickToggle()
        }
        pointerStart.current = null
        didDrag.current = false
      }}
      whileDrag={{ scale: 1.05, zIndex: 50, boxShadow: '0 12px 32px rgba(0,0,0,0.3)' }}
      layout
      transition={{ type: 'spring', stiffness: 300, damping: 28 }}
      className="relative cursor-grab active:cursor-grabbing select-none"
      style={{ zIndex: emphasized ? 10 : glowing ? 5 : 1, touchAction: 'none' }}
    >
      <motion.div
        animate={{
          scale: emphasized ? 1.08 : 1,
          boxShadow: emphasized
            ? '0 8px 24px rgba(249,115,22,0.35)'
            : glowing
            ? '0 4px 16px rgba(249,115,22,0.2)'
            : '0 1px 3px rgba(0,0,0,0.1)',
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 24 }}
        className={`
          flex flex-col items-center gap-2 px-4 py-3 rounded-xl border
          bg-white/10 backdrop-blur-sm
          transition-colors duration-200
          motion-reduce:transition-none
          ${glowing
            ? 'border-orange-400/80 ring-2 ring-orange-400/40'
            : emphasized
            ? 'border-orange-500 ring-2 ring-orange-500/50'
            : 'border-white/15 hover:border-white/30'
          }
        `}
      >
        {/* Glow effect overlay */}
        {glowing && (
          <motion.div
            className="absolute inset-0 rounded-xl pointer-events-none motion-reduce:hidden"
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              boxShadow: '0 0 12px 2px rgba(249,115,22,0.3), inset 0 0 8px rgba(249,115,22,0.1)',
            }}
          />
        )}

        {/* Logo */}
        <div className="w-12 h-12 flex items-center justify-center shrink-0">
          <img
            src={platform.logo}
            alt={platform.name}
            className="w-12 h-12 object-contain"
            style={{
              filter: 'drop-shadow(0 0 1px rgba(255,255,255,.9)) drop-shadow(0 0 3px rgba(255,255,255,.5))',
            }}
            draggable={false}
          />
        </div>

        {/* Label */}
        <span className="text-[11px] font-semibold text-gray-300 whitespace-nowrap">
          {platform.name}
        </span>
      </motion.div>
    </Reorder.Item>
  )
}

/* ── Main Component ── */
export default function Module00Overview() {
  const [stage, setStage] = useState(0)
  const [platforms, setPlatforms] = useState(CANONICAL_PLATFORMS)
  const [cardStates, setCardStates] = useState({}) // id -> 0|1|2

  const goTo = useCallback((s) => setStage(Math.max(0, Math.min(3, s))), [])

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'ArrowRight') goTo(stage + 1)
      if (e.key === 'ArrowLeft') goTo(stage - 1)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [stage, goTo])

  const handleCardClick = (id) => {
    const currentState = cardStates[id] || 0
    const nextState = (currentState + 1) % 3
    setCardStates(prev => ({ ...prev, [id]: nextState }))
  }

  return (
    <div className="py-8">
      {/* Module header */}
      <div className="section-container mb-6">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-sm font-bold text-white bg-gray-900 px-3 py-1 rounded-full">Overview</span>
          <h2 className="text-2xl font-bold text-gray-900">The data & AI control plane</h2>
        </div>
      </div>

      <div className="section-container">
        {/* Diagram container */}
        <div className="relative rounded-2xl overflow-hidden" style={{ background: 'linear-gradient(160deg, #fff7ed 0%, #fef3e2 15%, #faf5ff 40%, #eef2ff 65%, #f0fdf4 100%)' }}>
          <div className="p-3 md:p-4">
            <motion.div layout className="relative" transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}>

              {/* Orange spine */}
              <motion.div
                className="absolute left-1/2 -translate-x-1/2 z-0 pointer-events-none"
                style={{ width: 6, borderRadius: 3, background: 'linear-gradient(180deg, #F97316, #ea580c)' }}
                initial={false}
                animate={{
                  opacity: stage >= 1 ? 1 : 0,
                  top: stage >= 2 ? 0 : '40%',
                  bottom: 0,
                }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              />

              <motion.div layout className="relative z-10 flex flex-col gap-0 motion-reduce:transition-none" transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}>

                {/* Unified Metadata (stage >= 2) */}
                <AnimatePresence initial={false}>
                  {stage >= 2 && (
                    <motion.div
                      layout
                      key="metadata"
                      initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                      animate={{ opacity: 1, height: 'auto', marginBottom: 8 }}
                      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div className="rounded-2xl overflow-hidden shadow-lg" style={{ background: 'linear-gradient(135deg, #fb923c 0%, #F97316 40%, #ea580c 100%)' }}>
                        <div className="px-6 md:px-8 pt-3 pb-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Layers size={16} strokeWidth={1.5} className="text-white/70" />
                            <span className="font-bold text-white/60 text-[10px] uppercase tracking-wider">Unified Metadata</span>
                            <span className="ml-1"><img src={dbtIcon} alt="dbt" className="h-4 opacity-80" /></span>
                          </div>
                        </div>
                        <div className="mx-3 mb-2 rounded-xl bg-[#fef7ed]/95 backdrop-blur-sm p-3">
                          <div className="flex flex-wrap gap-2 justify-between px-4 md:px-6">
                            {metadataItems.map(item => (
                              <motion.span
                                key={item}
                                whileHover={{ y: -2, boxShadow: '0 4px 12px rgba(249,115,22,0.15)' }}
                                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                                className="px-3 py-2 bg-white border border-orange-200 rounded-lg text-sm font-semibold text-gray-800 flex-1 min-w-[110px] text-center cursor-default shadow-sm"
                              >
                                {item}
                              </motion.span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Personas (stage >= 3) */}
                <AnimatePresence initial={false}>
                  {stage >= 3 && (
                    <motion.div
                      layout
                      key="personas"
                      initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                      animate={{ opacity: 1, height: 'auto', marginBottom: 8 }}
                      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div className="rounded-2xl p-3 shadow-lg" style={{ background: 'linear-gradient(135deg, #8b5cf6, #6366f1, #7c3aed)' }}>
                        <div className="px-4 md:px-6">
                          <p className="text-white/60 font-bold text-[10px] mb-2 uppercase tracking-wider flex items-center gap-1.5">
                            <Users size={14} strokeWidth={1.5} className="text-white/50" /> Personas
                          </p>
                          <div className="flex flex-wrap gap-2.5 justify-between">
                            {personaItems.map(item => (
                              <motion.span
                                key={item}
                                whileHover={{ y: -2, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
                                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                                className="px-4 py-2 bg-white/20 border border-white/30 text-white rounded-lg text-sm font-semibold flex-1 min-w-[180px] text-center backdrop-blur-sm cursor-default"
                              >
                                {item}
                              </motion.span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Pipeline lane (always visible) */}
                <motion.div layout style={{ marginBottom: 8 }} transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}>
                  <div className="rounded-2xl border border-orange-100 p-3 shadow-sm" style={{ background: 'linear-gradient(135deg, #fffbf5, #fff8f0, #fefcfb)' }}>
                    <div className="px-4 md:px-6">
                      <p className="text-[10px] font-semibold text-orange-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <Workflow size={14} strokeWidth={1.5} className="text-orange-300" /> Pipeline
                      </p>
                      <div className="flex items-center gap-0">
                        {/* Ingestion */}
                        <motion.div
                          whileHover={{ scale: 1.06, boxShadow: '0 6px 20px rgba(99,102,241,0.2)' }}
                          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                          className="flex items-center justify-center gap-2 px-5 py-3 bg-white border border-indigo-100 rounded-xl text-sm font-semibold text-gray-800 shadow-sm cursor-default shrink-0 min-w-[180px]"
                        >
                          <CloudDownload size={16} strokeWidth={1.5} className="text-indigo-400" />
                          Ingestion
                        </motion.div>

                        {/* Connector */}
                        <div className="flex-1 flex items-center min-w-[60px]">
                          <div className="flex-1 h-[2px] rounded-full" style={{ background: 'linear-gradient(90deg, #a5b4fc, #F97316)' }} />
                          <div className="w-0 h-0 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-l-[8px] border-l-[#F97316] shrink-0" />
                        </div>

                        {/* Transformation / Gap */}
                        <AnimatePresence mode="wait">
                          {stage >= 1 ? (
                            <motion.div
                              key="transform-box"
                              initial={{ opacity: 0, scale: 0.85 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.85 }}
                              whileHover={{ scale: 1.06, boxShadow: '0 6px 20px rgba(249,115,22,0.2)' }}
                              transition={{ duration: 0.5, type: 'spring', stiffness: 160, damping: 16 }}
                              className="relative cursor-default shrink-0"
                            >
                              <div className="absolute -inset-1.5 bg-[#F97316]/15 rounded-2xl blur-lg" />
                              <div className="relative px-7 py-4 bg-gradient-to-br from-orange-50 to-white border-2 border-[#F97316] rounded-xl shadow-lg text-center">
                                <p className="text-base font-bold text-gray-900">Transformation</p>
                                <div className="flex items-center justify-center gap-1.5 mt-1">
                                  <img src={dbtIcon} alt="" className="h-4" />
                                  <p className="text-sm text-[#F97316] font-bold">dbt Fusion engine</p>
                                </div>
                              </div>
                            </motion.div>
                          ) : (
                            <motion.div
                              key="gap"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.4 }}
                              whileHover={{ scale: 1.06, borderColor: 'rgba(249,115,22,0.6)', boxShadow: '0 6px 20px rgba(249,115,22,0.2)' }}
                              className="px-10 py-5 border-2 border-dashed border-orange-200 rounded-xl text-center min-w-[170px] shrink-0 bg-white/50 cursor-pointer"
                            >
                              <p className="text-xl font-bold text-orange-200">?</p>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Connector */}
                        <div className="flex-1 flex items-center min-w-[60px]">
                          <div className="flex-1 h-[2px] rounded-full" style={{ background: 'linear-gradient(90deg, #F97316, #86efac)' }} />
                          <div className="w-0 h-0 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-l-[8px] border-l-[#22c55e] shrink-0" />
                        </div>

                        {/* BI */}
                        <motion.div
                          whileHover={{ scale: 1.06, boxShadow: '0 6px 20px rgba(34,197,94,0.2)' }}
                          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                          className="flex items-center justify-center gap-2 px-5 py-3 bg-white border border-green-100 rounded-xl text-sm font-semibold text-gray-800 shadow-sm cursor-default shrink-0 min-w-[180px]"
                        >
                          BI / Analytics / AI
                          <BarChart3 size={16} strokeWidth={1.5} className="text-green-400" />
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Data Platform lane (always visible) */}
                <motion.div layout transition={{ duration: 0.3 }}>
                  <div className="rounded-2xl p-3 shadow-lg" style={{ background: 'linear-gradient(135deg, #0f172a, #1e1b4b, #1e293b)' }}>
                    <div className="px-4 md:px-6">
                      <p className="text-white/50 font-bold text-[10px] mb-2 uppercase tracking-wider flex items-center gap-1.5">
                        <Server size={14} strokeWidth={1.5} className="text-indigo-400/60" /> Data platform
                      </p>

                      <Reorder.Group
                        axis="x"
                        values={platforms}
                        onReorder={setPlatforms}
                        className="flex flex-wrap gap-3 justify-center"
                      >
                        {platforms.map(p => (
                          <PlatformCard
                            key={p.id}
                            platform={p}
                            cardState={cardStates[p.id] || 0}
                            onClickToggle={() => handleCardClick(p.id)}
                          />
                        ))}
                      </Reorder.Group>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Stage toggle + progress dots */}
        <div className="mt-4 flex flex-col items-center gap-2">
          <div className="flex gap-1.5">
            {stages.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-500 motion-reduce:transition-none ${
                  i <= stage ? 'bg-gray-900 w-7' : 'bg-gray-200 w-3'
                }`}
              />
            ))}
          </div>

          <div className="inline-flex bg-gray-100 rounded-xl p-1">
            {stages.map((s, i) => (
              <button
                key={s.key}
                onClick={() => setStage(i)}
                className={`px-4 md:px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  stage === i
                    ? 'bg-gray-900 text-white shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

        </div>
      </div>
    </div>
  )
}
