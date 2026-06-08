import { useState } from 'react'
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

/* --- Main export --- */

const subtabs = [
  { key: 'global', label: 'Global & sub-global settings' },
  { key: 'incremental', label: 'Incremental models' },
  { key: 'snapshots', label: 'Snapshots' },
]

const subtabDescs = {
  global: 'Centralize configuration in dbt_project.yml instead of repeating config blocks in every model.',
  incremental: 'Write a select — dbt generates the MERGE, handles first-run vs. incremental, and supports full-refresh.',
  snapshots: 'A few lines of YAML give you full SCD Type 2 change tracking with valid-from/to ranges and delete handling.',
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
        </AnimatePresence>
      </div>
    </div>
  )
}
