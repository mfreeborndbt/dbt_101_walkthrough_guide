import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const nodes = [
  { id: 'raw_customers', label: 'raw_customers', type: 'source', x: 40, y: 40 },
  { id: 'raw_geoinfo', label: 'raw_geoinfo', type: 'source', x: 40, y: 140 },
  { id: 'raw_orders', label: 'raw_orders', type: 'source', x: 40, y: 260 },
  { id: 'raw_product', label: 'raw_product', type: 'source', x: 40, y: 360 },
  { id: 'stg_customers', label: 'stg_customers', type: 'staging', x: 260, y: 40 },
  { id: 'stg_geoinfo', label: 'stg_geoinfo', type: 'staging', x: 260, y: 140 },
  { id: 'stg_orders', label: 'stg_orders', type: 'staging', x: 260, y: 260 },
  { id: 'stg_product', label: 'stg_product', type: 'staging', x: 260, y: 360 },
  { id: 'int_enriched_customer', label: 'int_enriched_customer', type: 'intermediate', x: 520, y: 80 },
  { id: 'int_enriched_orders', label: 'int_enriched_orders', type: 'intermediate', x: 520, y: 300 },
  { id: 'fct_orders', label: 'fct_orders_with_customers_details', type: 'mart', x: 790, y: 190 },
]

const edges = [
  { from: 'raw_customers', to: 'stg_customers' },
  { from: 'raw_geoinfo', to: 'stg_geoinfo' },
  { from: 'raw_orders', to: 'stg_orders' },
  { from: 'raw_product', to: 'stg_product' },
  { from: 'stg_customers', to: 'int_enriched_customer' },
  { from: 'stg_geoinfo', to: 'int_enriched_customer' },
  { from: 'stg_orders', to: 'int_enriched_orders' },
  { from: 'stg_product', to: 'int_enriched_orders' },
  { from: 'int_enriched_customer', to: 'fct_orders' },
  { from: 'int_enriched_orders', to: 'fct_orders' },
]

const MART_ID = 'fct_orders'
const UPSTREAM_IDS = nodes.filter(n => n.id !== MART_ID).map(n => n.id)

const SOURCE_IDS = ['raw_customers', 'raw_geoinfo', 'raw_orders', 'raw_product']

const noBuildSteps = [
  { ids: ['stg_customers', 'stg_geoinfo', 'stg_orders', 'stg_product'], label: 'Staging' },
  { ids: ['int_enriched_customer', 'int_enriched_orders'], label: 'Intermediate' },
  { ids: [MART_ID], label: 'Mart' },
]

const nodeWidth = 180
const nodeHeight = 36

const idleColors = { bg: '#f3f4f6', border: '#d1d5db', text: '#6b7280' }
const activeColors = { bg: '#93c5fd', border: '#3b82f6', text: '#1e3a5f' }
const completedColors = { bg: '#86efac', border: '#22c55e', text: '#166534' }
const deferredColors = { bg: '#e5e7eb', border: '#9ca3af', text: '#9ca3af' }
const sourceColors = { bg: '#dcfce7', border: '#86efac', text: '#166534' }

function getEdgePath(fromNode, toNode) {
  const from = { x: fromNode.x + nodeWidth, y: fromNode.y + nodeHeight / 2 }
  const to = { x: toNode.x, y: toNode.y + nodeHeight / 2 }
  const midX = (from.x + to.x) / 2
  return `M ${from.x} ${from.y} C ${midX} ${from.y}, ${midX} ${to.y}, ${to.x} ${to.y}`
}

export default function DeferralAnimation() {
  const [mode, setMode] = useState('without')
  const [currentStep, setCurrentStep] = useState(-1)
  const [completedSteps, setCompletedSteps] = useState([])
  const [isRunning, setIsRunning] = useState(false)
  const [terminalLines, setTerminalLines] = useState([])
  const [hasRun, setHasRun] = useState(false)
  const [deferredActive, setDeferredActive] = useState(false)
  const timeoutsRef = useRef([])

  const reset = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout)
    timeoutsRef.current = []
    setCurrentStep(-1)
    setCompletedSteps([])
    setIsRunning(false)
    setTerminalLines([])
    setHasRun(false)
    setDeferredActive(false)
  }, [])

  const switchMode = (m) => {
    reset()
    setMode(m)
  }

  const getNodeState = useCallback((nodeId) => {
    // Sources are never built by dbt — always show as source
    if (SOURCE_IDS.includes(nodeId)) return 'source'

    if (mode === 'with' && deferredActive && UPSTREAM_IDS.includes(nodeId)) return 'deferred'

    if (mode === 'without') {
      if (currentStep >= 0 && currentStep < noBuildSteps.length) {
        if (noBuildSteps[currentStep].ids.includes(nodeId)) return 'active'
      }
      for (const stepIdx of completedSteps) {
        if (noBuildSteps[stepIdx].ids.includes(nodeId)) return 'completed'
      }
    } else {
      // "with" mode: only the mart builds
      if (currentStep === 0 && nodeId === MART_ID) return 'active'
      if (completedSteps.includes(0) && nodeId === MART_ID) return 'completed'
    }

    return 'idle'
  }, [mode, currentStep, completedSteps, deferredActive])

  const runWithout = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout)
    timeoutsRef.current = []
    setIsRunning(true)
    setHasRun(true)
    setCurrentStep(-1)
    setCompletedSteps([])
    setTerminalLines([{ text: '$ dbt run', type: 'command' }])

    const stepDuration = 1800
    const completionDelay = 1200

    noBuildSteps.forEach((step, i) => {
      const t1 = setTimeout(() => {
        setCurrentStep(i)
        if (i === 0) {
          setTerminalLines(prev => [...prev, { text: 'Concurrency: 4 threads (target="dev")', type: 'info' }, { text: '', type: 'blank' }])
        }
        const lines = step.ids.map(id => ({ text: `  Building dbt_user1.${id} (dev)...`, type: 'run' }))
        setTerminalLines(prev => [...prev, ...lines])
      }, i * stepDuration)
      timeoutsRef.current.push(t1)

      const t2 = setTimeout(() => {
        setCompletedSteps(prev => [...prev, i])
        const lines = step.ids.map(id => ({ text: `  OK dbt_user1.${id}`, type: 'ok' }))
        setTerminalLines(prev => [...prev, ...lines])
      }, i * stepDuration + completionDelay)
      timeoutsRef.current.push(t2)
    })

    const t3 = setTimeout(() => {
      setCurrentStep(-1)
      setIsRunning(false)
      setTerminalLines(prev => [...prev, { text: '', type: 'blank' }, { text: 'Done. Built 7 models in dbt_user1. All upstream rebuilt in dev.', type: 'warn' }])
    }, noBuildSteps.length * stepDuration)
    timeoutsRef.current.push(t3)
  }, [])

  const runWith = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout)
    timeoutsRef.current = []
    setIsRunning(true)
    setHasRun(true)
    setCurrentStep(-1)
    setCompletedSteps([])
    setDeferredActive(false)
    setTerminalLines([{ text: '$ dbt run --select fct_orders_with_customers_details --defer', type: 'command' }])

    // Step 1: mark upstream as deferred
    const t1 = setTimeout(() => {
      setDeferredActive(true)
      setTerminalLines(prev => [...prev,
        { text: 'Deferring upstream models to production...', type: 'info' },
        { text: '  int_enriched_customer -> PROD.analytics.int_enriched_customer', type: 'deferred' },
        { text: '  int_enriched_orders -> PROD.analytics.int_enriched_orders', type: 'deferred' },
        { text: '', type: 'blank' },
      ])
    }, 800)
    timeoutsRef.current.push(t1)

    // Step 2: build the mart
    const t2 = setTimeout(() => {
      setCurrentStep(0)
      setTerminalLines(prev => [...prev, { text: '  Building dbt_user1.fct_orders_with_customers_details — inputs from prod', type: 'run' }])
    }, 2200)
    timeoutsRef.current.push(t2)

    // Step 3: complete
    const t3 = setTimeout(() => {
      setCompletedSteps([0])
      setTerminalLines(prev => [...prev, { text: '  OK dbt_user1.fct_orders_with_customers_details', type: 'ok' }])
    }, 3400)
    timeoutsRef.current.push(t3)

    // Finish
    const t4 = setTimeout(() => {
      setCurrentStep(-1)
      setIsRunning(false)
      setTerminalLines(prev => [...prev, { text: '', type: 'blank' }, { text: 'Done. Built 1 model in dbt_user1. Upstream read from prod.', type: 'success' }])
    }, 4200)
    timeoutsRef.current.push(t4)
  }, [])

  const runAnimation = mode === 'without' ? runWithout : runWith

  function getColors(nodeId) {
    const state = getNodeState(nodeId)
    if (state === 'deferred') return deferredColors
    if (state === 'active') return activeColors
    if (state === 'completed') return completedColors
    if (state === 'source') return sourceColors
    return idleColors
  }

  function getEdgeState(edge) {
    const fromState = getNodeState(edge.from)
    const toState = getNodeState(edge.to)
    if (fromState === 'deferred' && toState !== 'idle') return 'deferred'
    if (toState === 'active') return 'active'
    if (fromState === 'completed' && (toState === 'completed' || toState === 'active')) return 'completed'
    return 'idle'
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="inline-flex bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => switchMode('without')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                mode === 'without' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Without deferral
            </button>
            <button
              onClick={() => switchMode('with')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                mode === 'with' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              With deferral
            </button>
          </div>
        </div>
        <button
          onClick={runAnimation}
          disabled={isRunning}
          className={`px-5 py-2 rounded-lg font-medium text-sm transition-all duration-150 ${
            isRunning
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-gray-900 text-white hover:bg-gray-800'
          }`}
        >
          {isRunning ? 'Running...' : hasRun ? 'Run again' : 'Run simulation'}
        </button>
      </div>

      {/* DAG */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-4 overflow-x-auto">
        <svg width="1060" height="430" viewBox="0 0 1060 430" className="w-full h-auto">
          {/* Edges */}
          {edges.map((edge) => {
            const fromNode = nodes.find(n => n.id === edge.from)
            const toNode = nodes.find(n => n.id === edge.to)
            const path = getEdgePath(fromNode, toNode)
            const state = getEdgeState(edge)
            return (
              <motion.path
                key={`${edge.from}-${edge.to}`}
                d={path}
                fill="none"
                strokeLinecap="round"
                animate={{
                  stroke: state === 'active' ? '#3b82f6' : state === 'completed' ? '#22c55e' : state === 'deferred' ? '#9ca3af' : '#d1d5db',
                  strokeWidth: state === 'active' ? 2.5 : 2,
                }}
                strokeDasharray={state === 'deferred' ? '6 4' : 'none'}
                transition={{ duration: 0.4 }}
              />
            )
          })}

          {/* Edge arrows */}
          {edges.map((edge) => {
            const toNode = nodes.find(n => n.id === edge.to)
            const state = getEdgeState(edge)
            return (
              <motion.circle
                key={`arrow-${edge.from}-${edge.to}`}
                cx={toNode.x - 4}
                cy={toNode.y + nodeHeight / 2}
                r={3}
                animate={{
                  fill: state === 'active' ? '#3b82f6' : state === 'completed' ? '#22c55e' : state === 'deferred' ? '#9ca3af' : '#d1d5db',
                }}
                transition={{ duration: 0.4 }}
              />
            )
          })}

          {/* "from prod" annotation on edges feeding the mart when deferred */}
          {mode === 'with' && deferredActive && (
            <text x={735} y={175} fontSize={9} fill="#6b7280" fontWeight={600} fontStyle="italic" textAnchor="middle">
              inputs read from prod
            </text>
          )}

          {/* Nodes */}
          {nodes.map((node) => {
            const state = getNodeState(node.id)
            const colors = getColors(node.id)
            const isTarget = node.id === MART_ID

            return (
              <motion.g key={node.id}>
                {/* Target marker */}
                {isTarget && (
                  <rect
                    x={node.x - 3}
                    y={node.y - 3}
                    width={nodeWidth + 6}
                    height={nodeHeight + 6}
                    rx={10}
                    fill="none"
                    stroke="#F97316"
                    strokeWidth={2}
                    strokeDasharray="4 3"
                    opacity={0.5}
                  />
                )}

                <motion.rect
                  x={node.x}
                  y={node.y}
                  width={nodeWidth}
                  height={nodeHeight}
                  rx={8}
                  animate={{ fill: colors.bg, stroke: colors.border }}
                  strokeWidth={state === 'active' ? 2.5 : 1.5}
                  transition={{ duration: 0.4 }}
                />

                {/* Active pulse */}
                {state === 'active' && (
                  <motion.rect
                    x={node.x} y={node.y} width={nodeWidth} height={nodeHeight} rx={8}
                    fill="none" stroke={colors.border} strokeWidth={1}
                    initial={{ opacity: 0.6 }}
                    animate={{ opacity: [0.6, 0, 0.6] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                )}

                {/* Completed checkmark */}
                {state === 'completed' && (
                  <>
                    <motion.circle cx={node.x + nodeWidth - 12} cy={node.y + 12} r={6} fill="#22c55e"
                      initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 400, damping: 15 }} />
                    <motion.path d={`M ${node.x + nodeWidth - 15} ${node.y + 12} l 3 3 l 5 -5`}
                      stroke="white" strokeWidth={1.5} fill="none" strokeLinecap="round" strokeLinejoin="round"
                      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.1, duration: 0.3 }} />
                  </>
                )}

                {/* PROD badge for deferred nodes */}
                {state === 'deferred' && (
                  <g>
                    <rect x={node.x + nodeWidth - 38} y={node.y + 2} width={34} height={14} rx={3} fill="#6b7280" />
                    <text x={node.x + nodeWidth - 21} y={node.y + 12} textAnchor="middle" fontSize={8} fontWeight={700} fill="white" fontFamily="ui-sans-serif,system-ui,sans-serif">
                      PROD
                    </text>
                  </g>
                )}

                {/* dbt_user1 badge for dev-built nodes */}
                {(state === 'active' || state === 'completed') && !SOURCE_IDS.includes(node.id) && (
                  <g>
                    <rect x={node.x + nodeWidth - 56} y={node.y + 2} width={52} height={14} rx={3} fill="#1e40af" />
                    <text x={node.x + nodeWidth - 30} y={node.y + 12} textAnchor="middle" fontSize={7} fontWeight={700} fill="white" fontFamily="ui-sans-serif,system-ui,sans-serif">
                      dbt_user1
                    </text>
                  </g>
                )}

                <text
                  x={node.x + nodeWidth / 2}
                  y={node.y + nodeHeight / 2 + 1}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={node.id === MART_ID ? 9 : 11}
                  fontFamily="ui-monospace, monospace"
                  fontWeight={600}
                  fill={colors.text}
                >
                  {node.label}
                </text>
              </motion.g>
            )
          })}

          {/* Column labels */}
          <text x={130} y={420} textAnchor="middle" fontSize={10} fill="#9ca3af" fontWeight={500}>Sources</text>
          <text x={350} y={420} textAnchor="middle" fontSize={10} fill="#9ca3af" fontWeight={500}>Staging</text>
          <text x={610} y={420} textAnchor="middle" fontSize={10} fill="#9ca3af" fontWeight={500}>Intermediate</text>
          <text x={880} y={420} textAnchor="middle" fontSize={10} fill="#9ca3af" fontWeight={500}>Marts</text>
        </svg>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mb-4 text-xs text-gray-500">
        <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded" style={{ background: '#93c5fd', border: '1.5px solid #3b82f6' }} /> Building (dev)</div>
        <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded" style={{ background: '#86efac', border: '1.5px solid #22c55e' }} /> Complete (dev)</div>
        <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded" style={{ background: '#e5e7eb', border: '1.5px solid #9ca3af' }} /> Deferred (read from prod)</div>
        <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded border-2 border-dashed" style={{ borderColor: '#F97316' }} /> Target model</div>
      </div>

      {/* Console log */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 font-mono text-xs max-h-48 overflow-y-auto">
        <AnimatePresence>
          {terminalLines.map((line, i) => (
            <motion.div
              key={`line-${i}`}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.15 }}
              className={
                line.type === 'command' ? 'text-emerald-700 font-bold' :
                line.type === 'info' ? 'text-gray-400' :
                line.type === 'run' ? 'text-blue-600' :
                line.type === 'ok' ? 'text-emerald-600' :
                line.type === 'success' ? 'text-emerald-700 font-bold' :
                line.type === 'warn' ? 'text-amber-600 font-bold' :
                line.type === 'deferred' ? 'text-gray-500 italic' :
                ''
              }
            >
              {line.text || '\u00A0'}
            </motion.div>
          ))}
        </AnimatePresence>
        {terminalLines.length === 0 && (
          <div className="text-gray-400">Click "Run simulation" to compare...</div>
        )}
      </div>
    </div>
  )
}
