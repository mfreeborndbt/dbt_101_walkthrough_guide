import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const KW = 'text-blue-600'
const FN = 'text-purple-600'
const STR = 'text-emerald-600'
const JJ = 'text-orange-600'
const TXT = 'text-gray-800'
const CMT = 'text-gray-400'
const ERR = 'text-red-600'

export default function LiveCompileDemo() {
  const [mode, setMode] = useState('without')
  const [phase, setPhase] = useState('idle') // idle | running | error | caught
  const timeoutsRef = useRef([])

  const reset = () => {
    timeoutsRef.current.forEach(clearTimeout)
    timeoutsRef.current = []
    setPhase('idle')
  }

  const switchMode = (m) => {
    reset()
    setMode(m)
  }

  const runValidation = useCallback(() => {
    reset()
    if (mode === 'without') {
      setPhase('running')
      const t = setTimeout(() => setPhase('error'), 3000)
      timeoutsRef.current.push(t)
    } else {
      setPhase('caught')
    }
  }, [mode])

  const isWith = mode === 'with'

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div className="inline-flex bg-gray-100 rounded-xl p-1">
          <button
            onClick={() => switchMode('without')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              !isWith ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Without live compile
          </button>
          <button
            onClick={() => switchMode('with')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              isWith ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            With live compile
          </button>
        </div>
        {!isWith && (
          <button
            onClick={runValidation}
            disabled={phase === 'running'}
            className={`px-5 py-2 rounded-lg font-medium text-sm transition-all duration-150 ${
              phase === 'running'
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gray-900 text-white hover:bg-gray-800'
            }`}
          >
            {phase === 'running' ? 'Executing in warehouse...' : 'Submit to warehouse'}
          </button>
        )}
        {isWith && phase === 'idle' && (
          <button
            onClick={runValidation}
            className="px-5 py-2 rounded-lg font-medium text-sm bg-gray-900 text-white hover:bg-gray-800 transition-all duration-150"
          >
            Check with Fusion
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-5">
        {/* Left: Code editor */}
        <motion.div
          whileHover={{ y: -2, boxShadow: '0 6px 20px rgba(0,0,0,0.06)' }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className="bg-white border border-gray-200/60 rounded-2xl shadow-sm overflow-hidden"
        >
          {/* Editor tab bar */}
          <div className="px-4 py-2.5 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">{isWith ? 'dbt Studio (Fusion)' : 'SQL editor'}</span>
              <span className="text-xs font-mono font-semibold text-gray-700 bg-white px-2 py-0.5 rounded border border-gray-200">fct_customer_orders.sql</span>
            </div>
            {isWith && phase === 'caught' && (
              <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded font-semibold">1 error</span>
            )}
          </div>

          {/* Code */}
          <div className="p-4 font-mono text-xs leading-relaxed">
            <div><span className={CMT}>-- fct_customer_orders.sql</span></div>
            <div className="h-2" />
            <div><span className={KW}>select</span></div>
            <div className="relative">
              <span className={TXT}>    </span>
              {/* The error token */}
              {isWith && phase === 'caught' ? (
                <span className="relative">
                  <span className={ERR} style={{ textDecoration: 'wavy underline', textDecorationColor: '#dc2626', textUnderlineOffset: '3px' }}>customr_id</span>
                  <span className={TXT}>,</span>
                </span>
              ) : (
                <span><span className={TXT}>customr_id,</span></span>
              )}
            </div>
            <div><span className={TXT}>    customer_name,</span></div>
            <div><span className={TXT}>    </span><span className={KW}>sum</span><span className={TXT}>(amount) </span><span className={KW}>as</span><span className={TXT}> total_spend</span></div>
            <div className="h-2" />
            <div><span className={KW}>from</span> <span className={JJ}>{'{{ '}</span><span className={FN}>ref</span>(<span className={STR}>'stg_orders'</span>)<span className={JJ}>{' }}'}</span><span className={TXT}> o</span></div>
            <div><span className={KW}>left join</span> <span className={JJ}>{'{{ '}</span><span className={FN}>ref</span>(<span className={STR}>'stg_customers'</span>)<span className={JJ}>{' }}'}</span><span className={TXT}> c</span></div>
            <div><span className={TXT}>    </span><span className={KW}>on</span><span className={TXT}> o.customer_id = c.customer_id</span></div>
            <div className="h-2" />
            <div><span className={KW}>group by</span><span className={TXT}> 1, 2</span></div>
          </div>

          {/* Fusion error tooltip (with mode, after check) */}
          <AnimatePresence>
            {isWith && phase === 'caught' && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mx-4 mb-4"
              >
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-xs">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-3 h-3 rounded-full bg-red-500 flex items-center justify-center text-white text-[8px] font-bold">!</span>
                    <span className="font-semibold text-red-800">Line 4: Unknown column</span>
                  </div>
                  <p className="text-red-700 ml-5">
                    <code className="bg-red-100 px-1 rounded">customr_id</code> does not exist on <code className="bg-red-100 px-1 rounded">stg_customers</code>.
                    Did you mean <code className="bg-green-100 text-green-700 px-1 rounded">customer_id</code>?
                  </p>
                  <p className="text-red-500 ml-5 mt-1 text-[10px]">Caught by the dbt Fusion engine (local, no warehouse execution)</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Right: Feedback panel */}
        <div className="space-y-4">
          {/* Status card */}
          <motion.div
            whileHover={{ y: -2, boxShadow: '0 6px 20px rgba(0,0,0,0.06)' }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="bg-white border border-gray-200/60 rounded-2xl p-5 shadow-sm"
          >
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              {isWith ? 'Fusion engine (local)' : 'Warehouse execution'}
            </p>

            <AnimatePresence mode="wait">
              {phase === 'idle' && (
                <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <p className="text-sm text-gray-400">
                    {isWith ? 'Click "Check with Fusion" to validate locally.' : 'Click "Submit to warehouse" to execute.'}
                  </p>
                </motion.div>
              )}

              {phase === 'running' && (
                <motion.div key="running" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
                    <span className="text-sm text-blue-700 font-medium">Executing query in warehouse...</span>
                  </div>
                  <div className="text-xs text-gray-400">Waiting for data platform response...</div>
                  <div className="h-1.5 bg-blue-100 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-blue-500 rounded-full"
                      initial={{ width: '0%' }}
                      animate={{ width: '90%' }}
                      transition={{ duration: 2.8, ease: 'linear' }}
                    />
                  </div>
                </motion.div>
              )}

              {phase === 'error' && (
                <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-xs font-semibold text-red-800 mb-1">SQL compilation error</p>
                    <p className="text-xs text-red-700 font-mono">invalid identifier 'CUSTOMR_ID'</p>
                  </div>
                  <p className="text-xs text-gray-500">Error returned after ~3 seconds of warehouse execution.</p>
                </motion.div>
              )}

              {phase === 'caught' && isWith && (
                <motion.div key="caught" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-xs font-semibold text-green-800 mb-1">Error caught locally</p>
                    <p className="text-xs text-green-700">The dbt Fusion engine identified the invalid column before any query reached the warehouse.</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Cost comparison */}
          <motion.div
            whileHover={{ y: -2, boxShadow: '0 6px 20px rgba(0,0,0,0.06)' }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="bg-white border border-gray-200/60 rounded-2xl p-5 shadow-sm"
          >
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Feedback loop comparison</p>
            <div className="grid grid-cols-2 gap-3">
              {/* Without */}
              <div className={`rounded-xl p-3 border ${!isWith ? 'border-red-200 bg-red-50/50' : 'border-gray-200 bg-gray-50'}`}>
                <p className="text-[10px] font-semibold text-gray-500 mb-2">Without live compile</p>
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Feedback time</span>
                    <span className="font-semibold text-red-600">~3-30 sec</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Compute cost</span>
                    <span className="font-semibold text-red-600">$ paid</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Where caught</span>
                    <span className="font-semibold text-gray-500">Warehouse</span>
                  </div>
                </div>
              </div>
              {/* With */}
              <div className={`rounded-xl p-3 border ${isWith ? 'border-green-200 bg-green-50/50' : 'border-gray-200 bg-gray-50'}`}>
                <p className="text-[10px] font-semibold text-gray-500 mb-2">With Fusion</p>
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Feedback time</span>
                    <span className="font-semibold text-green-700">Instant</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Compute cost</span>
                    <span className="font-semibold text-green-700">$0</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Where caught</span>
                    <span className="font-semibold text-green-700">Editor (local)</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
