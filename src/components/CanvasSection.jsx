import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const SEGMENTS = {
  input_orders: { label: 'Input: stg_orders', color: '#059669', bg: '#f0fdf4', border: '#86efac' },
  input_customers: { label: 'Input: stg_customers', color: '#059669', bg: '#f0fdf4', border: '#86efac' },
  join: { label: 'Join', color: '#6366f1', bg: '#eef2ff', border: '#a5b4fc' },
  filter: { label: 'Filter', color: '#d97706', bg: '#fffbeb', border: '#fde68a' },
  aggregate: { label: 'Aggregate', color: '#7c3aed', bg: '#f5f3ff', border: '#c4b5fd' },
  formula: { label: 'Formula', color: '#0891b2', bg: '#ecfeff', border: '#a5f3fc' },
  output: { label: 'Output', color: '#dc2626', bg: '#fef2f2', border: '#fecaca' },
}

/* ─── SQL Pane ─── */

function SqlLine({ segments, text, hl, setHl }) {
  const isHighlighted = segments.some(s => s === hl)
  return (
    <div
      onMouseEnter={() => segments.length > 0 && setHl(segments[0])}
      onMouseLeave={() => setHl(null)}
      className={`px-4 -mx-4 transition-all duration-150 cursor-default ${
        isHighlighted ? 'bg-blue-50 border-l-2 border-blue-500' : 'border-l-2 border-transparent'
      }`}
    >
      {text}
    </div>
  )
}

function SqlPane({ hl, setHl }) {
  const KW = 'text-blue-600'
  const FN = 'text-purple-600'
  const STR = 'text-emerald-600'
  const CMT = 'text-gray-400'
  const TXT = 'text-gray-800'
  const JJ = 'text-orange-600'

  return (
    <motion.div
      whileHover={{ y: -2, boxShadow: '0 6px 20px rgba(0,0,0,0.06)' }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className="bg-white border border-gray-200/60 rounded-2xl shadow-sm overflow-hidden"
    >
      <div className="px-4 py-2.5 border-b border-gray-100 flex items-center justify-between bg-gray-50">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">dbt Studio</span>
          <span className="text-xs font-mono font-semibold text-gray-700 bg-white px-2 py-0.5 rounded border border-gray-200">fct_customer_orders.sql</span>
        </div>
        <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-semibold">SQL</span>
      </div>

      <div className="p-4 font-mono text-xs leading-relaxed">
        <SqlLine segments={[]} hl={hl} setHl={setHl} text={<><span className={CMT}>-- fct_customer_orders.sql</span></>} />
        <SqlLine segments={['output']} hl={hl} setHl={setHl} text={<><span className={JJ}>{'{{ '}</span><span className={FN}>config</span>(<span className={FN}>materialized</span>=<span className={STR}>'table'</span>)<span className={JJ}>{' }}'}</span></>} />
        <div className="h-2" />
        <SqlLine segments={['aggregate', 'formula']} hl={hl} setHl={setHl} text={<><span className={KW}>select</span></>} />
        <SqlLine segments={['aggregate']} hl={hl} setHl={setHl} text={<><span className={TXT}>    o.customer_id,</span></>} />
        <SqlLine segments={['aggregate']} hl={hl} setHl={setHl} text={<><span className={KW}>    sum</span><span className={TXT}>(o.amount) </span><span className={KW}>as</span><span className={TXT}> total_spend,</span></>} />
        <SqlLine segments={['aggregate']} hl={hl} setHl={setHl} text={<><span className={KW}>    count</span><span className={TXT}>(o.order_id) </span><span className={KW}>as</span><span className={TXT}> order_count,</span></>} />
        <SqlLine segments={['formula']} hl={hl} setHl={setHl} text={<><span className={KW}>    sum</span><span className={TXT}>(o.amount) * </span><span className={STR}>1.2</span><span className={TXT}> </span><span className={KW}>as</span><span className={TXT}> lifetime_value</span></>} />
        <div className="h-2" />
        <SqlLine segments={['input_orders']} hl={hl} setHl={setHl} text={<><span className={KW}>from</span> <span className={JJ}>{'{{ '}</span><span className={FN}>ref</span>(<span className={STR}>'stg_orders'</span>)<span className={JJ}>{' }}'}</span><span className={TXT}> o</span></>} />
        <SqlLine segments={['join', 'input_customers']} hl={hl} setHl={setHl} text={<><span className={KW}>left join</span> <span className={JJ}>{'{{ '}</span><span className={FN}>ref</span>(<span className={STR}>'stg_customers'</span>)<span className={JJ}>{' }}'}</span><span className={TXT}> c</span></>} />
        <SqlLine segments={['join']} hl={hl} setHl={setHl} text={<><span className={TXT}>    </span><span className={KW}>on</span><span className={TXT}> o.customer_id = c.customer_id</span></>} />
        <div className="h-2" />
        <SqlLine segments={['filter']} hl={hl} setHl={setHl} text={<><span className={KW}>where</span><span className={TXT}> o.status = </span><span className={STR}>'completed'</span></>} />
        <div className="h-2" />
        <SqlLine segments={['aggregate']} hl={hl} setHl={setHl} text={<><span className={KW}>group by</span><span className={TXT}> o.customer_id</span></>} />
      </div>
    </motion.div>
  )
}

/* ─── Canvas Pane (SVG node graph) ─── */

const OPS = [
  { id: 'input_orders',    label: 'stg_orders',           type: 'Input',     config: 'Model',                x: 20,  y: 30 },
  { id: 'input_customers', label: 'stg_customers',        type: 'Input',     config: 'Model',                x: 20,  y: 130 },
  { id: 'join',            label: 'Join',                  type: 'Transform', config: 'on customer_id',       x: 200, y: 80 },
  { id: 'filter',          label: 'Filter',                type: 'Transform', config: "status = 'completed'", x: 370, y: 80 },
  { id: 'aggregate',       label: 'Aggregate',             type: 'Transform', config: 'sum(amount), count()', x: 530, y: 80 },
  { id: 'formula',         label: 'Formula',               type: 'Transform', config: 'lifetime_value',       x: 690, y: 80 },
  { id: 'output',          label: 'fct_customer_orders',   type: 'Output',    config: 'Table',                x: 860, y: 80 },
]

const EDGES = [
  { from: 'input_orders', to: 'join', port: 'L' },
  { from: 'input_customers', to: 'join', port: 'R' },
  { from: 'join', to: 'filter' },
  { from: 'filter', to: 'aggregate' },
  { from: 'aggregate', to: 'formula' },
  { from: 'formula', to: 'output' },
]

const OP_W = 140
const OP_H = 56

function CanvasPane({ hl, setHl }) {
  return (
    <motion.div
      whileHover={{ y: -2, boxShadow: '0 6px 20px rgba(0,0,0,0.06)' }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className="bg-white border border-gray-200/60 rounded-2xl shadow-sm overflow-hidden"
    >
      <div className="px-4 py-2.5 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
        <div className="flex items-center gap-4 text-[10px] font-semibold text-gray-500">
          <span className="text-gray-400">dbt Canvas</span>
          <div className="flex gap-2">
            <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded">Input</span>
            <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded">Transform</span>
            <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded">Output</span>
          </div>
        </div>
      </div>

      <div className="p-3 overflow-x-auto" style={{ background: 'radial-gradient(circle, #e5e7eb 0.8px, transparent 0.8px)', backgroundSize: '16px 16px' }}>
        <svg width="1020" height="210" viewBox="0 0 1020 210" className="w-full h-auto" style={{ minWidth: 700 }}>
          <defs>
            <marker id="canvas-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth={5} markerHeight={5} orient="auto-start-auto">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#9ca3af" />
            </marker>
            <marker id="canvas-arrow-hl" viewBox="0 0 10 10" refX="8" refY="5" markerWidth={5} markerHeight={5} orient="auto-start-auto">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#3b82f6" />
            </marker>
          </defs>

          {EDGES.map(e => {
            const from = OPS.find(o => o.id === e.from)
            const to = OPS.find(o => o.id === e.to)
            const x1 = from.x + OP_W
            const y1 = from.y + OP_H / 2
            const x2 = to.x
            const y2 = to.y + OP_H / 2
            const mx = (x1 + x2) / 2
            const isHl = hl === e.from || hl === e.to
            return (
              <g key={`${e.from}-${e.to}`}>
                <path
                  d={`M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`}
                  fill="none"
                  stroke={isHl ? '#3b82f6' : '#d1d5db'}
                  strokeWidth={isHl ? 2 : 1.5}
                  markerEnd={isHl ? 'url(#canvas-arrow-hl)' : 'url(#canvas-arrow)'}
                  style={{ transition: 'stroke 0.2s, stroke-width 0.2s' }}
                />
                {e.port && (
                  <text x={x2 - 10} y={y2 + (e.port === 'L' ? -6 : 6)} fontSize={8} fontWeight={700}
                    fill={isHl ? '#3b82f6' : '#9ca3af'} textAnchor="middle">{e.port}</text>
                )}
              </g>
            )
          })}

          {OPS.map(op => {
            const seg = SEGMENTS[op.id]
            const isHl = hl === op.id
            const fill = isHl ? seg.bg : '#ffffff'
            const stroke = isHl ? seg.color : '#d1d5db'
            const strokeW = isHl ? 2.5 : 1.5
            return (
              <g key={op.id} onMouseEnter={() => setHl(op.id)} onMouseLeave={() => setHl(null)} style={{ cursor: 'pointer' }}>
                {isHl && <rect x={op.x + 2} y={op.y + 3} width={OP_W} height={OP_H} rx={10} fill="rgba(0,0,0,0.06)" />}
                <rect x={op.x} y={op.y} width={OP_W} height={OP_H} rx={10}
                  fill={fill} stroke={stroke} strokeWidth={strokeW} style={{ transition: 'fill 0.2s, stroke 0.2s' }} />
                <rect x={op.x + 4} y={op.y + 4} width={op.type.length * 5.5 + 10} height={14} rx={4}
                  fill={op.type === 'Input' ? '#dcfce7' : op.type === 'Output' ? '#fecaca' : '#e0e7ff'} />
                <text x={op.x + 4 + (op.type.length * 5.5 + 10) / 2} y={op.y + 14} textAnchor="middle" fontSize={8} fontWeight={600}
                  fill={op.type === 'Input' ? '#166534' : op.type === 'Output' ? '#991b1b' : '#3730a3'}>{op.type}</text>
                <text x={op.x + OP_W / 2} y={op.y + 32} textAnchor="middle" fontSize={10} fontWeight={700}
                  fill={isHl ? seg.color : '#374151'} fontFamily="ui-monospace, monospace">{op.label}</text>
                <text x={op.x + OP_W / 2} y={op.y + 46} textAnchor="middle" fontSize={8} fill="#9ca3af"
                  fontFamily="ui-sans-serif, system-ui, sans-serif">{op.config}</text>
              </g>
            )
          })}
        </svg>
      </div>
    </motion.div>
  )
}

/* ─── View toggle options ─── */
const VIEWS = [
  { key: 'both', label: 'Both' },
  { key: 'sql', label: 'SQL' },
  { key: 'canvas', label: 'Canvas' },
]

/* ─── Main export ─── */

export default function CanvasSection() {
  const [hl, setHl] = useState(null)
  const [view, setView] = useState('both')

  return (
    <div>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <p className="text-sm text-gray-500">
          dbt Canvas is a read and write surface: build a model visually or read it as SQL. Same model, two views.
        </p>
        <div className="inline-flex bg-gray-100 rounded-xl p-1 shrink-0" role="radiogroup" aria-label="View mode">
          {VIEWS.map(v => (
            <button
              key={v.key}
              role="radio"
              aria-checked={view === v.key}
              onClick={() => setView(v.key)}
              className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                view === v.key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>
      </div>

      {/* Legend chips */}
      <div className="flex flex-wrap gap-3 mb-4 text-[10px]">
        {Object.entries(SEGMENTS).map(([key, seg]) => (
          <button
            key={key}
            onMouseEnter={() => setHl(key)}
            onMouseLeave={() => setHl(null)}
            className={`px-2.5 py-1 rounded-lg border font-medium transition-all duration-150 ${
              hl === key ? 'ring-2 ring-blue-400 shadow-sm' : ''
            }`}
            style={{ borderColor: seg.border, color: seg.color, backgroundColor: hl === key ? seg.bg : 'white' }}
          >
            {seg.label}
          </button>
        ))}
      </div>

      {/* Panels */}
      <AnimatePresence mode="wait">
        {view === 'both' && (
          <motion.div key="both" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
            className="grid grid-cols-1 xl:grid-cols-[1fr_1.4fr] gap-5">
            <SqlPane hl={hl} setHl={setHl} />
            <CanvasPane hl={hl} setHl={setHl} />
          </motion.div>
        )}
        {view === 'sql' && (
          <motion.div key="sql" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            <SqlPane hl={hl} setHl={setHl} />
          </motion.div>
        )}
        {view === 'canvas' && (
          <motion.div key="canvas" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            <CanvasPane hl={hl} setHl={setHl} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
