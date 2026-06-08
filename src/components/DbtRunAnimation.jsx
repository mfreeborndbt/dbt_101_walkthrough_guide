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
  { id: 'fct_orders_with_customers_details', label: 'fct_orders_with_customers_details', type: 'mart', x: 790, y: 190 },
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
  { from: 'int_enriched_customer', to: 'fct_orders_with_customers_details' },
  { from: 'int_enriched_orders', to: 'fct_orders_with_customers_details' },
]

const buildSteps = [
  { ids: ['raw_customers', 'raw_geoinfo', 'raw_orders', 'raw_product'], label: 'Sources (already exist)', phase: 'source' },
  { ids: ['stg_customers', 'stg_geoinfo', 'stg_orders', 'stg_product'], label: 'Step 1: Build staging models', phase: 'staging' },
  { ids: ['int_enriched_customer', 'int_enriched_orders'], label: 'Step 2: Build intermediate models', phase: 'intermediate' },
  { ids: ['fct_orders_with_customers_details'], label: 'Step 3: Build mart model', phase: 'mart' },
]

const nodeWidth = 180
const nodeHeight = 36

const typeColors = {
  source: { bg: '#dcfce7', border: '#86efac', text: '#166534' },
  staging: { bg: '#dbeafe', border: '#93c5fd', text: '#1e3a5f' },
  intermediate: { bg: '#dbeafe', border: '#93c5fd', text: '#1e3a5f' },
  mart: { bg: '#dbeafe', border: '#93c5fd', text: '#1e3a5f' },
}

const activeColors = {
  source: { bg: '#dcfce7', border: '#86efac', text: '#166534' },
  staging: { bg: '#93c5fd', border: '#3b82f6', text: '#1e3a5f' },
  intermediate: { bg: '#93c5fd', border: '#3b82f6', text: '#1e3a5f' },
  mart: { bg: '#93c5fd', border: '#3b82f6', text: '#1e3a5f' },
}

const completedColors = {
  source: { bg: '#dcfce7', border: '#86efac', text: '#166534' },
  staging: { bg: '#86efac', border: '#22c55e', text: '#166534' },
  intermediate: { bg: '#86efac', border: '#22c55e', text: '#166534' },
  mart: { bg: '#86efac', border: '#22c55e', text: '#166534' },
}

function getEdgePath(fromNode, toNode) {
  const from = { x: fromNode.x + nodeWidth, y: fromNode.y + nodeHeight / 2 }
  const to = { x: toNode.x, y: toNode.y + nodeHeight / 2 }
  const midX = (from.x + to.x) / 2
  return `M ${from.x} ${from.y} C ${midX} ${from.y}, ${midX} ${to.y}, ${to.x} ${to.y}`
}

export default function DbtRunAnimation() {
  const [currentStep, setCurrentStep] = useState(-1)
  const [completedSteps, setCompletedSteps] = useState([])
  const [isRunning, setIsRunning] = useState(false)
  const [terminalLines, setTerminalLines] = useState([])
  const [hasRun, setHasRun] = useState(false)
  const timeoutsRef = useRef([])

  const getNodeState = useCallback((nodeId) => {
    if (currentStep >= 0 && currentStep < buildSteps.length) {
      if (buildSteps[currentStep].ids.includes(nodeId)) return 'active'
    }
    for (const stepIdx of completedSteps) {
      if (buildSteps[stepIdx].ids.includes(nodeId)) return 'completed'
    }
    return 'idle'
  }, [currentStep, completedSteps])

  const getEdgeState = useCallback((edge) => {
    const fromState = getNodeState(edge.from)
    const toState = getNodeState(edge.to)
    if (toState === 'active') return 'active'
    if (fromState === 'completed' && (toState === 'completed' || toState === 'active')) return 'completed'
    return 'idle'
  }, [getNodeState])

  const runAnimation = useCallback(() => {
    // Clear any pending timeouts
    timeoutsRef.current.forEach(clearTimeout)
    timeoutsRef.current = []

    setIsRunning(true)
    setHasRun(true)
    setCurrentStep(-1)
    setCompletedSteps([])
    setTerminalLines([{ text: '$ dbt run', type: 'command' }])

    // Schedule all steps with fixed timeouts instead of setInterval
    const stepDuration = 1800
    const completionDelay = 1200

    buildSteps.forEach((buildStep, step) => {
      // Start step
      const startTime = step * stepDuration
      const t1 = setTimeout(() => {
        setCurrentStep(step)

        if (step === 0) {
          setTerminalLines(prev => [
            ...prev,
            { text: '', type: 'blank' },
            { text: 'Concurrency: 4 threads (target="prod")', type: 'info' },
            { text: '', type: 'blank' },
          ])
        }

        if (step > 0) {
          const newLines = buildStep.ids.map((id, i) => ({
            text: `${String((step - 1) * 4 + i + 1).padStart(2, ' ')} of 7 START sql table model analytics.${id}`,
            type: 'run',
          }))
          setTerminalLines(prev => [...prev, ...newLines])
        }
      }, startTime)
      timeoutsRef.current.push(t1)

      // Complete step
      const completeTime = startTime + completionDelay
      const t2 = setTimeout(() => {
        setCompletedSteps(prev => [...prev, step])

        if (step > 0) {
          const okLines = buildStep.ids.map((id, i) => ({
            text: `${String((step - 1) * 4 + i + 1).padStart(2, ' ')} of 7 OK created sql table model analytics.${id}`,
            type: 'ok',
          }))
          setTerminalLines(prev => [...prev, ...okLines])
        }
      }, completeTime)
      timeoutsRef.current.push(t2)
    })

    // Finish
    const finishTime = buildSteps.length * stepDuration
    const t3 = setTimeout(() => {
      setCurrentStep(-1)
      setIsRunning(false)
      setTerminalLines(prev => [
        ...prev,
        { text: '', type: 'blank' },
        { text: 'Done. PASS=7 WARN=0 ERROR=0 SKIP=0 TOTAL=7', type: 'success' },
      ])
    }, finishTime)
    timeoutsRef.current.push(t3)
  }, [])

  return (
    <div>
      {/* Header + button */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            dbt run
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">Watch dbt build models in the correct order, automatically</p>
        </div>
        <button
          onClick={runAnimation}
          disabled={isRunning}
          className={`px-5 py-2 rounded-lg font-medium text-sm transition-all duration-150 ${
            isRunning
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-gray-900 text-white hover:bg-gray-800 active:bg-gray-950'
          }`}
        >
          {isRunning ? 'Running...' : hasRun ? 'Run Again' : 'Run dbt run'}
        </button>
      </div>

      {/* DAG visualization */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-4 overflow-x-auto">
        <svg width="1060" height="420" viewBox="0 0 1060 420" className="w-full h-auto">
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
                strokeWidth={2}
                strokeLinecap="round"
                animate={{
                  stroke: state === 'active' ? '#3b82f6' : state === 'completed' ? '#22c55e' : '#d1d5db',
                  strokeWidth: state === 'active' ? 2.5 : 2,
                }}
                transition={{ duration: 0.4 }}
              />
            )
          })}

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
                  fill: state === 'active' ? '#3b82f6' : state === 'completed' ? '#22c55e' : '#d1d5db',
                }}
                transition={{ duration: 0.4 }}
              />
            )
          })}

          {nodes.map((node) => {
            const state = getNodeState(node.id)
            const colors = state === 'active' ? activeColors[node.type]
              : state === 'completed' ? completedColors[node.type]
              : typeColors[node.type]

            return (
              <motion.g key={node.id}>
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
                {state === 'active' && (
                  <motion.rect
                    x={node.x}
                    y={node.y}
                    width={nodeWidth}
                    height={nodeHeight}
                    rx={8}
                    fill="none"
                    stroke={colors.border}
                    strokeWidth={1}
                    initial={{ opacity: 0.6 }}
                    animate={{ opacity: [0.6, 0, 0.6] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                )}
                {state === 'completed' && node.type !== 'source' && (
                  <motion.circle
                    cx={node.x + nodeWidth - 12}
                    cy={node.y + 12}
                    r={6}
                    fill="#22c55e"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                  />
                )}
                {state === 'completed' && node.type !== 'source' && (
                  <motion.path
                    d={`M ${node.x + nodeWidth - 15} ${node.y + 12} l 3 3 l 5 -5`}
                    stroke="white"
                    strokeWidth={1.5}
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 0.1, duration: 0.3 }}
                  />
                )}
                <text
                  x={node.x + nodeWidth / 2}
                  y={node.y + nodeHeight / 2 + 1}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={node.id === 'fct_orders_with_customers_details' ? 9 : 11}
                  fontFamily="ui-monospace, monospace"
                  fontWeight={600}
                  fill={colors.text}
                >
                  {node.label}
                </text>
              </motion.g>
            )
          })}

          <text x={130} y={410} textAnchor="middle" fontSize={10} fill="#9ca3af" fontWeight={500}>Sources</text>
          <text x={350} y={410} textAnchor="middle" fontSize={10} fill="#9ca3af" fontWeight={500}>Staging</text>
          <text x={610} y={410} textAnchor="middle" fontSize={10} fill="#9ca3af" fontWeight={500}>Intermediate</text>
          <text x={880} y={410} textAnchor="middle" fontSize={10} fill="#9ca3af" fontWeight={500}>Marts</text>
        </svg>
      </div>

      {/* Terminal output */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 font-mono text-xs max-h-64 overflow-y-auto">
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
                ''
              }
            >
              {line.text || '\u00A0'}
            </motion.div>
          ))}
        </AnimatePresence>
        {terminalLines.length === 0 && (
          <div className="text-gray-400">Click "Run dbt run" to see the build order...</div>
        )}
      </div>
    </div>
  )
}
