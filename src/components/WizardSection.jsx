import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'

/* ═══════════════════════════════════════════════════
   Design tokens (matches existing app)
   ═══════════════════════════════════════════════════ */
const NAVY = '#111827'
const GREEN = '#059669'
const GREEN_LIGHT = '#f0fdf4'
const RED = '#dc2626'
const RED_LIGHT = '#fef2f2'
const BLUE = '#3b82f6'
const BLUE_LIGHT = '#eff6ff'
const AMBER = '#d97706'

const fadeSlide = {
  initial: { opacity: 0, x: 16 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -16 },
  transition: { duration: 0.3 },
}

/* ═══════════════════════════════════════════════════
   Tabs & descriptions
   ═══════════════════════════════════════════════════ */
const topics = [
  { key: 'intelligence', label: 'Intelligence' },
  { key: 'scope', label: 'Scope' },
  { key: 'tokens', label: 'Token efficiency' },
]

const topicDescs = {
  intelligence: 'dbt Wizard understands the right validation checks and always routes to the right tool. It self-validates before showing you anything.',
  scope: 'dbt Wizard can troubleshoot failed jobs and read from production after making changes, so it can confirm work will hold up in other environments.',
  tokens: "dbt's native metadata engine retrieves exactly what the agent needs before it writes a single line, so you get more accurate output while spending fewer tokens.",
}

/* ═══════════════════════════════════════════════════
   Toggle (kept from original)
   ═══════════════════════════════════════════════════ */
function Toggle({ value, onChange }) {
  return (
    <div className="inline-flex bg-gray-100 rounded-xl p-1" role="radiogroup" aria-label="Comparison mode">
      <button
        role="radio"
        aria-checked={value === 'without'}
        onClick={() => onChange('without')}
        className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
          value === 'without' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        Without dbt Wizard
      </button>
      <button
        role="radio"
        aria-checked={value === 'with'}
        onClick={() => onChange('with')}
        className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
          value === 'with' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        With dbt Wizard
      </button>
    </div>
  )
}

/* ═══════════════════════════════════════════════════
   Play button
   ═══════════════════════════════════════════════════ */
function PlayButton({ playing, hasPlayed, onPlay }) {
  return (
    <button
      onClick={onPlay}
      disabled={playing}
      className={`px-5 py-2 rounded-lg font-medium text-sm transition-all duration-150 ${
        playing ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gray-900 text-white hover:bg-gray-800'
      }`}
    >
      {playing ? 'Running...' : hasPlayed ? 'Run again' : 'Run simulation'}
    </button>
  )
}

/* ═══════════════════════════════════════════════════
   Shared animation helpers
   ═══════════════════════════════════════════════════ */
function useLoopIndex(items, intervalMs, enabled = true) {
  const [index, setIndex] = useState(0)
  const prefersReduced = useReducedMotion()
  useEffect(() => {
    if (!enabled || prefersReduced) return
    const id = setInterval(() => setIndex(i => (i + 1) % items.length), intervalMs)
    return () => clearInterval(id)
  }, [items.length, intervalMs, enabled, prefersReduced])
  useEffect(() => { setIndex(0) }, [enabled])
  return index
}

function SectionLabel({ children }) {
  return <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-3">{children}</p>
}

/* ═══════════════════════════════════════════════════
   SECTION 1 — Intelligence
   ═══════════════════════════════════════════════════ */

const INTEL_PROMPT = '"Write an accepted_values test for ship_mode."'

function IntelSimulator({ mode, runId }) {
  const prefersReduced = useReducedMotion()
  const [visibleSteps, setVisibleSteps] = useState(0)
  const intervalRef = useRef(null)
  const stepCount = mode === 'without' ? 5 : 10

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    setVisibleSteps(0)
    if (runId === 0) return
    if (prefersReduced) { setVisibleSteps(stepCount); return }

    let count = 0
    intervalRef.current = setInterval(() => {
      count++
      setVisibleSteps(count)
      if (count >= stepCount) clearInterval(intervalRef.current)
    }, STEP_DELAY)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [runId, mode, stepCount, prefersReduced])

  if (runId === 0) {
    return <div className="py-6 text-center text-xs text-gray-300">Press &quot;Run simulation&quot; to compare how each writes this test</div>
  }

  const stepStyle = (n) => ({
    opacity: visibleSteps >= n ? 1 : 0,
    transform: visibleSteps >= n ? 'translateY(0)' : 'translateY(8px)',
    transition: prefersReduced ? 'none' : `opacity 280ms ${STEP_EASE}, transform 280ms ${STEP_EASE}`,
    willChange: visibleSteps >= n - 1 && visibleSteps < n + 1 ? 'transform, opacity' : 'auto',
    pointerEvents: visibleSteps >= n ? 'auto' : 'none',
  })

  const Check = ({ children }) => (
    <div className="flex items-center gap-1.5 text-[10px]">
      <span className="text-green-500 font-bold shrink-0">&#10003;</span>
      <span className="text-gray-600">{children}</span>
    </div>
  )

  if (mode === 'without') {
    return (
      <div className="space-y-3">
        {/* Pulse 1: scaffold */}
        <div style={stepStyle(2)}>
          <div className="bg-white border border-gray-200 rounded-lg p-3">
            <p className="text-[10px] font-semibold text-gray-700 mb-1.5">Writes an accepted_values test</p>
            <div className="font-mono text-[9px] leading-relaxed text-gray-700">
              <div><span className="text-purple-600">columns</span><span className="text-gray-800">:</span></div>
              <div>  - <span className="text-purple-600">name</span><span className="text-gray-800">:</span> <span className="text-emerald-600">ship_mode</span></div>
              <div>    <span className="text-purple-600">data_tests</span><span className="text-gray-800">:</span></div>
              <div>      - <span className="text-blue-600">accepted_values</span><span className="text-gray-800">:</span></div>
              {/* Pulse 2: guessed values with amber accent */}
              <div style={stepStyle(3)} className="bg-amber-50 border border-amber-200 rounded -mx-1 px-1 py-0.5 mt-0.5">
                <div>          <span className="text-purple-600">values</span><span className="text-gray-800">:</span> <span className="text-[8px] text-amber-600 font-semibold ml-1">guessed</span></div>
                <div>            - <span className="text-amber-700 font-semibold">'Standard'</span></div>
                <div>            - <span className="text-amber-700 font-semibold">'Express'</span></div>
                <div>            - <span className="text-amber-700 font-semibold">'Two-Day'</span></div>
                <div>            - <span className="text-amber-700 font-semibold">'Overnight'</span></div>
              </div>
            </div>
          </div>
        </div>

        <div style={stepStyle(4)}>
          <div className="border border-red-200 bg-red-50/30 rounded-lg p-3">
            <div className="flex items-center gap-1.5 text-[10px]">
              <span className="text-red-500 font-bold shrink-0">&#10007;</span>
              <span className="text-red-700 font-semibold">accepted_values test on ship_mode FAILED</span>
            </div>
            <p className="text-[10px] text-gray-600 mt-1">6,012 rows with unexpected values. The real column contains completely different values.</p>
          </div>
        </div>

        <div style={stepStyle(5)}>
          <div className="border border-amber-200 bg-amber-50/50 rounded-lg px-3 py-2">
            <p className="text-[10px] text-amber-800 font-medium">It guessed values it never verified against the data, so the test is wrong out of the gate.</p>
          </div>
        </div>
      </div>
    )
  }

  // With dbt Wizard — 11 steps (query → table → pulse bad row → fix → scaffold → values → build → validate → git → takeaway)
  const badRowPulsing = visibleSteps >= 4 && visibleSteps < 5

  return (
    <div className="space-y-3">
      <style>{`@keyframes bad-row-pulse { 0%, 100% { background-color: rgb(255 251 235); } 50% { background-color: rgb(254 243 199); } }`}</style>

      {/* Beat 1: query */}
      <div style={stepStyle(2)}>
        <div className="bg-white border border-gray-200 rounded-lg p-3">
          <p className="text-[10px] font-semibold text-gray-700 mb-1.5">Queries the column's real values</p>
          <div className="font-mono text-[9px] text-gray-500">
            select ship_mode, count(*) from {'{{ ref(\'stg_line_items\') }}'} group by 1 order by 2 desc
          </div>
        </div>
      </div>

      {/* Beat 2: results table */}
      <div style={stepStyle(3)}>
        <div className="bg-white border border-gray-200 rounded-lg p-3">
          <table className="w-full text-[10px]">
            <thead>
              <tr className="text-left text-[9px] text-gray-400 uppercase tracking-wider">
                <th className="pb-1 font-semibold">ship_mode</th>
                <th className="pb-1 font-semibold text-right">count</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 font-mono">
              <tr className="border-t border-gray-100"><td className="py-0.5">TRUCK</td><td className="py-0.5 text-right">142,310</td></tr>
              <tr className="border-t border-gray-100"><td className="py-0.5">MAIL</td><td className="py-0.5 text-right">98,442</td></tr>
              <tr className="border-t border-gray-100"><td className="py-0.5">AIR</td><td className="py-0.5 text-right">61,003</td></tr>
              <tr className="border-t border-gray-100"><td className="py-0.5">FOB</td><td className="py-0.5 text-right">54,887</td></tr>
              <tr className="border-t border-gray-100"><td className="py-0.5">RAIL</td><td className="py-0.5 text-right">48,210</td></tr>
              <tr className="border-t border-gray-100"><td className="py-0.5">SHIP</td><td className="py-0.5 text-right">39,104</td></tr>
              <tr className="border-t border-gray-100"><td className="py-0.5">REG AIR</td><td className="py-0.5 text-right">12,118</td></tr>
              <tr className="border-t border-gray-100"
                style={badRowPulsing && !prefersReduced ? { animation: 'bad-row-pulse 1.2s ease-in-out infinite' } : { backgroundColor: visibleSteps >= 4 ? 'rgb(255 251 235)' : undefined }}>
                <td className="py-0.5 text-amber-700 font-semibold">reg air</td>
                <td className="py-0.5 text-right text-amber-600">421 <span className="text-[8px] text-amber-500 ml-1">&#8592; inconsistent</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Beat 3: pulse highlight on bad row (step 4 is just the pulse activating — no new content) */}

      <div style={stepStyle(5)}>
        <div className="bg-white border border-gray-200 rounded-lg p-3">
          <p className="text-[10px] font-semibold text-gray-700 mb-1.5">Fixes the inconsistency in the model SQL</p>
          <div className="font-mono text-[9px] space-y-0.5">
            <div className="text-red-600 bg-red-50 px-1.5 py-0.5 rounded">- ship_mode</div>
            <div className="text-green-700 bg-green-50 px-1.5 py-0.5 rounded">+ upper(trim(ship_mode)) as ship_mode</div>
          </div>
        </div>
      </div>

      {/* YAML scaffold */}
      <div style={stepStyle(6)}>
        <div className="bg-white border border-gray-200 rounded-lg p-3">
          <p className="text-[10px] font-semibold text-gray-700 mb-1.5">Writes the accepted_values test</p>
          <div className="font-mono text-[9px] leading-relaxed text-gray-700">
            <div><span className="text-purple-600">columns</span><span className="text-gray-800">:</span></div>
            <div>  - <span className="text-purple-600">name</span><span className="text-gray-800">:</span> <span className="text-emerald-600">ship_mode</span></div>
            <div>    <span className="text-purple-600">data_tests</span><span className="text-gray-800">:</span></div>
            <div>      - <span className="text-blue-600">accepted_values</span><span className="text-gray-800">:</span></div>
            {/* YAML values — confirmed */}
            <div style={stepStyle(7)} className="bg-green-50 border border-green-200 rounded -mx-1 px-1 py-0.5 mt-0.5">
              <div>          <span className="text-purple-600">values</span><span className="text-gray-800">:</span> <span className="text-[8px] text-green-600 font-semibold ml-1">confirmed from data</span></div>
              {['TRUCK', 'MAIL', 'AIR', 'FOB', 'RAIL', 'SHIP', 'REG AIR'].map(v => (
                <div key={v}>            - <span className="text-green-700 font-semibold">'{v}'</span></div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={stepStyle(8)}>
        <div className="flex items-center gap-1.5 text-[10px] text-gray-500">
          <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded text-[9px]">dbt build --select stg_line_items</span>
        </div>
      </div>

      <div style={stepStyle(9)}>
        <div className="space-y-1">
          <Check><code className="bg-gray-100 px-1 rounded text-[9px] font-mono">dbt parse</code> passed</Check>
          <Check><code className="bg-gray-100 px-1 rounded text-[9px] font-mono">stg_line_items</code> compiled successfully</Check>
          <Check>accepted_values test on ship_mode passed</Check>
        </div>
      </div>

      <div style={stepStyle(10)}>
        <div className="border border-green-200 bg-green-50/50 rounded-lg px-3 py-2">
          <p className="text-[10px] text-green-800 font-medium">It checked the real data, fixed the inconsistency it found, and the test reflects what's actually there — passed on the first run.</p>
        </div>
      </div>
    </div>
  )
}

function IntelligenceContent({ mode }) {
  const [intelRunId, setIntelRunId] = useState(0)
  const [playing, setPlaying] = useState(false)

  const handleRun = () => {
    setIntelRunId(r => r + 1)
    setPlaying(true)
    const count = mode === 'without' ? 5 : 10
    setTimeout(() => setPlaying(false), STEP_DELAY * (count + 1))
  }

  // Reset on mode change
  useEffect(() => {
    setIntelRunId(0)
    setPlaying(false)
  }, [mode])

  return (
    <AnimatePresence mode="wait">
      <motion.div key={`intel-${mode}`} {...fadeSlide}>
        <div className="border border-gray-200 rounded-xl p-4 bg-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs font-bold text-gray-900 mb-0.5">{mode === 'without' ? 'Generic coding agent' : 'dbt Wizard'}</p>
            </div>
            <button
              onClick={handleRun}
              disabled={playing}
              className={`px-5 py-2 rounded-lg font-medium text-sm transition-all duration-150 shrink-0 ml-4 ${
                playing ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gray-900 text-white hover:bg-gray-800'
              }`}
            >
              {playing ? 'Running...' : intelRunId > 0 ? 'Run again' : 'Run simulation'}
            </button>
          </div>

          <div className="bg-gray-50 rounded-lg px-3 py-2 mb-4">
            <p className="text-[10px] text-gray-400 font-medium mb-0.5">Prompt</p>
            <p className="text-xs text-gray-700 font-medium italic">{INTEL_PROMPT}</p>
          </div>

          <IntelSimulator mode={mode} runId={intelRunId} />
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

/* ═══════════════════════════════════════════════════
   SECTION 2 — Scope (static comparison)
   ═══════════════════════════════════════════════════ */

const SCOPE_WITHOUT_POINTS = [
  'No concept of production. You cannot see what is running live or what the production data looks like.',
  'No visibility into failed jobs or tests. A broken run in another environment stays invisible until someone flags it.',
  'No way to know how a change behaves elsewhere. Passing in dev does not mean it passes in production.',
]

const STEP_DELAY = 1200
const STEP_EASE = 'cubic-bezier(0.16, 1, 0.3, 1)'

function ScopeSimulator({ scenario, runId }) {
  const prefersReduced = useReducedMotion()
  const [visibleSteps, setVisibleSteps] = useState(0)
  const intervalRef = useRef(null)
  const stepCount = scenario === 'debug' ? 8 : 10

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    setVisibleSteps(0)
    if (runId === 0) return

    if (prefersReduced) {
      setVisibleSteps(stepCount)
      return
    }

    let count = 0
    intervalRef.current = setInterval(() => {
      count++
      setVisibleSteps(count)
      if (count >= stepCount) clearInterval(intervalRef.current)
    }, STEP_DELAY)

    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [runId, scenario, prefersReduced])

  if (runId === 0) {
    return <div className="py-6 text-center text-xs text-gray-300">Press &quot;Run simulation&quot; to see dbt Wizard in action</div>
  }

  // All steps are always rendered; visibility controlled by CSS only (opacity + translateY)
  const stepStyle = (n) => ({
    opacity: visibleSteps >= n ? 1 : 0,
    transform: visibleSteps >= n ? 'translateY(0)' : 'translateY(8px)',
    transition: prefersReduced ? 'none' : `opacity 280ms ${STEP_EASE}, transform 280ms ${STEP_EASE}`,
    willChange: visibleSteps >= n - 1 && visibleSteps < n + 1 ? 'transform, opacity' : 'auto',
    pointerEvents: visibleSteps >= n ? 'auto' : 'none',
  })

  const Check = ({ children }) => (
    <div className="flex items-center gap-1.5 text-[10px]">
      <span className="text-green-500 font-bold shrink-0">&#10003;</span>
      <span className="text-gray-600">{children}</span>
    </div>
  )

  if (scenario === 'debug') {
    return (
      <div className="space-y-3">
        <div style={stepStyle(2)}>
          <div className="border border-red-200 bg-red-50/30 rounded-lg p-3">
            <p className="text-[10px] text-gray-600"><span className="font-semibold text-red-600">Detected:</span> job #4821 failed — 22 of 23 models passed, 1 errored (<code className="bg-white px-1 rounded text-[9px] font-mono border border-red-200">fct_order_items</code>).</p>
          </div>
        </div>

        <div style={stepStyle(3)}>
          <div className="border border-amber-200 bg-amber-50/30 rounded-lg p-3">
            <p className="text-[10px] text-gray-600"><span className="font-semibold text-amber-600">Traced:</span> ambiguous column <code className="bg-white px-1 rounded text-[9px] font-mono border border-amber-200">order_date</code> — present in both <code className="bg-gray-100 px-1 rounded text-[9px] font-mono">stg_orders</code> and <code className="bg-gray-100 px-1 rounded text-[9px] font-mono">stg_payments</code> after a recent join change.</p>
          </div>
        </div>

        <div style={stepStyle(4)}>
          <div className="bg-white border border-gray-200 rounded-lg p-3">
            <p className="text-[10px] font-semibold text-gray-700 mb-1.5">Proposed fix</p>
            <div className="font-mono text-[9px] space-y-0.5">
              <div className="text-red-600 bg-red-50 px-1.5 py-0.5 rounded">- select order_date</div>
              <div className="text-green-700 bg-green-50 px-1.5 py-0.5 rounded">+ select orders.order_date</div>
            </div>
          </div>
        </div>

        <div style={stepStyle(5)}>
          <div className="flex items-center gap-1.5 text-[10px] text-gray-500">
            <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded text-[9px]">dbt build --select fct_order_items</span>
          </div>
        </div>

        <div style={stepStyle(6)}>
          <div className="space-y-1">
            <Check><code className="bg-gray-100 px-1 rounded text-[9px] font-mono">dbt parse</code> passed</Check>
            <Check><code className="bg-gray-100 px-1 rounded text-[9px] font-mono">fct_order_items</code> compiled successfully</Check>
            <Check>All tests pass</Check>
          </div>
        </div>

        <div style={stepStyle(7)}>
          <div className="bg-white border border-gray-200 rounded-lg p-3">
            <p className="text-[10px] font-semibold text-gray-700 mb-1.5">Committed to Git</p>
            <div className="flex items-center gap-2 text-[10px]">
              <span className="text-amber-600 font-mono font-semibold">e4a2f1c</span>
              <span className="text-gray-600">fix: qualify ambiguous order_date in fct_order_items</span>
            </div>
            <p className="text-[9px] text-gray-400 mt-1">Branch: <code className="bg-gray-100 px-1 rounded font-mono">fix/fct-order-items-ambiguous-col</code></p>
          </div>
        </div>

        <div style={stepStyle(8)}>
          <div className="border border-green-200 bg-green-50/50 rounded-lg px-3 py-2">
            <p className="text-[10px] text-green-800 font-medium">Failure detected, root cause traced, fix applied, validated, and committed — before anyone had to report it.</p>
          </div>
        </div>
      </div>
    )
  }

  // Refactor with scenario — 10 steps
  return (
    <div className="space-y-3">
      <div style={stepStyle(2)}>
        <div className="bg-white border border-gray-200 rounded-lg p-3">
          <p className="text-[10px] font-semibold text-gray-700 mb-1.5">Refactored SQL</p>
          <div className="font-mono text-[9px] space-y-0.5">
            <div className="text-gray-400 px-1.5 py-0.5">-- before</div>
            <div className="text-red-600 bg-red-50 px-1.5 py-0.5 rounded">case when sub.plan is not null then 'active'</div>
            <div className="text-red-600 bg-red-50 px-1.5 py-0.5 rounded">     else 'inactive' end as customer_status</div>
            <div className="text-gray-400 px-1.5 py-0.5 mt-1">-- after</div>
            <div className="text-green-700 bg-green-50 px-1.5 py-0.5 rounded">accounts.customer_status</div>
          </div>
        </div>
      </div>
      <div style={stepStyle(3)}>
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-[10px] text-gray-500 mb-1">
            <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded text-[9px]">dbt build --select int_accounts</span>
          </div>
          <Check><code className="bg-gray-100 px-1 rounded text-[9px] font-mono">dbt parse</code> passed</Check>
          <Check>All tests pass</Check>
        </div>
      </div>
      <div style={stepStyle(4)}>
        <div className="flex items-center gap-1.5 text-[10px] text-gray-500">
          <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded text-[9px]">dbt compare --select int_accounts</span>
        </div>
      </div>
      <div style={stepStyle(5)}>
        <div className="border border-red-200 bg-red-50/30 rounded-lg p-3">
          <p className="text-[10px] font-semibold text-red-700 mb-2">Mismatch detected</p>
          <table className="w-full text-[10px]">
            <thead>
              <tr className="text-left text-[9px] text-gray-400 uppercase tracking-wider">
                <th className="pb-1 font-semibold">Status</th>
                <th className="pb-1 font-semibold text-right">Prod</th>
                <th className="pb-1 font-semibold text-right">Dev (refactor)</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              <tr className="border-t border-gray-100"><td className="py-1 font-mono">active</td><td className="py-1 text-right">31,402</td><td className="py-1 text-right text-red-600">29,847</td></tr>
              <tr className="border-t border-gray-100"><td className="py-1 font-mono">prospect</td><td className="py-1 text-right">12,118</td><td className="py-1 text-right">12,118</td></tr>
              <tr className="border-t border-gray-100"><td className="py-1 font-mono">churned</td><td className="py-1 text-right">4,690</td><td className="py-1 text-right">4,690</td></tr>
              <tr className="border-t border-gray-100 bg-red-50"><td className="py-1 font-mono text-red-600 font-semibold">unknown</td><td className="py-1 text-right">0</td><td className="py-1 text-right text-red-600 font-semibold">1,555 <span className="text-[8px] text-red-500 ml-1">&#8592; new</span></td></tr>
            </tbody>
          </table>
          <p className="text-[9px] text-gray-400 mt-1.5">The accounts source returns null for 1,555 rows the old derived logic classified as active.</p>
        </div>
      </div>
      <div style={stepStyle(6)}>
        <div className="bg-white border border-gray-200 rounded-lg p-3">
          <p className="text-[10px] font-semibold text-gray-700 mb-1.5">Fix applied</p>
          <div className="font-mono text-[9px] space-y-0.5">
            <div className="text-red-600 bg-red-50 px-1.5 py-0.5 rounded">- accounts.customer_status</div>
            <div className="text-green-700 bg-green-50 px-1.5 py-0.5 rounded">+ coalesce(accounts.customer_status, 'active') as customer_status</div>
          </div>
        </div>
      </div>
      <div style={stepStyle(7)}>
        <div className="flex items-center gap-1.5 text-[10px] text-gray-500">
          <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded text-[9px]">dbt compare --select int_accounts</span>
          <span className="text-gray-400 text-[9px]">(re-run)</span>
        </div>
      </div>
      <div style={stepStyle(8)}>
        <div className="bg-white border border-gray-200 rounded-lg p-3">
          <p className="text-[10px] font-semibold text-gray-700 mb-2">Checked against production</p>
          <div className="flex items-center gap-3 mb-2 text-[10px]">
            <span className="text-gray-500">Row count:</span>
            <span className="font-medium text-gray-700">Production 48,210</span>
            <span className="text-gray-300">|</span>
            <span className="font-medium text-gray-700">Dev 48,210</span>
            <span className="text-green-600 font-semibold text-[9px] bg-green-50 px-1.5 py-0.5 rounded">Match</span>
          </div>
          <table className="w-full text-[10px]">
            <thead><tr className="text-left text-[9px] text-gray-400 uppercase tracking-wider"><th className="pb-1 font-semibold">Status</th><th className="pb-1 font-semibold text-right">Prod</th><th className="pb-1 font-semibold text-right">Dev</th></tr></thead>
            <tbody className="text-gray-700">
              <tr className="border-t border-gray-100"><td className="py-1 font-mono">active</td><td className="py-1 text-right">31,402</td><td className="py-1 text-right">31,402</td></tr>
              <tr className="border-t border-gray-100"><td className="py-1 font-mono">prospect</td><td className="py-1 text-right">12,118</td><td className="py-1 text-right">12,118</td></tr>
              <tr className="border-t border-gray-100"><td className="py-1 font-mono">churned</td><td className="py-1 text-right">4,690</td><td className="py-1 text-right">4,690</td></tr>
            </tbody>
          </table>
        </div>
      </div>
      <div style={stepStyle(9)}>
        <div className="bg-white border border-gray-200 rounded-lg p-3">
          <p className="text-[10px] font-semibold text-gray-700 mb-1.5">Committed to Git</p>
          <div className="flex items-center gap-2 text-[10px]">
            <span className="text-amber-600 font-mono font-semibold">b7d3a09</span>
            <span className="text-gray-600">refactor: source customer_status from accounts with coalesce fallback</span>
          </div>
          <p className="text-[9px] text-gray-400 mt-1">Branch: <code className="bg-gray-100 px-1 rounded font-mono">refactor/int-accounts-customer-status</code></p>
        </div>
      </div>
      <div style={stepStyle(10)}>
        <div className="border border-green-200 bg-green-50/50 rounded-lg px-3 py-2">
          <p className="text-[10px] text-green-800 font-medium">The compare caught the 1,555-row drift before it shipped — so the Slack message from Finance never had to happen.</p>
        </div>
      </div>
    </div>
  )
}

function ScopeWithoutSimulator({ scenario, runId }) {
  const prefersReduced = useReducedMotion()
  const [visibleSteps, setVisibleSteps] = useState(0)
  const intervalRef = useRef(null)
  const stepCount = scenario === 'debug' ? 5 : 7

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    setVisibleSteps(0)
    if (runId === 0) return
    if (prefersReduced) { setVisibleSteps(stepCount); return }
    let count = 0
    intervalRef.current = setInterval(() => {
      count++
      setVisibleSteps(count)
      if (count >= stepCount) clearInterval(intervalRef.current)
    }, STEP_DELAY)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [runId, scenario, stepCount, prefersReduced])

  if (runId === 0) {
    return <div className="py-6 text-center text-xs text-gray-300">Press &quot;Run simulation&quot; to see how this plays out without production visibility</div>
  }

  const ss = (n) => ({
    opacity: visibleSteps >= n ? 1 : 0,
    transform: visibleSteps >= n ? 'translateY(0)' : 'translateY(8px)',
    transition: prefersReduced ? 'none' : `opacity 280ms ${STEP_EASE}, transform 280ms ${STEP_EASE}`,
    willChange: visibleSteps >= n - 1 && visibleSteps < n + 1 ? 'transform, opacity' : 'auto',
    pointerEvents: visibleSteps >= n ? 'auto' : 'none',
  })

  const Check = ({ children }) => (
    <div className="flex items-center gap-1.5 text-[10px]">
      <span className="text-green-500 font-bold shrink-0">&#10003;</span>
      <span className="text-gray-600">{children}</span>
    </div>
  )

  if (scenario === 'debug') {
    return (
      <div className="space-y-3">
        <div style={ss(2)}>
          <div className="border border-amber-200 bg-amber-50/30 rounded-lg p-3">
            <p className="text-[10px] text-gray-600"><span className="font-semibold text-amber-600">Can't see the failed job</span> — no production visibility. Works from the local code only.</p>
          </div>
        </div>
        <div style={ss(3)}>
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-[10px] text-gray-500 mb-1">
              <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded text-[9px]">dbt build --select fct_order_items</span>
              <span className="text-gray-400 text-[9px]">(dev)</span>
            </div>
            <Check>Compiled successfully in dev</Check>
            <Check>All tests pass in dev</Check>
          </div>
        </div>
        <div style={ss(4)}>
          <div className="border border-red-200 bg-red-50/30 rounded-lg p-3">
            <div className="flex items-center gap-1.5 text-[10px]">
              <span className="text-red-500 font-bold shrink-0">&#10007;</span>
              <span className="text-red-700 font-semibold">Production job #4830 failed again</span>
            </div>
            <p className="text-[10px] text-gray-600 mt-1">The dev run never hit the production data that triggered the error. The same failure came back.</p>
          </div>
        </div>
        <div style={ss(5)}>
          <div className="border border-amber-200 bg-amber-50/50 rounded-lg px-3 py-2">
            <p className="text-[10px] text-amber-800 font-medium">Dev passing told you nothing about production — the same failure came back because there was no way to check against the environment that broke.</p>
          </div>
        </div>
      </div>
    )
  }

  // Refactor without — 7 steps
  return (
    <div className="space-y-3">
      <div style={ss(2)}>
        <div className="bg-white border border-gray-200 rounded-lg p-3">
          <p className="text-[10px] font-semibold text-gray-700 mb-1.5">Refactored SQL</p>
          <div className="font-mono text-[9px] space-y-0.5">
            <div className="text-gray-400 px-1.5 py-0.5">-- before</div>
            <div className="text-red-600 bg-red-50 px-1.5 py-0.5 rounded">case when sub.plan is not null then 'active'</div>
            <div className="text-red-600 bg-red-50 px-1.5 py-0.5 rounded">     else 'inactive' end as customer_status</div>
            <div className="text-gray-400 px-1.5 py-0.5 mt-1">-- after</div>
            <div className="text-green-700 bg-green-50 px-1.5 py-0.5 rounded">accounts.customer_status</div>
          </div>
        </div>
      </div>
      <div style={ss(3)}>
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-[10px] text-gray-500 mb-1">
            <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded text-[9px]">dbt build --select int_accounts</span>
            <span className="text-gray-400 text-[9px]">(dev)</span>
          </div>
          <Check>Compiled successfully in dev</Check>
          <Check>All tests pass</Check>
          <p className="text-[9px] text-gray-400 mt-1 italic">Can't validate against production — no comparison available.</p>
        </div>
      </div>
      <div style={ss(4)}>
        <div className="bg-white border border-gray-200 rounded-lg p-3">
          <p className="text-[10px] font-semibold text-gray-700 mb-1.5">Committed to Git</p>
          <div className="flex items-center gap-2 text-[10px]">
            <span className="text-amber-600 font-mono font-semibold">b7d3a09</span>
            <span className="text-gray-600">refactor: source customer_status from accounts instead of deriving</span>
          </div>
        </div>
      </div>
      <div style={ss(5)}>
        <div className="bg-white border border-gray-200 rounded-xl p-3">
          <div className="flex items-center gap-1.5 mb-1.5">
            <span className="text-[9px] font-semibold text-gray-400">#analytics-eng</span>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center shrink-0 text-[9px] font-bold text-purple-600">M</div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-semibold text-gray-800">Maya (Finance)</span>
                <span className="text-[9px] text-gray-400">2:14 PM</span>
              </div>
              <div className="bg-gray-100 rounded-lg rounded-tl-sm px-3 py-2 mt-1">
                <p className="text-[10px] text-gray-700">"Our numbers appear different than they were earlier today."</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div style={ss(6)}>
        <div className="border border-red-200 bg-red-50/30 rounded-lg p-3">
          <p className="text-[10px] font-semibold text-red-700 mb-2">Production numbers drifted after shipping</p>
          <table className="w-full text-[10px]">
            <thead>
              <tr className="text-left text-[9px] text-gray-400 uppercase tracking-wider">
                <th className="pb-1 font-semibold">Status</th>
                <th className="pb-1 font-semibold text-right">Dev (shipped)</th>
                <th className="pb-1 font-semibold text-right">Prod (actual)</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              <tr className="border-t border-gray-100"><td className="py-1 font-mono">active</td><td className="py-1 text-right">31,402</td><td className="py-1 text-right text-red-600">29,847</td></tr>
              <tr className="border-t border-gray-100"><td className="py-1 font-mono">prospect</td><td className="py-1 text-right">12,118</td><td className="py-1 text-right">12,118</td></tr>
              <tr className="border-t border-gray-100"><td className="py-1 font-mono">churned</td><td className="py-1 text-right">4,690</td><td className="py-1 text-right">4,690</td></tr>
              <tr className="border-t border-gray-100 bg-red-50"><td className="py-1 font-mono text-red-600 font-semibold">unknown</td><td className="py-1 text-right">0</td><td className="py-1 text-right text-red-600 font-semibold">1,555 <span className="text-[8px] text-red-500 ml-1">&#8592; new</span></td></tr>
            </tbody>
          </table>
        </div>
      </div>
      <div style={ss(7)}>
        <div className="border border-amber-200 bg-amber-50/50 rounded-lg px-3 py-2">
          <p className="text-[10px] text-amber-800 font-medium">Dev passed, but with no production comparison the drift only surfaced when a stakeholder flagged it in Slack — after it shipped.</p>
        </div>
      </div>
    </div>
  )
}

function ScopeContent({ mode }) {
  const [scenario, setScenario] = useState('debug')
  const [scopeRunId, setScopeRunId] = useState(0)
  const [playing, setPlaying] = useState(false)

  const handleScenarioChange = (s) => {
    setScenario(s)
    setScopeRunId(0)
    setPlaying(false)
  }

  const handleRun = () => {
    setScopeRunId(r => r + 1)
    setPlaying(true)
    const count = mode === 'without' ? (scenario === 'debug' ? 5 : 7) : (scenario === 'debug' ? 8 : 10)
    setTimeout(() => setPlaying(false), STEP_DELAY * (count + 1))
  }

  // Reset on mode change
  useEffect(() => {
    setScopeRunId(0)
    setPlaying(false)
  }, [mode])

  return (
    <AnimatePresence mode="wait">
      <motion.div key={`scope-${mode}`} {...fadeSlide}>
        {mode === 'without' ? (
          <div className="border border-gray-200 rounded-xl p-4 bg-white">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
              <div>
                <p className="text-xs font-bold text-gray-900 mb-0.5">Generic coding agent</p>
              </div>
            </div>

            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
              <div className="inline-flex bg-gray-100 rounded-xl p-1">
                {[
                  { key: 'debug', label: 'Debug an error' },
                  { key: 'refactor', label: 'Refactor a model' },
                ].map(s => (
                  <button
                    key={s.key}
                    onClick={() => handleScenarioChange(s.key)}
                    className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                      scenario === s.key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
              <button
                onClick={handleRun}
                disabled={playing}
                className={`px-5 py-2 rounded-lg font-medium text-sm transition-all duration-150 ${
                  playing ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gray-900 text-white hover:bg-gray-800'
                }`}
              >
                {playing ? 'Running...' : scopeRunId > 0 ? 'Run again' : 'Run simulation'}
              </button>
            </div>

            <div className="bg-gray-50 rounded-lg px-3 py-2 mb-4">
              <p className="text-[10px] text-gray-400 font-medium mb-0.5">Prompt</p>
              <p className="text-xs text-gray-700 font-medium italic">
                {scenario === 'debug'
                  ? '"My production job is failing. Can you explain why and fix it?"'
                  : '"Refactor int_accounts to read customer_status from the accounts source instead of deriving it. Validate it matches production."'}
              </p>
            </div>

            <ScopeWithoutSimulator scenario={scenario} runId={scopeRunId} />
          </div>
        ) : (
          <div className="border border-gray-200 rounded-xl p-4 bg-white">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
              <div>
                <p className="text-xs font-bold text-gray-900 mb-0.5">dbt Wizard</p>
                <p className="text-[10px] text-gray-500">dbt Wizard can troubleshoot failed jobs and read from production after making changes, so it can confirm work will hold up in other environments.</p>
              </div>
            </div>

            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
              <div className="inline-flex bg-gray-100 rounded-xl p-1">
                {[
                  { key: 'debug', label: 'Debug an error' },
                  { key: 'refactor', label: 'Refactor a model' },
                ].map(s => (
                  <button
                    key={s.key}
                    onClick={() => handleScenarioChange(s.key)}
                    className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                      scenario === s.key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
              <button
                onClick={handleRun}
                disabled={playing}
                className={`px-5 py-2 rounded-lg font-medium text-sm transition-all duration-150 ${
                  playing ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gray-900 text-white hover:bg-gray-800'
                }`}
              >
                {playing ? 'Running...' : scopeRunId > 0 ? 'Run again' : 'Run simulation'}
              </button>
            </div>

            <div className="bg-gray-50 rounded-lg px-3 py-2 mb-4">
              <p className="text-[10px] text-gray-400 font-medium mb-0.5">Prompt</p>
              <p className="text-xs text-gray-700 font-medium italic">
                {scenario === 'debug'
                  ? '"My production job is failing. Can you explain why and fix it?"'
                  : '"Refactor int_accounts to read customer_status from the accounts source instead of deriving it. Validate it matches production."'}
              </p>
            </div>

            <ScopeSimulator scenario={scenario} runId={scopeRunId} />
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}

/* ═══════════════════════════════════════════════════
   SECTION 3 — Token efficiency
   ═══════════════════════════════════════════════════ */

const GENERIC_STEPS = [
  { action: 'read', file: 'dbt_project.yml' },
  { action: 'read', file: 'models/schema.yml' },
  { action: 'read', file: 'models/stg_orders.sql' },
  { action: 'read', file: 'models/stg_customers.sql' },
  { action: 'read', file: 'models/stg_payments.sql' },
  { action: 'grep', file: '"churn" across 47 files — 0 results' },
  { action: 'read', file: 'models/stg_subscriptions.sql' },
  { action: 'read', file: 'models/stg_invoices.sql' },
  { action: 'read', file: 'models/int_enriched.sql' },
  { action: 'read', file: 'models/int_customer_orders.sql' },
  { action: 'compile', file: 'int_customer_orders.sql — checking refs...' },
  { action: 'read', file: 'models/fct_orders.sql' },
  { action: 'read', file: 'models/fct_revenue.sql' },
  { action: 'read', file: 'models/fct_subscriptions.sql' },
  { action: 'grep', file: '"segment" across 47 files — 3 results' },
  { action: 'read', file: 'models/dim_products.sql' },
  { action: 'read', file: 'models/dim_customers.sql' },
  { action: 'read', file: 'models/dim_dates.sql' },
  { action: 'read', file: 'models/dim_regions.sql' },
  { action: 'read', file: 'tests/schema.yml' },
  { action: 'read', file: 'tests/fct_orders_tests.yml' },
  { action: 'read', file: 'tests/int_enriched_tests.yml' },
  { action: 'compile', file: 'fct_subscriptions.sql — resolving columns...' },
  { action: 'read', file: 'macros/utils.sql' },
  { action: 'read', file: 'macros/date_spine.sql' },
  { action: 'read', file: 'macros/churn_logic.sql' },
  { action: 'compile', file: 'draft query — syntax check...' },
  { action: 'error', file: 'column "customer_segment" not found — retrying' },
  { action: 'read', file: 'models/dim_customers.sql (re-read)' },
  { action: 'grep', file: '"customer_segment" across 47 files — 1 result' },
  { action: 'read', file: 'snapshots/scd_customers.sql' },
  { action: 'read', file: 'models/dim_channels.sql' },
  { action: 'compile', file: 'draft query v2 — syntax check...' },
  { action: 'read', file: 'packages.yml' },
  { action: 'read', file: 'models/marts/fct_churn.sql' },
  { action: 'compile', file: 'final query — validating...' },
]

const METADATA_RESULTS = [
  {
    label: 'Source models',
    detail: 'dim_customers (customer_segment, region) + fct_orders (order activity)',
    role: 'Build from the canonical marts, not staging copies',
  },
  {
    label: 'Grain',
    detail: 'dim_customers: 1 row / customer — fct_orders: 1 row / order',
    role: 'Monthly rollup aggregates at the right level',
  },
  {
    label: 'Join path',
    detail: 'fct_orders → dim_customers, many_to_one on customer_id',
    role: 'Correct join — no fanout or double-counting',
  },
  {
    label: 'Freshness & tests',
    detail: 'Both inputs compiled <15 min ago, 4/4 tests passing',
    role: 'Builds on current, validated data',
  },
]

const TOKEN_PROMPT = '"Can you build a model with monthly churn rate by customer segment, broken down by region"'

const METADATA_TABLES = [
  { id: 'models',    label: 'models',    result: 'dim_customers, fct_orders',                 x: 340, y: 10 },
  { id: 'columns',   label: 'columns',   result: 'customer_segment (STRING), region (STRING)', x: 340, y: 56 },
  { id: 'lineage',   label: 'lineage',   result: 'fct_orders → dim_customers, many_to_one',   x: 340, y: 102 },
  { id: 'tests',     label: 'tests',     result: '4/4 tests passing on inputs',                x: 340, y: 148 },
  { id: 'freshness', label: 'freshness', result: 'compiled <15 min ago',                       x: 340, y: 194 },
]

function MetadataGraph() {
  return (
    <div>
      <p className="text-[10px] text-gray-500 mb-3">One query, resolved across the project's metadata tables — no file-by-file reconstruction.</p>
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 overflow-x-auto">
        <svg width="680" height="240" viewBox="0 0 680 240" className="w-full h-auto">
          {/* Query node (left) */}
          <motion.g initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
            <rect x={10} y={95} width={180} height={80} rx={10} fill="#f0fdf4" stroke="#86efac" strokeWidth={1.5} />
            <text x={100} y={120} textAnchor="middle" fontSize={9} fontWeight={700} fill="#059669" fontFamily="ui-monospace, monospace">single metadata query</text>
            <text x={100} y={138} textAnchor="middle" fontSize={8} fill="#6b7280" fontFamily="ui-monospace, monospace">"monthly churn by</text>
            <text x={100} y={150} textAnchor="middle" fontSize={8} fill="#6b7280" fontFamily="ui-monospace, monospace">segment, by region"</text>
          </motion.g>

          {/* Connector lines + table nodes */}
          {METADATA_TABLES.map((table, i) => {
            const fromY = 135
            const toY = table.y + 18
            return (
              <motion.g key={table.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.15 + i * 0.08 }}>
                {/* Connector */}
                <path
                  d={`M 190 ${fromY} C 265 ${fromY}, 265 ${toY}, ${table.x} ${toY}`}
                  fill="none" stroke="#d1d5db" strokeWidth={1.2} strokeDasharray="3,3"
                />
                <circle cx={table.x} cy={toY} r={2.5} fill="#86efac" />

                {/* Table node */}
                <rect x={table.x} y={table.y} width={320} height={36} rx={6} fill="white" stroke="#e5e7eb" strokeWidth={1} />
                <text x={table.x + 8} y={table.y + 14} fontSize={9} fontWeight={700} fill="#059669" fontFamily="ui-monospace, monospace">{table.label}</text>
                <text x={table.x + 8} y={table.y + 27} fontSize={8} fill="#6b7280" fontFamily="ui-monospace, monospace">{table.result}</text>
              </motion.g>
            )
          })}
        </svg>
      </div>
      <p className="text-[9px] text-gray-400 mt-2 italic">This is a slice of a larger set of tables the native metadata engine maintains — only the tables relevant to this prompt are queried.</p>
    </div>
  )
}

function TokenUsage({ mode, runId, onDone, onRun }) {
  const prefersReduced = useReducedMotion()
  const [visibleFiles, setVisibleFiles] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [showExplainer, setShowExplainer] = useState(false)
  const [pulseExplainer, setPulseExplainer] = useState(false)
  const scrollRef = useRef(null)
  const timeoutsRef = useRef([])
  const onDoneRef = useRef(onDone)
  onDoneRef.current = onDone

  useEffect(() => {
    timeoutsRef.current.forEach(clearTimeout)
    timeoutsRef.current = []
    setVisibleFiles(0)
    setShowResult(false)
    setShowExplainer(false)
    setPulseExplainer(false)

    if (runId === 0) return

    if (mode === 'without') {
      const fileDelay = prefersReduced ? 0 : 180
      GENERIC_STEPS.forEach((_, i) => {
        const t = setTimeout(() => {
          setVisibleFiles(i + 1)
          if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }, fileDelay * (i + 1))
        timeoutsRef.current.push(t)
      })
      const resultT = setTimeout(() => {
        setShowResult(true)
        onDoneRef.current?.()
      }, fileDelay * (GENERIC_STEPS.length + 1) + 800)
      timeoutsRef.current.push(resultT)
    } else {
      const lookupDelay = prefersReduced ? 0 : 250
      METADATA_RESULTS.forEach((_, i) => {
        const t = setTimeout(() => setVisibleFiles(i + 1), lookupDelay * (i + 1))
        timeoutsRef.current.push(t)
      })
      const resultT = setTimeout(() => {
        setShowResult(true)
        setPulseExplainer(true)
        onDoneRef.current?.()
      }, lookupDelay * (METADATA_RESULTS.length + 1) + 400)
      timeoutsRef.current.push(resultT)
    }

    return () => timeoutsRef.current.forEach(clearTimeout)
  }, [runId, mode, prefersReduced])

  const hasContent = runId > 0

  return (
    <div className="border border-gray-200 rounded-xl p-4 bg-white">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs font-bold text-gray-900 mb-0.5">{mode === 'without' ? 'Generic coding agent' : 'dbt Wizard'}</p>
        </div>
        <button
          onClick={() => { if (onRun) onRun() }}
          disabled={hasContent && !showResult}
          className={`px-5 py-2 rounded-lg font-medium text-sm transition-all duration-150 shrink-0 ml-4 ${
            (hasContent && !showResult) ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gray-900 text-white hover:bg-gray-800'
          }`}
        >
          {(hasContent && !showResult) ? 'Running...' : hasContent ? 'Run again' : 'Run simulation'}
        </button>
      </div>

      <div className="bg-gray-50 rounded-lg px-3 py-2 mb-4">
        <p className="text-[10px] text-gray-400 font-medium mb-0.5">Prompt</p>
        <p className="text-xs text-gray-700 font-medium italic">{TOKEN_PROMPT}</p>
      </div>

      {!hasContent ? (
        <div className="py-4 text-center text-xs text-gray-300">Press &quot;Run simulation&quot; to see how tokens are consumed</div>
      ) : (
        <div>
          <p className="text-xs font-semibold text-gray-700 mb-2">
            {mode === 'without' ? 'Generic agent' : 'dbt Wizard'}
          </p>
          <p className="text-[10px] text-gray-400 mb-2">
            {mode === 'without'
              ? 'Reads files one by one to reconstruct context'
              : 'Retrieved the building blocks to construct this model — single call'}
          </p>
          <div
            ref={scrollRef}
            className={`space-y-1 overflow-y-auto ${mode === 'without' ? 'max-h-56' : ''} mb-4`}
          >
            {mode === 'without' ? (
              GENERIC_STEPS.slice(0, visibleFiles).map((step, i) => {
                const actionColor =
                  step.action === 'read' ? 'text-red-400' :
                  step.action === 'grep' ? 'text-amber-500' :
                  step.action === 'compile' ? 'text-blue-500' :
                  step.action === 'error' ? 'text-red-600 font-semibold' :
                  'text-gray-400'
                return (
                  <div key={`${step.action}-${i}`} className="flex items-center gap-1.5 text-[10px] font-mono text-gray-400">
                    <span className={`shrink-0 ${actionColor}`}>{step.action}</span>
                    <span className={`truncate ${step.action === 'error' ? 'text-red-500' : ''}`}>{step.file}</span>
                  </div>
                )
              })
            ) : (
              METADATA_RESULTS.slice(0, visibleFiles).map((item) => (
                <div key={item.label} className="flex items-start gap-2 text-[10px] py-1.5">
                  <span className="text-green-500 text-xs font-bold mt-0.5 shrink-0">&#10003;</span>
                  <div className="min-w-0">
                    <span className="text-gray-800 font-semibold">{item.label}</span>
                    <span className="text-gray-500 ml-1.5">{item.detail}</span>
                    <p className="text-gray-400 text-[9px] mt-0.5">{item.role}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          {showResult && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-[10px] text-gray-400 font-medium">Tokens consumed</p>
                <p className={`text-lg font-bold tabular-nums ${mode === 'without' ? 'text-red-600' : 'text-green-700'}`}>
                  {mode === 'without' ? '~48k' : '~3.2k'}
                </p>
              </div>
              <div className="h-4 bg-gray-100 rounded-full overflow-hidden mb-3">
                <motion.div
                  className={`h-full rounded-full ${mode === 'without' ? 'bg-red-400' : 'bg-green-500'}`}
                  initial={{ width: 0 }}
                  animate={{ width: mode === 'without' ? '100%' : '6.7%' }}
                  transition={{ duration: prefersReduced ? 0 : 0.8, ease: 'easeOut' }}
                />
              </div>
              {mode === 'without' ? (
                <div className="border border-red-200 bg-red-50/50 rounded-lg px-3 py-2">
                  <p className="text-[10px] text-red-700 font-semibold">~48k tokens to get context</p>
                </div>
              ) : (
                <>
                  <div className="border border-green-200 bg-green-50/50 rounded-lg px-3 py-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] text-green-800 font-semibold">~3.2k tokens — 93% fewer</p>
                      </div>
                      <p className="text-[10px] font-semibold text-green-700">Cheaper and more accurate</p>
                    </div>
                  </div>
                  <style>{`@keyframes explainer-pulse { 0%, 100% { background-color: transparent; } 50% { background-color: rgb(220 252 231); } }`}</style>
                  <button
                    onClick={() => { setShowExplainer(e => !e); setPulseExplainer(false) }}
                    className={`mt-3 text-[10px] font-medium text-green-700 hover:text-green-900 transition-colors cursor-pointer flex items-center gap-1 px-2 py-1 -mx-2 rounded-md ${pulseExplainer && !showExplainer ? 'ring-2 ring-green-400' : ''}`}
                    style={pulseExplainer && !showExplainer && !prefersReduced ? { animation: 'explainer-pulse 1.5s ease-in-out 3' } : undefined}
                    onAnimationEnd={() => setPulseExplainer(false)}
                  >
                    {showExplainer ? 'Hide details' : 'See how this works'}
                    <motion.svg width="10" height="10" viewBox="0 0 10 10" animate={{ rotate: showExplainer ? 180 : 0 }} transition={{ duration: 0.2 }} className="shrink-0">
                      <path d="M2.5 3.75L5 6.25L7.5 3.75" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    </motion.svg>
                  </button>
                  <AnimatePresence>
                    {showExplainer && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-3">
                          <MetadataGraph />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              )}
            </motion.div>
          )}
        </div>
      )}
    </div>
  )
}

function TokenContent({ mode, runId, onDone, onRun }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div key={`tokens-${mode}`} {...fadeSlide}>
        <TokenUsage mode={mode} runId={runId} onDone={onDone} onRun={onRun} />
      </motion.div>
    </AnimatePresence>
  )
}

/* ═══════════════════════════════════════════════════
   Main export
   ═══════════════════════════════════════════════════ */
export default function WizardSection() {
  const [activeTopic, setActiveTopic] = useState('intelligence')
  const [mode, setMode] = useState('without')
  const [playing, setPlaying] = useState(false)
  const [hasPlayed, setHasPlayed] = useState(false)
  const [tokenRunId, setTokenRunId] = useState(0)

  // Reset playing state when tab or mode changes
  const handleTopicChange = (key) => {
    setActiveTopic(key)
    setMode('without')
    setPlaying(false)
    setHasPlayed(false)
    setTokenRunId(0)
  }
  const handleModeChange = (m) => {
    setMode(m)
    setPlaying(false)
    setHasPlayed(false)
    setTokenRunId(0)
  }
  const handlePlay = () => {
    if (activeTopic === 'tokens') {
      setTokenRunId(r => r + 1)
      setPlaying(true)
      setHasPlayed(true)
    } else {
      setPlaying(true)
      setHasPlayed(true)
    }
  }

  return (
    <div>
      {/* Topic tabs + toggle + play button */}
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div className="inline-flex bg-gray-100 rounded-xl p-1" role="tablist" aria-label="Wizard comparison topics">
          {topics.map(t => (
            <button
              key={t.key}
              role="tab"
              aria-selected={activeTopic === t.key}
              aria-controls={`panel-${t.key}`}
              onClick={() => handleTopicChange(t.key)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTopic === t.key
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <Toggle value={mode} onChange={handleModeChange} />
        </div>
      </div>

      {/* Description */}
      <AnimatePresence mode="wait">
        <motion.p
          key={activeTopic}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2 }}
          className="text-sm text-gray-500 mb-5"
        >
          {topicDescs[activeTopic]}
        </motion.p>
      </AnimatePresence>

      {/* Content */}
      <AnimatePresence mode="wait">
        {activeTopic === 'intelligence' && (
          <motion.div key="intelligence" id="panel-intelligence" role="tabpanel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <IntelligenceContent mode={mode} />
          </motion.div>
        )}
        {activeTopic === 'scope' && (
          <motion.div key="scope" id="panel-scope" role="tabpanel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <ScopeContent mode={mode} />
          </motion.div>
        )}
        {activeTopic === 'tokens' && (
          <motion.div key="tokens" id="panel-tokens" role="tabpanel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <TokenContent mode={mode} runId={tokenRunId} onDone={() => setPlaying(false)} onRun={handlePlay} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
