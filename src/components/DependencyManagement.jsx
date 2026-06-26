import { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/* ------------------------------------------------------------------ */
/*  DAG config                                                         */
/* ------------------------------------------------------------------ */

const nodes = [
  { id: 'raw_orders',     label: 'raw_orders',     type: 'source',  x: 40,  y: 20 },
  { id: 'raw_customers',  label: 'raw_customers',  type: 'source',  x: 40,  y: 100 },
  { id: 'stg_orders',     label: 'stg_orders',     type: 'staging', x: 280, y: 20 },
  { id: 'stg_customers',  label: 'stg_customers',  type: 'staging', x: 280, y: 100 },
  { id: 'fct_orders',     label: 'fct_orders',     type: 'mart',    x: 520, y: 60 },
]

const edges = [
  { from: 'raw_orders',    to: 'stg_orders' },
  { from: 'raw_customers', to: 'stg_customers' },
  { from: 'stg_orders',    to: 'fct_orders' },
  { from: 'stg_customers', to: 'fct_orders' },
]

const buildSteps = [
  { ids: ['raw_orders', 'raw_customers'], phase: 'source' },
  { ids: ['stg_orders', 'stg_customers'], phase: 'staging' },
  { ids: ['fct_orders'], phase: 'mart' },
]

const nodeWidth = 160
const nodeHeight = 36

// idle = gray (not built), active = blue pulse (building), completed = blue (built)
// sources stay in their own soft-green style throughout
const typeColors = {
  source:  { bg: '#dcfce7', border: '#86efac', text: '#166534' },
  staging: { bg: '#f3f4f6', border: '#d1d5db', text: '#6b7280' },
  mart:    { bg: '#f3f4f6', border: '#d1d5db', text: '#6b7280' },
}

const activeColors = {
  source:  { bg: '#dcfce7', border: '#86efac', text: '#166534' },
  staging: { bg: '#93c5fd', border: '#3b82f6', text: '#1e3a5f' },
  mart:    { bg: '#93c5fd', border: '#3b82f6', text: '#1e3a5f' },
}

const completedColors = {
  source:  { bg: '#dcfce7', border: '#86efac', text: '#166534' },
  staging: { bg: '#dbeafe', border: '#3b82f6', text: '#1e3a5f' },
  mart:    { bg: '#dbeafe', border: '#3b82f6', text: '#1e3a5f' },
}

function getEdgePath(fromNode, toNode) {
  const from = { x: fromNode.x + nodeWidth, y: fromNode.y + nodeHeight / 2 }
  const to = { x: toNode.x, y: toNode.y + nodeHeight / 2 }
  const midX = (from.x + to.x) / 2
  return `M ${from.x} ${from.y} C ${midX} ${from.y}, ${midX} ${to.y}, ${to.x} ${to.y}`
}

/* ------------------------------------------------------------------ */
/*  Reduced motion                                                     */
/* ------------------------------------------------------------------ */

function usePrefersReducedMotion() {
  const [prefersReduced, setPrefersReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReduced(mq.matches)
    const handler = (e) => setPrefersReduced(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])
  return prefersReduced
}

/* ------------------------------------------------------------------ */
/*  Without dbt                                                        */
/* ------------------------------------------------------------------ */

function WithoutDbtSection() {
  return (
    <div className="space-y-4">
      {/* File list */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
          Your model SQL files
        </p>
        <div className="grid grid-cols-3 gap-2">
          {['stg_orders.sql', 'stg_customers.sql', 'fct_orders.sql'].map(f => (
            <motion.div
              key={f}
              whileHover={{ y: -3 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              className="bg-white border border-gray-200 rounded-lg px-3 py-2 font-mono text-xs text-gray-700 text-center cursor-default hover:shadow-md hover:border-gray-300 transition-shadow"
            >
              {f}
            </motion.div>
          ))}
        </div>
        <p className="text-[10px] text-gray-400 mt-1.5 italic">
          These files have no inherent ordering. They're just SQL on disk.
        </p>
      </div>

      {/* Manually maintained run order */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
          Manually maintained run order
        </p>
        <div className="bg-white border-2 border-dashed border-amber-300 rounded-lg p-4 font-mono text-xs leading-relaxed">
          <div className="text-gray-700">
            <span className="text-amber-600 font-bold">1.</span> run stg_orders
          </div>
          <div className="text-gray-700">
            <span className="text-amber-600 font-bold">2.</span> run stg_customers
          </div>
          <div className="text-gray-700">
            <span className="text-amber-600 font-bold">3.</span> run fct_orders
          </div>
        </div>
      </div>

      {/* Failure-mode callout cards */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { title: 'Rename a model', desc: 'The run order silently breaks' },
          { title: 'Add a model', desc: 'You must remember where to insert it' },
          { title: 'Circular dependency', desc: 'Discovered at runtime, not before' },
        ].map((item, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -3 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className="bg-red-50 border border-red-200 rounded-lg p-3 cursor-default hover:shadow-md transition-shadow"
          >
            <p className="text-xs font-semibold text-red-700">{item.title}</p>
            <p className="text-[10px] text-red-600/70 mt-0.5">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  With dbt: code panel + DAG + animation                             */
/*                                                                      */
/*  Phases (each highlight is temporary — on then off):                 */
/*    idle                                                              */
/*    pulse-refs      – green highlight + pulse on ref lines & stg nodes*/
/*    build-staging   – stg_orders/stg_customers build (sources done)   */
/*    pause-after-stg – brief gap, refs cleared                         */
/*    pulse-focus     – green highlight + pulse on filename & fct node  */
/*    build-mart      – fct_orders builds                               */
/*    done            – all built, highlights cleared                   */
/* ------------------------------------------------------------------ */

function WithDbtSection() {
  const [animPhase, setAnimPhase] = useState('idle')
  const [currentStep, setCurrentStep] = useState(-1)
  const [completedSteps, setCompletedSteps] = useState([])
  const [hasRun, setHasRun] = useState(false)
  const timeoutsRef = useRef([])
  const prefersReduced = usePrefersReducedMotion()

  const clearTimeouts = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout)
    timeoutsRef.current = []
  }, [])

  // Derive highlight booleans from phase — each is only on during its window
  const highlightRefs = animPhase === 'pulse-refs' || animPhase === 'build-staging'
  const pulseUpstream = animPhase === 'pulse-refs'
  const highlightFilename = animPhase === 'pulse-focus' || animPhase === 'build-mart'
  const pulseFocus = animPhase === 'pulse-focus'

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
    if (toState === 'completed' && fromState === 'completed') return 'completed'
    return 'idle'
  }, [getNodeState])

  const runAnimation = useCallback(() => {
    clearTimeouts()
    setHasRun(true)
    setCurrentStep(-1)
    setCompletedSteps([])

    if (prefersReduced) {
      setCompletedSteps([0, 1, 2])
      setAnimPhase('done')
      return
    }

    const schedule = (fn, ms) => {
      const t = setTimeout(fn, ms)
      timeoutsRef.current.push(t)
    }

    // 1. Pulse refs + upstream nodes for ~1.8s (nothing builds yet)
    setAnimPhase('pulse-refs')

    // 2. Build upstream: sources complete instantly, staging starts building
    schedule(() => {
      setAnimPhase('build-staging')
      setCompletedSteps([0]) // sources done
      setCurrentStep(1)      // staging active (building)
    }, 1800)

    // Staging complete — clear ref highlight
    schedule(() => {
      setCompletedSteps([0, 1])
      setCurrentStep(-1)
      setAnimPhase('pause-after-stg') // brief pause, refs now off
    }, 3400)

    // 3. Pulse focus model title + fct node for ~1.8s
    schedule(() => {
      setAnimPhase('pulse-focus')
    }, 3800)

    // 4. Build fct_orders
    schedule(() => {
      setAnimPhase('build-mart')
      setCurrentStep(2)
    }, 5600)

    // Mart complete — clear focus highlight
    schedule(() => {
      setCompletedSteps([0, 1, 2])
      setCurrentStep(-1)
    }, 7000)

    // 5. Done — all highlights off
    schedule(() => {
      setAnimPhase('done')
    }, 7400)
  }, [clearTimeouts, prefersReduced])

  const isRunning = !['idle', 'done'].includes(animPhase)

  return (
    <div className="space-y-2">
      {/* Inline CSS for pulse keyframe */}
      <style>{`
        @keyframes dep-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        .dep-pulse { animation: dep-pulse 0.8s ease-in-out infinite; }
      `}</style>

      {/* Header + button */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-500 leading-relaxed">
            dbt reads <code className="bg-gray-100 px-1.5 py-0.5 rounded text-[10px] font-mono text-emerald-700">ref()</code> calls,
            builds the dependency graph automatically, and works out the correct build order — no hand-maintained run script.
          </p>
        </div>
        <button
          onClick={runAnimation}
          disabled={isRunning}
          className={`px-5 py-2 rounded-lg font-medium text-sm transition-all duration-150 shrink-0 ml-4 ${
            isRunning
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-gray-900 text-white hover:bg-gray-800 active:bg-gray-950'
          }`}
        >
          {isRunning ? 'Running...' : hasRun ? 'Replay' : 'Run pipeline'}
        </button>
      </div>

      {/* Code panel — full width, on top */}
      <div className="bg-white border border-gray-200 rounded-lg p-3 font-mono text-[11px] leading-relaxed">
        <div className={`mb-2 transition-all duration-400 rounded -ml-2 pl-2 py-0.5 ${highlightFilename ? (pulseFocus ? 'bg-emerald-50 border-l-2 border-emerald-400 text-emerald-700 font-bold dep-pulse' : 'bg-emerald-50 border-l-2 border-emerald-400 text-emerald-700 font-bold') : 'text-gray-400 border-l-2 border-transparent'}`}>
          -- models/marts/fct_orders.sql
        </div>
        <div className="text-gray-700">
          <div><span className="text-blue-600">SELECT</span></div>
          <div className="ml-4">o.order_id,</div>
          <div className="ml-4">o.customer_id,</div>
          <div className="ml-4">c.customer_name,</div>
          <div className="ml-4">o.amount</div>
          <div className={`border-l-2 -ml-2 pl-2 py-0.5 transition-all duration-400 ${highlightRefs ? (pulseUpstream ? 'bg-emerald-50 border-emerald-400 dep-pulse' : 'bg-emerald-50 border-emerald-400') : 'bg-transparent border-transparent'}`}>
            <span className="text-blue-600">FROM</span>{' '}
            <span className={`font-bold transition-colors duration-400 ${highlightRefs ? 'text-emerald-600' : 'text-gray-700'}`}>
              {"{{ ref('stg_orders') }}"}
            </span>{' '}o
          </div>
          <div className={`border-l-2 -ml-2 pl-2 py-0.5 transition-all duration-400 ${highlightRefs ? (pulseUpstream ? 'bg-emerald-50 border-emerald-400 dep-pulse' : 'bg-emerald-50 border-emerald-400') : 'bg-transparent border-transparent'}`}>
            <span className="text-blue-600">LEFT JOIN</span>{' '}
            <span className={`font-bold transition-colors duration-400 ${highlightRefs ? 'text-emerald-600' : 'text-gray-700'}`}>
              {"{{ ref('stg_customers') }}"}
            </span>{' '}c
          </div>
          <div className="ml-8"><span className="text-blue-600">ON</span> o.customer_id = c.customer_id</div>
        </div>
      </div>

      {/* DAG — full width, underneath */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 overflow-x-auto">
        <svg width="740" height="160" viewBox="0 0 740 160" className="w-full h-auto">
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
                  stroke: state === 'active' ? '#3b82f6'
                    : state === 'completed' ? '#3b82f6'
                    : '#d1d5db',
                  strokeWidth: state === 'active' ? 2.5 : 2,
                }}
                transition={{ duration: 0.4 }}
              />
            )
          })}

          {/* Edge dots */}
          {edges.map((edge) => {
            const toNode = nodes.find(n => n.id === edge.to)
            const state = getEdgeState(edge)
            return (
              <motion.circle
                key={`dot-${edge.from}-${edge.to}`}
                cx={toNode.x - 4}
                cy={toNode.y + nodeHeight / 2}
                r={3}
                animate={{
                  fill: state === 'active' ? '#3b82f6'
                    : state === 'completed' ? '#3b82f6'
                    : '#d1d5db',
                }}
                transition={{ duration: 0.4 }}
              />
            )
          })}

          {/* Nodes */}
          {nodes.map((node) => {
            const state = getNodeState(node.id)
            const colors = state === 'active' ? activeColors[node.type]
              : state === 'completed' ? completedColors[node.type]
              : typeColors[node.type]

            // Upstream DAG nodes pulse during pulse-refs phase
            const isUpstreamPulse = pulseUpstream && (node.id === 'stg_orders' || node.id === 'stg_customers')
            // Focus DAG node pulses during pulse-focus phase
            const isFocusPulse = pulseFocus && node.id === 'fct_orders'
            // Focus DAG node highlighted (non-pulse) during build-mart
            const isFocusHighlight = animPhase === 'build-mart' && node.id === 'fct_orders'

            const isEmphasized = isUpstreamPulse || isFocusPulse || isFocusHighlight
            const emphasisBg = isEmphasized ? '#a7f3d0' : null
            const emphasisBorder = isEmphasized ? '#10b981' : null
            const emphasisText = isEmphasized ? '#065f46' : null

            return (
              <motion.g key={node.id}>
                <motion.rect
                  x={node.x}
                  y={node.y}
                  width={nodeWidth}
                  height={nodeHeight}
                  rx={8}
                  animate={{
                    fill: emphasisBg || colors.bg,
                    stroke: emphasisBorder || colors.border,
                  }}
                  strokeWidth={state === 'active' || isEmphasized ? 2.5 : 1.5}
                  transition={{ duration: 0.4 }}
                />
                {/* Pulse ring during emphasis phases */}
                {(isUpstreamPulse || isFocusPulse) && (
                  <motion.rect
                    x={node.x}
                    y={node.y}
                    width={nodeWidth}
                    height={nodeHeight}
                    rx={8}
                    fill="none"
                    stroke={emphasisBorder}
                    strokeWidth={1.5}
                    initial={{ opacity: 0.7 }}
                    animate={{ opacity: [0.7, 0.1, 0.7] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                  />
                )}
                {/* Pulse ring on active (building) */}
                {state === 'active' && node.type !== 'source' && (
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
                {/* Checkmark */}
                {state === 'completed' && node.type !== 'source' && (
                  <>
                    <motion.circle
                      cx={node.x + nodeWidth - 12}
                      cy={node.y + 12}
                      r={6}
                      fill="#3b82f6"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                    />
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
                  </>
                )}
                {/* Label */}
                <text
                  x={node.x + nodeWidth / 2}
                  y={node.y + nodeHeight / 2 + 1}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={11}
                  fontFamily="ui-monospace, monospace"
                  fontWeight={600}
                  fill={emphasisText || colors.text}
                >
                  {node.label}
                </text>
              </motion.g>
            )
          })}

          {/* Source labels */}
          {nodes.filter(n => n.type === 'source').map(node => (
            <text key={`lbl-${node.id}`}
              x={node.x + nodeWidth / 2}
              y={node.y + nodeHeight + 12}
              textAnchor="middle"
              fontSize={8}
              fill="#9ca3af"
              fontStyle="italic"
            >
              source — not built / read-only
            </text>
          ))}
        </svg>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Main export: toggles between Without / With dbt                     */
/* ------------------------------------------------------------------ */

export default function DependencyManagement({ showDbt }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={showDbt ? 'with' : 'without'}
        initial={{ opacity: 0, x: showDbt ? 10 : -10 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: showDbt ? -10 : 10 }}
        transition={{ duration: 0.25 }}
      >
        {!showDbt ? (
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
            <WithoutDbtSection />
          </div>
        ) : (
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
            <WithDbtSection />
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}
