import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const topics = [
  { key: 'sources', label: 'Sources' },
  { key: 'staging', label: 'Staging' },
  { key: 'intermediate', label: 'Intermediate' },
  { key: 'marts', label: 'Marts' },
]

const topicDescs = {
  sources: 'How raw data enters your project and whether anyone knows if it is fresh.',
  staging: 'Where renaming, casting, and basic cleanup happen before anything else.',
  intermediate: 'Shared transformations that multiple data products can reuse.',
  marts: 'The final, consumable data products your stakeholders query.',
}

/* ─── Layer color tokens (With dbt only) ─── */
const LC = {
  source:       { fill: '#059669', bg: '#05966920', stroke: '#059669', text: '#059669', light: '#f0fdf4', border: '#86efac', dot: 'bg-emerald-500' },
  staging:      { fill: '#6366f1', bg: '#6366f120', stroke: '#6366f1', text: '#6366f1', light: '#eef2ff', border: '#a5b4fc', dot: 'bg-indigo-500' },
  intermediate: { fill: '#7c3aed', bg: '#7c3aed20', stroke: '#7c3aed', text: '#7c3aed', light: '#f5f3ff', border: '#c4b5fd', dot: 'bg-violet-500' },
  mart:         { fill: '#d97706', bg: '#d9770620', stroke: '#d97706', text: '#d97706', light: '#fffbeb', border: '#fde68a', dot: 'bg-amber-500' },
}

/* ─── Shared toggle ─── */
function DbtToggle({ withDbt, setWithDbt }) {
  return (
    <div className="flex justify-center mb-5">
      <div className="inline-flex bg-gray-100 rounded-xl p-1">
        <button
          onClick={() => setWithDbt(false)}
          className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            !withDbt ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Without dbt
        </button>
        <button
          onClick={() => setWithDbt(true)}
          className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            withDbt ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          With dbt
        </button>
      </div>
    </div>
  )
}

/* ─── Hoverable box wrapper (reuses app's spring hover pattern) ─── */
function HoverBox({ children, className = '', style }) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      className={`cursor-default ${className}`}
      style={style}
    >
      {children}
    </motion.div>
  )
}

/* ─── Shared mini-DAG renderer ─── */
const NW = 120
const NH = 28

function MiniDAG({ nodes, edges, width, height, badges }) {
  const [hovered, setHovered] = useState(null)
  const nodeMap = {}
  nodes.forEach(n => { nodeMap[n.id] = n })

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
      <defs>
        <marker id="dm-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth={5} markerHeight={5} orient="auto-start-auto">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#d1d5db" />
        </marker>
        <marker id="dm-arrow-hl" viewBox="0 0 10 10" refX="8" refY="5" markerWidth={5} markerHeight={5} orient="auto-start-auto">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#9ca3af" />
        </marker>
      </defs>

      {/* Edges */}
      {(edges || []).map(([fromId, toId], i) => {
        const from = nodeMap[fromId]
        const to = nodeMap[toId]
        if (!from || !to) return null
        const fw = from.w || NW
        const fh = from.h || NH
        const th = to.h || NH
        const x1 = from.x + fw
        const y1 = from.y + fh / 2
        const x2 = to.x
        const y2 = to.y + th / 2
        const dx = Math.max((x2 - x1) * 0.4, 16)
        const d = `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`
        return (
          <path key={i} d={d} fill="none" stroke="#d1d5db" strokeWidth={1} markerEnd="url(#dm-arrow)" />
        )
      })}

      {/* Nodes */}
      {nodes.map((n) => {
        const w = n.w || NW
        const h = n.h || NH
        const isHL = n.highlight
        const isHov = hovered === n.id
        const yOff = isHov ? -2 : 0
        const c = n.color || '#6b7280'
        return (
          <g key={n.id}
            onMouseEnter={() => setHovered(n.id)}
            onMouseLeave={() => setHovered(null)}
            style={{ cursor: 'default' }}
          >
            {isHov && (
              <rect x={n.x - 2} y={n.y - 2 + yOff} width={w + 4} height={h + 4} rx={7}
                fill="none" stroke={c} strokeWidth={2} opacity={0.3} />
            )}
            <rect
              x={n.x} y={n.y + yOff} width={w} height={h} rx={5}
              fill={isHL ? c + '25' : c + '10'}
              stroke={isHL ? c : c + '60'}
              strokeWidth={isHL ? 2 : 1}
            />
            <text
              x={n.x + w / 2} y={n.y + yOff + h / 2 + 4}
              textAnchor="middle" fontSize={9} fontWeight={isHL ? 700 : 500}
              fontFamily="ui-monospace, monospace"
              fill={isHL ? c : '#6b7280'}
            >
              {n.label}
            </text>
          </g>
        )
      })}

      {/* Badges */}
      {(badges || []).map((b, i) => (
        <g key={`b${i}`}>
          <rect x={b.x} y={b.y} width={b.w || b.label.length * 5.5 + 10} height={14} rx={7}
            fill={b.bg || '#f0fdf4'} stroke={b.border || '#86efac'} strokeWidth={1} />
          <text x={b.x + (b.w || b.label.length * 5.5 + 10) / 2} y={b.y + 10}
            textAnchor="middle" fontSize={7.5} fontWeight={600} fill={b.textColor || '#166534'}>
            {b.label}
          </text>
        </g>
      ))}
    </svg>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   Topic 1: Sources
   ═══════════════════════════════════════════════════════════════════ */
export function SourcesTopic() {
  const [withDbt, setWithDbt] = useState(false)

  return (
    <div>
      <DbtToggle withDbt={withDbt} setWithDbt={setWithDbt} />
      <AnimatePresence mode="wait">
        {!withDbt ? (
          <motion.div key="without" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
            <div className="text-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">Raw tables, no signposts</h3>
              <p className="text-sm text-gray-500 mt-1">Nothing marks what is a source versus a transformed table, or what is safe to read versus write.</p>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                {[
                  { name: 'raw_orders', accent: '#94a3b8' }, { name: 'customers', accent: '#a78bfa' },
                  { name: 'stg_payments', accent: '#6366f1' }, { name: 'dim_products', accent: '#f59e0b' },
                  { name: 'orders_v2', accent: '#94a3b8' }, { name: 'raw_events', accent: '#94a3b8' },
                  { name: 'user_sessions', accent: '#a78bfa' }, { name: 'fct_revenue', accent: '#f59e0b' },
                  { name: 'tmp_refunds', accent: '#fb923c' }, { name: 'customer_final', accent: '#a78bfa' },
                ].map((t) => (
                  <HoverBox key={t.name} className="bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-center hover:shadow-md hover:border-gray-300 transition-shadow border-l-[3px]" style={{ borderLeftColor: t.accent }}>
                    <div className="font-mono text-[10px] text-gray-600 truncate">{t.name}</div>
                    <div className="text-[9px] text-gray-400 mt-0.5">table</div>
                  </HoverBox>
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div key="with" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
            <div className="text-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">Declared sources</h3>
              <p className="text-sm text-gray-500 mt-1">Sources are defined explicitly, with clear lineage and freshness SLAs you can configure.</p>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
              <div className="overflow-x-auto">
                <MiniDAG
                  width={560} height={160}
                  nodes={[
                    { id: 'raw_orders', label: 'raw_orders', x: 16, y: 20, color: LC.source.fill, highlight: true, w: 100, h: NH },
                    { id: 'raw_customers', label: 'raw_customers', x: 16, y: 62, color: LC.source.fill, highlight: true, w: 100, h: NH },
                    { id: 'raw_payments', label: 'raw_payments', x: 16, y: 104, color: LC.source.fill, highlight: true, w: 100, h: NH },
                    { id: 'stg_orders', label: 'stg_orders', x: 190, y: 20, color: LC.staging.fill, w: 100, h: NH },
                    { id: 'stg_customers', label: 'stg_customers', x: 190, y: 62, color: LC.staging.fill, w: 100, h: NH },
                    { id: 'stg_payments', label: 'stg_payments', x: 190, y: 104, color: LC.staging.fill, w: 100, h: NH },
                    { id: 'fct_orders', label: 'fct_orders', x: 380, y: 62, color: LC.mart.fill, w: 100, h: NH },
                  ]}
                  edges={[
                    ['raw_orders', 'stg_orders'], ['raw_customers', 'stg_customers'], ['raw_payments', 'stg_payments'],
                    ['stg_orders', 'fct_orders'], ['stg_customers', 'fct_orders'], ['stg_payments', 'fct_orders'],
                  ]}
                  badges={[
                    { x: 118, y: 6, label: 'fresh', bg: LC.source.light, border: LC.source.border, textColor: '#166534' },
                    { x: 118, y: 48, label: 'fresh', bg: LC.source.light, border: LC.source.border, textColor: '#166534' },
                    { x: 118, y: 90, label: 'stale', bg: '#fffbeb', border: '#fde68a', textColor: '#92400e' },
                  ]}
                />
              </div>
              <div className="flex items-center justify-center gap-4 mt-2 text-[10px]">
                <div className="flex items-center gap-1"><span className={`w-2 h-2 rounded-full ${LC.source.dot}`} /> source</div>
                <div className="flex items-center gap-1"><span className={`w-2 h-2 rounded-full ${LC.staging.dot}`} /> staging</div>
                <div className="flex items-center gap-1"><span className={`w-2 h-2 rounded-full ${LC.mart.dot}`} /> mart</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   Topic 2: Staging
   ═══════════════════════════════════════════════════════════════════ */
export function StagingTopic() {
  const [withDbt, setWithDbt] = useState(false)

  return (
    <div>
      <DbtToggle withDbt={withDbt} setWithDbt={setWithDbt} />
      <AnimatePresence mode="wait">
        {!withDbt ? (
          <motion.div key="without" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
            <div className="text-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">Cleaning happens everywhere</h3>
              <p className="text-sm text-gray-500 mt-1">No single place to rename, cast, or standardize. Is the fix upstream or downstream? Unclear.</p>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
              <div className="flex flex-col items-center gap-4">
                <HoverBox className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-center hover:shadow-md hover:border-gray-300 transition-shadow">
                  <div className="font-mono text-[11px] text-gray-700 font-semibold">raw_customers</div>
                  <div className="flex gap-1.5 mt-1.5 justify-center">
                    <span className="text-[9px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded font-mono">ID</span>
                    <span className="text-[9px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded font-mono">CUST_NM</span>
                    <span className="text-[9px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded font-mono">SIGNUP_DT</span>
                  </div>
                </HoverBox>
                <svg width="400" height="40" viewBox="0 0 400 40" className="shrink-0">
                  <defs>
                    <marker id="stg-wo-arrow" viewBox="0 0 10 10" refX="5" refY="9" markerWidth={5} markerHeight={5} orient="0">
                      <path d="M 0 0 L 5 10 L 10 0 z" fill="#d1d5db" />
                    </marker>
                  </defs>
                  <path d="M 200 0 C 200 20, 67 20, 67 40" fill="none" stroke="#d1d5db" strokeWidth={1.5} markerEnd="url(#stg-wo-arrow)" />
                  <path d="M 200 0 C 200 16, 200 24, 200 40" fill="none" stroke="#d1d5db" strokeWidth={1.5} markerEnd="url(#stg-wo-arrow)" />
                  <path d="M 200 0 C 200 20, 333 20, 333 40" fill="none" stroke="#d1d5db" strokeWidth={1.5} markerEnd="url(#stg-wo-arrow)" />
                </svg>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-lg">
                  {[
                    { name: 'report_a', cols: ['cust_id', 'name', 'signup_date'] },
                    { name: 'report_b', cols: ['customer_id', 'cust_nm', 'created_at'] },
                    { name: 'report_c', cols: ['id', 'customer_name', 'signup_dt'] },
                  ].map((r) => (
                    <HoverBox key={r.name} className="bg-white border border-gray-200 rounded-lg px-3 py-2 hover:shadow-md hover:border-gray-300 transition-shadow">
                      <div className="font-mono text-[10px] text-gray-700 font-semibold text-center">{r.name}</div>
                      <div className="flex flex-wrap gap-1 mt-1.5 justify-center">
                        {r.cols.map((c) => (
                          <span key={c} className="text-[8px] bg-red-50 text-red-600 border border-red-200 px-1.5 py-0.5 rounded font-mono">{c}</span>
                        ))}
                      </div>
                    </HoverBox>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div key="with" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
            <div className="text-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">One place to standardize</h3>
              <p className="text-sm text-gray-500 mt-1">Staging models set naming conventions, light casting, and key tests early, so joins downstream stay correct.</p>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
              <div className="relative" style={{ minHeight: 340 }}>
                {/* SVG curved connectors (behind cards via absolute positioning) */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="xMidYMid meet">
                  {/* raw_customers → stg_customers (center to center) */}
                  <path d="M 50% 68 C 50% 100, 50% 110, 50% 140" fill="none" stroke="#c7d2fe" strokeWidth={1.5}>
                    <animate attributeName="d" values="M 50% 68 C 50% 100, 50% 110, 50% 140" />
                  </path>
                </svg>
                <div className="relative flex flex-col items-center" style={{ gap: 0 }}>
                  {/* raw_customers card */}
                  <HoverBox className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-center hover:shadow-md transition-shadow" style={{ borderColor: LC.source.border }}>
                    <div className="font-mono text-[11px] font-semibold" style={{ color: LC.source.fill }}>raw_customers</div>
                    <div className="flex gap-1.5 mt-1.5 justify-center">
                      <span className="text-[9px] px-1.5 py-0.5 rounded font-mono" style={{ backgroundColor: LC.source.light, color: LC.source.fill }}>ID</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded font-mono" style={{ backgroundColor: LC.source.light, color: LC.source.fill }}>CUST_NM</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded font-mono" style={{ backgroundColor: LC.source.light, color: LC.source.fill }}>SIGNUP_DT</span>
                    </div>
                  </HoverBox>
                  {/* Curved connector: raw → stg */}
                  <svg width="60" height="36" viewBox="0 0 60 36" className="shrink-0">
                    <defs>
                      <marker id="stg-arrow-down" viewBox="0 0 10 10" refX="5" refY="9" markerWidth={5} markerHeight={5} orient="0">
                        <path d="M 0 0 L 5 10 L 10 0 z" fill="#c7d2fe" />
                      </marker>
                    </defs>
                    <path d="M 30 0 C 30 14, 30 22, 30 36" fill="none" stroke="#c7d2fe" strokeWidth={1.5} markerEnd="url(#stg-arrow-down)" />
                  </svg>
                  {/* stg_customers card */}
                  <HoverBox className="bg-white border-2 rounded-lg px-5 py-3 text-center shadow-sm hover:shadow-md transition-shadow" style={{ borderColor: LC.staging.border }}>
                    <div className="font-mono text-[11px] font-bold" style={{ color: LC.staging.fill }}>stg_customers</div>
                    <div className="flex gap-1.5 mt-2 justify-center">
                      {['customer_id', 'customer_name', 'signed_up_at'].map(c => (
                        <span key={c} className="text-[9px] px-1.5 py-0.5 rounded font-mono border" style={{ backgroundColor: LC.staging.light, color: LC.staging.fill, borderColor: LC.staging.border }}>{c}</span>
                      ))}
                    </div>
                  </HoverBox>
                  {/* Curved fan-out connector: stg → 3 reports */}
                  <svg width="400" height="40" viewBox="0 0 400 40" className="shrink-0">
                    <path d="M 200 0 C 200 20, 67 20, 67 40" fill="none" stroke="#c7d2fe" strokeWidth={1.5} markerEnd="url(#stg-arrow-down)" />
                    <path d="M 200 0 C 200 16, 200 24, 200 40" fill="none" stroke="#c7d2fe" strokeWidth={1.5} markerEnd="url(#stg-arrow-down)" />
                    <path d="M 200 0 C 200 20, 333 20, 333 40" fill="none" stroke="#c7d2fe" strokeWidth={1.5} markerEnd="url(#stg-arrow-down)" />
                  </svg>
                  {/* Report cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-lg">
                    {['report_a', 'report_b', 'report_c'].map((name) => (
                      <HoverBox key={name} className="bg-white border border-gray-200 rounded-lg px-3 py-2 hover:shadow-md hover:border-gray-300 transition-shadow">
                        <div className="font-mono text-[10px] text-gray-700 font-semibold text-center">{name}</div>
                        <div className="flex flex-wrap gap-1 mt-1.5 justify-center">
                          {['customer_id', 'customer_name', 'signed_up_at'].map((c) => (
                            <span key={c} className="text-[8px] px-1.5 py-0.5 rounded font-mono border" style={{ backgroundColor: LC.staging.light, color: LC.staging.fill, borderColor: LC.staging.border }}>{c}</span>
                          ))}
                        </div>
                      </HoverBox>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   Topic 3: Intermediate
   ═══════════════════════════════════════════════════════════════════ */
export function IntermediateTopic() {
  const [withDbt, setWithDbt] = useState(false)

  const logicBlock = (
    <div className="bg-gray-950 rounded px-2 py-1.5 font-mono text-[8px] leading-relaxed text-gray-400 mt-1.5">
      <div><span className="text-blue-400">WITH</span> enriched <span className="text-blue-400">AS</span> (</div>
      <div className="ml-2"><span className="text-blue-400">SELECT</span> ...</div>
      <div className="ml-2"><span className="text-blue-400">JOIN</span> ... <span className="text-blue-400">ON</span> ...</div>
      <div className="ml-2"><span className="text-blue-400">WHERE</span> status = ...</div>
      <div>)</div>
    </div>
  )

  return (
    <div>
      <DbtToggle withDbt={withDbt} setWithDbt={setWithDbt} />
      <AnimatePresence mode="wait">
        {!withDbt ? (
          <motion.div key="without" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
            <div className="text-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">Logic locked in scripts</h3>
              <p className="text-sm text-gray-500 mt-1">Reusable logic is buried inside ad-hoc scripts. Data products carry too much logic to have a clear purpose.</p>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto">
                {['fct_order_summary', 'fct_customer_orders'].map((name) => (
                  <HoverBox key={name} className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md hover:border-gray-300 transition-shadow">
                    <div className="font-mono text-[11px] text-gray-700 font-semibold">{name}</div>
                    <div className="mt-1 bg-red-50 border border-red-200 rounded px-2 py-1 text-[9px] text-red-600 font-medium">
                      Duplicated logic
                    </div>
                    {logicBlock}
                    <div className="text-[9px] text-gray-400 mt-1.5">Same CTE copy-pasted into both scripts.</div>
                  </HoverBox>
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div key="with" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
            <div className="text-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">Reusable building blocks</h3>
              <p className="text-sm text-gray-500 mt-1">Complex logic lives in intermediate models that many products reuse. Troubleshooting and discovery get easier.</p>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
              <div className="flex flex-col items-center gap-3 max-w-xl mx-auto">
                <HoverBox className="bg-white border-2 rounded-lg p-3 w-full max-w-xs shadow-sm hover:shadow-md transition-shadow" style={{ borderColor: LC.intermediate.border }}>
                  <div className="font-mono text-[11px] font-bold text-center" style={{ color: LC.intermediate.fill }}>int_enriched_orders</div>
                  <div className="mt-1 rounded px-2 py-1 text-[9px] font-medium text-center border" style={{ backgroundColor: LC.intermediate.light, color: LC.intermediate.fill, borderColor: LC.intermediate.border }}>
                    Shared logic, single source
                  </div>
                  {logicBlock}
                </HoverBox>
                <svg width="400" height="40" viewBox="0 0 400 40" className="shrink-0">
                  <defs>
                    <marker id="int-arrow" viewBox="0 0 10 10" refX="5" refY="9" markerWidth={5} markerHeight={5} orient="0">
                      <path d="M 0 0 L 5 10 L 10 0 z" fill="#c7d2fe" />
                    </marker>
                  </defs>
                  <path d="M 200 0 C 200 20, 100 20, 100 40" fill="none" stroke="#c7d2fe" strokeWidth={1.5} markerEnd="url(#int-arrow)" />
                  <path d="M 200 0 C 200 20, 300 20, 300 40" fill="none" stroke="#c7d2fe" strokeWidth={1.5} markerEnd="url(#int-arrow)" />
                </svg>
                <div className="grid grid-cols-2 gap-4 w-full max-w-xl">
                  {['fct_order_summary', 'fct_customer_orders'].map((name) => (
                    <HoverBox key={name} className="bg-white border rounded-lg p-3 text-center hover:shadow-md transition-shadow" style={{ borderColor: LC.mart.border }}>
                      <div className="font-mono text-[10px] font-semibold" style={{ color: '#b45309' }}>{name}</div>
                      <div className="mt-1.5 bg-gray-950 rounded px-2 py-1.5 font-mono text-[7px] leading-relaxed text-gray-400 whitespace-nowrap">
                        <div><span className="text-blue-400">SELECT</span> * <span className="text-blue-400">FROM</span> <span className="text-violet-300">{"{{ ref('int_enriched_orders') }}"}</span></div>
                        <div><span className="text-blue-400">WHERE</span> ...</div>
                      </div>
                      <div className="text-[9px] text-gray-400 mt-1.5">Thin, focused, easy to read.</div>
                    </HoverBox>
                  ))}
                </div>
                <div className="flex items-center justify-center gap-4 mt-1 text-[10px]">
                  <div className="flex items-center gap-1"><span className={`w-2 h-2 rounded-full ${LC.intermediate.dot}`} /> intermediate</div>
                  <div className="flex items-center gap-1"><span className={`w-2 h-2 rounded-full ${LC.mart.dot}`} /> mart</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   Topic 4: Marts
   ═══════════════════════════════════════════════════════════════════ */
export function MartsTopic() {
  const [withDbt, setWithDbt] = useState(false)

  return (
    <div>
      <DbtToggle withDbt={withDbt} setWithDbt={setWithDbt} />
      <AnimatePresence mode="wait">
        {!withDbt ? (
          <motion.div key="without" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
            <div className="text-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">Many versions of the truth</h3>
              <p className="text-sm text-gray-500 mt-1">Every team builds its own customer, order, or supplier. None of them agree.</p>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {[
                  { name: 'customers', team: 'analytics', color: '#6366f1' },
                  { name: 'dim_cust', team: 'finance', color: '#d97706' },
                  { name: 'customer_final', team: 'marketing', color: '#0891b2' },
                  { name: 'mkt_customers', team: 'growth', color: '#dc2626' },
                  { name: 'cust_master', team: 'ops', color: '#7c3aed' },
                ].map((t) => (
                  <HoverBox key={t.name} className="bg-white border border-gray-200 rounded-lg p-3 text-center hover:shadow-md hover:border-gray-300 transition-shadow">
                    <div className="font-mono text-[10px] font-semibold text-gray-700">{t.name}</div>
                    <div className="flex items-center justify-center gap-1 mt-1.5">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: t.color }} />
                      <span className="text-[9px] font-medium" style={{ color: t.color }}>{t.team}</span>
                    </div>
                    <div className="text-[8px] text-gray-400 mt-1">No lineage</div>
                  </HoverBox>
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div key="with" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
            <div className="text-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">One shared data product</h3>
              <p className="text-sm text-gray-500 mt-1">A single, consistent, shareable model with full lineage spelled out.</p>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
              <div className="overflow-x-auto">
                <MiniDAG
                  width={750} height={160}
                  nodes={[
                    { id: 'src', label: 'raw_customers', x: 16, y: 66, color: LC.source.fill, w: 110, h: NH },
                    { id: 'stg', label: 'stg_customers', x: 158, y: 66, color: LC.staging.fill, w: 110, h: NH },
                    { id: 'int', label: 'int_customer_orders', x: 300, y: 66, color: LC.intermediate.fill, w: 130, h: NH },
                    { id: 'dim', label: 'dim_customers', x: 462, y: 66, color: LC.mart.fill, highlight: true, w: 120, h: NH },
                    { id: 'c1', label: 'analytics_dash', x: 620, y: 16, color: '#6b7280', w: 105, h: NH },
                    { id: 'c2', label: 'finance_report', x: 620, y: 52, color: '#6b7280', w: 105, h: NH },
                    { id: 'c3', label: 'marketing_kpis', x: 620, y: 88, color: '#6b7280', w: 105, h: NH },
                    { id: 'c4', label: 'exec_summary', x: 620, y: 124, color: '#6b7280', w: 105, h: NH },
                  ]}
                  edges={[
                    ['src', 'stg'], ['stg', 'int'], ['int', 'dim'],
                    ['dim', 'c1'], ['dim', 'c2'], ['dim', 'c3'], ['dim', 'c4'],
                  ]}
                />
              </div>
              <div className="flex items-center justify-center gap-4 mt-2 text-[10px]">
                <div className="flex items-center gap-1"><span className={`w-2 h-2 rounded-full ${LC.source.dot}`} /> source</div>
                <div className="flex items-center gap-1"><span className={`w-2 h-2 rounded-full ${LC.staging.dot}`} /> staging</div>
                <div className="flex items-center gap-1"><span className={`w-2 h-2 rounded-full ${LC.intermediate.dot}`} /> intermediate</div>
                <div className="flex items-center gap-1"><span className={`w-2 h-2 rounded-full ${LC.mart.dot}`} /> mart</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   Main export
   ═══════════════════════════════════════════════════════════════════ */
export default function DataModeling() {
  const [activeTopic, setActiveTopic] = useState('sources')

  return (
    <div className="section-container py-8">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Data Modeling</h2>
        <div className="inline-flex bg-gray-100 rounded-xl p-1 mt-4">
          {topics.map(t => (
            <button
              key={t.key}
              onClick={() => setActiveTopic(t.key)}
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
      </div>

      <div className="mb-5 text-center">
        <AnimatePresence mode="wait">
          <motion.div key={activeTopic} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.2 }}>
            <p className="text-sm text-gray-500">{topicDescs[activeTopic]}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="bg-white border border-gray-200/60 rounded-2xl p-6 shadow-sm">
        <AnimatePresence mode="wait">
          {activeTopic === 'sources' && (
            <motion.div key="sources" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
              <SourcesTopic />
            </motion.div>
          )}
          {activeTopic === 'staging' && (
            <motion.div key="staging" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
              <StagingTopic />
            </motion.div>
          )}
          {activeTopic === 'intermediate' && (
            <motion.div key="intermediate" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
              <IntermediateTopic />
            </motion.div>
          )}
          {activeTopic === 'marts' && (
            <motion.div key="marts" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
              <MartsTopic />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
