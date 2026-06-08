import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const nodeWidth = 180
const nodeHeight = 36

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

const scenarios = {
  rebuild_all: {
    label: 'Without dbt State',
    desc: 'raw_orders gets new data, but all models rebuild regardless',
    steps: [
      { action: 'freshness', ids: ['raw_orders'], label: 'New data detected in raw_orders' },
      { action: 'build', ids: ['stg_customers', 'stg_geoinfo', 'stg_orders', 'stg_product'] },
      { action: 'complete', ids: ['stg_customers', 'stg_geoinfo', 'stg_orders', 'stg_product'] },
      { action: 'build', ids: ['int_enriched_customer', 'int_enriched_orders'] },
      { action: 'complete', ids: ['int_enriched_customer', 'int_enriched_orders'] },
      { action: 'build', ids: ['fct_orders_with_customers_details'] },
      { action: 'complete', ids: ['fct_orders_with_customers_details'] },
      { action: 'wasted', ids: ['stg_customers', 'stg_geoinfo', 'stg_product', 'int_enriched_customer'] },
    ],
    terminalSummary: 'Rebuilt 7 models. 4 models rebuilt unnecessarily because no upstream data changed.',
    terminalType: 'warn',
  },
  source_aware: {
    label: 'With dbt State',
    desc: 'raw_orders gets new data. Only downstream models rebuild, unchanged models are reused.',
    steps: [
      { action: 'freshness', ids: ['raw_orders'], label: 'New data detected in raw_orders' },
      { action: 'skip', ids: ['stg_customers', 'stg_geoinfo', 'stg_product'], label: 'No new data upstream. Skip.' },
      { action: 'build', ids: ['stg_orders'] },
      { action: 'complete', ids: ['stg_orders'] },
      { action: 'skip', ids: ['int_enriched_customer'], label: 'No upstream changes. Skip.' },
      { action: 'build', ids: ['int_enriched_orders'] },
      { action: 'complete', ids: ['int_enriched_orders'] },
      { action: 'build', ids: ['fct_orders_with_customers_details'] },
      { action: 'complete', ids: ['fct_orders_with_customers_details'] },
      { action: 'reuse', ids: ['stg_customers', 'stg_geoinfo', 'stg_product', 'int_enriched_customer'] },
    ],
    terminalSummary: 'Rebuilt 3 models, reused 4. Only order-dependent models ran.',
    terminalType: 'success',
  },
  update_all: {
    label: 'Advanced Configuration',
    desc: <>raw_orders gets new data. int_enriched_orders has <code className="bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded text-[11px] font-mono font-bold">update: all</code> configured.</>,
    steps: [
      { action: 'freshness', ids: ['raw_orders'], label: 'New data detected in raw_orders' },
      { action: 'skip', ids: ['stg_customers', 'stg_geoinfo', 'stg_product'], label: 'No new data upstream. Skip.' },
      { action: 'build', ids: ['stg_orders'] },
      { action: 'complete', ids: ['stg_orders'] },
      { action: 'skip', ids: ['int_enriched_customer'], label: 'No upstream changes. Skip.' },
      { action: 'check', ids: ['int_enriched_orders'], label: 'int_enriched_orders has update: all. Checking parents.' },
      { action: 'config_skip', ids: ['int_enriched_orders'], label: 'stg_product did not update. Blocked by update: all.' },
      { action: 'skip', ids: ['fct_orders_with_customers_details'], label: 'No upstream parents updated. Skip.' },
    ],
    terminalSummary: 'Rebuilt 1 model, skipped 6. int_enriched_orders blocked by update: all since not all parents updated.',
    terminalType: 'info',
  },
}

const typeColors = {
  source: { bg: '#dcfce7', border: '#86efac', text: '#166534' },
  staging: { bg: '#dbeafe', border: '#93c5fd', text: '#1e3a5f' },
  intermediate: { bg: '#dbeafe', border: '#93c5fd', text: '#1e3a5f' },
  mart: { bg: '#dbeafe', border: '#93c5fd', text: '#1e3a5f' },
}

const stateColors = {
  fresh: { bg: '#fbbf24', border: '#f59e0b', text: '#78350f' },
  building: { bg: '#93c5fd', border: '#3b82f6', text: '#1e3a5f' },
  complete: { bg: '#86efac', border: '#22c55e', text: '#166534' },
  skipped: { bg: '#f3f4f6', border: '#d1d5db', text: '#9ca3af' },
  checking: { bg: '#fde68a', border: '#f59e0b', text: '#78350f' },
  stale: { bg: '#fee2e2', border: '#fca5a5', text: '#991b1b' },
  wasted: { bg: '#fef3c7', border: '#f59e0b', text: '#92400e' },
  reused: { bg: '#e0e7ff', border: '#818cf8', text: '#3730a3' },
  config_skip: { bg: '#fef3c7', border: '#f59e0b', text: '#92400e' },
}

function getEdgePath(fromNode, toNode) {
  const from = { x: fromNode.x + nodeWidth, y: fromNode.y + nodeHeight / 2 }
  const to = { x: toNode.x, y: toNode.y + nodeHeight / 2 }
  const midX = (from.x + to.x) / 2
  return `M ${from.x} ${from.y} C ${midX} ${from.y}, ${midX} ${to.y}, ${to.x} ${to.y}`
}

export default function StateAwareOrchestration() {
  const [scenario, setScenario] = useState('rebuild_all')
  const [nodeStates, setNodeStates] = useState({})
  const [isRunning, setIsRunning] = useState(false)
  const [hasRun, setHasRun] = useState(false)
  const [terminalLines, setTerminalLines] = useState([])
  const timeoutsRef = useRef([])
  const terminalRef = useRef(null)

  const getNodeColors = useCallback((nodeId) => {
    const node = nodes.find(n => n.id === nodeId)
    const state = nodeStates[nodeId]
    if (node?.type === 'source' && state !== 'fresh' && state !== 'stale') return typeColors.source
    if (state && stateColors[state]) return stateColors[state]
    return typeColors[node?.type] || typeColors.staging
  }, [nodeStates])

  const getEdgeColor = useCallback((edge) => {
    const toState = nodeStates[edge.to]
    const fromState = nodeStates[edge.from]
    if (toState === 'skipped') return '#e5e7eb'
    if (toState === 'complete') return '#22c55e'
    if (toState === 'building') return '#3b82f6'
    if (fromState === 'complete' || fromState === 'fresh') return '#22c55e'
    return '#d1d5db'
  }, [nodeStates])

  const addLines = useCallback((lines) => {
    setTerminalLines(prev => [...prev, ...lines])
    setTimeout(() => {
      if (terminalRef.current) terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }, 50)
  }, [])

  const runSimulation = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout)
    timeoutsRef.current = []
    setIsRunning(true)
    setHasRun(true)
    setNodeStates({})
    setTerminalLines([{ text: '$ dbt build --select source:raw_orders+', type: 'command' }])

    const sc = scenarios[scenario]
    let delay = 400

    sc.steps.forEach((step) => {
      const t = setTimeout(() => {
        if (step.action === 'freshness') {
          setNodeStates(prev => {
            const next = { ...prev }
            step.ids.forEach(id => { next[id] = 'fresh' })
            return next
          })
          addLines([
            { text: '', type: 'blank' },
            { text: `Source freshness check: ${step.ids.join(', ')} has new data`, type: 'fresh' },
          ])
        }

        if (step.action === 'check') {
          setNodeStates(prev => {
            const next = { ...prev }
            step.ids.forEach(id => { next[id] = 'checking' })
            return next
          })
          addLines([{ text: `Checking: ${step.ids.join(', ')} requires all upstream sources fresh`, type: 'test' }])
        }

        if (step.action === 'stale') {
          setNodeStates(prev => {
            const next = { ...prev }
            step.ids.forEach(id => { next[id] = 'stale' })
            return next
          })
          addLines(step.ids.map(id => ({ text: `  ${id} has no new data (stale)`, type: 'fail' })))
        }

        if (step.action === 'build') {
          setNodeStates(prev => {
            const next = { ...prev }
            step.ids.forEach(id => { next[id] = 'building' })
            return next
          })
          addLines(step.ids.map(id => ({ text: `  START sql table model analytics.${id}`, type: 'run' })))
        }

        if (step.action === 'complete') {
          setNodeStates(prev => {
            const next = { ...prev }
            step.ids.forEach(id => { next[id] = 'complete' })
            return next
          })
          addLines(step.ids.map(id => ({ text: `  OK    created sql table model analytics.${id}`, type: 'ok' })))
        }

        if (step.action === 'skip') {
          setNodeStates(prev => {
            const next = { ...prev }
            step.ids.forEach(id => { next[id] = 'skipped' })
            return next
          })
          addLines(step.ids.map(id => ({ text: `  SKIP  analytics.${id}`, type: 'skip' })))
        }

        if (step.action === 'wasted') {
          setNodeStates(prev => {
            const next = { ...prev }
            step.ids.forEach(id => { next[id] = 'wasted' })
            return next
          })
          addLines([
            { text: '', type: 'blank' },
            ...step.ids.map(id => ({ text: `  WASTED  analytics.${id} (no upstream data changed)`, type: 'warn' })),
          ])
        }

        if (step.action === 'reuse') {
          setNodeStates(prev => {
            const next = { ...prev }
            step.ids.forEach(id => { next[id] = 'reused' })
            return next
          })
          addLines([
            { text: '', type: 'blank' },
            ...step.ids.map(id => ({ text: `  REUSED  analytics.${id} (no rebuild needed)`, type: 'reuse' })),
          ])
        }

        if (step.action === 'config_skip') {
          setNodeStates(prev => {
            const next = { ...prev }
            step.ids.forEach(id => { next[id] = 'config_skip' })
            return next
          })
          addLines(step.ids.map(id => ({ text: `  BLOCKED analytics.${id} [update: all] not all parents updated`, type: 'warn' })))
        }
      }, delay)
      timeoutsRef.current.push(t)
      delay += step.action === 'complete' ? 800 : step.action === 'build' ? 1200 : step.action === 'wasted' ? 1200 : step.action === 'reuse' ? 1200 : 1000
    })

    const t = setTimeout(() => {
      setIsRunning(false)
      addLines([
        { text: '', type: 'blank' },
        { text: sc.terminalSummary, type: sc.terminalType },
      ])
    }, delay)
    timeoutsRef.current.push(t)
  }, [scenario, addLines])

  const sc = scenarios[scenario]

  return (
    <div>
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            dbt build
          </h3>
          <div className="flex items-center gap-2">
            <div className="inline-flex bg-gray-100 rounded-lg p-0.5 text-xs">
              {Object.entries(scenarios).map(([key, s]) => (
                <button
                  key={key}
                  onClick={() => { if (!isRunning) { setScenario(key); setNodeStates({}); setTerminalLines([]); setHasRun(false) } }}
                  className={`px-3 py-1.5 rounded-md font-medium transition-all whitespace-nowrap ${
                    scenario === key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          <button
            onClick={runSimulation}
            disabled={isRunning}
            className={`px-5 py-2 rounded-lg font-medium text-sm transition-all duration-150 shrink-0 ${
              isRunning
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gray-900 text-white hover:bg-gray-800 active:bg-gray-950'
            }`}
          >
            {isRunning ? 'Running...' : hasRun ? 'Run Again' : 'Run Simulation'}
          </button>
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-1.5 ml-4">{sc.desc}</p>
      </div>

      {/* DAG */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-4 overflow-x-auto">
        <svg width="1060" height="420" viewBox="0 0 1060 420" className="w-full h-auto">
          {edges.map((edge) => {
            const fromNode = nodes.find(n => n.id === edge.from)
            const toNode = nodes.find(n => n.id === edge.to)
            const path = getEdgePath(fromNode, toNode)
            const color = getEdgeColor(edge)
            return (
              <motion.path
                key={`${edge.from}-${edge.to}`}
                d={path}
                fill="none"
                strokeLinecap="round"
                animate={{ stroke: color, strokeWidth: 2 }}
                transition={{ duration: 0.4 }}
              />
            )
          })}

          {edges.map((edge) => {
            const toNode = nodes.find(n => n.id === edge.to)
            const color = getEdgeColor(edge)
            return (
              <motion.circle
                key={`dot-${edge.from}-${edge.to}`}
                cx={toNode.x - 4}
                cy={toNode.y + nodeHeight / 2}
                r={3}
                animate={{ fill: color }}
                transition={{ duration: 0.4 }}
              />
            )
          })}

          {nodes.map((node) => {
            const colors = getNodeColors(node.id)
            const state = nodeStates[node.id]
            return (
              <motion.g key={node.id}>
                <motion.rect
                  x={node.x} y={node.y} width={nodeWidth} height={nodeHeight} rx={8}
                  animate={{ fill: colors.bg, stroke: colors.border }}
                  strokeWidth={state === 'building' || state === 'fresh' || state === 'checking' ? 2.5 : 1.5}
                  transition={{ duration: 0.4 }}
                />
                {(state === 'building' || state === 'checking') && (
                  <motion.rect
                    x={node.x} y={node.y} width={nodeWidth} height={nodeHeight} rx={8}
                    fill="none" stroke={state === 'checking' ? '#f59e0b' : '#3b82f6'} strokeWidth={1}
                    animate={{ opacity: [0.6, 0, 0.6] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                )}
                {state === 'fresh' && (
                  <motion.rect
                    x={node.x} y={node.y} width={nodeWidth} height={nodeHeight} rx={8}
                    fill="none" stroke="#f59e0b" strokeWidth={1.5}
                    animate={{ opacity: [0.8, 0.2, 0.8] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                )}
                {/* Checkmark for complete */}
                {state === 'complete' && (
                  <>
                    <motion.circle cx={node.x + nodeWidth - 12} cy={node.y + 12} r={6} fill="#22c55e"
                      initial={{ scale: 0 }} animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                    />
                    <motion.path
                      d={`M ${node.x + nodeWidth - 15} ${node.y + 12} l 3 3 l 5 -5`}
                      stroke="white" strokeWidth={1.5} fill="none" strokeLinecap="round" strokeLinejoin="round"
                      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                      transition={{ delay: 0.1, duration: 0.3 }}
                    />
                  </>
                )}
                {/* Skip dash */}
                {state === 'skipped' && (
                  <>
                    <motion.circle cx={node.x + nodeWidth - 12} cy={node.y + 12} r={6} fill="#9ca3af"
                      initial={{ scale: 0 }} animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                    />
                    <motion.path
                      d={`M ${node.x + nodeWidth - 15} ${node.y + 12} l 6 0`}
                      stroke="white" strokeWidth={2} fill="none" strokeLinecap="round"
                      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                      transition={{ delay: 0.1, duration: 0.3 }}
                    />
                  </>
                )}
                {/* Stale X */}
                {state === 'stale' && (
                  <>
                    <motion.circle cx={node.x + nodeWidth - 12} cy={node.y + 12} r={6} fill="#f87171"
                      initial={{ scale: 0 }} animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                    />
                    <motion.path
                      d={`M ${node.x + nodeWidth - 14.5} ${node.y + 9.5} l 5 5 M ${node.x + nodeWidth - 9.5} ${node.y + 9.5} l -5 5`}
                      stroke="white" strokeWidth={1.5} fill="none" strokeLinecap="round"
                      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                      transition={{ delay: 0.1, duration: 0.3 }}
                    />
                  </>
                )}
                {/* Wasted warning icon */}
                {state === 'wasted' && (
                  <>
                    <motion.circle cx={node.x + nodeWidth - 12} cy={node.y + 12} r={6} fill="#f59e0b"
                      initial={{ scale: 0 }} animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                    />
                    <motion.text
                      x={node.x + nodeWidth - 12} y={node.y + 13.5}
                      textAnchor="middle" dominantBaseline="middle"
                      fontSize={9} fontWeight={800} fill="white"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      transition={{ delay: 0.15 }}
                    >!</motion.text>
                  </>
                )}
                {/* Fresh pulse dot */}
                {state === 'fresh' && (
                  <motion.circle cx={node.x + nodeWidth - 12} cy={node.y + 12} r={5} fill="#f59e0b"
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                )}
                {/* Reused icon */}
                {state === 'reused' && (
                  <>
                    <motion.circle cx={node.x + nodeWidth - 12} cy={node.y + 12} r={6} fill="#818cf8"
                      initial={{ scale: 0 }} animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                    />
                    <motion.path
                      d={`M ${node.x + nodeWidth - 15} ${node.y + 12} a 3 3 0 1 1 6 0`}
                      stroke="white" strokeWidth={1.5} fill="none" strokeLinecap="round"
                      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                      transition={{ delay: 0.1, duration: 0.3 }}
                    />
                    <motion.path
                      d={`M ${node.x + nodeWidth - 9.5} ${node.y + 10} l 0.5 2 l 2 -0.5`}
                      stroke="white" strokeWidth={1.2} fill="none" strokeLinecap="round" strokeLinejoin="round"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    />
                  </>
                )}
                {/* Config skip: update:all badge */}
                {state === 'config_skip' && (
                  <>
                    <motion.rect
                      x={node.x} y={node.y} width={nodeWidth} height={nodeHeight} rx={8}
                      fill="none" stroke="#f59e0b" strokeWidth={2.5}
                      animate={{ opacity: [1, 0.4, 1] }}
                      transition={{ duration: 1.2, repeat: Infinity }}
                    />
                    <motion.circle cx={node.x + nodeWidth - 12} cy={node.y + 12} r={6} fill="#f59e0b"
                      initial={{ scale: 0 }} animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                    />
                    <motion.text
                      x={node.x + nodeWidth - 12} y={node.y + 13.5}
                      textAnchor="middle" dominantBaseline="middle"
                      fontSize={9} fontWeight={800} fill="white"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      transition={{ delay: 0.15 }}
                    >!</motion.text>
                  </>
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

      {/* Legend */}
      {(() => {
        const vals = Object.values(nodeStates)
        const hasWasted = vals.includes('wasted')
        const hasReused = vals.includes('reused')
        const hasConfigSkip = vals.includes('config_skip')
        return (
          <div className="flex flex-wrap gap-3 mb-4">
            {[
              { color: 'bg-amber-300 border-amber-500', label: 'New Data', key: 'fresh' },
              { color: 'bg-blue-200 border-blue-400', label: 'Building', key: 'building' },
              { color: 'bg-emerald-200 border-emerald-400', label: 'Complete', key: 'complete' },
              { color: 'bg-amber-100 border-amber-400', label: 'Wasted Compute', key: 'wasted' },
              { color: 'bg-indigo-200 border-indigo-400', label: 'Reused', key: 'reused' },
              { color: 'bg-gray-200 border-gray-400', label: 'Skipped', key: 'skipped' },
              { color: 'bg-amber-100 border-amber-400', label: 'Blocked (update: all)', key: 'config_skip' },
            ].map(item => {
              const isHighlighted =
                (item.key === 'wasted' && hasWasted) ||
                (item.key === 'reused' && hasReused) ||
                (item.key === 'config_skip' && hasConfigSkip)
              const highlightColor =
                item.key === 'wasted' ? 'bg-amber-50 ring-2 ring-amber-400 text-amber-800 font-semibold' :
                item.key === 'reused' ? 'bg-indigo-50 ring-2 ring-indigo-400 text-indigo-800 font-semibold' :
                item.key === 'config_skip' ? 'bg-amber-50 ring-2 ring-amber-400 text-amber-800 font-semibold' :
                ''
              return (
                <motion.div
                  key={item.label}
                  className={`flex items-center gap-1.5 text-xs px-2 py-1 rounded-md transition-all duration-300 ${
                    isHighlighted ? highlightColor : 'text-gray-600'
                  }`}
                  animate={isHighlighted ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 0.5 }}
                >
                  <span className={`w-3 h-3 rounded border ${item.color}`} />
                  {item.label}
                </motion.div>
              )
            })}
          </div>
        )
      })()}

      {/* Terminal */}
      <div ref={terminalRef} className="bg-white border border-gray-200 rounded-xl p-4 font-mono text-xs max-h-64 overflow-y-auto">
        <AnimatePresence>
          {terminalLines.map((line, i) => (
            <motion.div
              key={`line-${i}`}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.15 }}
              className={
                line.type === 'command' ? 'text-emerald-700 font-bold' :
                line.type === 'fresh' ? 'text-amber-600 font-semibold' :
                line.type === 'info' ? 'text-gray-400' :
                line.type === 'run' ? 'text-blue-600' :
                line.type === 'ok' ? 'text-emerald-600' :
                line.type === 'test' ? 'text-amber-600' :
                line.type === 'fail' ? 'text-red-400' :
                line.type === 'skip' ? 'text-gray-500' :
                line.type === 'reuse' ? 'text-indigo-600' :
                line.type === 'success' ? 'text-emerald-700 font-bold' :
                line.type === 'warn' ? 'text-amber-600 font-bold' :
                ''
              }
            >
              {line.text || '\u00A0'}
            </motion.div>
          ))}
        </AnimatePresence>
        {terminalLines.length === 0 && (
          <div className="text-gray-400">Click "Run Simulation" to see dbt state in action...</div>
        )}
      </div>
    </div>
  )
}
