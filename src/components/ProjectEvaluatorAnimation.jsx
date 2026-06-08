import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const categories = [
  {
    name: 'Modeling',
    checks: [
      'Direct join to source', 'Duplicate sources', 'Hard coded references',
      'Model fanout', 'Source fanout', 'Multiple sources joined',
      'Rejoining of upstream concepts', 'Root models',
      'Downstream models dependent on source',
      'Staging dependent on other staging',
      'Staging dependent on downstream',
      'Unused sources', 'Models with too many joins',
    ],
  },
  {
    name: 'Testing',
    checks: ['Missing primary key tests', 'Missing source freshness', 'Test coverage'],
  },
  {
    name: 'Documentation',
    checks: ['Undocumented models', 'Documentation coverage', 'Undocumented sources', 'Undocumented source tables'],
  },
  {
    name: 'Structure',
    checks: ['Model naming conventions', 'Model directories', 'Source directories', 'Test directories'],
  },
  {
    name: 'Performance',
    checks: ['Chained view dependencies', 'Exposure parents materializations'],
  },
  {
    name: 'Governance',
    checks: ['Public models without contracts', 'Undocumented public models', 'Exposures dependent on private models'],
  },
]

const totalChecks = categories.reduce((sum, c) => sum + c.checks.length, 0)

// Checks that warn in "messy" mode
const messyWarnings = new Set([
  'Direct join to source',
  'Undocumented models',
  'Test coverage',
  'Model naming conventions',
  'Public models without contracts',
])

export default function ProjectEvaluatorAnimation() {
  const [isRunning, setIsRunning] = useState(false)
  const [hasRun, setHasRun] = useState(false)
  const [messy, setMessy] = useState(false)
  const [categoryStates, setCategoryStates] = useState({})
  // categoryStates: { [catName]: { status: 'pending'|'running'|'done', checks: { [checkName]: 'pending'|'running'|'pass'|'warn' } } }
  const [passedCount, setPassedCount] = useState(0)
  const [warnCount, setWarnCount] = useState(0)
  const [phase, setPhase] = useState('idle') // idle | evaluating | gate | building | done
  const [terminalLines, setTerminalLines] = useState([])
  const [expandedCat, setExpandedCat] = useState(null)
  const timeoutsRef = useRef([])

  const reset = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout)
    timeoutsRef.current = []
    setCategoryStates({})
    setPassedCount(0)
    setWarnCount(0)
    setPhase('idle')
    setTerminalLines([])
    setIsRunning(false)
    setHasRun(false)
    setExpandedCat(null)
  }, [])

  const runAnimation = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout)
    timeoutsRef.current = []
    setIsRunning(true)
    setHasRun(true)
    setPassedCount(0)
    setWarnCount(0)
    setPhase('evaluating')
    setExpandedCat(null)

    // Init all categories to pending
    const init = {}
    categories.forEach(cat => {
      const checks = {}
      cat.checks.forEach(c => { checks[c] = 'pending' })
      init[cat.name] = { status: 'pending', checks }
    })
    setCategoryStates(init)

    setTerminalLines([
      { text: '$ dbt build --select package:dbt_project_evaluator', type: 'command' },
      { text: 'Running best-practice checks across the project...', type: 'info' },
      { text: '', type: 'blank' },
    ])

    let delay = 600
    let runningPassed = 0
    let runningWarn = 0

    categories.forEach((cat, catIdx) => {
      // Start category
      const catStartDelay = delay
      const t1 = setTimeout(() => {
        setCategoryStates(prev => ({
          ...prev,
          [cat.name]: { ...prev[cat.name], status: 'running' },
        }))
        setExpandedCat(cat.name)
        setTerminalLines(prev => [...prev, { text: `  [${cat.name}] Running ${cat.checks.length} checks...`, type: 'run' }])
      }, catStartDelay)
      timeoutsRef.current.push(t1)
      delay += 400

      // Animate each check
      cat.checks.forEach((check, checkIdx) => {
        const checkDelay = delay
        // Start check
        const t2 = setTimeout(() => {
          setCategoryStates(prev => {
            const updated = { ...prev }
            updated[cat.name] = {
              ...updated[cat.name],
              checks: { ...updated[cat.name].checks, [check]: 'running' },
            }
            return updated
          })
        }, checkDelay)
        timeoutsRef.current.push(t2)

        // Complete check
        const isWarn = messy && messyWarnings.has(check)
        const completeDelay = checkDelay + 180
        const t3 = setTimeout(() => {
          const result = isWarn ? 'warn' : 'pass'
          setCategoryStates(prev => {
            const updated = { ...prev }
            updated[cat.name] = {
              ...updated[cat.name],
              checks: { ...updated[cat.name].checks, [check]: result },
            }
            return updated
          })
          if (isWarn) {
            runningWarn++
            setWarnCount(runningWarn)
          } else {
            runningPassed++
            setPassedCount(runningPassed)
          }
        }, completeDelay)
        timeoutsRef.current.push(t3)
        delay = completeDelay + 80
      })

      // Complete category
      const catEndDelay = delay + 100
      const t4 = setTimeout(() => {
        setCategoryStates(prev => ({
          ...prev,
          [cat.name]: { ...prev[cat.name], status: 'done' },
        }))
        const catWarnCount = cat.checks.filter(c => messy && messyWarnings.has(c)).length
        if (catWarnCount > 0) {
          setTerminalLines(prev => [...prev, { text: `  [${cat.name}] ${cat.checks.length - catWarnCount} passed, ${catWarnCount} warnings`, type: 'warn' }])
        } else {
          setTerminalLines(prev => [...prev, { text: `  [${cat.name}] ${cat.checks.length}/${cat.checks.length} passed`, type: 'ok' }])
        }
      }, catEndDelay)
      timeoutsRef.current.push(t4)
      delay = catEndDelay + 200
    })

    // Gate
    const gateDelay = delay + 300
    const t5 = setTimeout(() => {
      setPhase('gate')
      setExpandedCat(null)
      const totalWarn = messy ? messyWarnings.size : 0
      if (totalWarn > 0) {
        setTerminalLines(prev => [...prev,
          { text: '', type: 'blank' },
          { text: `Best practices: ${totalChecks - totalWarn} passed, ${totalWarn} warnings`, type: 'warn' },
          { text: 'Warnings found. Review before merging.', type: 'warn' },
        ])
      } else {
        setTerminalLines(prev => [...prev,
          { text: '', type: 'blank' },
          { text: `Best practices: ${totalChecks}/${totalChecks} validated`, type: 'success' },
          { text: 'Proceeding to project build...', type: 'success' },
        ])
      }
    }, gateDelay)
    timeoutsRef.current.push(t5)

    // Build phase (brief)
    const buildDelay = gateDelay + 1200
    const t6 = setTimeout(() => {
      setPhase('building')
      setTerminalLines(prev => [...prev, { text: '', type: 'blank' }, { text: '$ dbt build', type: 'command' }, { text: '  Building project models...', type: 'run' }])
    }, buildDelay)
    timeoutsRef.current.push(t6)

    // Done
    const doneDelay = buildDelay + 1500
    const t7 = setTimeout(() => {
      setPhase('done')
      setIsRunning(false)
      setTerminalLines(prev => [...prev, { text: '  Build complete.', type: 'ok' }, { text: '', type: 'blank' }, { text: 'Done. CI job passed.', type: 'success' }])
    }, doneDelay)
    timeoutsRef.current.push(t7)
  }, [messy])

  const getCheckIcon = (state) => {
    if (state === 'pass') return <span className="text-green-600 font-bold text-xs">&#10003;</span>
    if (state === 'warn') return <span className="text-amber-500 font-bold text-xs">&#9888;</span>
    if (state === 'running') return <span className="w-2 h-2 rounded-full bg-blue-500 inline-block animate-pulse" />
    return <span className="w-2 h-2 rounded-full bg-gray-300 inline-block" />
  }

  const getCatIcon = (catName) => {
    const cat = categoryStates[catName]
    if (!cat) return <span className="w-3 h-3 rounded-full bg-gray-200 inline-block" />
    if (cat.status === 'done') {
      const hasWarn = Object.values(cat.checks).some(s => s === 'warn')
      if (hasWarn) return <span className="text-amber-500 font-bold">&#9888;</span>
      return <span className="text-green-600 font-bold">&#10003;</span>
    }
    if (cat.status === 'running') return <span className="w-3 h-3 rounded-full bg-blue-500 inline-block animate-pulse" />
    return <span className="w-3 h-3 rounded-full bg-gray-200 inline-block" />
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            CI job: best-practice gate
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">dbt_project_evaluator checks the project against dbt Labs best practices on every PR.</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Messy toggle */}
          <label className="flex items-center gap-2 text-xs text-gray-500 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={messy}
              onChange={(e) => { reset(); setMessy(e.target.checked) }}
              className="rounded border-gray-300"
            />
            Messy project
          </label>
          <button
            onClick={runAnimation}
            disabled={isRunning}
            className={`px-5 py-2 rounded-lg font-medium text-sm transition-all duration-150 ${
              isRunning
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gray-900 text-white hover:bg-gray-800'
            }`}
          >
            {isRunning ? 'Running...' : hasRun ? 'Run again' : 'Run CI job'}
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
          <span>Checks: {passedCount + warnCount} / {totalChecks}</span>
          <span>
            {passedCount > 0 && <span className="text-green-600 mr-3">{passedCount} passed</span>}
            {warnCount > 0 && <span className="text-amber-500">{warnCount} warnings</span>}
          </span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${warnCount > 0 ? 'bg-amber-400' : 'bg-green-500'}`}
            initial={{ width: '0%' }}
            animate={{ width: `${((passedCount + warnCount) / totalChecks) * 100}%` }}
            transition={{ duration: 0.2 }}
          />
        </div>
      </div>

      {/* Category cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
        {categories.map(cat => {
          const state = categoryStates[cat.name]
          const isExpanded = expandedCat === cat.name
          const doneChecks = state ? Object.values(state.checks).filter(s => s === 'pass' || s === 'warn').length : 0

          return (
            <motion.div
              key={cat.name}
              whileHover={{ y: -2, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              onClick={() => setExpandedCat(isExpanded ? null : cat.name)}
              className={`border rounded-xl p-3 cursor-pointer transition-all duration-200 ${
                state?.status === 'running' ? 'border-blue-300 bg-blue-50/50' :
                state?.status === 'done' && Object.values(state.checks).some(s => s === 'warn') ? 'border-amber-300 bg-amber-50/50' :
                state?.status === 'done' ? 'border-green-300 bg-green-50/50' :
                'border-gray-200 bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  {getCatIcon(cat.name)}
                  <span className="text-sm font-semibold text-gray-800">{cat.name}</span>
                </div>
                <span className="text-[10px] text-gray-400">{doneChecks}/{cat.checks.length}</span>
              </div>

              {/* Expanded checks */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-2 space-y-0.5">
                      {cat.checks.map(check => (
                        <div key={check} className="flex items-center gap-2 text-[10px] text-gray-600 py-0.5">
                          {getCheckIcon(state?.checks?.[check] || 'pending')}
                          <span className={state?.checks?.[check] === 'warn' ? 'text-amber-600 font-medium' : ''}>{check}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Collapsed: just show count */}
              {!isExpanded && doneChecks > 0 && doneChecks < cat.checks.length && (
                <div className="h-1 bg-gray-100 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-blue-400 rounded-full transition-all" style={{ width: `${(doneChecks / cat.checks.length) * 100}%` }} />
                </div>
              )}
            </motion.div>
          )
        })}
      </div>

      {/* Gate status */}
      <AnimatePresence>
        {(phase === 'gate' || phase === 'building' || phase === 'done') && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-4 px-4 py-3 rounded-xl border text-sm font-medium ${
              warnCount > 0
                ? 'bg-amber-50 border-amber-200 text-amber-800'
                : 'bg-green-50 border-green-200 text-green-800'
            }`}
          >
            {warnCount > 0
              ? `${warnCount} warning(s) found. Review flagged checks before merging.`
              : phase === 'done'
                ? 'Best practices validated. CI job passed.'
                : 'Best practices validated. Proceeding to project build...'
            }
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mb-4 text-xs text-gray-500">
        <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-gray-300" /> Pending</div>
        <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" /> Running</div>
        <div className="flex items-center gap-1.5"><span className="text-green-600 font-bold text-xs">&#10003;</span> Validated</div>
        <div className="flex items-center gap-1.5"><span className="text-amber-500 font-bold text-xs">&#9888;</span> Warning</div>
      </div>

      {/* Console */}
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
                line.type === 'warn' ? 'text-amber-600 font-semibold' :
                ''
              }
            >
              {line.text || '\u00A0'}
            </motion.div>
          ))}
        </AnimatePresence>
        {terminalLines.length === 0 && (
          <div className="text-gray-400">Click "Run CI job" to see the best-practice gate...</div>
        )}
      </div>
    </div>
  )
}
