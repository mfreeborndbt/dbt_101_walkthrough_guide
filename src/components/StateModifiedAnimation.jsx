import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/* ─── DAG (matches spec: no raw_product/stg_product) ─── */
const nodes = [
  { id: 'raw_customers', label: 'raw_customers', type: 'source', x: 40, y: 40 },
  { id: 'raw_geoinfo', label: 'raw_geoinfo', type: 'source', x: 40, y: 140 },
  { id: 'raw_orders', label: 'raw_orders', type: 'source', x: 40, y: 260 },
  { id: 'stg_customers', label: 'stg_customers', type: 'staging', x: 260, y: 40 },
  { id: 'stg_geoinfo', label: 'stg_geoinfo', type: 'staging', x: 260, y: 140 },
  { id: 'stg_orders', label: 'stg_orders', type: 'staging', x: 260, y: 260 },
  { id: 'int_enriched_customer', label: 'int_enriched_customer', type: 'intermediate', x: 520, y: 80 },
  { id: 'int_enriched_orders', label: 'int_enriched_orders', type: 'intermediate', x: 520, y: 260 },
  { id: 'fct_orders', label: 'fct_orders_with_customers_details', type: 'mart', x: 790, y: 170 },
]

const edges = [
  { from: 'raw_customers', to: 'stg_customers' },
  { from: 'raw_geoinfo', to: 'stg_geoinfo' },
  { from: 'raw_orders', to: 'stg_orders' },
  { from: 'stg_customers', to: 'int_enriched_customer' },
  { from: 'stg_geoinfo', to: 'int_enriched_customer' },
  { from: 'stg_orders', to: 'int_enriched_orders' },
  { from: 'int_enriched_customer', to: 'fct_orders' },
  { from: 'int_enriched_orders', to: 'fct_orders' },
]

const MODIFIED_ID = 'int_enriched_orders'
const DOWNSTREAM_ID = 'fct_orders'
const SOURCE_IDS = ['raw_customers', 'raw_geoinfo', 'raw_orders']
const SKIPPED_IDS = ['raw_customers', 'stg_customers', 'raw_geoinfo', 'stg_geoinfo', 'int_enriched_customer', 'raw_orders', 'stg_orders']

/* "Without" builds in DAG order, each node: build phase → test phase */
const withoutSteps = [
  { ids: ['stg_customers', 'stg_geoinfo', 'stg_orders'], label: 'Staging' },
  { ids: ['int_enriched_customer', 'int_enriched_orders'], label: 'Intermediate' },
  { ids: ['fct_orders'], label: 'Mart' },
]

const nodeWidth = 180
const nodeHeight = 36

/* ─── Colors (identical to DeferralAnimation) ─── */
const idleColors = { bg: '#f3f4f6', border: '#d1d5db', text: '#6b7280' }
const buildingColors = { bg: '#93c5fd', border: '#3b82f6', text: '#1e3a5f' }
const testingColors = { bg: '#c4b5fd', border: '#7c3aed', text: '#4c1d95' }
const completedColors = { bg: '#86efac', border: '#22c55e', text: '#166534' }
const skippedColors = { bg: '#e5e7eb', border: '#9ca3af', text: '#9ca3af' }
const sourceColors = { bg: '#dcfce7', border: '#86efac', text: '#166534' }
const modifiedIdleColors = { bg: '#fef3c7', border: '#f59e0b', text: '#92400e' }

function getEdgePath(fromNode, toNode) {
  const from = { x: fromNode.x + nodeWidth, y: fromNode.y + nodeHeight / 2 }
  const to = { x: toNode.x, y: toNode.y + nodeHeight / 2 }
  const midX = (from.x + to.x) / 2
  return `M ${from.x} ${from.y} C ${midX} ${from.y}, ${midX} ${to.y}, ${to.x} ${to.y}`
}

export default function StateModifiedAnimation() {
  const [mode, setMode] = useState('without')
  /* nodePhases: { [id]: 'idle'|'modified'|'building'|'testing'|'completed'|'skipped' } */
  const [nodePhases, setNodePhases] = useState({})
  const [isRunning, setIsRunning] = useState(false)
  const [hasRun, setHasRun] = useState(false)
  const [terminalLines, setTerminalLines] = useState([])
  const [diffVisible, setDiffVisible] = useState(false)
  const [summary, setSummary] = useState(null)
  const timeoutsRef = useRef([])

  const reset = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout)
    timeoutsRef.current = []
    setNodePhases({})
    setIsRunning(false)
    setTerminalLines([])
    setHasRun(false)
    setDiffVisible(false)
    setSummary(null)
  }, [])

  const switchMode = (m) => { reset(); setMode(m) }

  const addTimeout = (fn, ms) => {
    const id = setTimeout(fn, ms)
    timeoutsRef.current.push(id)
    return id
  }

  const addLines = (lines) => setTerminalLines(prev => [...prev, ...lines])
  const setPhase = (ids, phase) => setNodePhases(prev => {
    const next = { ...prev }
    ids.forEach(id => { next[id] = phase })
    return next
  })

  /* ─── WITHOUT state:modified ─── */
  const runWithout = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout)
    timeoutsRef.current = []
    setIsRunning(true)
    setHasRun(true)
    setNodePhases({})
    setSummary(null)
    setDiffVisible(false)
    setTerminalLines([])

    // Phase 1: show the diff alone (t=300)
    addTimeout(() => {
      setDiffVisible(true)
      addLines([
        { text: '# Code change detected in int_enriched_orders', type: 'info' },
        { text: '  - sum(order_total) as order_total', type: 'diff-remove' },
        { text: '  + round(sum(order_total), 2) as order_total', type: 'diff-add' },
        { text: '', type: 'blank' },
      ])
    }, 300)

    // Phase 1b: after the diff is visible, mark the node on the DAG (t=1800)
    addTimeout(() => {
      setPhase([MODIFIED_ID], 'modified')
      setPhase(SOURCE_IDS, 'source')
    }, 1800)

    // Phase 2: after a visible pause, show the command (t=3200)
    addTimeout(() => {
      addLines([
        { text: '$ dbt build', type: 'command' },
        { text: 'Concurrency: 4 threads (target="dev")', type: 'info' },
        { text: '', type: 'blank' },
      ])
    }, 3200)

    // Phase 3: DAG animation starts at t=4200
    let t = 4200
    const buildDur = 1200
    const testDur = 1000
    const gapDur = 400

    withoutSteps.forEach((step) => {
      const stepStart = t
      // Build phase
      addTimeout(() => {
        setPhase(step.ids, 'building')
        addLines(step.ids.map(id => ({ text: `  Building ${id}...`, type: 'run' })))
      }, stepStart)

      // Test phase
      addTimeout(() => {
        setPhase(step.ids, 'testing')
        addLines(step.ids.map(id => ({ text: `  Testing ${id}...`, type: 'test' })))
      }, stepStart + buildDur)

      // Complete
      addTimeout(() => {
        setPhase(step.ids, 'completed')
        addLines(step.ids.map(id => ({ text: `  OK ${id} (build + test)`, type: 'ok' })))
      }, stepStart + buildDur + testDur)

      t = stepStart + buildDur + testDur + gapDur
    })

    // Summary
    addTimeout(() => {
      setIsRunning(false)
      addLines([
        { text: '', type: 'blank' },
        { text: `Done. 9 models built · 9 tested. Entire project rebuilt for a one-model change.`, type: 'warn' },
      ])
      setSummary({ built: 9, tested: 9, skipped: 0, pct: null })
    }, t + 400)
  }, [])

  /* ─── WITH state:modified ─── */
  const runWith = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout)
    timeoutsRef.current = []
    setIsRunning(true)
    setHasRun(true)
    setNodePhases({})
    setSummary(null)
    setDiffVisible(false)
    setTerminalLines([])

    // Phase 1: show diff alone (t=300)
    addTimeout(() => {
      setDiffVisible(true)
      addLines([
        { text: '# Code change detected in int_enriched_orders', type: 'info' },
        { text: '  - sum(order_total) as order_total', type: 'diff-remove' },
        { text: '  + round(sum(order_total), 2) as order_total', type: 'diff-add' },
        { text: '', type: 'blank' },
      ])
    }, 300)

    // Phase 1b: mark node as modified on the DAG (t=1800)
    addTimeout(() => {
      setPhase([MODIFIED_ID], 'modified')
      setPhase(SOURCE_IDS, 'source')
    }, 1800)

    // Phase 2: after pause, show command (t=3200)
    addTimeout(() => {
      addLines([
        { text: '$ dbt build -s state:modified+', type: 'command' },
        { text: 'Comparing against production manifest...', type: 'info' },
      ])
    }, 3200)

    // Phase 3: skip unaffected nodes (t=4500)
    addTimeout(() => {
      setPhase(SKIPPED_IDS, 'skipped')
      addLines([
        { text: '  state:modified found 1 changed node: int_enriched_orders', type: 'info' },
        { text: '  + operator selects downstream: fct_orders_with_customers_details', type: 'info' },
        { text: '  Skipping 7 unaffected nodes (deferred to existing relations)', type: 'deferred' },
        { text: '', type: 'blank' },
      ])
    }, 4500)

    // Phase 4: build int_enriched_orders (t=5900)
    addTimeout(() => {
      setPhase([MODIFIED_ID], 'building')
      addLines([{ text: '  Building int_enriched_orders...', type: 'run' }])
    }, 5900)

    // test int_enriched_orders (t=7100)
    addTimeout(() => {
      setPhase([MODIFIED_ID], 'testing')
      addLines([
        { text: '  Testing int_enriched_orders...', type: 'test' },
        { text: '    not_null: PASS', type: 'ok' },
        { text: '    unique: PASS', type: 'ok' },
      ])
    }, 7100)

    // complete int_enriched_orders (t=8300)
    addTimeout(() => {
      setPhase([MODIFIED_ID], 'completed')
      addLines([{ text: '  OK int_enriched_orders (build + test)', type: 'ok' }])
    }, 8300)

    // build fct_orders (t=8900)
    addTimeout(() => {
      setPhase([DOWNSTREAM_ID], 'building')
      addLines([{ text: '  Building fct_orders_with_customers_details...', type: 'run' }])
    }, 8900)

    // test fct_orders (t=10100)
    addTimeout(() => {
      setPhase([DOWNSTREAM_ID], 'testing')
      addLines([
        { text: '  Testing fct_orders_with_customers_details...', type: 'test' },
        { text: '    not_null: PASS', type: 'ok' },
        { text: '    accepted_values: PASS', type: 'ok' },
      ])
    }, 10100)

    // complete fct_orders (t=11300)
    addTimeout(() => {
      setPhase([DOWNSTREAM_ID], 'completed')
      addLines([{ text: '  OK fct_orders_with_customers_details (build + test)', type: 'ok' }])
    }, 11300)

    // summary (t=12100)
    addTimeout(() => {
      setIsRunning(false)
      addLines([
        { text: '', type: 'blank' },
        { text: 'Done. 2 models built · 2 tested · 7 skipped. ~78% less compute.', type: 'success' },
      ])
      setSummary({ built: 2, tested: 2, skipped: 7, pct: 78 })
    }, 12100)
  }, [])

  const runAnimation = mode === 'without' ? runWithout : runWith

  /* ─── Node colors ─── */
  function getColors(nodeId) {
    const phase = nodePhases[nodeId]
    if (SOURCE_IDS.includes(nodeId) && phase !== 'skipped') return sourceColors
    if (phase === 'skipped') return skippedColors
    if (phase === 'building') return buildingColors
    if (phase === 'testing') return testingColors
    if (phase === 'completed') return completedColors
    if (phase === 'modified') return modifiedIdleColors
    if (SOURCE_IDS.includes(nodeId)) return sourceColors
    return idleColors
  }

  function getEdgeState(edge) {
    const fp = nodePhases[edge.from]
    const tp = nodePhases[edge.to]
    if (fp === 'skipped' || tp === 'skipped') return 'skipped'
    if (tp === 'building') return 'building'
    if (tp === 'testing') return 'testing'
    if (fp === 'completed' && (tp === 'completed' || tp === 'building' || tp === 'testing')) return 'completed'
    return 'idle'
  }

  function edgeStroke(state) {
    if (state === 'building') return '#3b82f6'
    if (state === 'testing') return '#7c3aed'
    if (state === 'completed') return '#22c55e'
    if (state === 'skipped') return '#9ca3af'
    return '#d1d5db'
  }

  return (
    <div>
      {/* Header: toggle + button */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div className="inline-flex bg-gray-100 rounded-xl p-1" role="radiogroup" aria-label="state:modified comparison">
          <button role="radio" aria-checked={mode === 'without'}
            onClick={() => switchMode('without')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              mode === 'without' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}>
            <span>Without <code className="text-xs font-mono bg-gray-100 px-1 rounded">state:modified</code></span>
          </button>
          <button role="radio" aria-checked={mode === 'with'}
            onClick={() => switchMode('with')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              mode === 'with' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}>
            <span>With <code className="text-xs font-mono bg-gray-100 px-1 rounded">state:modified</code></span>
          </button>
        </div>
        <button
          onClick={runAnimation}
          disabled={isRunning}
          className={`px-5 py-2 rounded-lg font-medium text-sm transition-all duration-150 ${
            isRunning ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gray-900 text-white hover:bg-gray-800'
          }`}>
          {isRunning ? 'Running...' : hasRun ? 'Run again' : 'Run simulation'}
        </button>
      </div>

      {/* Diff callout */}
      <AnimatePresence>
        {diffVisible && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 border border-amber-200 bg-amber-50/60 rounded-xl p-3 font-mono text-xs overflow-hidden"
          >
            <p className="text-[10px] font-semibold text-amber-700 uppercase tracking-wider mb-1.5">Code change in int_enriched_orders</p>
            <div className="text-red-600 bg-red-50 px-2 py-0.5 rounded mb-0.5">- sum(order_total) as order_total</div>
            <div className="text-green-700 bg-green-50 px-2 py-0.5 rounded">+ round(sum(order_total), 2) as order_total</div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DAG */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-4 overflow-x-auto">
        <svg width="1060" height="350" viewBox="0 0 1060 350" className="w-full h-auto">
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
                animate={{ stroke: edgeStroke(state), strokeWidth: state === 'building' || state === 'testing' ? 2.5 : 2 }}
                strokeDasharray={state === 'skipped' ? '6 4' : 'none'}
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
                animate={{ fill: edgeStroke(state) }}
                transition={{ duration: 0.4 }}
              />
            )
          })}

          {/* Nodes */}
          {nodes.map((node) => {
            const phase = nodePhases[node.id]
            const colors = getColors(node.id)
            const isModifiedNode = node.id === MODIFIED_ID

            return (
              <motion.g key={node.id}>
                {/* Modified marker (dashed amber border) */}
                {isModifiedNode && diffVisible && (
                  <rect
                    x={node.x - 3} y={node.y - 3}
                    width={nodeWidth + 6} height={nodeHeight + 6}
                    rx={10} fill="none" stroke="#f59e0b" strokeWidth={2} strokeDasharray="4 3" opacity={0.6}
                  />
                )}

                {/* Node rect */}
                <motion.rect
                  x={node.x} y={node.y} width={nodeWidth} height={nodeHeight} rx={8}
                  animate={{ fill: colors.bg, stroke: colors.border }}
                  strokeWidth={phase === 'building' || phase === 'testing' ? 2.5 : 1.5}
                  transition={{ duration: 0.4 }}
                />

                {/* Active pulse */}
                {(phase === 'building' || phase === 'testing') && (
                  <motion.rect
                    x={node.x} y={node.y} width={nodeWidth} height={nodeHeight} rx={8}
                    fill="none" stroke={colors.border} strokeWidth={1}
                    initial={{ opacity: 0.6 }}
                    animate={{ opacity: [0.6, 0, 0.6] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                )}

                {/* Completed checkmark */}
                {phase === 'completed' && (
                  <>
                    <motion.circle
                      cx={node.x + nodeWidth - 12} cy={node.y + 12} r={6} fill="#22c55e"
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

                {/* Phase badge */}
                {phase === 'building' && !SOURCE_IDS.includes(node.id) && (
                  <g>
                    <rect x={node.x + nodeWidth - 56} y={node.y + 2} width={52} height={14} rx={3} fill="#1e40af" />
                    <text x={node.x + nodeWidth - 30} y={node.y + 12} textAnchor="middle" fontSize={7} fontWeight={700} fill="white" fontFamily="ui-sans-serif,system-ui,sans-serif">
                      building
                    </text>
                  </g>
                )}
                {phase === 'testing' && !SOURCE_IDS.includes(node.id) && (
                  <g>
                    <rect x={node.x + nodeWidth - 52} y={node.y + 2} width={48} height={14} rx={3} fill="#7c3aed" />
                    <text x={node.x + nodeWidth - 28} y={node.y + 12} textAnchor="middle" fontSize={7} fontWeight={700} fill="white" fontFamily="ui-sans-serif,system-ui,sans-serif">
                      testing
                    </text>
                  </g>
                )}

                {/* Skipped badge */}
                {phase === 'skipped' && !SOURCE_IDS.includes(node.id) && (
                  <g>
                    <rect x={node.x + nodeWidth - 52} y={node.y + 2} width={48} height={14} rx={3} fill="#6b7280" />
                    <text x={node.x + nodeWidth - 28} y={node.y + 12} textAnchor="middle" fontSize={7} fontWeight={700} fill="white" fontFamily="ui-sans-serif,system-ui,sans-serif">
                      skipped
                    </text>
                  </g>
                )}

                {/* Modified badge */}
                {phase === 'modified' && (
                  <g>
                    <rect x={node.x + nodeWidth - 58} y={node.y + 2} width={54} height={14} rx={3} fill="#f59e0b" />
                    <text x={node.x + nodeWidth - 31} y={node.y + 12} textAnchor="middle" fontSize={7} fontWeight={700} fill="white" fontFamily="ui-sans-serif,system-ui,sans-serif">
                      modified
                    </text>
                  </g>
                )}

                {/* Node label */}
                <text
                  x={node.x + nodeWidth / 2}
                  y={node.y + nodeHeight / 2 + 1}
                  textAnchor="middle" dominantBaseline="middle"
                  fontSize={node.id === 'fct_orders' ? 9 : 11}
                  fontFamily="ui-monospace, monospace"
                  fontWeight={600} fill={colors.text}
                >
                  {node.label}
                </text>
              </motion.g>
            )
          })}

          {/* Column labels */}
          <text x={130} y={340} textAnchor="middle" fontSize={10} fill="#9ca3af" fontWeight={500}>Sources</text>
          <text x={350} y={340} textAnchor="middle" fontSize={10} fill="#9ca3af" fontWeight={500}>Staging</text>
          <text x={610} y={340} textAnchor="middle" fontSize={10} fill="#9ca3af" fontWeight={500}>Intermediate</text>
          <text x={880} y={340} textAnchor="middle" fontSize={10} fill="#9ca3af" fontWeight={500}>Marts</text>
        </svg>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mb-4 text-xs text-gray-500">
        <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded" style={{ background: '#93c5fd', border: '1.5px solid #3b82f6' }} /> Building</div>
        <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded" style={{ background: '#c4b5fd', border: '1.5px solid #7c3aed' }} /> Testing</div>
        <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded" style={{ background: '#86efac', border: '1.5px solid #22c55e' }} /> Complete</div>
        <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded" style={{ background: '#e5e7eb', border: '1.5px solid #9ca3af' }} /> Skipped (deferred)</div>
        <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded border-2 border-dashed" style={{ borderColor: '#f59e0b' }} /> Modified node</div>
      </div>

      {/* Summary bar */}
      <AnimatePresence>
        {summary && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`mb-4 rounded-xl px-4 py-3 flex items-center justify-between ${
              summary.pct ? 'border border-green-200 bg-green-50/50' : 'border border-amber-200 bg-amber-50/50'
            }`}
          >
            <div className="flex items-center gap-4 text-xs font-semibold">
              <span className={summary.pct ? 'text-green-800' : 'text-amber-800'}>
                {summary.built} built · {summary.tested} tested{summary.skipped > 0 ? ` · ${summary.skipped} skipped` : ''}
              </span>
            </div>
            {summary.pct && (
              <span className="text-xs font-bold text-green-700">~{summary.pct}% less compute</span>
            )}
            {!summary.pct && (
              <span className="text-xs font-bold text-amber-700">Entire project rebuilt</span>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Terminal */}
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
                line.type === 'test' ? 'text-purple-600' :
                line.type === 'ok' ? 'text-emerald-600' :
                line.type === 'success' ? 'text-emerald-700 font-bold' :
                line.type === 'warn' ? 'text-amber-600 font-bold' :
                line.type === 'deferred' ? 'text-gray-500 italic' :
                line.type === 'diff-remove' ? 'text-red-600' :
                line.type === 'diff-add' ? 'text-green-700' :
                ''
              }
            >
              {line.text || '\u00A0'}
            </motion.div>
          ))}
        </AnimatePresence>
        {terminalLines.length === 0 && (
          <div className="text-gray-400">Click &quot;Run simulation&quot; to compare...</div>
        )}
      </div>
    </div>
  )
}
