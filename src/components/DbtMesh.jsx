import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const views = [
  { key: 'discovery', label: 'Model Discovery' },
  { key: 'lineage', label: 'Cross Project Lineage' },
  { key: 'breaking', label: 'Breaking Change Protection' },
]

const viewDescs = {
  discovery: 'How teams find and trust models from other projects.',
  lineage: 'Understand a model in context without drowning in the full graph.',
  breaking: 'Upstream changes no longer silently break downstream consumers.',
}

/* ─── Shared toggle ─── */
function MeshToggle({ withMesh, setWithMesh }) {
  return (
    <div className="flex justify-center mb-5">
      <div className="inline-flex bg-gray-100 rounded-xl p-1">
        <button
          onClick={() => setWithMesh(false)}
          className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            !withMesh ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Without Mesh
        </button>
        <button
          onClick={() => setWithMesh(true)}
          className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            withMesh ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          With Mesh
        </button>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   View 1: Model Discovery
   ═══════════════════════════════════════════════════════════════════ */

const allModels = [
  { name: 'stg_orders', proj: 0 }, { name: 'stg_customers', proj: 1 }, { name: 'stg_payments', proj: 2 }, { name: 'stg_sessions', proj: 1 },
  { name: 'stg_events', proj: 3 }, { name: 'stg_refunds', proj: 2 }, { name: 'stg_shipments', proj: 3 }, { name: 'stg_invoices', proj: 2 },
  { name: 'stg_employees', proj: 3 }, { name: 'stg_campaigns', proj: 1 }, { name: 'stg_suppliers', proj: 4 }, { name: 'stg_warehouses', proj: 3 }, { name: 'stg_regions', proj: 0 },
  { name: 'stg_channels', proj: 1 }, { name: 'stg_subscriptions', proj: 2 }, { name: 'stg_page_views', proj: 1 }, { name: 'stg_tickets', proj: 3 },
  { name: 'int_order_items', proj: 0 }, { name: 'int_customer_ord', proj: 0 }, { name: 'int_payment_agg', proj: 2 }, { name: 'int_session_evt', proj: 1 },
  { name: 'int_revenue_daily', proj: 2 }, { name: 'int_user_activity', proj: 1 }, { name: 'int_refund_sum', proj: 2 },
  { name: 'int_campaign_perf', proj: 1 }, { name: 'int_supply_chain', proj: 4 },
  { name: 'fct_orders', proj: 0 }, { name: 'fct_revenue', proj: 2 }, { name: 'fct_sessions', proj: 1 }, { name: 'fct_payments', proj: 2 }, { name: 'fct_shipments', proj: 3 },
  { name: 'fct_subscriptions', proj: 2 }, { name: 'fct_invoices', proj: 2 }, { name: 'fct_refunds', proj: 2 }, { name: 'fct_churn', proj: 0 },
  { name: 'dim_customers', proj: 0 }, { name: 'dim_dates', proj: 4 }, { name: 'dim_regions', proj: 3 }, { name: 'dim_channels', proj: 1 },
  { name: 'dim_campaigns', proj: 1 }, { name: 'dim_suppliers', proj: 4 }, { name: 'dim_warehouses', proj: 3 }, { name: 'dim_employees', proj: 3 },
  { name: 'rpt_daily_revenue', proj: 0 }, { name: 'rpt_weekly_orders', proj: 0 }, { name: 'rpt_customer_ltv', proj: 0 },
  { name: 'rpt_channel_mix', proj: 1 }, { name: 'rpt_region_summary', proj: 3 }, { name: 'rpt_cohort_ret', proj: 1 }, { name: 'rpt_inventory', proj: 3 },
  { name: 'rpt_mrr', proj: 2 }, { name: 'rpt_arr_growth', proj: 2 }, { name: 'rpt_funnel', proj: 1 }, { name: 'rpt_exec_summary', proj: 0 },
  { name: 'exp_finance_dash', proj: 2 }, { name: 'exp_ops_monitor', proj: 3 }, { name: 'exp_marketing_bi', proj: 1 },
  { name: 'exp_ceo_report', proj: 0 }, { name: 'exp_board_deck', proj: 4 }, { name: 'snap_customers', proj: 0 },
  { name: 'stg_contracts', proj: 2 }, { name: 'stg_leads', proj: 1 }, { name: 'stg_opportunities', proj: 1 }, { name: 'stg_accounts', proj: 2 }, { name: 'stg_territories', proj: 3 },
  { name: 'int_lead_scoring', proj: 1 }, { name: 'int_deal_pipeline', proj: 1 }, { name: 'int_quota_attain', proj: 2 }, { name: 'int_territory_map', proj: 3 }, { name: 'int_forecast_agg', proj: 2 },
  { name: 'fct_pipeline', proj: 1 }, { name: 'fct_bookings', proj: 2 }, { name: 'fct_renewals', proj: 2 }, { name: 'fct_support_tickets', proj: 3 },
  { name: 'dim_accounts', proj: 2 }, { name: 'dim_territories', proj: 3 }, { name: 'dim_segments', proj: 0 }, { name: 'dim_currencies', proj: 4 },
  { name: 'rpt_pipeline_vel', proj: 1 }, { name: 'rpt_win_rate', proj: 1 }, { name: 'rpt_nrr', proj: 2 }, { name: 'rpt_support_sla', proj: 3 },
  { name: 'exp_sales_dash', proj: 1 }, { name: 'exp_cs_health', proj: 3 }, { name: 'exp_rev_forecast', proj: 2 }, { name: 'snap_accounts', proj: 2 }, { name: 'snap_pipeline', proj: 1 },
]

const projectColors = ['#6366f1', '#0891b2', '#059669', '#dc2626', '#7c3aed']
const projectNames = ['analytics', 'marketing', 'finance', 'sales', 'platform']

const certifiedModels = [
  { name: 'fct_orders', team: 'sales', project: 'sales', desc: 'Completed orders with revenue' },
  { name: 'fct_revenue', team: 'finance', project: 'finance', desc: 'Recognized revenue by period' },
  { name: 'dim_customers', team: 'platform', project: 'platform', desc: 'Customer master with segments' },
  { name: 'fct_sessions', team: 'marketing', project: 'marketing', desc: 'Web sessions with attribution' },
  { name: 'dim_regions', team: 'platform', project: 'platform', desc: 'Geographic hierarchy' },
  { name: 'dim_channels', team: 'platform', project: 'platform', desc: 'Channel taxonomy' },
  { name: 'fct_payments', team: 'finance', project: 'finance', desc: 'Payment transactions' },
  { name: 'dim_dates', team: 'platform', project: 'platform', desc: 'Date spine and fiscal calendar' },
  { name: 'rpt_customer_ltv', team: 'analytics', project: 'datascience', desc: 'Lifetime value by cohort' },
]

const teamColorMap = {
  analytics: '#6366f1',
  marketing: '#0891b2',
  finance: '#059669',
  sales: '#dc2626',
  platform: '#7c3aed',
}

/* ─── Project lineage DAG for "With Mesh" tab ─── */
function ProjectLineageDAG({ highlightedProject, onHoverProject }) {
  const PNW = 250, PNH = 68
  const col0 = 20, col1 = 350, col2 = 680
  const vGap = 16, topPad = 16
  const midY0 = topPad
  const midY1 = midY0 + PNH + vGap
  const midY2 = midY1 + PNH + vGap
  const midCenter = midY0 + (midY2 + PNH - midY0) / 2
  const sideY = midCenter - PNH / 2
  const svgW = col2 + PNW + 20
  const svgH = midY2 + PNH + topPad

  const projects = [
    { id: 'platform', label: 'Platform | Core Foundations', models: 4, x: col0, y: sideY, color: '#7c3aed' },
    { id: 'finance', label: 'Finance | Revenue', models: 2, x: col1, y: midY0, color: '#059669' },
    { id: 'marketing', label: 'Marketing | Web & Channels', models: 1, x: col1, y: midY1, color: '#0891b2' },
    { id: 'sales', label: 'Sales | Orders', models: 1, x: col1, y: midY2, color: '#d97706' },
    { id: 'datascience', label: 'Data Science | Advanced Analytics', models: 1, x: col2, y: sideY, color: '#0ea5e9' },
  ]

  const edges = [
    ['platform', 'finance'],
    ['platform', 'marketing'],
    ['platform', 'sales'],
    ['marketing', 'datascience'],
    ['sales', 'datascience'],
  ]

  const projectMap = {}
  projects.forEach(p => { projectMap[p.id] = p })

  return (
    <div className="overflow-x-auto">
      <svg width={svgW} height={svgH} viewBox={`0 0 ${svgW} ${svgH}`} className="w-full h-auto">
        <defs>
          <pattern id="proj-grid" width="16" height="16" patternUnits="userSpaceOnUse">
            <circle cx="8" cy="8" r="0.7" fill="#e5e7eb" />
          </pattern>
          <marker id="proj-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth={5} markerHeight={5} orient="auto-start-auto">
            <path d="M 0 1 L 8 5 L 0 9 z" fill="#cbd5e1" />
          </marker>
        </defs>

        {/* Dotted grid background */}
        <rect width={svgW} height={svgH} fill="url(#proj-grid)" rx={8} />

        {/* Edges (cubic bezier) */}
        {edges.map(([fromId, toId], i) => {
          const from = projectMap[fromId]
          const to = projectMap[toId]
          const x1 = from.x + PNW
          const y1 = from.y + PNH / 2
          const x2 = to.x
          const y2 = to.y + PNH / 2
          const dx = (x2 - x1) * 0.45
          const d = `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`
          const edgeActive = !highlightedProject || fromId === highlightedProject || toId === highlightedProject
          return <path key={i} d={d} fill="none" stroke="#d1d5db" strokeWidth={1.5} markerEnd="url(#proj-arrow)"
            style={{ transition: 'opacity 0.2s' }} opacity={edgeActive ? 1 : 0.25} />
        })}

        {/* Project nodes */}
        {projects.map(p => {
          const badgeW = 34, badgeH = 20, badgeX = p.x + 10, badgeY = p.y + 12
          const dividerY = p.y + 44
          const isHL = highlightedProject === p.id
          return (
            <g key={p.id} style={{ transition: 'opacity 0.2s', cursor: 'pointer' }} opacity={highlightedProject && !isHL ? 0.4 : 1}
              onMouseEnter={() => onHoverProject && onHoverProject(p.id)}
              onMouseLeave={() => onHoverProject && onHoverProject(null)}>
              {/* Highlight glow */}
              {isHL && (
                <rect x={p.x - 3} y={p.y - 3} width={PNW + 6} height={PNH + 6} rx={10}
                  fill="none" stroke={p.color} strokeWidth={2} opacity={0.5} />
              )}
              {/* Shadow */}
              <rect x={p.x + 1} y={p.y + 2} width={PNW} height={PNH} rx={8} fill="#00000008" />
              {/* Card */}
              <rect x={p.x} y={p.y} width={PNW} height={PNH} rx={8} fill="white"
                stroke={isHL ? p.color : '#e5e7eb'} strokeWidth={isHL ? 1.5 : 1} />
              {/* PRJ badge */}
              <rect x={badgeX} y={badgeY} width={badgeW} height={badgeH} rx={4} fill={p.color + '15'} stroke={p.color + '40'} strokeWidth={0.5} />
              <text x={badgeX + badgeW / 2} y={badgeY + 14} textAnchor="middle" fontSize={8} fontWeight={700} fill={p.color} fontFamily="ui-monospace, monospace">PRJ</text>
              {/* Title */}
              <text x={p.x + 52} y={p.y + 26} fontSize={10.5} fontWeight={600} fill="#374151" fontFamily="system-ui, sans-serif">{p.label}</text>
              {/* Divider */}
              <line x1={p.x} y1={dividerY} x2={p.x + PNW} y2={dividerY} stroke="#f3f4f6" strokeWidth={1} />
              {/* Public Models count */}
              <text x={p.x + 10} y={p.y + 59} fontSize={10} fontWeight={500} fill="#9ca3af" fontFamily="system-ui, sans-serif">
                {p.models} Public Model{p.models !== 1 ? 's' : ''}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}

function ModelDiscovery() {
  const [withMesh, setWithMesh] = useState(false)
  const [activeFilter, setActiveFilter] = useState(null)
  const [hoveredCard, setHoveredCard] = useState(null)
  const [hoveredProject, setHoveredProject] = useState(null)
  const highlightedProject = hoveredCard
    ? (certifiedModels.find(m => m.name === hoveredCard) || {}).project
    : hoveredProject

  return (
    <div>
      <MeshToggle withMesh={withMesh} setWithMesh={(v) => { setWithMesh(v); setActiveFilter(null) }} />
      <AnimatePresence mode="wait">
        {!withMesh ? (
          <motion.div
            key="without"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">Every model, everywhere</h3>
              <p className="text-sm text-gray-500 mt-1">Sift through hundreds of models from every project to find one you can trust.</p>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Hundreds/Thousands of models across multiple domains</span>
                <div className="flex gap-1.5">
                  {projectNames.map((p, i) => (
                    <button
                      key={p}
                      onClick={() => setActiveFilter(activeFilter === i ? null : i)}
                      className="text-[10px] font-medium px-1.5 py-0.5 rounded transition-all duration-200 cursor-pointer"
                      style={{
                        backgroundColor: activeFilter === i ? projectColors[i] + '30' : projectColors[i] + '18',
                        color: projectColors[i],
                        outline: activeFilter === i ? `2px solid ${projectColors[i]}` : 'none',
                        outlineOffset: '1px',
                      }}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-1.5">
                {allModels.map((m) => {
                  const dimmed = activeFilter !== null && m.proj !== activeFilter
                  return (
                    <div
                      key={m.name}
                      className="text-[8px] font-mono px-1.5 py-2 rounded-md border text-center truncate transition-all duration-200"
                      style={{
                        borderColor: dimmed ? '#e5e7eb' : projectColors[m.proj] + '40',
                        backgroundColor: dimmed ? '#f9fafb' : projectColors[m.proj] + '08',
                        color: dimmed ? '#d1d5db' : '#6b7280',
                        opacity: dimmed ? 0.5 : 1,
                      }}
                      title={m.name}
                    >
                      {m.name}
                    </div>
                  )
                })}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="with"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">Public, certified models</h3>
              <p className="text-sm text-gray-500 mt-1">Build on a curated set of public models that teams own and certify for cross-team use.</p>
            </div>
            {/* Top half: project lineage DAG */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Project lineage</span>
              </div>
              <ProjectLineageDAG highlightedProject={highlightedProject} onHoverProject={setHoveredProject} />
            </div>
            {/* Bottom half: public model cards */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">9 certified models, maintained by different teams</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                {certifiedModels.map((m) => {
                  const color = teamColorMap[m.team] || '#6b7280'
                  const isHovered = hoveredCard === m.name
                  const isDimmed = hoveredProject && m.project !== hoveredProject && !isHovered
                  return (
                    <motion.div
                      key={m.name}
                      onMouseEnter={() => setHoveredCard(m.name)}
                      onMouseLeave={() => setHoveredCard(null)}
                      animate={{ y: isHovered ? -3 : 0, opacity: isDimmed ? 0.4 : 1 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                      className="bg-white border border-gray-200 rounded-lg p-3 flex flex-col gap-1.5 cursor-default"
                      style={{
                        borderColor: isHovered ? color + '80' : undefined,
                        boxShadow: isHovered ? `0 4px 12px ${color}15` : undefined,
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-semibold text-gray-800">{m.name}</span>
                        <div className="flex items-center gap-1">
                          <span className="text-[9px] font-medium px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">public</span>
                          <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-bold" title="Certified">&#10003;</span>
                        </div>
                      </div>
                      <p className="text-[11px] text-gray-500">{m.desc}</p>
                      <div className="flex items-center gap-1 mt-auto">
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
                        <span className="text-[10px] font-medium" style={{ color }}>{m.team}</span>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   View 2: Cross Project Lineage
   ═══════════════════════════════════════════════════════════════════ */

/* --- DAG layout: strict grid, computed per state --- */
const NW = 115    // small node width
const NWL = 140   // highlight node width
const NH = 24     // small node height
const NHL = 30    // highlight node height
const CGAP = 28   // column gap
const RGAP = 10   // row gap
const ZPAD = 16   // zone internal padding
const ZLBL = 18   // zone label height reserve (top-left)

// Column x positions for a given array of column widths
function mkCols(widths) {
  const xs = [ZPAD]
  for (let i = 1; i < widths.length; i++) xs.push(xs[i - 1] + widths[i - 1] + CGAP)
  return xs
}
// Row y given zone top and row index
function ry(row, zTop) { return zTop + ZPAD + ZLBL + row * (NH + RGAP) }

// Canonical model names (used identically in every state)
const N = {
  fct: 'fct_order_items', srcFx: 'src_exchange_rates', stgFx: 'stg_exchange_rates',
  intRev: 'int_revenue_converted', rptArr: 'rpt_arr_growth',
}

/* ════════════════ WITHOUT MESH: one monolithic project ════════════════ */
// One outer project container. Two internal swimlanes (analytics team / finance team).
// Columns: src, stg, int, fct, rpt, exp
const WC = mkCols([NW, NW, NW, NWL, NW, NW])
const WM_TOP = 0
// Analytics team swimlane: rows 0-7
const WA_LANE_Y = WM_TOP + ZPAD + ZLBL  // first node y
const WA_ROWS = 8
// Finance team swimlane: starts after analytics rows + gap
const WF_LANE_TOP = WA_LANE_Y + WA_ROWS * (NH + RGAP) + 8
const WF_LANE_LABEL_Y = WF_LANE_TOP
const WF_NODE_Y = WF_LANE_TOP + ZLBL

const wmTotalH = WF_NODE_Y + NH + ZPAD + 4
const wmTotalW = WC[5] + NW + ZPAD

const withoutMeshNodes = [
  // Analytics team sources (col 0)
  { id: 's1', label: 'src_orders', x: WC[0], y: ry(0, WM_TOP), color: '#9ca3af', small: true },
  { id: 's2', label: 'src_customers', x: WC[0], y: ry(1, WM_TOP), color: '#9ca3af', small: true },
  { id: 's3', label: 'src_payments', x: WC[0], y: ry(2, WM_TOP), color: '#9ca3af', small: true },
  { id: 's4', label: 'src_products', x: WC[0], y: ry(3, WM_TOP), color: '#9ca3af', small: true },
  { id: 's5', label: 'src_sessions', x: WC[0], y: ry(4, WM_TOP), color: '#9ca3af', small: true },
  { id: 's6', label: 'src_events', x: WC[0], y: ry(5, WM_TOP), color: '#9ca3af', small: true },
  { id: 's7', label: 'src_refunds', x: WC[0], y: ry(6, WM_TOP), color: '#9ca3af', small: true },
  // Analytics staging (col 1)
  { id: 'st1', label: 'stg_orders', x: WC[1], y: ry(0, WM_TOP), color: '#6366f1', small: true },
  { id: 'st2', label: 'stg_customers', x: WC[1], y: ry(1, WM_TOP), color: '#6366f1', small: true },
  { id: 'st3', label: 'stg_payments', x: WC[1], y: ry(2, WM_TOP), color: '#6366f1', small: true },
  { id: 'st4', label: 'stg_products', x: WC[1], y: ry(3, WM_TOP), color: '#6366f1', small: true },
  { id: 'st5', label: 'stg_sessions', x: WC[1], y: ry(4, WM_TOP), color: '#6366f1', small: true },
  { id: 'st6', label: 'stg_events', x: WC[1], y: ry(5, WM_TOP), color: '#6366f1', small: true },
  { id: 'st7', label: 'stg_refunds', x: WC[1], y: ry(6, WM_TOP), color: '#6366f1', small: true },
  // Analytics intermediate (col 2)
  { id: 'i1', label: 'int_order_items', x: WC[2], y: ry(0, WM_TOP), color: '#0891b2', small: true },
  { id: 'i2', label: 'int_cust_orders', x: WC[2], y: ry(1, WM_TOP), color: '#0891b2', small: true },
  { id: 'i3', label: 'int_pay_agg', x: WC[2], y: ry(2, WM_TOP), color: '#0891b2', small: true },
  { id: 'i4', label: 'int_product_sales', x: WC[2], y: ry(3, WM_TOP), color: '#0891b2', small: true },
  { id: 'i5', label: 'int_session_evt', x: WC[2], y: ry(4, WM_TOP), color: '#0891b2', small: true },
  { id: 'i6', label: 'int_refund_sum', x: WC[2], y: ry(5, WM_TOP), color: '#0891b2', small: true },
  // Analytics facts (col 3): payments row 0, sessions row 2, order_items row 4
  { id: 'f3', label: 'fct_payments', x: WC[3], y: ry(0, WM_TOP), color: '#059669', small: true },
  { id: 'f2', label: 'fct_sessions', x: WC[3], y: ry(2, WM_TOP), color: '#059669', small: true },
  { id: 'fct', label: N.fct, x: WC[3], y: ry(4, WM_TOP), color: '#059669', highlight: true },
  // Analytics reports (col 4)
  { id: 'd1', label: 'rpt_daily_rev', x: WC[4], y: ry(0, WM_TOP), color: '#d97706', small: true },
  { id: 'd2', label: 'rpt_orders', x: WC[4], y: ry(1, WM_TOP), color: '#d97706', small: true },
  { id: 'd4', label: 'rpt_product_perf', x: WC[4], y: ry(2, WM_TOP), color: '#d97706', small: true },
  { id: 'd5', label: 'rpt_cohort', x: WC[4], y: ry(3, WM_TOP), color: '#d97706', small: true },
  // Analytics exposures (col 5)
  { id: 'd6', label: 'exp_dashboard', x: WC[5], y: ry(0, WM_TOP), color: '#dc2626', small: true },
  { id: 'd7', label: 'exp_finance_rpt', x: WC[5], y: ry(2, WM_TOP), color: '#dc2626', small: true },
  { id: 'd8', label: 'exp_exec_summary', x: WC[5], y: ry(3, WM_TOP), color: '#dc2626', small: true },
  // Finance team models (same project, different internal swimlane)
  // int_revenue_converted at col 4 (aligned with rpt_orders etc), rpt_arr at col 5 (aligned with exposures)
  { id: 's8', label: N.srcFx, x: WC[0], y: WF_NODE_Y, color: '#9ca3af', small: true },
  { id: 'st8', label: N.stgFx, x: WC[1], y: WF_NODE_Y, color: '#6366f1', small: true },
  { id: 'int_rev', label: N.intRev, x: WC[4], y: WF_NODE_Y, color: '#0891b2', small: true, highlight: true },
  { id: 'rpt_arr', label: N.rptArr, x: WC[5], y: WF_NODE_Y, color: '#d97706', small: true },
]
const withoutMeshEdges = [
  ['s1','st1'],['s2','st2'],['s3','st3'],['s4','st4'],['s5','st5'],['s6','st6'],['s7','st7'],
  ['st1','i1'],['st1','i2'],['st2','i2'],['st3','i3'],['st4','i4'],['st5','i5'],['st6','i5'],['st7','i6'],
  ['st2','i1'],['st3','i1'],['st6','i6'],
  ['i1','fct'],['i2','fct'],['i3','fct'],['i4','fct'],['i6','fct'],['i3','f3'],['i5','f2'],
  ['f3','d1'],['f3','d2'],['fct','d2'],['f2','d5'],['fct','d4'],
  ['d1','d6'],['d2','d6'],['d4','d7'],['d5','d8'],
  ['s8','st8'],['fct','int_rev'],['st8','int_rev'],['int_rev','rpt_arr'],
]
// One outer project container + two internal swimlane labels
const withoutMeshZones = [
  { x: 0, y: 0, w: wmTotalW, h: wmTotalH, label: 'monolithic project', color: '#6b7280', solid: true },
]
// Swimlane labels rendered separately (not dashed containers, just text labels)
const withoutMeshLanes = [
  { x: wmTotalW - ZPAD, y: 5, label: 'analytics team', color: '#059669' },
  { x: wmTotalW - ZPAD, y: WF_LANE_LABEL_Y, label: 'finance team', color: '#d97706' },
]

/* ════════════════ SCOPED (With Mesh, collapsed) ════════════════ */
// Two separate project containers with a clear gap.
const MC = mkCols([NWL, NW, NW, NW])
const M_ANA_TOP = 0
const M_ANA_H = ZPAD + ZLBL + NHL + ZPAD
const M_GAP = 20
const M_FIN_TOP = M_ANA_H + M_GAP
const M_FIN_ROWS = 1
const M_FIN_H = ZPAD + ZLBL + M_FIN_ROWS * (NH + RGAP) + ZPAD

const scopedNodes = [
  { id: 'fct', label: N.fct, x: MC[0] + ZPAD, y: M_ANA_TOP + ZPAD + ZLBL, color: '#059669', highlight: true, tag: 'public' },
  { id: 'src_fx', label: N.srcFx, x: MC[0], y: ry(0, M_FIN_TOP), color: '#9ca3af', small: true },
  { id: 'stg_fx', label: N.stgFx, x: MC[1], y: ry(0, M_FIN_TOP), color: '#6366f1', small: true },
  { id: 'int_rev', label: N.intRev, x: MC[2], y: ry(0, M_FIN_TOP), color: '#0891b2', small: true, highlight: true },
  { id: 'rpt_arr', label: N.rptArr, x: MC[3], y: ry(0, M_FIN_TOP), color: '#d97706', small: true },
]
const scopedEdges = [
  ['fct', 'int_rev'], ['src_fx', 'stg_fx'], ['stg_fx', 'int_rev'],
  ['int_rev', 'rpt_arr'],
]
const scopedZones = [
  { x: 0, y: M_ANA_TOP, w: MC[0] + ZPAD + NWL + 46 + ZPAD, h: M_ANA_H, label: 'analytics project', color: '#059669' },
  { x: 0, y: M_FIN_TOP, w: MC[3] + NW + ZPAD, h: M_FIN_H, label: 'finance project', color: '#d97706' },
]

/* ════════════════ EXPANDED (With Mesh, full lineage) ════════════════ */
const EC = mkCols([NW, NW, NW, NWL, NW, NW])
const E_ANA_TOP = 0
const E_ANA_ROWS = 5
const E_ANA_H = ZPAD + ZLBL + E_ANA_ROWS * (NH + RGAP) + ZPAD
const E_GAP = 20
const E_FIN_TOP = E_ANA_H + E_GAP
const E_FIN_H = ZPAD + ZLBL + NH + ZPAD + 4

const expandedNodes = [
  { id: 's1', label: 'src_orders', x: EC[0], y: ry(0, E_ANA_TOP), color: '#9ca3af', small: true },
  { id: 's2', label: 'src_customers', x: EC[0], y: ry(1, E_ANA_TOP), color: '#9ca3af', small: true },
  { id: 's3', label: 'src_payments', x: EC[0], y: ry(2, E_ANA_TOP), color: '#9ca3af', small: true },
  { id: 's4', label: 'src_products', x: EC[0], y: ry(3, E_ANA_TOP), color: '#9ca3af', small: true },
  { id: 's7', label: 'src_refunds', x: EC[0], y: ry(4, E_ANA_TOP), color: '#9ca3af', small: true },
  { id: 'st1', label: 'stg_orders', x: EC[1], y: ry(0, E_ANA_TOP), color: '#6366f1', small: true },
  { id: 'st2', label: 'stg_customers', x: EC[1], y: ry(1, E_ANA_TOP), color: '#6366f1', small: true },
  { id: 'st3', label: 'stg_payments', x: EC[1], y: ry(2, E_ANA_TOP), color: '#6366f1', small: true },
  { id: 'st4', label: 'stg_products', x: EC[1], y: ry(3, E_ANA_TOP), color: '#6366f1', small: true },
  { id: 'st7', label: 'stg_refunds', x: EC[1], y: ry(4, E_ANA_TOP), color: '#6366f1', small: true },
  { id: 'i1', label: 'int_order_items', x: EC[2], y: ry(0, E_ANA_TOP), color: '#0891b2', small: true },
  { id: 'i2', label: 'int_cust_orders', x: EC[2], y: ry(1, E_ANA_TOP), color: '#0891b2', small: true },
  { id: 'i3', label: 'int_pay_agg', x: EC[2], y: ry(2, E_ANA_TOP), color: '#0891b2', small: true },
  { id: 'i4', label: 'int_product_sales', x: EC[2], y: ry(3, E_ANA_TOP), color: '#0891b2', small: true },
  { id: 'fct', label: N.fct, x: EC[3], y: ry(1, E_ANA_TOP) + 3, color: '#059669', highlight: true, tag: 'public' },
  // Finance row
  { id: 'src_fx', label: N.srcFx, x: EC[0], y: ry(0, E_FIN_TOP), color: '#9ca3af', small: true },
  { id: 'stg_fx', label: N.stgFx, x: EC[1], y: ry(0, E_FIN_TOP), color: '#6366f1', small: true },
  { id: 'int_rev', label: N.intRev, x: EC[4], y: ry(0, E_FIN_TOP), color: '#0891b2', small: true, highlight: true },
  { id: 'rpt_arr', label: N.rptArr, x: EC[5], y: ry(0, E_FIN_TOP), color: '#d97706', small: true },
]
const expandedEdges = [
  ['s1','st1'],['s2','st2'],['s3','st3'],['s4','st4'],['s7','st7'],
  ['st1','i1'],['st2','i2'],['st3','i3'],['st4','i4'],['st2','i1'],['st3','i1'],['st7','i3'],
  ['i1','fct'],['i2','fct'],['i3','fct'],['i4','fct'],
  ['fct','int_rev'],['src_fx','stg_fx'],['stg_fx','int_rev'],
  ['int_rev','rpt_arr'],
]
const expandedZones = [
  { x: 0, y: E_ANA_TOP, w: EC[3] + NWL + 46 + ZPAD, h: E_ANA_H, label: 'analytics project', color: '#059669' },
  { x: 0, y: E_FIN_TOP, w: EC[5] + NW + ZPAD, h: E_FIN_H, label: 'finance project', color: '#d97706' },
]

/* ════════════════ LineageDAG dispatcher ════════════════ */
function LineageDAG({ variant }) {
  // Only the With Mesh variants highlight the fct->int_rev edge green
  const greenEdge = ['fct', 'int_rev']
  if (variant === 'scoped') {
    const w = scopedZones[1].w + 4
    const h = M_FIN_TOP + M_FIN_H + 4
    return <DAGRenderer nodes={scopedNodes} edges={scopedEdges} zones={scopedZones} lanes={[]} greenEdge={greenEdge} width={w} height={h} />
  }
  if (variant === 'expanded') {
    const w = Math.max(expandedZones[0].w, expandedZones[1].w) + 4
    const h = E_FIN_TOP + E_FIN_H + 4
    return <DAGRenderer nodes={expandedNodes} edges={expandedEdges} zones={expandedZones} lanes={[]} greenEdge={greenEdge} width={w} height={h} />
  }
  // Without Mesh: no green edge
  return <DAGRenderer nodes={withoutMeshNodes} edges={withoutMeshEdges} zones={withoutMeshZones} lanes={withoutMeshLanes} width={wmTotalW + 4} height={wmTotalH + 4} />
}

/* ════════════════ DAGRenderer ════════════════ */
function DAGRenderer({ nodes, edges, zones, lanes, greenEdge, width, height }) {
  const [hovered, setHovered] = useState(null)
  const nodeMap = {}
  nodes.forEach(n => { nodeMap[n.id] = n })
  const nw = (n) => (n.small ? NW : NWL)
  const nh = (n) => (n.small ? NH : NHL)

  return (
    <div className="overflow-x-auto">
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
        <defs>
          <marker id="mesh-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth={5} markerHeight={5} orient="auto-start-auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#d1d5db" />
          </marker>
          <marker id="mesh-arrow-green" viewBox="0 0 10 10" refX="8" refY="5" markerWidth={5} markerHeight={5} orient="auto-start-auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#86efac" />
          </marker>
          <marker id="mesh-arrow-accent" viewBox="0 0 10 10" refX="8" refY="5" markerWidth={5} markerHeight={5} orient="auto-start-auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#fdba74" />
          </marker>
        </defs>

        {/* Project / container zones */}
        {(zones || []).map((z, i) => (
          <g key={`z${i}`}>
            <rect x={z.x} y={z.y} width={z.w} height={z.h} rx={8}
              fill={z.color + '06'} stroke={z.color + (z.solid ? '30' : '20')}
              strokeWidth={z.solid ? 1.5 : 1} strokeDasharray={z.solid ? undefined : '6 3'} />
            {/* Label: top-left inside with background pill */}
            <rect x={z.x + 6} y={z.y + 4} width={z.label.length * 5.8 + 10} height={15} rx={4} fill="white" fillOpacity={0.85} />
            <text x={z.x + 11} y={z.y + 14} fontSize={9} fontWeight={600} fill={z.color + '90'}>{z.label}</text>
          </g>
        ))}

        {/* Swimlane labels (upper-right of each band, above edges) */}
        {(lanes || []).map((l, i) => {
          const pillW = l.label.length * 5.5 + 10
          return (
            <g key={`l${i}`}>
              <rect x={l.x - pillW} y={l.y - 1} width={pillW} height={14} rx={4} fill={l.color + '10'} stroke={l.color + '20'} strokeWidth={0.5} />
              <text x={l.x - 3} y={l.y + 10} textAnchor="end" fontSize={8.5} fontWeight={600} fill={l.color + '80'}>{l.label}</text>
            </g>
          )
        })}

        {/* Divider line between swimlanes in Without Mesh */}
        {(lanes || []).length > 1 && (
          <line x1={ZPAD} y1={WF_LANE_TOP - 4} x2={wmTotalW - ZPAD} y2={WF_LANE_TOP - 4}
            stroke="#e5e7eb" strokeWidth={1} strokeDasharray="4 3" />
        )}

        {/* Edges */}
        {edges.map(([fromId, toId], i) => {
          const from = nodeMap[fromId]
          const to = nodeMap[toId]
          if (!from || !to) return null

          const fw = nw(from), fh = nh(from), tw = nw(to), th = nh(to)
          const isGreen = greenEdge && greenEdge[0] === fromId && greenEdge[1] === toId
          const stroke = isGreen ? '#86efac' : '#e5e7eb'
          const sw = isGreen ? 1.5 : 1
          const marker = isGreen ? 'url(#mesh-arrow-green)' : 'url(#mesh-arrow)'

          // Detect cross-band edges: target is significantly below the source
          const goesDown = to.y > from.y + fh + 20
          const isCrossBand = goesDown && (to.x + tw / 2 <= from.x + fw / 2 || Math.abs((to.x + tw / 2) - (from.x + fw / 2)) < tw)

          let d
          if (isCrossBand) {
            // Orthogonal stepped path: exit bottom, drop vertically in the channel
            // just left of the target, then turn right and enter the LEFT edge.
            const r = 6
            const exitX = from.x + fw / 2
            const exitY = from.y + fh
            // Enter the left edge of the target, offset up slightly so it doesn't
            // overlap the stg_fx -> int_rev edge (which enters at center-left)
            const enterX = to.x
            const enterY = to.y + th * 0.25
            // The vertical channel runs at the target's left edge minus a small gap
            const channelX = to.x - CGAP / 2

            d = `M ${exitX} ${exitY}`
              + ` L ${exitX} ${exitY + r}`
              // Turn toward channel
              + ` Q ${exitX} ${exitY + r + r}, ${exitX + (channelX < exitX ? -r : r)} ${exitY + r + r}`
              + ` L ${channelX} ${exitY + r + r}`
              // Drop vertically in channel
              + ` L ${channelX} ${enterY - r}`
              // Turn right into target left edge
              + ` Q ${channelX} ${enterY}, ${channelX + r} ${enterY}`
              + ` L ${enterX} ${enterY}`
          } else {
            // Normal forward edge: smooth cubic bezier
            const x1 = from.x + fw
            const y1 = from.y + fh / 2
            const x2 = to.x
            // Offset entry Y if this target also receives a cross-band edge
            const hasCrossBandSibling = edges.some(([fId, tId]) => {
              if (tId !== toId || fId === fromId) return false
              const f2 = nodeMap[fId]
              if (!f2) return false
              const f2h = nh(f2)
              const f2w = nw(f2)
              const gd = to.y > f2.y + f2h + 20
              const gb = to.x + tw / 2 <= f2.x + f2w / 2 || Math.abs((to.x + tw / 2) - (f2.x + f2w / 2)) < tw
              return gd && gb
            })
            const y2 = to.y + (hasCrossBandSibling ? th * 0.75 : th / 2)
            const dx = Math.max((x2 - x1) * 0.4, 20)
            d = `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`
          }

          return <path key={i} d={d} fill="none" stroke={stroke} strokeWidth={sw} markerEnd={marker} />
        })}

        {/* Nodes (rendered AFTER edges so they sit on top and occlude crossing lines) */}
        {nodes.map((n) => {
          const w = nw(n)
          const h = nh(n)
          const isHL = n.highlight
          const isAccent = n.accent
          const isHov = hovered === n.id
          const hoverable = isHL || isAccent
          const yOff = isHov ? -2 : 0
          return (
            <g key={n.id}
              style={{ cursor: hoverable ? 'pointer' : undefined }}
              onMouseEnter={hoverable ? () => setHovered(n.id) : undefined}
              onMouseLeave={hoverable ? () => setHovered(null) : undefined}
            >
              {isHov && (
                <rect x={n.x - 2} y={n.y - 2 + yOff} width={w + 4} height={h + 4} rx={7}
                  fill="none" stroke={n.color} strokeWidth={2} opacity={0.3} />
              )}
              {/* Opaque white background so edges pass behind the node */}
              <rect x={n.x} y={n.y + yOff} width={w} height={h} rx={5} fill="white" />
              <rect x={n.x} y={n.y + yOff} width={w} height={h} rx={5}
                fill={isHL ? n.color + '20' : isAccent ? n.color + '18' : (n.small ? n.color + '10' : n.color + '15')}
                stroke={isHL ? n.color : isAccent ? n.color + '90' : n.color + '60'}
                strokeWidth={isHL ? 2 : isAccent ? 1.5 : 1}
                strokeDasharray={isAccent ? '4 2' : undefined} />
              <text x={n.x + w / 2} y={n.y + yOff + h / 2 + (n.small ? 3.5 : 4.5)}
                textAnchor="middle" fontSize={n.small ? 8 : 11} fontWeight={isHL ? 700 : 500}
                fontFamily="ui-monospace, monospace" fill={isHL ? n.color : '#6b7280'}>
                {n.label}
              </text>
              {n.tag && (
                <g>
                  <rect x={n.x + w + 4} y={n.y + yOff + (h - 14) / 2} width={38} height={14} rx={7}
                    fill="#f0fdf4" stroke="#86efac" strokeWidth={1} />
                  <text x={n.x + w + 23} y={n.y + yOff + h / 2 + 3}
                    textAnchor="middle" fontSize={7.5} fontWeight={600} fill="#166534">public</text>
                </g>
              )}
            </g>
          )
        })}
      </svg>
    </div>
  )
}

function CrossProjectLineage() {
  const [withMesh, setWithMesh] = useState(false)
  const [expanded, setExpanded] = useState(false)

  return (
    <div>
      <MeshToggle withMesh={withMesh} setWithMesh={(v) => { setWithMesh(v); setExpanded(false) }} />
      <AnimatePresence mode="wait">
        {!withMesh ? (
          <motion.div
            key="without"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">The whole graph, all at once</h3>
              <p className="text-sm text-gray-500 mt-1">Every source and model behind it, plus everything downstream.</p>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <LineageDAG variant="full" />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="with"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">Scoped to what matters</h3>
              <p className="text-sm text-gray-500 mt-1">See this model in the context of your project. Expand to the full lineage when you need it.</p>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <AnimatePresence mode="wait">
                {!expanded ? (
                  <motion.div
                    key="scoped"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <LineageDAG variant="scoped" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="expanded"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.3 }}
                  >
                    <LineageDAG variant="expanded" />
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="mt-3 text-center">
                <button
                  onClick={() => setExpanded(!expanded)}
                  className="px-4 py-1.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-150"
                >
                  {expanded ? 'Collapse lineage' : 'Show full lineage'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   View 3: Breaking Change Protection
   ═══════════════════════════════════════════════════════════════════ */

function BreakingChangeProtection() {
  const [withMesh, setWithMesh] = useState(false)
  const [pushed, setPushed] = useState(false)
  const [migratedToV2, setMigratedToV2] = useState(false)

  const handleToggle = (v) => {
    setWithMesh(v)
    setPushed(false)
    setMigratedToV2(false)
  }

  return (
    <div>
      <MeshToggle withMesh={withMesh} setWithMesh={handleToggle} />
      <AnimatePresence mode="wait">
        {!withMesh ? (
          <motion.div
            key="without"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">Changes break downstream</h3>
              <p className="text-sm text-gray-500 mt-1">An upstream edit flows through instantly and breaks anyone building on it.</p>
            </div>
            <WithoutMeshBreaking pushed={pushed} setPushed={setPushed} />
          </motion.div>
        ) : (
          <motion.div
            key="with"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">Contracts and versions</h3>
              <p className="text-sm text-gray-500 mt-1">A contract means the model cannot change without a new version. v1 stays stable while downstream teams adopt v2 and validate on their own cadence.</p>
            </div>
            <WithMeshBreaking pushed={pushed} setPushed={setPushed} migratedToV2={migratedToV2} setMigratedToV2={setMigratedToV2} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* Shared code block styling */
function CodeBlock({ children, label, borderColor }) {
  return (
    <div className="rounded-lg overflow-hidden border" style={{ borderColor: borderColor || '#e5e7eb' }}>
      {label && (
        <div className="bg-gray-100 px-3 py-1 text-[10px] font-semibold text-gray-500 uppercase tracking-wider border-b" style={{ borderColor: borderColor || '#e5e7eb' }}>
          {label}
        </div>
      )}
      <div className="bg-gray-950 px-3 py-2.5 font-mono text-[11px] leading-relaxed">
        {children}
      </div>
    </div>
  )
}

function WithoutMeshBreaking({ pushed, setPushed }) {
  // Staged animation phases: idle -> renamed -> pulsing -> break1 -> break2 -> done
  const [phase, setPhase] = useState('idle')
  const timeouts = useRef([])

  useEffect(() => {
    if (!pushed) { setPhase('idle'); return }
    // Clear any previous timeouts
    timeouts.current.forEach(clearTimeout)
    timeouts.current = []
    // Stage 1: rename upstream (0-800ms)
    setPhase('renamed')
    // Stage 2: pulse across divider (1200ms)
    timeouts.current.push(setTimeout(() => setPhase('pulsing'), 1200))
    // Stage 3: first downstream breaks (2200ms)
    timeouts.current.push(setTimeout(() => setPhase('break1'), 2200))
    // Stage 4: pause to digest, then second downstream breaks (3400ms)
    timeouts.current.push(setTimeout(() => setPhase('break2'), 3400))
    // Stage 5: summary (4400ms)
    timeouts.current.push(setTimeout(() => setPhase('done'), 4400))
    return () => timeouts.current.forEach(clearTimeout)
  }, [pushed])

  const renamed = phase !== 'idle'
  const pulsing = phase === 'pulsing' || phase === 'break1' || phase === 'break2' || phase === 'done'
  const broke1 = phase === 'break1' || phase === 'break2' || phase === 'done'
  const broke2 = phase === 'break2' || phase === 'done'
  const done = phase === 'done'

  const handleReset = () => {
    timeouts.current.forEach(clearTimeout)
    timeouts.current = []
    setPushed(false)
    setPhase('idle')
  }

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
      {/* Upstream / Divider / Downstream layout */}
      <div className="flex flex-col md:flex-row gap-0 mb-5">
        {/* Upstream card */}
        <div className="flex-1 min-w-0">
          <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: renamed ? '#dc2626' : '#059669' }} />
            Upstream: dim_customers
          </div>
          <CodeBlock label="analytics project" borderColor={renamed ? '#fca5a5' : '#86efac'}>
            <div className="text-gray-500">-- dim_customers.sql</div>
            <div className="text-blue-400 mt-1">SELECT</div>
            <div className="text-gray-300 ml-2">customer_id,</div>
            {!renamed ? (
              <div className="text-gray-300 ml-2">customer_name,</div>
            ) : (
              <motion.div
                initial={{ backgroundColor: 'rgba(220,38,38,0.3)' }}
                animate={{ backgroundColor: 'rgba(220,38,38,0.12)' }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="ml-2 -mx-1 px-1 rounded"
              >
                <span className="text-red-400">full_name,</span>
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className="text-red-400/60 text-[9px] ml-1"
                >-- renamed</motion.span>
              </motion.div>
            )}
            <div className="text-gray-300 ml-2">segment,</div>
            <div className="text-gray-300 ml-2">created_at</div>
            <div className="text-blue-400">FROM</div>
            <div className="text-emerald-400 ml-2">{'{{ ref(\'stg_customers\') }}'}</div>
          </CodeBlock>
        </div>

        {/* Vertical divider with labels and pulse */}
        <div className="hidden md:flex flex-col items-center justify-center px-4 relative" style={{ minWidth: 48 }}>
          <div className="text-[8px] font-semibold text-gray-400 uppercase tracking-widest mb-2">Upstream</div>
          <div className="flex-1 relative flex items-center">
            <div className="w-px bg-gradient-to-b from-transparent via-gray-300 to-transparent h-full" />
            {/* Pulse animation */}
            <AnimatePresence>
              {pulsing && !broke1 && (
                <motion.div
                  initial={{ top: '10%', opacity: 0 }}
                  animate={{ top: '90%', opacity: [0, 1, 1, 0] }}
                  transition={{ duration: 0.5, ease: 'easeIn' }}
                  className="absolute left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-red-400"
                  style={{ position: 'absolute' }}
                />
              )}
            </AnimatePresence>
          </div>
          <div className="text-[8px] font-semibold text-gray-400 uppercase tracking-widest mt-2">Downstream</div>
        </div>

        {/* Downstream cards */}
        <div className="flex-[1.15] min-w-0 space-y-3">
          {/* Downstream 1: finance */}
          <div>
            <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <motion.span
                animate={{ backgroundColor: broke1 ? '#dc2626' : '#6366f1' }}
                transition={{ duration: 0.3 }}
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: broke1 ? '#dc2626' : '#6366f1' }}
              />
              Downstream: rpt_customer_ltv
              {broke1 && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="text-[9px] font-bold text-red-600 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded ml-auto"
                >FAILED</motion.span>
              )}
            </div>
            <CodeBlock label="finance project" borderColor={broke1 ? '#fca5a5' : '#c7d2fe'}>
              <div className="text-gray-500">-- rpt_customer_ltv.sql</div>
              <div className="text-blue-400 mt-1">SELECT</div>
              <div className="text-gray-300 ml-2">customer_id,</div>
              <motion.div
                animate={{ backgroundColor: broke1 ? 'rgba(220,38,38,0.15)' : 'transparent' }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="ml-2 -mx-1 px-1 rounded"
              >
                <span className={broke1 ? 'text-red-400' : 'text-gray-300'}>customer_name,</span>
                {broke1 && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.15 }}
                    className="text-red-400/60 text-[9px] ml-1"
                  >-- column not found</motion.span>
                )}
              </motion.div>
              <div className="text-gray-300 ml-2">sum(revenue) as ltv</div>
              <div className="text-blue-400">FROM</div>
              <div className="text-emerald-400 ml-2">{"{{ ref('analytics', 'dim_customers') }}"}</div>
              <div className="text-blue-400">GROUP BY</div>
              <div className="text-gray-300 ml-2">1, 2</div>
            </CodeBlock>
          </div>

          {/* Downstream 2: marketing */}
          <div>
            <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <motion.span
                animate={{ backgroundColor: broke2 ? '#dc2626' : '#d97706' }}
                transition={{ duration: 0.3 }}
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: broke2 ? '#dc2626' : '#d97706' }}
              />
              Downstream: rpt_cohort_retention
              {broke2 && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="text-[9px] font-bold text-red-600 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded ml-auto"
                >FAILED</motion.span>
              )}
            </div>
            <CodeBlock label="marketing project" borderColor={broke2 ? '#fca5a5' : '#fde68a'}>
              <div className="text-gray-500">-- rpt_cohort_retention.sql</div>
              <div className="text-blue-400 mt-1">SELECT</div>
              <div className="text-gray-300 ml-2">segment,</div>
              <motion.div
                animate={{ backgroundColor: broke2 ? 'rgba(220,38,38,0.15)' : 'transparent' }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="ml-2 -mx-1 px-1 rounded"
              >
                <span className={broke2 ? 'text-red-400' : 'text-gray-300'}>customer_name,</span>
                {broke2 && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.15 }}
                    className="text-red-400/60 text-[9px] ml-1"
                  >-- column not found</motion.span>
                )}
              </motion.div>
              <div className="text-gray-300 ml-2">count(*) as customers</div>
              <div className="text-blue-400">FROM</div>
              <div className="text-emerald-400 ml-2">{"{{ ref('analytics', 'dim_customers') }}"}</div>
              <div className="text-blue-400">GROUP BY</div>
              <div className="text-gray-300 ml-2">1, 2</div>
            </CodeBlock>
          </div>
        </div>
      </div>

      {/* Status row */}
      <AnimatePresence>
        {done && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="flex items-center justify-center gap-6 mb-4"
          >
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-red-600">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              rpt_customer_ltv: FAILED
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-red-600">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              rpt_cohort_retention: FAILED
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="text-center">
        {!pushed ? (
          <button
            onClick={() => setPushed(true)}
            className="px-5 py-2 rounded-lg font-medium text-sm bg-gray-900 text-white hover:bg-gray-800 active:bg-gray-950 transition-all duration-150"
          >
            Rename customer_name to full_name
          </button>
        ) : !done ? (
          <span className="inline-flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium bg-red-50 text-red-400">
            <motion.span animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.2, repeat: Infinity }}>Propagating change...</motion.span>
          </span>
        ) : (
          <button
            onClick={handleReset}
            className="px-5 py-2 rounded-lg font-medium text-sm bg-gray-200 text-gray-600 hover:bg-gray-300 transition-all duration-150"
          >
            Reset and replay
          </button>
        )}
        {done && (
          <motion.p
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="text-xs text-red-500 mt-2"
          >
            Both downstream models broke instantly. Neither team knew the rename was coming.
          </motion.p>
        )}
      </div>
    </div>
  )
}

function WithMeshBreaking({ pushed, setPushed, migratedToV2, setMigratedToV2 }) {
  // Staged phases: idle -> v2created -> v1holds -> v2adopted -> done
  const [phase, setPhase] = useState('idle')
  const timeouts = useRef([])

  useEffect(() => {
    if (!pushed) { setPhase('idle'); return }
    timeouts.current.forEach(clearTimeout)
    timeouts.current = []
    // Step 1: v2 created upstream (0-800ms)
    setPhase('v2created')
    // Step 2: pulse crosses divider (1400ms)
    timeouts.current.push(setTimeout(() => setPhase('pulsing'), 1400))
    // Step 3: v1 consumer holds steady (3200ms — 1s after pulse ends)
    timeouts.current.push(setTimeout(() => setPhase('v1holds'), 3200))
    // Step 4: pause to digest v1 stability, then v2 adoption (4600ms)
    timeouts.current.push(setTimeout(() => {
      setMigratedToV2(true)
      setPhase('v2adopted')
    }, 4600))
    // Step 5: resolve (5600ms)
    timeouts.current.push(setTimeout(() => setPhase('done'), 5600))
    return () => timeouts.current.forEach(clearTimeout)
  }, [pushed, setMigratedToV2])

  const v2Created = phase !== 'idle'
  const pulsing = phase === 'pulsing'
  const v1Holds = phase === 'v1holds' || phase === 'v2adopted' || phase === 'done'
  const v2Adopted = phase === 'v2adopted' || phase === 'done'
  const done = phase === 'done'

  const handleReset = () => {
    timeouts.current.forEach(clearTimeout)
    timeouts.current = []
    setPushed(false)
    setMigratedToV2(false)
    setPhase('idle')
  }

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
      {/* Upstream / Divider / Downstream layout */}
      <div className="flex flex-col md:flex-row gap-0 mb-5">
        {/* Upstream card */}
        <div className="flex-1 min-w-0">
          <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Upstream: dim_customers
          </div>
          <CodeBlock label="analytics project" borderColor="#86efac">
            <div className="text-gray-500">-- dim_customers.sql</div>
            <div className="text-gray-500 mt-1">-- v1: contract enforced</div>
            <div className="text-blue-400">SELECT</div>
            <div className="text-gray-300 ml-2">customer_id,</div>
            <div className="text-gray-300 ml-2">customer_name,</div>
            <div className="text-gray-300 ml-2">segment,</div>
            <div className="text-gray-300 ml-2">created_at</div>
            <div className="text-blue-400">FROM</div>
            <div className="text-emerald-400 ml-2">{'{{ ref(\'stg_customers\') }}'}</div>
          </CodeBlock>
          <AnimatePresence>
            {v2Created && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="mt-2"
              >
                <CodeBlock label="v2 (new version)" borderColor="#a5b4fc">
                  <div className="text-gray-500">-- dim_customers_v2.sql</div>
                  <div className="text-blue-400 mt-1">SELECT</div>
                  <div className="text-gray-300 ml-2">customer_id,</div>
                  <motion.div
                    initial={{ backgroundColor: 'rgba(99,102,241,0.3)' }}
                    animate={{ backgroundColor: 'rgba(99,102,241,0.1)' }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="ml-2 -mx-1 px-1 rounded"
                  >
                    <span className="text-indigo-400">full_name,</span>
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.3 }}
                      className="text-indigo-400/60 text-[9px] ml-1"
                    >-- renamed</motion.span>
                  </motion.div>
                  <div className="text-gray-300 ml-2">segment,</div>
                  <div className="text-gray-300 ml-2">created_at</div>
                  <div className="text-blue-400">FROM</div>
                  <div className="text-emerald-400 ml-2">{'{{ ref(\'stg_customers\') }}'}</div>
                </CodeBlock>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Vertical divider with pulse */}
        <div className="hidden md:flex flex-col items-center justify-center px-4 relative" style={{ minWidth: 48 }}>
          <div className="text-[8px] font-semibold text-gray-400 uppercase tracking-widest mb-2">Upstream</div>
          <div className="flex-1 relative flex items-center">
            <div className="w-px bg-gradient-to-b from-transparent via-gray-300 to-transparent h-full" />
            <AnimatePresence>
              {pulsing && (
                <motion.div
                  initial={{ top: '10%', opacity: 0 }}
                  animate={{ top: '90%', opacity: [0, 1, 1, 0] }}
                  transition={{ duration: 0.7, ease: 'easeIn' }}
                  className="absolute left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-indigo-400"
                />
              )}
            </AnimatePresence>
          </div>
          <div className="text-[8px] font-semibold text-gray-400 uppercase tracking-widest mt-2">Downstream</div>
        </div>

        {/* Downstream cards: marketing (v1 holds) on top, finance (adopts v2) below */}
        <div className="flex-[1.15] min-w-0 space-y-3">
          {/* Marketing: stays on v1 (shown first, highlighted first in animation) */}
          <motion.div
            animate={{
              borderColor: v1Holds ? '#86efac' : 'transparent',
              backgroundColor: v1Holds && !v2Adopted ? 'rgba(5,150,105,0.03)' : 'transparent',
            }}
            transition={{ duration: 0.4 }}
            className="rounded-lg"
            style={{ padding: v1Holds ? 4 : 0 }}
          >
            <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Downstream: rpt_cohort_retention
              {v1Holds && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="text-[9px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded ml-auto"
                >STABLE on v1</motion.span>
              )}
            </div>
            <CodeBlock label="marketing project" borderColor="#86efac">
              <div className="text-gray-500">-- rpt_cohort_retention.sql</div>
              <div className="text-blue-400 mt-1">SELECT</div>
              <div className="text-gray-300 ml-2">segment,</div>
              <div className="text-gray-300 ml-2">customer_name,</div>
              <div className="text-gray-300 ml-2">count(*) as customers</div>
              <div className="text-blue-400">FROM</div>
              <div className="text-emerald-400 ml-2">{"{{ ref('analytics', 'dim_customers', v=1) }}"}</div>
              <div className="text-blue-400">GROUP BY</div>
              <div className="text-gray-300 ml-2">1, 2</div>
            </CodeBlock>
            <div className="mt-2 flex items-center justify-center gap-1 text-[10px] font-medium text-emerald-600">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Still on v1, runs fine
            </div>
          </motion.div>

          {/* Finance: adopts v2 (shown second, highlighted after a pause) */}
          <motion.div
            animate={{ borderColor: v2Adopted ? '#a5b4fc' : 'transparent', backgroundColor: v2Adopted ? 'rgba(99,102,241,0.03)' : 'transparent' }}
            transition={{ duration: 0.4 }}
            className="rounded-lg"
            style={{ padding: v2Adopted ? 4 : 0 }}
          >
            <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <motion.span
                animate={{ backgroundColor: v2Adopted ? '#6366f1' : '#059669' }}
                transition={{ duration: 0.3 }}
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: v2Adopted ? '#6366f1' : '#059669' }}
              />
              Downstream: rpt_customer_ltv
              {v2Adopted && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="text-[9px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-200 px-1.5 py-0.5 rounded ml-auto"
                >ADOPTED v2</motion.span>
              )}
            </div>
            <CodeBlock label="finance project" borderColor={v2Adopted ? '#a5b4fc' : '#86efac'}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={v2Adopted ? 'v2' : 'v1'}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="text-gray-500">-- rpt_customer_ltv.sql</div>
                  <div className="text-blue-400 mt-1">SELECT</div>
                  <div className="text-gray-300 ml-2">customer_id,</div>
                  {!v2Adopted ? (
                    <div className="text-gray-300 ml-2">customer_name,</div>
                  ) : (
                    <motion.div
                      initial={{ backgroundColor: 'rgba(99,102,241,0.25)' }}
                      animate={{ backgroundColor: 'rgba(99,102,241,0.08)' }}
                      transition={{ duration: 0.8 }}
                      className="ml-2 -mx-1 px-1 rounded"
                    >
                      <span className="text-indigo-400">full_name,</span>
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                        className="text-indigo-400/60 text-[9px] ml-1"
                      >-- updated</motion.span>
                    </motion.div>
                  )}
                  <div className="text-gray-300 ml-2">sum(revenue) as ltv</div>
                  <div className="text-blue-400">FROM</div>
                  <div className="text-emerald-400 ml-2">
                    {v2Adopted
                      ? "{{ ref('analytics', 'dim_customers', v=2) }}"
                      : "{{ ref('analytics', 'dim_customers', v=1) }}"
                    }
                  </div>
                  <div className="text-blue-400">GROUP BY</div>
                  <div className="text-gray-300 ml-2">1, 2</div>
                </motion.div>
              </AnimatePresence>
            </CodeBlock>
            {v2Adopted && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-2 flex items-center justify-center gap-1 text-[10px] font-medium text-indigo-600"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                Migrated to v2 on their own schedule
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Status */}
      <AnimatePresence>
        {done && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="flex items-center justify-center gap-6 mb-4"
          >
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              v1 consumers: unaffected
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-indigo-600">
              <span className="w-2 h-2 rounded-full bg-indigo-500" />
              v2 adopted and validated
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="text-center">
        {!pushed ? (
          <button
            onClick={() => setPushed(true)}
            className="px-5 py-2 rounded-lg font-medium text-sm bg-gray-900 text-white hover:bg-gray-800 active:bg-gray-950 transition-all duration-150"
          >
            Rename customer_name to full_name
          </button>
        ) : !done ? (
          <span className="inline-flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium bg-indigo-50 text-indigo-400">
            <motion.span animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.2, repeat: Infinity }}>Versioning in progress...</motion.span>
          </span>
        ) : (
          <button
            onClick={handleReset}
            className="px-5 py-2 rounded-lg font-medium text-sm bg-gray-200 text-gray-600 hover:bg-gray-300 transition-all duration-150"
          >
            Reset and replay
          </button>
        )}
        {done && (
          <motion.p
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="text-xs text-emerald-600 mt-2"
          >
            v1 stays stable. Teams adopt v2, update their code, and validate on their own cadence.
          </motion.p>
        )}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   Main export
   ═══════════════════════════════════════════════════════════════════ */

export default function DbtMesh() {
  const [activeView, setActiveView] = useState('discovery')

  return (
    <div className="section-container py-8">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">dbt Mesh</h2>
        <div className="inline-flex bg-gray-100 rounded-xl p-1 mt-4">
          {views.map(v => (
            <button
              key={v.key}
              onClick={() => setActiveView(v.key)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeView === v.key
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-5 text-center">
        <AnimatePresence mode="wait">
          <motion.div key={activeView} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.2 }}>
            <p className="text-sm text-gray-500">{viewDescs[activeView]}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="bg-white border border-gray-200/60 rounded-2xl p-6 shadow-sm">
        <AnimatePresence mode="wait">
          {activeView === 'discovery' && (
            <motion.div key="discovery" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
              <ModelDiscovery />
            </motion.div>
          )}
          {activeView === 'lineage' && (
            <motion.div key="lineage" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
              <CrossProjectLineage />
            </motion.div>
          )}
          {activeView === 'breaking' && (
            <motion.div key="breaking" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
              <BreakingChangeProtection />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
