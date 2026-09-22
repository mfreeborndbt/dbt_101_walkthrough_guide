import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/* --- Shared code-pane component --- */

function CodePane({ title, badge, badgeColor, bgColor = 'bg-gray-50', children }) {
  return (
    <motion.div
      whileHover={{ y: -3, boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className="bg-white border border-gray-200/60 rounded-2xl shadow-sm overflow-hidden"
    >
      <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{title}</span>
        <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${badgeColor}`}>{badge}</span>
      </div>
      <div className={`p-5 font-mono text-xs leading-relaxed overflow-x-auto ${bgColor}`}>
        {children}
      </div>
    </motion.div>
  )
}

/* --- SQL syntax tokens --- */
const KW = 'text-blue-600'
const JJ = 'text-orange-600'
const FN = 'text-purple-600'
const STR = 'text-emerald-600'
const CMT = 'text-gray-400'
const TXT = 'text-gray-800'
const YK = 'text-purple-600'
const YV = 'text-emerald-600'
const YD = 'text-gray-500'

/* --- Subtab 1: Global & sub-global settings --- */

function GlobalSettings() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CodePane title="Without dbt_project.yml" badge="Repeated" badgeColor="bg-red-100 text-red-700" bgColor="bg-red-50/30">
          <div className={CMT}>-- models/staging/stg_customers.sql</div>
          <div><span className={JJ}>{'{{ '}</span><span className={FN}>config</span>(<span className={FN}>materialized</span>=<span className={STR}>'view'</span>)<span className={JJ}>{' }}'}</span></div>
          <div><span className={KW}>select</span> * <span className={KW}>from</span> ...</div>
          <div className="h-3" />
          <div className={CMT}>-- models/staging/stg_orders.sql</div>
          <div><span className={JJ}>{'{{ '}</span><span className={FN}>config</span>(<span className={FN}>materialized</span>=<span className={STR}>'view'</span>)<span className={JJ}>{' }}'}</span></div>
          <div><span className={KW}>select</span> * <span className={KW}>from</span> ...</div>
          <div className="h-3" />
          <div className={CMT}>-- models/staging/stg_products.sql</div>
          <div><span className={JJ}>{'{{ '}</span><span className={FN}>config</span>(<span className={FN}>materialized</span>=<span className={STR}>'view'</span>)<span className={JJ}>{' }}'}</span></div>
          <div><span className={KW}>select</span> * <span className={KW}>from</span> ...</div>
          <div className="h-3" />
          <div className={CMT}>-- models/marts/fct_orders.sql</div>
          <div><span className={JJ}>{'{{ '}</span><span className={FN}>config</span>(<span className={FN}>materialized</span>=<span className={STR}>'table'</span>)<span className={JJ}>{' }}'}</span></div>
          <div><span className={KW}>select</span> * <span className={KW}>from</span> ...</div>
          <div className="h-3" />
          <div className={CMT}>-- models/marts/dim_customers.sql</div>
          <div><span className={JJ}>{'{{ '}</span><span className={FN}>config</span>(<span className={FN}>materialized</span>=<span className={STR}>'table'</span>)<span className={JJ}>{' }}'}</span></div>
          <div><span className={KW}>select</span> * <span className={KW}>from</span> ...</div>
          <div className="h-4" />
        </CodePane>

        <CodePane title="dbt_project.yml" badge="Centralized" badgeColor="bg-green-100 text-green-700" bgColor="bg-green-50/30">
          <div><span className={YK}>models</span><span className={YD}>:</span></div>
          <div className="pl-4"><span className={YK}>my_project</span><span className={YD}>:</span></div>
          <div className="pl-8 bg-blue-50 -mx-5 px-5 py-0.5 border-l-2 border-blue-400"><span className={YK}>+materialized</span><span className={YD}>: </span><span className={YV}>view</span> <span className={CMT}># global default</span></div>
          <div className="h-2" />
          <div className="pl-8"><span className={YK}>staging</span><span className={YD}>:</span> <span className={CMT}># sub-global</span></div>
          <div className="pl-12"><span className={YK}>+materialized</span><span className={YD}>: </span><span className={YV}>view</span></div>
          <div className="h-2" />
          <div className="pl-8 bg-amber-50 -mx-5 px-5 py-0.5 border-l-2 border-amber-400"><span className={YK}>marts</span><span className={YD}>:</span> <span className={CMT}># sub-global override</span></div>
          <div className="pl-12 bg-amber-50 -mx-5 px-5 py-0.5 border-l-2 border-amber-400"><span className={YK}>+materialized</span><span className={YD}>: </span><span className={YV}>table</span></div>
          <div className="h-4" />
          <div className={CMT}># Environment-aware via env vars:</div>
          <div><span className={YK}>models</span><span className={YD}>:</span></div>
          <div className="pl-4"><span className={YK}>my_project</span><span className={YD}>:</span></div>
          <div className="pl-8"><span className={YK}>marts</span><span className={YD}>:</span></div>
          <div className="pl-12 bg-purple-50 -mx-5 px-5 py-0.5 border-l-2 border-purple-400"><span className={YK}>+materialized</span><span className={YD}>: </span><span className={STR}>{`"{{ env_var('DBT_MARTS_MATERIALIZATION', 'view') }}"`}</span></div>
        </CodePane>
      </div>
    </div>
  )
}

/* --- Subtab 2: Incremental models --- */

function IncrementalModels() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CodePane title="Hand-written MERGE" badge="Pure DML" badgeColor="bg-red-100 text-red-700" bgColor="bg-red-50/30">
          <div><span className={KW}>MERGE INTO</span> <span className={TXT}>analytics.orders</span> <span className={KW}>AS</span> target</div>
          <div><span className={KW}>USING</span> staging_orders <span className={KW}>AS</span> source</div>
          <div className="pl-4"><span className={KW}>ON</span> target.order_id = source.order_id</div>
          <div className="h-2" />
          <div><span className={KW}>WHEN MATCHED THEN UPDATE SET</span></div>
          <div className="pl-4">target.status     = source.status,</div>
          <div className="pl-4">target.updated_at = source.updated_at</div>
          <div className="h-2" />
          <div><span className={KW}>WHEN NOT MATCHED THEN INSERT</span></div>
          <div className="pl-4">(order_id, status, updated_at)</div>
          <div><span className={KW}>VALUES</span></div>
          <div className="pl-4">(source.order_id, source.status,</div>
          <div className="pl-5">source.updated_at);</div>
          <div className="h-4" />
        </CodePane>

        <CodePane title="dbt incremental model" badge="dbt generates the MERGE" badgeColor="bg-green-100 text-green-700" bgColor="bg-green-50/30">
          <div><span className={JJ}>{'{{ '}</span><span className={FN}>config</span>(</div>
          <div className="pl-8"><span className={FN}>materialized</span>=<span className={STR}>'incremental'</span>,</div>
          <div className="pl-8"><span className={FN}>unique_key</span>=<span className={STR}>'order_id'</span>,</div>
          <div className="pl-8"><span className={FN}>incremental_strategy</span>=<span className={STR}>'merge'</span></div>
          <div>)<span className={JJ}>{' }}'}</span></div>
          <div className="h-2" />
          <div><span className={KW}>select</span></div>
          <div className="pl-4">order_id,</div>
          <div className="pl-4">status,</div>
          <div className="pl-4">updated_at</div>
          <div><span className={KW}>from</span> <span className={JJ}>{'{{ '}</span><span className={FN}>source</span>(<span className={STR}>'raw'</span>, <span className={STR}>'orders'</span>)<span className={JJ}>{' }}'}</span></div>
          <div className="h-2" />
          <div className="bg-amber-50 -mx-5 px-5 py-0.5 border-l-2 border-amber-400"><span className={JJ}>{'{%'}</span> <span className={KW}>if</span> <span className={FN}>is_incremental</span>() <span className={JJ}>{'%}'}</span></div>
          <div className="bg-amber-50 -mx-5 px-5 py-0.5 border-l-2 border-amber-400 pl-4"><span className={CMT}>-- only rows newer than what we've loaded</span></div>
          <div className="bg-amber-50 -mx-5 px-5 py-0.5 border-l-2 border-amber-400 pl-4"><span className={KW}>where</span> updated_at {'>'} (</div>
          <div className="bg-amber-50 -mx-5 px-5 py-0.5 border-l-2 border-amber-400 pl-8"><span className={KW}>select</span> <span className={FN}>max</span>(updated_at) <span className={KW}>from</span> <span className={JJ}>{'{{ '}</span><span className={FN}>this</span><span className={JJ}>{' }}'}</span></div>
          <div className="bg-amber-50 -mx-5 px-5 py-0.5 border-l-2 border-amber-400 pl-4">)</div>
          <div className="bg-amber-50 -mx-5 px-5 py-0.5 border-l-2 border-amber-400"><span className={JJ}>{'{%'}</span> <span className={KW}>endif</span> <span className={JJ}>{'%}'}</span></div>
        </CodePane>
      </div>
    </div>
  )
}

/* --- Subtab 3: Snapshots (SCD Type 2) --- */

function Snapshots() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CodePane title="snapshots.yml (v1.9+)" badge="YAML" badgeColor="bg-purple-100 text-purple-700" bgColor="bg-gray-50">
          <div><span className={YK}>snapshots</span><span className={YD}>:</span></div>
          <div className="pl-4"><span className={YD}>- </span><span className={YK}>name</span><span className={YD}>: </span><span className={YV}>orders_snapshot</span></div>
          <div className="pl-6"><span className={YK}>relation</span><span className={YD}>: </span><span className={YV}>source('raw', 'orders')</span></div>
          <div className="pl-6"><span className={YK}>config</span><span className={YD}>:</span></div>
          <div className="pl-8 bg-blue-50 -mx-5 px-5 py-0.5 border-l-2 border-blue-400"><span className={YK}>unique_key</span><span className={YD}>: </span><span className={YV}>order_id</span></div>
          <div className="pl-8 bg-blue-50 -mx-5 px-5 py-0.5 border-l-2 border-blue-400"><span className={YK}>strategy</span><span className={YD}>: </span><span className={YV}>timestamp</span></div>
          <div className="pl-8 bg-blue-50 -mx-5 px-5 py-0.5 border-l-2 border-blue-400"><span className={YK}>updated_at</span><span className={YD}>: </span><span className={YV}>updated_at</span></div>
          <div className="pl-8 bg-amber-50 -mx-5 px-5 py-0.5 border-l-2 border-amber-400"><span className={YK}>hard_deletes</span><span className={YD}>: </span><span className={YV}>new_record</span></div>
          <div className="pl-8"><span className={YK}>dbt_valid_to_current</span><span className={YD}>: </span><span className={STR}>"9999-12-31"</span></div>
          <div className="h-4" />
        </CodePane>

        <motion.div whileHover={{ y: -3, boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }} transition={{ type: 'spring', stiffness: 400, damping: 25 }} className="bg-white border border-gray-200/60 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Snapshot output</span>
            <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded font-semibold">Auto-generated columns</span>
          </div>
          <div className="p-5 space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-gray-200 text-left">
                    <th className="py-2 px-2 font-semibold text-gray-700">order_id</th>
                    <th className="py-2 px-2 font-semibold text-gray-700">status</th>
                    <th className="py-2 px-2 font-semibold text-blue-700 bg-blue-50">dbt_valid_from</th>
                    <th className="py-2 px-2 font-semibold text-blue-700 bg-blue-50">dbt_valid_to</th>
                    <th className="py-2 px-2 font-semibold text-amber-700 bg-amber-50">dbt_is_deleted</th>
                  </tr>
                </thead>
                <tbody className="font-mono text-gray-600">
                  <tr className="border-b border-gray-100">
                    <td className="py-1.5 px-2">1001</td>
                    <td className="py-1.5 px-2">pending</td>
                    <td className="py-1.5 px-2 bg-blue-50/50 text-blue-700">2026-01-15</td>
                    <td className="py-1.5 px-2 bg-blue-50/50 text-blue-700">2026-02-03</td>
                    <td className="py-1.5 px-2 bg-amber-50/50 text-gray-400">false</td>
                  </tr>
                  <tr className="border-b border-gray-100 bg-green-50/30">
                    <td className="py-1.5 px-2">1001</td>
                    <td className="py-1.5 px-2 font-semibold text-green-700">shipped</td>
                    <td className="py-1.5 px-2 bg-blue-50/50 text-blue-700">2026-02-03</td>
                    <td className="py-1.5 px-2 bg-blue-50/50 text-blue-700">9999-12-31</td>
                    <td className="py-1.5 px-2 bg-amber-50/50 text-gray-400">false</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-1.5 px-2">1002</td>
                    <td className="py-1.5 px-2">complete</td>
                    <td className="py-1.5 px-2 bg-blue-50/50 text-blue-700">2026-01-20</td>
                    <td className="py-1.5 px-2 bg-blue-50/50 text-blue-700">9999-12-31</td>
                    <td className="py-1.5 px-2 bg-amber-50/50 text-gray-400">false</td>
                  </tr>
                  <tr className="bg-red-50/30">
                    <td className="py-1.5 px-2">1003</td>
                    <td className="py-1.5 px-2 text-red-600">cancelled</td>
                    <td className="py-1.5 px-2 bg-blue-50/50 text-blue-700">2026-03-01</td>
                    <td className="py-1.5 px-2 bg-blue-50/50 text-blue-700">9999-12-31</td>
                    <td className="py-1.5 px-2 bg-amber-50/50 font-semibold text-amber-700">true</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-[10px] text-gray-500">
              <span className="text-green-700 font-semibold">Green row:</span> current version (status changed from pending to shipped).
              <span className="text-amber-700 font-semibold ml-2">dbt_is_deleted:</span> flagged when a source row disappears (<code className="bg-gray-100 px-1 rounded">hard_deletes: new_record</code>).
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

/* --- Subtab 4: dbt Checks --- */

const checksCategories = [
  { name: 'Modeling', checks: [
    { name: 'Direct join to source', severity: 'error' },
    { name: 'Duplicate sources', severity: 'error' },
    { name: 'Multiple sources joined', severity: 'warn' },
    { name: 'Staging models dependent on downstream', severity: 'error' },
    { name: 'Unused sources', severity: 'warn' },
  ]},
  { name: 'Testing', checks: [
    { name: 'Missing primary key tests', severity: 'error' },
    { name: 'Test coverage below threshold', severity: 'error' },
    { name: 'Missing source freshness', severity: 'warn' },
  ]},
  { name: 'Documentation', checks: [
    { name: 'Undocumented public models', severity: 'error' },
    { name: 'Documentation coverage', severity: 'warn' },
    { name: 'Undocumented sources', severity: 'warn' },
  ]},
  { name: 'Governance', checks: [
    { name: 'Public models without contracts', severity: 'error' },
    { name: 'Model naming conventions', severity: 'error' },
    { name: 'Exposures dependent on private models', severity: 'warn' },
  ]},
]

const checksTotalCount = checksCategories.reduce((sum, c) => sum + c.checks.length, 0)

const checksMessyResults = {
  'Direct join to source': 'error',
  'Unused sources': 'warn',
  'Missing primary key tests': 'error',
  'Documentation coverage': 'warn',
}

function DbtChecks() {
  const [isRunning, setIsRunning] = useState(false)
  const [hasRun, setHasRun] = useState(false)
  const [messy, setMessy] = useState(false)
  const [checkStates, setCheckStates] = useState({})
  const [passedCount, setPassedCount] = useState(0)
  const [errorCount, setErrorCount] = useState(0)
  const [warnCount, setWarnCount] = useState(0)
  const [phase, setPhase] = useState('idle')
  const [terminalLines, setTerminalLines] = useState([])
  const [expandedCat, setExpandedCat] = useState(null)
  const timeoutsRef = useRef([])

  const reset = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout)
    timeoutsRef.current = []
    setCheckStates({}); setPassedCount(0); setErrorCount(0); setWarnCount(0)
    setPhase('idle'); setTerminalLines([]); setIsRunning(false); setHasRun(false); setExpandedCat(null)
  }, [])

  const runChecks = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout)
    timeoutsRef.current = []
    setIsRunning(true); setHasRun(true); setPassedCount(0); setErrorCount(0); setWarnCount(0)
    setPhase('running'); setExpandedCat(null)

    const init = {}
    checksCategories.forEach(cat => {
      const checks = {}
      cat.checks.forEach(c => { checks[c.name] = 'pending' })
      init[cat.name] = { status: 'pending', checks }
    })
    setCheckStates(init)
    setTerminalLines([
      { text: '$ dbt check', type: 'command' },
      { text: 'Running project checks against dbt Information Schema...', type: 'info' },
      { text: '', type: 'blank' },
    ])

    let delay = 500
    let rp = 0, re = 0, rw = 0

    checksCategories.forEach((cat) => {
      const t1 = setTimeout(() => {
        setCheckStates(prev => ({ ...prev, [cat.name]: { ...prev[cat.name], status: 'running' } }))
        setExpandedCat(cat.name)
        setTerminalLines(prev => [...prev, { text: `  [${cat.name}] Running ${cat.checks.length} checks...`, type: 'run' }])
      }, delay)
      timeoutsRef.current.push(t1)
      delay += 350

      cat.checks.forEach((check) => {
        const cd = delay
        const t2 = setTimeout(() => {
          setCheckStates(prev => {
            const u = { ...prev }
            u[cat.name] = { ...u[cat.name], checks: { ...u[cat.name].checks, [check.name]: 'running' } }
            return u
          })
        }, cd)
        timeoutsRef.current.push(t2)

        const mr = messy ? checksMessyResults[check.name] : null
        const cmpd = cd + 160
        const t3 = setTimeout(() => {
          const result = mr || 'pass'
          setCheckStates(prev => {
            const u = { ...prev }
            u[cat.name] = { ...u[cat.name], checks: { ...u[cat.name].checks, [check.name]: result } }
            return u
          })
          if (result === 'error') { re++; setErrorCount(re) }
          else if (result === 'warn') { rw++; setWarnCount(rw) }
          else { rp++; setPassedCount(rp) }
        }, cmpd)
        timeoutsRef.current.push(t3)
        delay = cmpd + 60
      })

      const ced = delay + 80
      const t4 = setTimeout(() => {
        setCheckStates(prev => ({ ...prev, [cat.name]: { ...prev[cat.name], status: 'done' } }))
        const ce = cat.checks.filter(c => messy && checksMessyResults[c.name] === 'error').length
        const cw = cat.checks.filter(c => messy && checksMessyResults[c.name] === 'warn').length
        if (ce > 0 || cw > 0) {
          const parts = []
          if (cat.checks.length - ce - cw > 0) parts.push(`${cat.checks.length - ce - cw} passed`)
          if (ce > 0) parts.push(`${ce} error(s)`)
          if (cw > 0) parts.push(`${cw} warning(s)`)
          setTerminalLines(prev => [...prev, { text: `  [${cat.name}] ${parts.join(', ')}`, type: ce > 0 ? 'error' : 'warn' }])
        } else {
          setTerminalLines(prev => [...prev, { text: `  [${cat.name}] ${cat.checks.length}/${cat.checks.length} passed`, type: 'ok' }])
        }
      }, ced)
      timeoutsRef.current.push(t4)
      delay = ced + 150
    })

    const gd = delay + 250
    const t5 = setTimeout(() => {
      setPhase('gate'); setExpandedCat(null)
      const te = messy ? checksCategories.reduce((s, cat) => s + cat.checks.filter(c => checksMessyResults[c.name] === 'error').length, 0) : 0
      if (te > 0) {
        setTerminalLines(prev => [...prev, { text: '', type: 'blank' }, { text: `Checks: ${te} error(s) found. Build blocked.`, type: 'error' }, { text: 'Fix failing checks before proceeding.', type: 'error' }])
      } else {
        setTerminalLines(prev => [...prev, { text: '', type: 'blank' }, { text: `Checks: ${checksTotalCount}/${checksTotalCount} passed`, type: 'success' }, { text: 'All checks passed. Proceeding to compilation...', type: 'success' }])
      }
    }, gd)
    timeoutsRef.current.push(t5)

    const dd = gd + 1000
    const t6 = setTimeout(() => { setPhase('done'); setIsRunning(false) }, dd)
    timeoutsRef.current.push(t6)
  }, [messy])

  const getCheckIcon = (s) => {
    if (s === 'pass') return <span className="text-green-600 font-bold text-xs">&#10003;</span>
    if (s === 'error') return <span className="text-red-500 font-bold text-xs">&#10007;</span>
    if (s === 'warn') return <span className="text-amber-500 font-bold text-xs">&#9888;</span>
    if (s === 'running') return <span className="w-2 h-2 rounded-full bg-blue-500 inline-block animate-pulse" />
    return <span className="w-2 h-2 rounded-full bg-gray-300 inline-block" />
  }

  const getCatIcon = (catName) => {
    const cat = checkStates[catName]
    if (!cat) return <span className="w-3 h-3 rounded-full bg-gray-200 inline-block" />
    if (cat.status === 'done') {
      if (Object.values(cat.checks).some(s => s === 'error')) return <span className="text-red-500 font-bold">&#10007;</span>
      if (Object.values(cat.checks).some(s => s === 'warn')) return <span className="text-amber-500 font-bold">&#9888;</span>
      return <span className="text-green-600 font-bold">&#10003;</span>
    }
    if (cat.status === 'running') return <span className="w-3 h-3 rounded-full bg-blue-500 inline-block animate-pulse" />
    return <span className="w-3 h-3 rounded-full bg-gray-200 inline-block" />
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: check definitions */}
        <div className="space-y-4">
          <CodePane title="checks/direct_join_to_source.sql" badge="SQL check" badgeColor="bg-blue-100 text-blue-700" bgColor="bg-blue-50/30">
            <div className={CMT}>-- Fails if any model reads directly from a source</div>
            <div><span className={KW}>select</span> <span className={TXT}>unique_id</span></div>
            <div><span className={KW}>from</span> <span className={JJ}>{'{{ '}</span><span className={FN}>info_schema</span>(<span className={STR}>'edges'</span>)<span className={JJ}>{' }}'}</span></div>
            <div><span className={KW}>where</span> <span className={TXT}>parent_unique_id</span> <span className={KW}>like</span> <span className={STR}>'source.%'</span></div>
            <div>  <span className={KW}>and</span> <span className={TXT}>child_unique_id</span> <span className={KW}>not like</span> <span className={STR}>'%stg_%'</span></div>
          </CodePane>

          <CodePane title="checks/_checks.yml" badge="Config" badgeColor="bg-purple-100 text-purple-700" bgColor="bg-purple-50/30">
            <div><span className={YK}>version</span><span className={YD}>: </span><span className={YV}>2</span></div>
            <div><span className={YK}>checks</span><span className={YD}>:</span></div>
            <div className="pl-4">- <span className={YK}>name</span><span className={YD}>: </span><span className={YV}>direct_join_to_source</span></div>
            <div className="pl-6"><span className={YK}>config</span><span className={YD}>:</span></div>
            <div className="pl-8"><span className={YK}>severity</span><span className={YD}>: </span><span className="text-red-600">error</span></div>
            <div className="h-1" />
            <div className="pl-4">- <span className={YK}>name</span><span className={YD}>: </span><span className={YV}>undocumented_public_models</span></div>
            <div className="pl-6"><span className={YK}>config</span><span className={YD}>:</span></div>
            <div className="pl-8"><span className={YK}>severity</span><span className={YD}>: </span><span className="text-amber-600">warn</span></div>
            <div className="h-1" />
            <div className="pl-4">- <span className={YK}>name</span><span className={YD}>: </span><span className={YV}>missing_primary_key_tests</span></div>
            <div className="pl-6"><span className={YK}>config</span><span className={YD}>:</span></div>
            <div className="pl-8"><span className={YK}>severity</span><span className={YD}>: </span><span className="text-red-600">error</span></div>
          </CodePane>
        </div>

        {/* Right: interactive simulator */}
        <div className="space-y-4">
          <div className="bg-white border border-gray-200/60 rounded-2xl shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Run checks</p>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-xs text-gray-500 cursor-pointer select-none">
                  <input type="checkbox" checked={messy} onChange={(e) => { reset(); setMessy(e.target.checked) }} className="rounded border-gray-300" />
                  Messy project
                </label>
                <button
                  onClick={hasRun ? () => { reset(); setTimeout(runChecks, 50) } : runChecks}
                  disabled={isRunning}
                  className={`text-xs font-semibold px-4 py-1.5 rounded-lg transition-all duration-150 ${isRunning ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gray-900 text-white hover:bg-gray-800'}`}
                >
                  {isRunning ? 'Running...' : hasRun ? 'Run again' : 'Run dbt check'}
                </button>
              </div>
            </div>

            {/* Progress */}
            <div className="mb-3">
              <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                <span>Checks: {passedCount + errorCount + warnCount} / {checksTotalCount}</span>
                <span>
                  {passedCount > 0 && <span className="text-green-600">{passedCount} passed</span>}
                  {warnCount > 0 && <span className="text-amber-500 ml-2">{warnCount} warnings</span>}
                  {errorCount > 0 && <span className="text-red-500 ml-2">{errorCount} errors</span>}
                </span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${errorCount > 0 ? 'bg-red-500' : warnCount > 0 ? 'bg-amber-400' : 'bg-green-500'}`}
                  initial={{ width: '0%' }}
                  animate={{ width: `${((passedCount + errorCount + warnCount) / checksTotalCount) * 100}%` }}
                  transition={{ duration: 0.2 }}
                />
              </div>
            </div>

            {/* Category cards */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              {checksCategories.map(cat => {
                const state = checkStates[cat.name]
                const isExpanded = expandedCat === cat.name
                const doneChecks = state ? Object.values(state.checks).filter(s => s === 'pass' || s === 'error' || s === 'warn').length : 0
                return (
                  <motion.div
                    key={cat.name}
                    whileHover={{ y: -2, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    onClick={() => setExpandedCat(isExpanded ? null : cat.name)}
                    className={`border rounded-xl p-2.5 cursor-pointer transition-all duration-200 ${
                      state?.status === 'running' ? 'border-blue-300 bg-blue-50/50' :
                      state?.status === 'done' && Object.values(state.checks).some(s => s === 'error') ? 'border-red-300 bg-red-50/50' :
                      state?.status === 'done' && Object.values(state.checks).some(s => s === 'warn') ? 'border-amber-300 bg-amber-50/50' :
                      state?.status === 'done' ? 'border-green-300 bg-green-50/50' :
                      'border-gray-200 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-0.5">
                      <div className="flex items-center gap-1.5">
                        {getCatIcon(cat.name)}
                        <span className="text-xs font-semibold text-gray-800">{cat.name}</span>
                      </div>
                      <span className="text-[10px] text-gray-400">{doneChecks}/{cat.checks.length}</span>
                    </div>
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                          <div className="mt-1.5 space-y-0.5">
                            {cat.checks.map(check => {
                              const cr = state?.checks?.[check.name] || 'pending'
                              const failed = cr === 'error' || cr === 'warn'
                              return (
                                <div key={check.name} className="flex items-center gap-1.5 text-[10px] text-gray-600 py-0.5">
                                  {getCheckIcon(cr)}
                                  <span className={cr === 'error' ? 'text-red-600 font-medium' : cr === 'warn' ? 'text-amber-600 font-medium' : ''}>{check.name}</span>
                                  {failed && <span className={`ml-auto text-[9px] font-medium ${check.severity === 'error' ? 'text-red-400' : 'text-amber-400'}`}>{check.severity}</span>}
                                </div>
                              )
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    {!isExpanded && doneChecks > 0 && doneChecks < cat.checks.length && (
                      <div className="h-1 bg-gray-100 rounded-full mt-1.5 overflow-hidden">
                        <div className="h-full bg-blue-400 rounded-full transition-all" style={{ width: `${(doneChecks / cat.checks.length) * 100}%` }} />
                      </div>
                    )}
                  </motion.div>
                )
              })}
            </div>

            {/* Gate status */}
            <AnimatePresence>
              {(phase === 'gate' || phase === 'done') && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  className={`mb-3 px-3 py-2 rounded-xl border text-xs font-medium ${errorCount > 0 ? 'bg-red-50 border-red-200 text-red-800' : 'bg-green-50 border-green-200 text-green-800'}`}
                >
                  {errorCount > 0 ? `${errorCount} check(s) failed. Build blocked until errors are resolved.` : 'All checks passed. Build proceeds.'}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Console */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 font-mono text-[10px] h-36 overflow-y-auto">
              <AnimatePresence>
                {terminalLines.map((line, i) => (
                  <motion.div key={`line-${i}`} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.15 }}
                    className={
                      line.type === 'command' ? 'text-emerald-700 font-bold' :
                      line.type === 'info' ? 'text-gray-400' :
                      line.type === 'run' ? 'text-blue-600' :
                      line.type === 'ok' ? 'text-emerald-600' :
                      line.type === 'success' ? 'text-emerald-700 font-bold' :
                      line.type === 'error' ? 'text-red-600 font-semibold' :
                      line.type === 'warn' ? 'text-amber-600 font-semibold' : ''
                    }
                  >
                    {line.text || '\u00A0'}
                  </motion.div>
                ))}
              </AnimatePresence>
              {terminalLines.length === 0 && (
                <div className="text-gray-400">Click &quot;Run dbt check&quot; to validate project standards...</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* --- Main export --- */

const subtabs = [
  { key: 'global', label: 'Global & sub-global settings' },
  { key: 'incremental', label: 'Incremental models' },
  { key: 'snapshots', label: 'Snapshots' },
  { key: 'checks', label: 'dbt Checks' },
]

const subtabDescs = {
  global: 'Centralize configuration in dbt_project.yml instead of repeating config blocks in every model.',
  incremental: 'Write a select — dbt generates the MERGE, handles first-run vs. incremental, and supports full-refresh.',
  snapshots: 'A few lines of YAML give you full SCD Type 2 change tracking with valid-from/to ranges and delete handling.',
  checks: 'Define project standards as SQL checks that run locally before every build. Errors block the build; warnings log but continue.',
}

export default function Module08AdvConfig() {
  const [activeSubtab, setActiveSubtab] = useState('global')

  return (
    <div className="py-8">
      <div className="section-container mb-6">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-sm font-bold text-white bg-gray-900 px-3 py-1 rounded-full">Module 08</span>
          <h2 className="text-2xl font-bold text-gray-900">Advanced configurations</h2>
        </div>

        <div className="inline-flex bg-gray-100 rounded-xl p-1 mt-2">
          {subtabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveSubtab(tab.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeSubtab === tab.key
                  ? 'bg-gray-900 text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.p
            key={activeSubtab}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="text-sm text-gray-500 mt-3"
          >
            {subtabDescs[activeSubtab]}
          </motion.p>
        </AnimatePresence>
      </div>

      <div className="section-container">
        <AnimatePresence mode="wait">
          {activeSubtab === 'global' && (
            <motion.div key="global" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              <GlobalSettings />
            </motion.div>
          )}
          {activeSubtab === 'incremental' && (
            <motion.div key="incremental" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              <IncrementalModels />
            </motion.div>
          )}
          {activeSubtab === 'snapshots' && (
            <motion.div key="snapshots" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              <Snapshots />
            </motion.div>
          )}
          {activeSubtab === 'checks' && (
            <motion.div key="checks" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              <DbtChecks />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
