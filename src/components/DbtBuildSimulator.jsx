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

// dbt build steps: build model → test model → next layer
// In fail scenario, stg_orders fails its not_null test
const buildStepsPass = [
  { action: 'source', ids: ['raw_customers', 'raw_geoinfo', 'raw_orders', 'raw_product'], label: 'Sources ready' },
  { action: 'build', ids: ['stg_customers', 'stg_geoinfo', 'stg_orders', 'stg_product'], label: 'Build staging models' },
  { action: 'test', ids: ['stg_customers', 'stg_geoinfo', 'stg_orders', 'stg_product'], label: 'Test staging models', results: { stg_customers: 'pass', stg_geoinfo: 'pass', stg_orders: 'pass', stg_product: 'pass' } },
  { action: 'build', ids: ['int_enriched_customer', 'int_enriched_orders'], label: 'Build intermediate models' },
  { action: 'test', ids: ['int_enriched_customer', 'int_enriched_orders'], label: 'Test intermediate models', results: { int_enriched_customer: 'pass', int_enriched_orders: 'pass' } },
  { action: 'build', ids: ['fct_orders_with_customers_details'], label: 'Build mart model' },
  { action: 'test', ids: ['fct_orders_with_customers_details'], label: 'Test mart model', results: { fct_orders_with_customers_details: 'pass' } },
]

const buildStepsFail = [
  { action: 'source', ids: ['raw_customers', 'raw_geoinfo', 'raw_orders', 'raw_product'], label: 'Sources ready' },
  { action: 'build', ids: ['stg_customers', 'stg_geoinfo', 'stg_orders', 'stg_product'], label: 'Build staging models' },
  { action: 'test', ids: ['stg_customers', 'stg_geoinfo', 'stg_orders', 'stg_product'], label: 'Test staging models', results: { stg_customers: 'pass', stg_geoinfo: 'pass', stg_orders: 'fail', stg_product: 'pass' } },
  { action: 'skip', ids: ['int_enriched_orders', 'fct_orders_with_customers_details'], label: 'Skip downstream of stg_orders' },
  { action: 'build', ids: ['int_enriched_customer'], label: 'Build int_enriched_customer' },
  { action: 'test', ids: ['int_enriched_customer'], label: 'Test int_enriched_customer', results: { int_enriched_customer: 'pass' } },
]

const typeColors = {
  source: { bg: '#dcfce7', border: '#86efac', text: '#166534' },
  staging: { bg: '#dbeafe', border: '#93c5fd', text: '#1e3a5f' },
  intermediate: { bg: '#dbeafe', border: '#93c5fd', text: '#1e3a5f' },
  mart: { bg: '#dbeafe', border: '#93c5fd', text: '#1e3a5f' },
}

const stateColors = {
  building: { bg: '#93c5fd', border: '#3b82f6', text: '#1e3a5f' },
  testing: { bg: '#fde68a', border: '#f59e0b', text: '#78350f' },
  passed: { bg: '#86efac', border: '#22c55e', text: '#166534' },
  failed: { bg: '#fca5a5', border: '#ef4444', text: '#991b1b' },
  skipped: { bg: '#e5e7eb', border: '#9ca3af', text: '#6b7280' },
}

function getEdgePath(fromNode, toNode) {
  const from = { x: fromNode.x + nodeWidth, y: fromNode.y + nodeHeight / 2 }
  const to = { x: toNode.x, y: toNode.y + nodeHeight / 2 }
  const midX = (from.x + to.x) / 2
  return `M ${from.x} ${from.y} C ${midX} ${from.y}, ${midX} ${to.y}, ${to.x} ${to.y}`
}

// Terminal log generators
function buildLog(id, num, total) {
  return { text: `${String(num).padStart(2, ' ')} of ${total} START sql table model analytics.${id}`, type: 'run' }
}
function buildOkLog(id, num, total) {
  return { text: `${String(num).padStart(2, ' ')} of ${total} OK created sql table model analytics.${id}`, type: 'ok' }
}
function testStartLog(id) {
  return { text: `     TEST unique_${id}_id .....................................`, type: 'test' }
}
function testPassLog(id) {
  return { text: `     PASS unique_${id}_id`, type: 'ok' }
}
function testFailLog(id) {
  return { text: `     FAIL 3 unique_${id}_id`, type: 'fail' }
}
function skipLog(id) {
  return { text: `     SKIP model analytics.${id} (upstream test failure)`, type: 'skip' }
}

export default function DbtBuildSimulator() {
  const [scenario, setScenario] = useState('pass')
  const [nodeStates, setNodeStates] = useState({}) // id -> 'building' | 'testing' | 'passed' | 'failed' | 'skipped'
  const [isRunning, setIsRunning] = useState(false)
  const [terminalLines, setTerminalLines] = useState([])
  const [hasRun, setHasRun] = useState(false)
  const timeoutsRef = useRef([])
  const terminalRef = useRef(null)

  const getNodeColors = useCallback((nodeId) => {
    const node = nodes.find(n => n.id === nodeId)
    if (node?.type === 'source') return typeColors.source
    const state = nodeStates[nodeId]
    if (state && stateColors[state]) return stateColors[state]
    return typeColors[node?.type] || typeColors.staging
  }, [nodeStates])

  const getEdgeColor = useCallback((edge) => {
    const fromState = nodeStates[edge.from]
    const toState = nodeStates[edge.to]
    if (toState === 'skipped') return '#d1d5db'
    if (toState === 'failed') return '#ef4444'
    if (fromState === 'passed' && (toState === 'passed' || toState === 'building' || toState === 'testing')) return '#22c55e'
    if (toState === 'building' || toState === 'testing') return '#3b82f6'
    return '#d1d5db'
  }, [nodeStates])

  const addTerminalLines = useCallback((lines) => {
    setTerminalLines(prev => [...prev, ...lines])
    // Auto-scroll
    setTimeout(() => {
      if (terminalRef.current) {
        terminalRef.current.scrollTop = terminalRef.current.scrollHeight
      }
    }, 50)
  }, [])

  const runSimulation = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout)
    timeoutsRef.current = []

    setIsRunning(true)
    setHasRun(true)
    setNodeStates({})
    setTerminalLines([{ text: '$ dbt build', type: 'command' }])

    const steps = scenario === 'pass' ? buildStepsPass : buildStepsFail
    const totalModels = scenario === 'pass' ? 7 : 7
    let delay = 200
    let modelNum = 0

    steps.forEach((step) => {
      if (step.action === 'source') {
        const t = setTimeout(() => {
          setNodeStates(prev => {
            const next = { ...prev }
            step.ids.forEach(id => { next[id] = 'passed' })
            return next
          })
          addTerminalLines([
            { text: '', type: 'blank' },
            { text: 'Concurrency: 4 threads (target="prod")', type: 'info' },
            { text: '', type: 'blank' },
          ])
        }, delay)
        timeoutsRef.current.push(t)
        delay += 800
      }

      if (step.action === 'build') {
        // Start building
        const t1 = setTimeout(() => {
          setNodeStates(prev => {
            const next = { ...prev }
            step.ids.forEach(id => { next[id] = 'building' })
            return next
          })
          const logs = step.ids.map(id => {
            modelNum++
            return buildLog(id, modelNum, totalModels)
          })
          addTerminalLines(logs)
        }, delay)
        timeoutsRef.current.push(t1)
        delay += 1200

        // Finish building
        const currentModelNum = modelNum
        const t2 = setTimeout(() => {
          setNodeStates(prev => {
            const next = { ...prev }
            step.ids.forEach(id => { next[id] = 'testing' }) // transition to "awaiting test"
            return next
          })
          let num = currentModelNum
          const logs = step.ids.map(id => {
            num++
            return buildOkLog(id, num, totalModels)
          })
          addTerminalLines(logs)
        }, delay)
        timeoutsRef.current.push(t2)
        // Fix modelNum for the ok logs
        modelNum += 0 // already incremented
        delay += 600
      }

      if (step.action === 'test') {
        // Start tests
        const t1 = setTimeout(() => {
          setNodeStates(prev => {
            const next = { ...prev }
            step.ids.forEach(id => { next[id] = 'testing' })
            return next
          })
          const logs = step.ids.map(id => testStartLog(id))
          addTerminalLines(logs)
        }, delay)
        timeoutsRef.current.push(t1)
        delay += 1000

        // Show results
        const t2 = setTimeout(() => {
          setNodeStates(prev => {
            const next = { ...prev }
            step.ids.forEach(id => {
              const result = step.results[id]
              next[id] = result === 'pass' ? 'passed' : 'failed'
            })
            return next
          })
          const logs = step.ids.map(id => {
            const result = step.results[id]
            return result === 'pass' ? testPassLog(id) : testFailLog(id)
          })
          addTerminalLines(logs)
        }, delay)
        timeoutsRef.current.push(t2)
        delay += 800
      }

      if (step.action === 'skip') {
        const t = setTimeout(() => {
          setNodeStates(prev => {
            const next = { ...prev }
            step.ids.forEach(id => { next[id] = 'skipped' })
            return next
          })
          const logs = step.ids.map(id => skipLog(id))
          addTerminalLines(logs)
        }, delay)
        timeoutsRef.current.push(t)
        delay += 800
      }
    })

    // Final summary
    const t = setTimeout(() => {
      setIsRunning(false)
      if (scenario === 'pass') {
        addTerminalLines([
          { text: '', type: 'blank' },
          { text: 'Done. PASS=7 WARN=0 ERROR=0 SKIP=0 TOTAL=7', type: 'success' },
        ])
      } else {
        addTerminalLines([
          { text: '', type: 'blank' },
          { text: 'Done. PASS=5 WARN=0 ERROR=1 SKIP=2 TOTAL=7', type: 'fail' },
          { text: 'Bad data in stg_orders was blocked from propagating downstream.', type: 'info' },
        ])
      }
    }, delay)
    timeoutsRef.current.push(t)
  }, [scenario, addTerminalLines])

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            dbt build
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">Models are built and tested in DAG order. Failed tests block downstream.</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Scenario toggle */}
          <div className="inline-flex bg-gray-100 rounded-lg p-0.5 text-xs">
            <button
              onClick={() => { if (!isRunning) { setScenario('pass'); setNodeStates({}); setTerminalLines([]); setHasRun(false) } }}
              className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                scenario === 'pass' ? 'bg-white text-emerald-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              All Pass
            </button>
            <button
              onClick={() => { if (!isRunning) { setScenario('fail'); setNodeStates({}); setTerminalLines([]); setHasRun(false) } }}
              className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                scenario === 'fail' ? 'bg-white text-red-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Test Failure
            </button>
          </div>
          <button
            onClick={runSimulation}
            disabled={isRunning}
            className={`px-5 py-2 rounded-lg font-medium text-sm transition-all duration-150 ${
              isRunning
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gray-900 text-white hover:bg-gray-800 active:bg-gray-950'
            }`}
          >
            {isRunning ? 'Running...' : hasRun ? 'Run Again' : 'Run dbt build'}
          </button>
        </div>
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
                  x={node.x}
                  y={node.y}
                  width={nodeWidth}
                  height={nodeHeight}
                  rx={8}
                  animate={{ fill: colors.bg, stroke: colors.border }}
                  strokeWidth={state === 'building' || state === 'testing' ? 2.5 : 1.5}
                  transition={{ duration: 0.4 }}
                />
                {state === 'building' && (
                  <motion.rect
                    x={node.x} y={node.y} width={nodeWidth} height={nodeHeight} rx={8}
                    fill="none" stroke={colors.border} strokeWidth={1}
                    animate={{ opacity: [0.6, 0, 0.6] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                )}
                {state === 'testing' && (
                  <motion.rect
                    x={node.x} y={node.y} width={nodeWidth} height={nodeHeight} rx={8}
                    fill="none" stroke="#f59e0b" strokeWidth={1}
                    animate={{ opacity: [0.8, 0.2, 0.8] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                )}
                {/* Status icon */}
                {state === 'passed' && node.type !== 'source' && (
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
                {state === 'failed' && (
                  <>
                    <motion.circle cx={node.x + nodeWidth - 12} cy={node.y + 12} r={6} fill="#ef4444"
                      initial={{ scale: 0 }} animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                    />
                    <motion.path
                      d={`M ${node.x + nodeWidth - 15} ${node.y + 9} l 6 6 M ${node.x + nodeWidth - 9} ${node.y + 9} l -6 6`}
                      stroke="white" strokeWidth={1.5} fill="none" strokeLinecap="round"
                      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                      transition={{ delay: 0.1, duration: 0.3 }}
                    />
                  </>
                )}
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
      <div className="flex flex-wrap gap-3 mb-4">
        {[
          { color: 'bg-blue-200 border-blue-400', label: 'Building' },
          { color: 'bg-amber-200 border-amber-400', label: 'Testing' },
          { color: 'bg-emerald-200 border-emerald-400', label: 'Passed' },
          { color: 'bg-red-200 border-red-400', label: 'Failed' },
          { color: 'bg-gray-200 border-gray-400', label: 'Skipped' },
        ].map(item => (
          <div key={item.label} className="flex items-center gap-1.5 text-xs text-gray-600">
            <span className={`w-3 h-3 rounded border ${item.color}`} />
            {item.label}
          </div>
        ))}
      </div>

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
                line.type === 'info' ? 'text-gray-400' :
                line.type === 'run' ? 'text-blue-600' :
                line.type === 'ok' ? 'text-emerald-600' :
                line.type === 'test' ? 'text-amber-600' :
                line.type === 'fail' ? 'text-red-400 font-bold' :
                line.type === 'skip' ? 'text-gray-500' :
                line.type === 'success' ? 'text-emerald-700 font-bold' :
                ''
              }
            >
              {line.text || '\u00A0'}
            </motion.div>
          ))}
        </AnimatePresence>
        {terminalLines.length === 0 && (
          <div className="text-gray-400">Click "Run dbt build" to see models build and test in DAG order...</div>
        )}
      </div>
    </div>
  )
}
