import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

// ── Tab config ────────────────────────────────────────────────────
const TABS = [
  { id: 'logical', label: 'Logical',  prefix: null,             accent: { tab: 'bg-gray-700 text-white'  } },
  { id: 'dev',     label: 'Dev',      prefix: 'dev.dbt_user1',  accent: { tab: 'bg-blue-600 text-white'  } },
  { id: 'qa',      label: 'QA',       prefix: 'qa.pr_1234',     accent: { tab: 'bg-amber-500 text-white' } },
  { id: 'prod',    label: 'Prod',     prefix: 'prod.analytics', accent: { tab: 'bg-green-600 text-white' } },
]

// ── Model names ───────────────────────────────────────────────────
const SRC_NAMES  = ['raw_customers', 'raw_geoinfo', 'raw_orders', 'raw_product']
const STG_NAMES  = ['stg_customers', 'stg_geoinfo', 'stg_orders', 'stg_product']
const INT_NAMES  = ['int_enriched_customer', 'int_enriched_orders']
const MART_NAME  = 'fct_orders_with_customers_details'
const CONSUMER_NAMES = ['BI Dashboard 1', 'BI Dashboard 2', 'ML Model 1']

// ── Geometry helpers ──────────────────────────────────────────────
const NODE_H  = 36
const CHAR_W  = 7.2
const PAD_X   = 28
const MIN_W   = 140
const COL_GAP = 70

function nodeW(label) {
  return Math.max(MIN_W, Math.ceil(label.length * CHAR_W + PAD_X))
}
function maxW(labels) {
  return Math.max(...labels.map(nodeW))
}
function fqn(name, prefix) {
  if (prefix === null || name.startsWith('raw_')) return name
  return `${prefix}.${name}`
}

// ── Arrow ─────────────────────────────────────────────────────────
function Arrow({ x1, y1, x2, y2, straight = false, color = '#9CA3AF' }) {
  const mx = (x1 + x2) / 2
  const d = straight
    ? `M ${x1} ${y1} L ${x2} ${y2}`
    : `M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`
  return <path d={d} stroke={color} strokeWidth="1.5" fill="none" markerEnd="url(#dag-ah)" />
}

// ── Node ──────────────────────────────────────────────────────────
function Node({ x, y, w, label, variant }) {
  const styles = {
    green:    { bg: '#dcfce7', border: '#86efac', color: '#14532d' },
    blue:     { bg: '#dbeafe', border: '#93c5fd', color: '#1e3a5f' },
    consumer: { bg: '#fef3c7', border: '#fbbf24', color: '#78350f' },
  }
  const s = styles[variant] || styles.blue
  return (
    <foreignObject x={x} y={y - NODE_H / 2} width={w} height={NODE_H} style={{ overflow: 'visible' }}>
      <div
        xmlns="http://www.w3.org/1999/xhtml"
        style={{
          background: s.bg,
          border: `1.5px solid ${s.border}`,
          borderRadius: 8,
          height: NODE_H,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'monospace',
          fontSize: 11,
          fontWeight: 600,
          color: s.color,
          boxSizing: 'border-box',
          padding: '0 8px',
          whiteSpace: 'nowrap',
          cursor: 'default',
          transition: 'all 0.2s ease-out',
          transformOrigin: 'center center',
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = 'scale(1.06)'
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)'
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = 'scale(1)'
          e.currentTarget.style.boxShadow = 'none'
        }}
      >
        {label}
      </div>
    </foreignObject>
  )
}

// ── Banner (logical tab only) ─────────────────────────────────────
function Banner({ x, w, label, sub, variant }) {
  const bg     = variant === 'green' ? '#f0fdf4' : '#eff6ff'
  const border = variant === 'green' ? '#86efac' : '#93c5fd'
  const color  = variant === 'green' ? '#166534' : '#1e40af'
  return (
    <foreignObject x={x} y={10} width={w} height={48}>
      <div
        xmlns="http://www.w3.org/1999/xhtml"
        style={{
          background: bg, border: `1.5px solid ${border}`, borderRadius: 8,
          height: '100%', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          fontFamily: 'ui-sans-serif, system-ui, sans-serif',
          fontSize: 10, color, boxSizing: 'border-box',
          padding: '0 8px', textAlign: 'center',
        }}
      >
        <span style={{ fontStyle: 'italic' }}>{label} →</span>
        <span style={{ fontWeight: 700, fontStyle: 'italic' }}>{sub}</span>
      </div>
    </foreignObject>
  )
}

// ── Single pipeline group (reusable for dev double-stack) ─────────
function PipelineGroup({ prefix, yOffset, layout, totalW, showBanners = false, isProd = false }) {
  const { SRC_X, STG_X, INT_X, MART_X, CON_X,
          SRC_W, STG_W, INT_W, MART_W, CON_W } = layout

  const srcLabels = SRC_NAMES.map(n => fqn(n, prefix))
  const stgLabels = STG_NAMES.map(n => fqn(n, prefix))
  const intLabels = INT_NAMES.map(n => fqn(n, prefix))
  const martLabel = fqn(MART_NAME, prefix)

  const ROW_STEP = 55
  const TOP = yOffset
  const ROW_Y = [TOP, TOP + ROW_STEP, TOP + ROW_STEP * 2 + 10, TOP + ROW_STEP * 3 + 10]

  const INT_C_Y = (ROW_Y[0] + ROW_Y[1]) / 2
  const INT_O_Y = (ROW_Y[2] + ROW_Y[3]) / 2
  const MART_Y  = (INT_C_Y  + INT_O_Y)  / 2
  const CON_SPREAD = 65
  const CON_Y = [MART_Y - CON_SPREAD, MART_Y, MART_Y + CON_SPREAD]

  return (
    <g>
      {showBanners && (
        <>
          <Banner x={SRC_X} w={SRC_W} label="Read layer" sub="what dbt reads in order to build" variant="green" yOverride={yOffset - 58} />
          <Banner x={STG_X} w={totalW - STG_X - 10} label="Write layer" sub="what dbt builds in data platform" variant="blue" yOverride={yOffset - 58} />
        </>
      )}

      {ROW_Y.map((y, i) => <Arrow key={`src-stg-${i}`} x1={SRC_X + SRC_W} y1={y} x2={STG_X} y2={y} straight />)}

      <Arrow x1={STG_X + STG_W} y1={ROW_Y[0]} x2={INT_X} y2={INT_C_Y} />
      <Arrow x1={STG_X + STG_W} y1={ROW_Y[1]} x2={INT_X} y2={INT_C_Y} />
      <Arrow x1={STG_X + STG_W} y1={ROW_Y[2]} x2={INT_X} y2={INT_O_Y} />
      <Arrow x1={STG_X + STG_W} y1={ROW_Y[3]} x2={INT_X} y2={INT_O_Y} />

      <Arrow x1={INT_X + INT_W} y1={INT_C_Y} x2={MART_X} y2={MART_Y} />
      <Arrow x1={INT_X + INT_W} y1={INT_O_Y} x2={MART_X} y2={MART_Y} />

      {isProd && CON_Y.map((y) => (
        <Arrow key={`con-${y}`} x1={MART_X + MART_W} y1={MART_Y} x2={CON_X} y2={y} color="#f59e0b" />
      ))}

      {srcLabels.map((label, i) => <Node key={`src-${label}`} x={SRC_X} y={ROW_Y[i]} w={SRC_W} label={label} variant="green" />)}
      {stgLabels.map((label, i) => <Node key={`stg-${label}`} x={STG_X} y={ROW_Y[i]} w={STG_W} label={label} variant="blue" />)}

      <Node x={INT_X} y={INT_C_Y} w={INT_W} label={intLabels[0]} variant="blue" />
      <Node x={INT_X} y={INT_O_Y} w={INT_W} label={intLabels[1]} variant="blue" />
      <Node x={MART_X} y={MART_Y} w={MART_W} label={martLabel} variant="blue" />

      {isProd && CON_Y.map((y, i) => (
        <Node key={CONSUMER_NAMES[i]} x={CON_X} y={y} w={CON_W} label={CONSUMER_NAMES[i]} variant="consumer" />
      ))}
    </g>
  )
}

// ── DAG canvas ────────────────────────────────────────────────────
function DAGCanvas({ tab }) {
  const prefix    = tab.prefix
  const isLogical = tab.id === 'logical'
  const isProd    = tab.id === 'prod'
  const isDev     = tab.id === 'dev'

  // Compute layout widths using the widest labels across both dev users (or single prefix)
  const prefixes  = isDev ? ['dev.dbt_user1', 'dev.dbt_user2'] : [prefix]
  const allStgLabels  = prefixes.flatMap(p => STG_NAMES.map(n => fqn(n, p)))
  const allIntLabels  = prefixes.flatMap(p => INT_NAMES.map(n => fqn(n, p)))
  const allMartLabels = prefixes.map(p => fqn(MART_NAME, p))

  const SRC_W  = maxW(SRC_NAMES)
  const STG_W  = maxW(allStgLabels)
  const INT_W  = maxW(allIntLabels)
  const MART_W = maxW(allMartLabels)
  const CON_W  = maxW(CONSUMER_NAMES)

  const SRC_X  = 10
  const STG_X  = SRC_X  + SRC_W  + COL_GAP
  const INT_X  = STG_X  + STG_W  + COL_GAP
  const MART_X = INT_X  + INT_W  + COL_GAP
  const CON_X  = MART_X + MART_W + COL_GAP

  const layout = { SRC_X, STG_X, INT_X, MART_X, CON_X, SRC_W, STG_W, INT_W, MART_W, CON_W }
  const TOTAL_W = isProd ? CON_X + CON_W + 10 : MART_X + MART_W + 10

  // Height helpers — PIPE_BOT is how far below yOffset the pipeline's bottom node center sits
  const PIPE_BOT = 55 * 3 + 10  // = 175 (ROW_Y[3] relative to yOffset)

  const TOP_PAD  = isLogical ? 110 : 50

  // Dev double-stack geometry — leave 35px between title baseline and first node top
  const DEV_TITLE1_Y  = 22                            // title 1 text baseline
  const DEV_TOP1      = DEV_TITLE1_Y + 35 + NODE_H / 2  // first node center
  const SEP_Y         = DEV_TOP1 + PIPE_BOT + NODE_H / 2 + 28   // divider line
  const DEV_TITLE2_Y  = SEP_Y + 28                   // second title baseline
  const DEV_TOP2      = DEV_TITLE2_Y + 35 + NODE_H / 2  // second node center

  let TOTAL_H
  if (isDev) {
    TOTAL_H = DEV_TOP2 + PIPE_BOT + NODE_H / 2 + 30
  } else {
    TOTAL_H = TOP_PAD + PIPE_BOT + NODE_H / 2 + 30
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={tab.id}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.25 }}
        className="overflow-x-auto"
      >
        <svg
          viewBox={`0 0 ${TOTAL_W} ${TOTAL_H}`}
          width="100%"
          style={{ minWidth: Math.min(700, TOTAL_W), display: 'block' }}
        >
          <defs>
            <marker id="dag-ah" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill="#9CA3AF" />
            </marker>
          </defs>

          {/* ── Logical: banners + single pipeline ── */}
          {isLogical && (
            <>
              <Banner x={SRC_X} w={SRC_W} label="Read layer" sub="what dbt reads in order to build" variant="green" />
              <Banner x={STG_X} w={TOTAL_W - STG_X - 10} label="Write layer" sub="what dbt builds in data platform" variant="blue" />
              <PipelineGroup prefix={null} yOffset={TOP_PAD} layout={layout} totalW={TOTAL_W} />
            </>
          )}

          {/* ── Dev: two pipelines with titles + divider ── */}
          {isDev && (
            <>
              {/* User 1 title */}
              <text x={SRC_X} y={DEV_TITLE1_Y} fontFamily="ui-sans-serif, system-ui, sans-serif" fontSize={13} fontWeight="700" fill="#1d4ed8">
                User 1 Dev Environment
              </text>
              <PipelineGroup prefix="dev.dbt_user1" yOffset={DEV_TOP1} layout={layout} totalW={TOTAL_W} />

              {/* Divider */}
              <line x1={0} y1={SEP_Y} x2={TOTAL_W} y2={SEP_Y} stroke="#e5e7eb" strokeWidth="2" strokeDasharray="6 4" />

              {/* User 2 title */}
              <text x={SRC_X} y={DEV_TITLE2_Y} fontFamily="ui-sans-serif, system-ui, sans-serif" fontSize={13} fontWeight="700" fill="#7c3aed">
                User 2 Dev Environment
              </text>
              <PipelineGroup prefix="dev.dbt_user2" yOffset={DEV_TOP2} layout={layout} totalW={TOTAL_W} />
            </>
          )}

          {/* ── QA / Prod: single pipeline ── */}
          {!isLogical && !isDev && (
            <PipelineGroup
              prefix={prefix}
              yOffset={TOP_PAD}
              layout={layout}
              totalW={TOTAL_W}
              isProd={isProd}
            />
          )}
        </svg>
      </motion.div>
    </AnimatePresence>
  )
}

// ── File tree ─────────────────────────────────────────────────────
const FILE_TREE = [
  { indent: 0, icon: '📁', name: 'my-dbt-project/',   bold: true },
  { indent: 1, icon: '📁', name: 'models/' },
  { indent: 2, icon: '📁', name: '01_staging/' },
  { indent: 3, icon: '📄', name: 'stg_customers.sql' },
  { indent: 3, icon: '📄', name: 'stg_geoinfo.sql' },
  { indent: 3, icon: '📄', name: 'stg_orders.sql' },
  { indent: 3, icon: '📄', name: 'stg_product.sql' },
  { indent: 2, icon: '📁', name: '02_int/' },
  { indent: 3, icon: '📄', name: 'int_enriched_customer.sql', highlight: true },
  { indent: 3, icon: '📄', name: 'int_enriched_orders.sql' },
  { indent: 2, icon: '📁', name: '03_mart/' },
  { indent: 3, icon: '📄', name: 'fct_orders_with_customers_details.sql' },
  { indent: 1, icon: '📁', name: 'sources/' },
  { indent: 2, icon: '📄', name: 'sources.yml' },
  { indent: 1, icon: '📄', name: 'dbt_project.yml' },
]

// ── Code view ─────────────────────────────────────────────────────
function CodeLine({ parts }) {
  return (
    <div className="leading-6">
      {parts.map((p, i) => (
        <span key={i} style={{ color: p.color }}>{p.text}</span>
      ))}
    </div>
  )
}

const KW   = '#2563eb'  // blue — SQL keywords
const JJ   = '#f97316'  // orange — jinja delimiters
const FN   = '#9333ea'  // purple — ref / config
const STR  = '#16a34a'  // green — string values
const CMT  = '#6b7280'  // gray — comments
const FQN_C = '#0e7490' // cyan — compiled FQN
const TXT  = '#334155'  // default text

function buildCode(tab) {
  const p = tab.prefix  // null = logical

  if (!p) {
    // Uncompiled source — show ref() calls
    return [
      [{ text: '{{ ', color: JJ }, { text: 'config', color: FN }, { text: "(materialized='table') ", color: TXT }, { text: '}}', color: JJ }],
      [],
      [{ text: 'select', color: KW }],
      [{ text: '    c.customer_id,', color: TXT }],
      [{ text: '    c.customer_name,', color: TXT }],
      [{ text: '    c.email,', color: TXT }],
      [{ text: '    g.region,', color: TXT }],
      [{ text: '    g.country', color: TXT }],
      [{ text: 'from ', color: KW }, { text: '{{ ', color: JJ }, { text: 'ref', color: FN }, { text: "('", color: TXT }, { text: 'stg_customers', color: STR }, { text: "') ", color: TXT }, { text: '}}', color: JJ }, { text: ' c', color: TXT }],
      [{ text: 'left join ', color: KW }, { text: '{{ ', color: JJ }, { text: 'ref', color: FN }, { text: "('", color: TXT }, { text: 'stg_geoinfo', color: STR }, { text: "') ", color: TXT }, { text: '}}', color: JJ }, { text: ' g', color: TXT }],
      [{ text: '    on c.geo_id = g.geo_id', color: TXT }],
    ]
  }

  // Compiled — replace ref() with FQN
  const schema = p
  return [
    [{ text: `-- compiled for: ${schema}`, color: CMT }],
    [],
    [{ text: 'create table ', color: KW }, { text: `${schema}.int_enriched_customer`, color: FQN_C }, { text: ' as', color: KW }],
    [],
    [{ text: 'select', color: KW }],
    [{ text: '    c.customer_id,', color: TXT }],
    [{ text: '    c.customer_name,', color: TXT }],
    [{ text: '    c.email,', color: TXT }],
    [{ text: '    g.region,', color: TXT }],
    [{ text: '    g.country', color: TXT }],
    [{ text: 'from ', color: KW }, { text: `${schema}.stg_customers`, color: FQN_C }, { text: ' c', color: TXT }],
    [{ text: 'left join ', color: KW }, { text: `${schema}.stg_geoinfo`, color: FQN_C }, { text: ' g', color: TXT }],
    [{ text: '    on c.geo_id = g.geo_id', color: TXT }],
  ]
}

function CodeView({ tab }) {
  const lines = buildCode(tab)
  const isCompiled = !!tab.prefix

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={tab.id}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.2 }}
        className="flex gap-0 rounded-xl overflow-hidden border border-gray-200"
        style={{ minHeight: 420 }}
      >
        {/* Left: file tree */}
        <div className="bg-gray-50 border-r border-gray-200 p-5 min-w-[260px] font-mono text-xs text-gray-700">
          <p className="text-gray-400 uppercase tracking-widest text-[10px] mb-3 font-sans">Project files</p>
          {FILE_TREE.map((row, i) => (
            <div
              key={i}
              style={{ paddingLeft: row.indent * 14 }}
              className={`flex items-center gap-1 py-0.5 rounded ${
                row.highlight
                  ? 'bg-blue-100 text-blue-800 font-bold px-1 -mx-1'
                  : row.bold ? 'font-bold' : ''
              }`}
            >
              <span className="text-[11px]">{row.icon}</span>
              <span>{row.name}</span>
            </div>
          ))}
        </div>

        {/* Right: code */}
        <div className="flex-1 bg-white border-l border-gray-200 p-5 overflow-x-auto">
          {/* File header */}
          <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-200">
            <span className="text-gray-500 font-mono text-xs">📄 int_enriched_customer.sql</span>
            <span className={`ml-auto text-[10px] px-2 py-0.5 rounded font-semibold ${
              isCompiled
                ? 'bg-cyan-100 text-cyan-700'
                : 'bg-orange-100 text-orange-700'
            }`}>
              {isCompiled ? `compiled · ${tab.prefix}` : 'source (uncompiled)'}
            </span>
          </div>

          {/* Code lines */}
          <div className="font-mono text-sm">
            {lines.map((parts, i) =>
              parts.length === 0
                ? <div key={i} className="h-4" />
                : <CodeLine key={i} parts={parts} />
            )}
          </div>

          {/* Key insight callout */}
          {isCompiled && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-6 border-l-2 border-cyan-500 pl-3 text-xs text-gray-500"
            >
              <span className="text-cyan-700 font-semibold">One codebase.</span>
              {' '}The SQL didn't change, only the destination schema.
              {' '}<span className="text-cyan-700 font-mono">{`{{ ref() }}`}</span>
              {' '}compiled to <span className="text-cyan-700 font-mono">{tab.prefix}</span>.
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

// ── Main ──────────────────────────────────────────────────────────
export default function ProjectArchitectureVisual() {
  const [activeTab, setActiveTab] = useState(TABS[0])
  const [viewMode, setViewMode]   = useState('lineage')

  return (
    <div className="w-full space-y-8">
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">How environments interact with a dbt project</h3>
        <p className="text-gray-600 mb-6">
          dbt projects follow a standard architecture. Data flows from raw sources through layers of transformation, getting cleaner and more business-focused at each stage.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="bg-white border border-gray-200/60 rounded-xl p-6 shadow-sm"
      >
        {/* Controls row */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          {/* Mode toggle */}
          <div className="flex rounded-lg border border-gray-200 overflow-hidden text-sm font-semibold">
            {['lineage', 'code'].map((m) => (
              <button
                key={m}
                onClick={() => setViewMode(m)}
                className={`px-4 py-1.5 transition-all duration-200 ${
                  viewMode === m
                    ? 'bg-gray-900 text-white'
                    : 'bg-white text-gray-500 hover:bg-gray-50'
                }`}
              >
                {m === 'lineage' ? '⬡ Lineage' : '{ } Code'}
              </button>
            ))}
          </div>

          <div className="w-px h-5 bg-gray-200" />

          {/* Environment tabs */}
          <span className="text-sm text-gray-500 font-medium">Environment:</span>
          {TABS.map((tab) => {
            const isActive = tab.id === activeTab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 border ${
                  isActive
                    ? `${tab.accent.tab} border-transparent shadow-sm`
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            )
          })}
        </div>

        {viewMode === 'lineage'
          ? <DAGCanvas tab={activeTab} />
          : <CodeView tab={activeTab} />
        }
      </motion.div>
    </div>
  )
}
