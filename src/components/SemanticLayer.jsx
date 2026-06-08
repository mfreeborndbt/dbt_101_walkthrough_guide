import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const tabs = [
  { key: 'how', label: 'How It Works' },
  { key: 'problem', label: 'Problem It Solves' },
  { key: 'config', label: 'How It\'s Configured' },
]

const tabDescs = {
  how: 'The Semantic Layer translates simple questions into correct SQL through a governed metrics catalog.',
  problem: 'Without a Semantic Layer, metrics live everywhere and nowhere. With one, every consumer gets the same answer.',
  config: 'Define your metrics alongside your models. Same repo, same review process, same CI pipeline.',
}

/* ─── Tab 1: How It Works ─── */

/* --- Non-AI flow diagram (5 boxes) --- */
function FlowDiagramNonAI() {
  const [hovered, setHovered] = useState(null)
  const boxes = [
    { id: 'input', label: 'User Input', x: 5, w: 140, fill: '#f0fdf4', stroke: '#86efac', titleColor: '#166534' },
    { id: 'connector', label: 'API / Native Connector', x: 180, w: 145, fill: '#fff7ed', stroke: '#fdba74', titleColor: '#9a3412' },
    { id: 'sl', label: 'dbt Semantic Layer', x: 360, w: 155, fill: '#eff6ff', stroke: '#93c5fd', titleColor: '#1e3a5f' },
    { id: 'sql', label: 'Generated SQL', x: 550, w: 145, fill: '#fefce8', stroke: '#fde68a', titleColor: '#78350f' },
    { id: 'results', label: 'Results', x: 730, w: 110, fill: '#fdf4ff', stroke: '#e9d5ff', titleColor: '#581c87' },
  ]
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 overflow-x-auto">
      <svg width="850" height="195" viewBox="0 0 850 195" className="w-full h-auto">
        <defs>
          <marker id="sl-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth={6} markerHeight={6} orient="auto-start-auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#9ca3af" />
          </marker>
        </defs>

        {/* Arrows between boxes */}
        <line x1={150} y1={90} x2={175} y2={90} stroke="#9ca3af" strokeWidth={1.5} markerEnd="url(#sl-arrow)" />
        <line x1={330} y1={90} x2={355} y2={90} stroke="#9ca3af" strokeWidth={1.5} markerEnd="url(#sl-arrow)" />
        <line x1={520} y1={90} x2={545} y2={90} stroke="#9ca3af" strokeWidth={1.5} markerEnd="url(#sl-arrow)" />
        <line x1={700} y1={90} x2={725} y2={90} stroke="#9ca3af" strokeWidth={1.5} markerEnd="url(#sl-arrow)" />

        {/* Hoverable boxes */}
        {boxes.map((box) => {
          const isH = hovered === box.id
          return (
            <motion.g
              key={box.id}
              animate={{ y: isH ? -3 : 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            >
              <rect x={box.x} y={30} width={box.w} height={120} rx={12} fill={box.fill} stroke={box.stroke} strokeWidth={isH ? 2.5 : 1.5} />
              {isH && <rect x={box.x - 2} y={28} width={box.w + 4} height={124} rx={14} fill="none" stroke={box.stroke} strokeWidth={2} opacity={0.4} />}
              <text x={box.x + box.w / 2} y={22} textAnchor="middle" fontSize={box.id === 'connector' ? 9.5 : 11} fontWeight={600} fill={box.titleColor}>{box.label}</text>
              <rect x={box.x} y={18} width={box.w} height={135} fill="transparent" style={{ cursor: 'pointer' }}
                onMouseEnter={() => setHovered(box.id)} onMouseLeave={() => setHovered(null)} />
            </motion.g>
          )
        })}

        {/* User Input content — Non-AI */}
        <foreignObject x={13} y={42} width={124} height={100} style={{ pointerEvents: 'none' }}>
          <div xmlns="http://www.w3.org/1999/xhtml" style={{ fontSize: '10px', color: '#374151', lineHeight: '1.4' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '8px' }}>
              <span style={{ fontSize: '13px' }}>📋</span>
              <span style={{ fontWeight: 600 }}>Dropdown</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '8px' }}>
              <span style={{ fontSize: '13px' }}>🖱</span>
              <span style={{ fontWeight: 600 }}>Drag & Drop</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ fontSize: '13px' }}>💻</span>
              <span style={{ fontWeight: 600 }}>Code</span>
            </div>
          </div>
        </foreignObject>

        {/* API / Native Connector content */}
        <foreignObject x={188} y={40} width={129} height={104} style={{ pointerEvents: 'none' }}>
          <div xmlns="http://www.w3.org/1999/xhtml" style={{ fontSize: '9px', color: '#374151', lineHeight: '1.5' }}>
            <div style={{ textAlign: 'center', marginBottom: '4px' }}>
              <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: '10px', fontWeight: 700, color: '#9a3412' }}>Converts to SL Query</span>
            </div>
            <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: '7.5px', color: '#6b7280', lineHeight: '1.4' }}>
              <div>--metrics revenue</div>
              <div>--group-by region</div>
              <div>--where "order_date</div>
              <div>&nbsp;&nbsp;&gt;= '2025-10-01'"</div>
            </div>
          </div>
        </foreignObject>

        {/* MetricFlow content */}
        <foreignObject x={368} y={40} width={139} height={104} style={{ pointerEvents: 'none' }}>
          <div xmlns="http://www.w3.org/1999/xhtml" style={{ fontSize: '10px', color: '#374151', lineHeight: '1.5' }}>
            <div style={{ textAlign: 'center', marginBottom: '6px' }}>
              <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: '11px', fontWeight: 700, color: '#1e40af' }}>MetricFlow</span>
            </div>
            <div style={{ fontSize: '9px', color: '#6b7280', textAlign: 'center' }}>
              Resolves metric definitions,<br />
              dimensions, filters, and<br />
              entity relationships
            </div>
          </div>
        </foreignObject>

        {/* SQL content */}
        <foreignObject x={558} y={42} width={129} height={100} style={{ pointerEvents: 'none' }}>
          <div xmlns="http://www.w3.org/1999/xhtml" style={{ fontFamily: 'ui-monospace, monospace', fontSize: '8.5px', color: '#374151', lineHeight: '1.5' }}>
            <span style={{ color: '#2563eb' }}>SELECT</span><br />
            {'  region,'}<br />
            {'  '}<span style={{ color: '#2563eb' }}>SUM</span>{'(amount)'}<br />
            {'  '}<span style={{ color: '#6b7280' }}>as</span>{' revenue'}<br />
            <span style={{ color: '#2563eb' }}>FROM</span>{' analytics.'}<br />
            {'  fct_orders'}<br />
            <span style={{ color: '#2563eb' }}>GROUP BY</span>{' region'}
          </div>
        </foreignObject>

        {/* Results content */}
        <foreignObject x={738} y={42} width={94} height={100} style={{ pointerEvents: 'none' }}>
          <div xmlns="http://www.w3.org/1999/xhtml" style={{ fontSize: '9px', color: '#374151', lineHeight: '1.6' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e9d5ff' }}>
                  <th style={{ textAlign: 'left', fontWeight: 600, paddingBottom: '3px', fontSize: '8px' }}>Region</th>
                  <th style={{ textAlign: 'right', fontWeight: 600, paddingBottom: '3px', fontSize: '8px' }}>Rev</th>
                </tr>
              </thead>
              <tbody style={{ fontSize: '8.5px' }}>
                <tr><td>West</td><td style={{ textAlign: 'right' }}>$2.4M</td></tr>
                <tr><td>East</td><td style={{ textAlign: 'right' }}>$1.8M</td></tr>
                <tr><td>Central</td><td style={{ textAlign: 'right' }}>$1.2M</td></tr>
              </tbody>
            </table>
          </div>
        </foreignObject>

        {/* Location labels */}
        <text x={75} y={170} textAnchor="middle" fontSize={10} fill="#6b7280" fontWeight={600}>Application</text>
        <text x={340} y={170} textAnchor="middle" fontSize={10} fill="#6b7280" fontWeight={600}>dbt Platform</text>
        <text x={622} y={170} textAnchor="middle" fontSize={10} fill="#6b7280" fontWeight={600}>Data Platform</text>
        <text x={785} y={170} textAnchor="middle" fontSize={10} fill="#6b7280" fontWeight={600}>Application</text>

        {/* Bracket under Connector + Semantic Layer to show dbt Platform spans both */}
        <line x1={180} y1={158} x2={520} y2={158} stroke="#d1d5db" strokeWidth={1} />
        <line x1={180} y1={155} x2={180} y2={158} stroke="#d1d5db" strokeWidth={1} />
        <line x1={520} y1={155} x2={520} y2={158} stroke="#d1d5db" strokeWidth={1} />
      </svg>
    </div>
  )
}

/* --- AI flow diagram (5 boxes) --- */
function FlowDiagramAI() {
  const [hovered, setHovered] = useState(null)
  const boxes = [
    { id: 'input', label: 'User Input', x: 5, w: 140, fill: '#f0fdf4', stroke: '#86efac', titleColor: '#166534' },
    { id: 'mcp', label: 'MCP Server', x: 180, w: 145, fill: '#fdf2f8', stroke: '#f9a8d4', titleColor: '#9d174d' },
    { id: 'sl', label: 'dbt Semantic Layer', x: 360, w: 155, fill: '#eff6ff', stroke: '#93c5fd', titleColor: '#1e3a5f' },
    { id: 'sql', label: 'Generated SQL', x: 550, w: 145, fill: '#fefce8', stroke: '#fde68a', titleColor: '#78350f' },
    { id: 'results', label: 'Results', x: 730, w: 110, fill: '#fdf4ff', stroke: '#e9d5ff', titleColor: '#581c87' },
  ]
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 overflow-x-auto">
      <svg width="850" height="195" viewBox="0 0 850 195" className="w-full h-auto">
        <defs>
          <marker id="sl-arrow-ai" viewBox="0 0 10 10" refX="8" refY="5" markerWidth={6} markerHeight={6} orient="auto-start-auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#9ca3af" />
          </marker>
        </defs>

        {/* Arrows between boxes */}
        <line x1={150} y1={90} x2={175} y2={90} stroke="#9ca3af" strokeWidth={1.5} markerEnd="url(#sl-arrow-ai)" />
        <line x1={330} y1={90} x2={355} y2={90} stroke="#9ca3af" strokeWidth={1.5} markerEnd="url(#sl-arrow-ai)" />
        <line x1={520} y1={90} x2={545} y2={90} stroke="#9ca3af" strokeWidth={1.5} markerEnd="url(#sl-arrow-ai)" />
        <line x1={700} y1={90} x2={725} y2={90} stroke="#9ca3af" strokeWidth={1.5} markerEnd="url(#sl-arrow-ai)" />

        {/* Hoverable boxes */}
        {boxes.map((box) => {
          const isH = hovered === box.id
          return (
            <motion.g
              key={box.id}
              animate={{ y: isH ? -3 : 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            >
              <rect x={box.x} y={30} width={box.w} height={120} rx={12} fill={box.fill} stroke={box.stroke} strokeWidth={isH ? 2.5 : 1.5} />
              {isH && <rect x={box.x - 2} y={28} width={box.w + 4} height={124} rx={14} fill="none" stroke={box.stroke} strokeWidth={2} opacity={0.4} />}
              <text x={box.x + box.w / 2} y={22} textAnchor="middle" fontSize={11} fontWeight={600} fill={box.titleColor}>{box.label}</text>
              <rect x={box.x} y={18} width={box.w} height={135} fill="transparent" style={{ cursor: 'pointer' }}
                onMouseEnter={() => setHovered(box.id)} onMouseLeave={() => setHovered(null)} />
            </motion.g>
          )
        })}

        {/* User Input content — AI */}
        <foreignObject x={13} y={42} width={124} height={100} style={{ pointerEvents: 'none' }}>
          <div xmlns="http://www.w3.org/1999/xhtml" style={{ fontSize: '10px', color: '#374151', lineHeight: '1.4' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '6px' }}>
              <span style={{ fontSize: '13px' }}>💬</span>
              <span style={{ fontWeight: 600 }}>LLM / Chat</span>
            </div>
            <div style={{ fontStyle: 'italic', color: '#6b7280', fontSize: '9px' }}>
              "What was revenue by region last quarter?"
            </div>
          </div>
        </foreignObject>

        {/* MCP Server content */}
        <foreignObject x={188} y={40} width={129} height={104} style={{ pointerEvents: 'none' }}>
          <div xmlns="http://www.w3.org/1999/xhtml" style={{ fontSize: '9px', color: '#374151', lineHeight: '1.5' }}>
            <div style={{ textAlign: 'center', marginBottom: '4px' }}>
              <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: '10px', fontWeight: 700, color: '#9d174d' }}>dbt MCP Server</span>
            </div>
            <div style={{ fontSize: '8.5px', color: '#6b7280' }}>
              <div style={{ marginBottom: '2px' }}>&#x2022; Lists available metrics</div>
              <div style={{ marginBottom: '2px' }}>&#x2022; Lists dimensions</div>
              <div>&#x2022; LLM maps text to YML values</div>
            </div>
          </div>
        </foreignObject>

        {/* MetricFlow content */}
        <foreignObject x={368} y={40} width={139} height={104} style={{ pointerEvents: 'none' }}>
          <div xmlns="http://www.w3.org/1999/xhtml" style={{ fontSize: '10px', color: '#374151', lineHeight: '1.5' }}>
            <div style={{ textAlign: 'center', marginBottom: '6px' }}>
              <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: '11px', fontWeight: 700, color: '#1e40af' }}>MetricFlow</span>
            </div>
            <div style={{ fontSize: '9px', color: '#6b7280', textAlign: 'center' }}>
              Resolves metric definitions,<br />
              dimensions, filters, and<br />
              entity relationships
            </div>
          </div>
        </foreignObject>

        {/* SQL content */}
        <foreignObject x={558} y={42} width={129} height={100} style={{ pointerEvents: 'none' }}>
          <div xmlns="http://www.w3.org/1999/xhtml" style={{ fontFamily: 'ui-monospace, monospace', fontSize: '8.5px', color: '#374151', lineHeight: '1.5' }}>
            <span style={{ color: '#2563eb' }}>SELECT</span><br />
            {'  region,'}<br />
            {'  '}<span style={{ color: '#2563eb' }}>SUM</span>{'(amount)'}<br />
            {'  '}<span style={{ color: '#6b7280' }}>as</span>{' revenue'}<br />
            <span style={{ color: '#2563eb' }}>FROM</span>{' analytics.'}<br />
            {'  fct_orders'}<br />
            <span style={{ color: '#2563eb' }}>GROUP BY</span>{' region'}
          </div>
        </foreignObject>

        {/* Results content */}
        <foreignObject x={738} y={42} width={94} height={100} style={{ pointerEvents: 'none' }}>
          <div xmlns="http://www.w3.org/1999/xhtml" style={{ fontSize: '9px', color: '#374151', lineHeight: '1.6' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e9d5ff' }}>
                  <th style={{ textAlign: 'left', fontWeight: 600, paddingBottom: '3px', fontSize: '8px' }}>Region</th>
                  <th style={{ textAlign: 'right', fontWeight: 600, paddingBottom: '3px', fontSize: '8px' }}>Rev</th>
                </tr>
              </thead>
              <tbody style={{ fontSize: '8.5px' }}>
                <tr><td>West</td><td style={{ textAlign: 'right' }}>$2.4M</td></tr>
                <tr><td>East</td><td style={{ textAlign: 'right' }}>$1.8M</td></tr>
                <tr><td>Central</td><td style={{ textAlign: 'right' }}>$1.2M</td></tr>
              </tbody>
            </table>
          </div>
        </foreignObject>

        {/* Location labels */}
        <text x={75} y={170} textAnchor="middle" fontSize={10} fill="#6b7280" fontWeight={600}>Application</text>
        <text x={340} y={170} textAnchor="middle" fontSize={10} fill="#6b7280" fontWeight={600}>dbt Platform</text>
        <text x={622} y={170} textAnchor="middle" fontSize={10} fill="#6b7280" fontWeight={600}>Data Platform</text>
        <text x={785} y={170} textAnchor="middle" fontSize={10} fill="#6b7280" fontWeight={600}>Application</text>

        {/* Bracket under MCP + Semantic Layer to show dbt Platform spans both */}
        <line x1={180} y1={158} x2={520} y2={158} stroke="#d1d5db" strokeWidth={1} />
        <line x1={180} y1={155} x2={180} y2={158} stroke="#d1d5db" strokeWidth={1} />
        <line x1={520} y1={155} x2={520} y2={158} stroke="#d1d5db" strokeWidth={1} />
      </svg>
    </div>
  )
}

/* --- Animation stages and labels per mode --- */
const animStagesNonAI = ['idle', 'input', 'connector', 'metricflow', 'sql', 'results', 'done']
const animStagesAI = ['idle', 'input', 'mcp', 'metricflow', 'sql', 'results', 'done']

const progressStepsNonAI = [
  { key: 'input', label: 'User Input', color: { bg: '#f0fdf4', border: '#86efac', activeBorder: '#22c55e', text: '#166534' } },
  { key: 'connector', label: 'API / Connector', color: { bg: '#fff7ed', border: '#fdba74', activeBorder: '#f97316', text: '#9a3412' } },
  { key: 'metricflow', label: 'MetricFlow', color: { bg: '#eff6ff', border: '#93c5fd', activeBorder: '#3b82f6', text: '#1e3a5f' } },
  { key: 'sql', label: 'Generate SQL', color: { bg: '#fefce8', border: '#fde68a', activeBorder: '#f59e0b', text: '#78350f' } },
  { key: 'results', label: 'Results', color: { bg: '#fdf4ff', border: '#e9d5ff', activeBorder: '#a855f7', text: '#581c87' } },
]

const progressStepsAI = [
  { key: 'input', label: 'User Input', color: { bg: '#f0fdf4', border: '#86efac', activeBorder: '#22c55e', text: '#166534' } },
  { key: 'mcp', label: 'MCP Server', color: { bg: '#fdf2f8', border: '#f9a8d4', activeBorder: '#ec4899', text: '#9d174d' } },
  { key: 'metricflow', label: 'MetricFlow', color: { bg: '#eff6ff', border: '#93c5fd', activeBorder: '#3b82f6', text: '#1e3a5f' } },
  { key: 'sql', label: 'Generate SQL', color: { bg: '#fefce8', border: '#fde68a', activeBorder: '#f59e0b', text: '#78350f' } },
  { key: 'results', label: 'Results', color: { bg: '#fdf4ff', border: '#e9d5ff', activeBorder: '#a855f7', text: '#581c87' } },
]

export function HowItWorks() {
  const [isAI, setIsAI] = useState(true)
  const [stage, setStage] = useState('idle')
  const [terminalLines, setTerminalLines] = useState([])
  const [selectedStage, setSelectedStage] = useState(null)
  const timeoutsRef = useRef([])
  const terminalRef = useRef(null)

  const animStages = isAI ? animStagesAI : animStagesNonAI
  const progressSteps = isAI ? progressStepsAI : progressStepsNonAI

  const addLine = useCallback((line) => {
    setTerminalLines(prev => [...prev, line])
    setTimeout(() => {
      if (terminalRef.current) terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }, 50)
  }, [])

  const runAnimationAI = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout)
    timeoutsRef.current = []
    setTerminalLines([])
    setStage('idle')
    setSelectedStage(null)

    let delay = 200

    // Stage 1: User input
    const t1 = setTimeout(() => {
      setStage('input')
      addLine({ text: '$ chat: "What was revenue by region last quarter?"', type: 'command', s: 'input' })
    }, delay)
    timeoutsRef.current.push(t1)
    delay += 1400

    // Stage 2: MCP Server
    const t2 = setTimeout(() => {
      setStage('mcp')
      addLine({ text: '', type: 'blank' })
      addLine({ text: 'Querying dbt MCP Server...', type: 'info', s: 'mcp' })
    }, delay)
    timeoutsRef.current.push(t2)
    delay += 600

    const t2b = setTimeout(() => {
      addLine({ text: '  list_metrics() → [revenue, order_count, customer_count, ...]', type: 'ok', s: 'mcp' })
    }, delay)
    timeoutsRef.current.push(t2b)
    delay += 500

    const t2c = setTimeout(() => {
      addLine({ text: '  list_dimensions(metric: revenue) → [region, order_date, customer_segment, ...]', type: 'ok', s: 'mcp' })
    }, delay)
    timeoutsRef.current.push(t2c)
    delay += 500

    const t2d = setTimeout(() => {
      addLine({ text: '', type: 'blank' })
      addLine({ text: '  LLM mapping: "revenue" → metric: revenue', type: 'ok', s: 'mcp' })
    }, delay)
    timeoutsRef.current.push(t2d)
    delay += 400

    const t2e = setTimeout(() => {
      addLine({ text: '  LLM mapping: "by region" → group_by: Dimension(\'region\')', type: 'ok', s: 'mcp' })
    }, delay)
    timeoutsRef.current.push(t2e)
    delay += 400

    const t2f = setTimeout(() => {
      addLine({ text: '  LLM mapping: "last quarter" → filter: TimeDimension(\'order_date\') >= 2025-10-01', type: 'ok', s: 'mcp' })
    }, delay)
    timeoutsRef.current.push(t2f)
    delay += 800

    // Stage 3: MetricFlow
    const t3 = setTimeout(() => {
      setStage('metricflow')
      addLine({ text: '', type: 'blank' })
      addLine({ text: 'Resolving with MetricFlow...', type: 'info', s: 'metricflow' })
    }, delay)
    timeoutsRef.current.push(t3)
    delay += 600

    const t3b = setTimeout(() => {
      addLine({ text: '  Metric:    revenue → SUM(amount) WHERE status != \'cancelled\'', type: 'ok', s: 'metricflow' })
    }, delay)
    timeoutsRef.current.push(t3b)
    delay += 400

    const t3c = setTimeout(() => {
      addLine({ text: '  Dimension: region (categorical, from dim_customers)', type: 'ok', s: 'metricflow' })
    }, delay)
    timeoutsRef.current.push(t3c)
    delay += 400

    const t3d = setTimeout(() => {
      addLine({ text: '  Filter:    order_date >= 2025-10-01 AND order_date < 2026-01-01', type: 'ok', s: 'metricflow' })
    }, delay)
    timeoutsRef.current.push(t3d)
    delay += 400

    const t3e = setTimeout(() => {
      addLine({ text: '  Joins:     fct_orders → dim_customers via customer_id', type: 'ok', s: 'metricflow' })
    }, delay)
    timeoutsRef.current.push(t3e)
    delay += 800

    // Stage 4: SQL generation
    const t4 = setTimeout(() => {
      setStage('sql')
      addLine({ text: '', type: 'blank' })
      addLine({ text: 'Generating SQL...', type: 'info', s: 'sql' })
    }, delay)
    timeoutsRef.current.push(t4)
    delay += 500

    const sqlLines = [
      '  SELECT',
      '      c.region,',
      '      SUM(o.amount) AS revenue',
      '  FROM analytics.fct_orders o',
      '  LEFT JOIN analytics.dim_customers c',
      '      ON o.customer_id = c.customer_id',
      '  WHERE o.status != \'cancelled\'',
      '      AND o.order_date >= \'2025-10-01\'',
      '      AND o.order_date < \'2026-01-01\'',
      '  GROUP BY c.region',
      '  ORDER BY revenue DESC',
    ]
    sqlLines.forEach((line) => {
      const t = setTimeout(() => {
        addLine({ text: line, type: 'sql', s: 'sql' })
      }, delay)
      timeoutsRef.current.push(t)
      delay += 120
    })
    delay += 600

    // Stage 5: Results
    const t5 = setTimeout(() => {
      setStage('results')
      addLine({ text: '', type: 'blank' })
      addLine({ text: 'Executing query...', type: 'info', s: 'results' })
    }, delay)
    timeoutsRef.current.push(t5)
    delay += 800

    const t5b = setTimeout(() => {
      addLine({ text: '', type: 'blank' })
      addLine({ text: '  REGION      REVENUE', type: 'header', s: 'results' })
      addLine({ text: '  ─────────   ──────────', type: 'header', s: 'results' })
    }, delay)
    timeoutsRef.current.push(t5b)
    delay += 300

    const resultRows = [
      { text: '  West        $2,412,000', type: 'result', s: 'results' },
      { text: '  East        $1,845,000', type: 'result', s: 'results' },
      { text: '  Central     $1,203,000', type: 'result', s: 'results' },
    ]
    resultRows.forEach((row) => {
      const t = setTimeout(() => { addLine(row) }, delay)
      timeoutsRef.current.push(t)
      delay += 250
    })
    delay += 400

    // Done
    const t6 = setTimeout(() => {
      setStage('done')
      addLine({ text: '', type: 'blank' })
      addLine({ text: '3 rows returned.', type: 'success' })
    }, delay)
    timeoutsRef.current.push(t6)
  }, [addLine])

  const runAnimationNonAI = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout)
    timeoutsRef.current = []
    setTerminalLines([])
    setStage('idle')
    setSelectedStage(null)

    let delay = 200

    // Stage 1: User input (dropdown / code selection)
    const t1 = setTimeout(() => {
      setStage('input')
      addLine({ text: 'User selects: metric = revenue, group by = region, filter = last quarter', type: 'command', s: 'input' })
    }, delay)
    timeoutsRef.current.push(t1)
    delay += 1400

    // Stage 2: API / Native Connector
    const t1b = setTimeout(() => {
      setStage('connector')
      addLine({ text: '', type: 'blank' })
      addLine({ text: 'API / Native Connector converting to SL query syntax...', type: 'info', s: 'connector' })
    }, delay)
    timeoutsRef.current.push(t1b)
    delay += 600

    const t1c = setTimeout(() => {
      addLine({ text: '$ dbt sl query \\', type: 'ok', s: 'connector' })
    }, delay)
    timeoutsRef.current.push(t1c)
    delay += 300

    const t1d = setTimeout(() => {
      addLine({ text: '    --metrics revenue \\', type: 'ok', s: 'connector' })
    }, delay)
    timeoutsRef.current.push(t1d)
    delay += 300

    const t1e = setTimeout(() => {
      addLine({ text: '    --group-by region \\', type: 'ok', s: 'connector' })
    }, delay)
    timeoutsRef.current.push(t1e)
    delay += 300

    const t1f = setTimeout(() => {
      addLine({ text: '    --where "order_date >= \'2025-10-01\'"', type: 'ok', s: 'connector' })
    }, delay)
    timeoutsRef.current.push(t1f)
    delay += 800

    // Stage 3: MetricFlow
    const t2 = setTimeout(() => {
      setStage('metricflow')
      addLine({ text: '', type: 'blank' })
      addLine({ text: 'Resolving with MetricFlow...', type: 'info', s: 'metricflow' })
    }, delay)
    timeoutsRef.current.push(t2)
    delay += 600

    const t2b = setTimeout(() => {
      addLine({ text: '  Metric:    revenue → SUM(amount) WHERE status != \'cancelled\'', type: 'ok', s: 'metricflow' })
    }, delay)
    timeoutsRef.current.push(t2b)
    delay += 400

    const t2c = setTimeout(() => {
      addLine({ text: '  Dimension: region (categorical, from dim_customers)', type: 'ok', s: 'metricflow' })
    }, delay)
    timeoutsRef.current.push(t2c)
    delay += 400

    const t2d = setTimeout(() => {
      addLine({ text: '  Filter:    order_date >= 2025-10-01 AND order_date < 2026-01-01', type: 'ok', s: 'metricflow' })
    }, delay)
    timeoutsRef.current.push(t2d)
    delay += 400

    const t2e = setTimeout(() => {
      addLine({ text: '  Joins:     fct_orders → dim_customers via customer_id', type: 'ok', s: 'metricflow' })
    }, delay)
    timeoutsRef.current.push(t2e)
    delay += 800

    // Stage 3: SQL generation
    const t3 = setTimeout(() => {
      setStage('sql')
      addLine({ text: '', type: 'blank' })
      addLine({ text: 'Generating SQL...', type: 'info', s: 'sql' })
    }, delay)
    timeoutsRef.current.push(t3)
    delay += 500

    const sqlLines = [
      '  SELECT',
      '      c.region,',
      '      SUM(o.amount) AS revenue',
      '  FROM analytics.fct_orders o',
      '  LEFT JOIN analytics.dim_customers c',
      '      ON o.customer_id = c.customer_id',
      '  WHERE o.status != \'cancelled\'',
      '      AND o.order_date >= \'2025-10-01\'',
      '      AND o.order_date < \'2026-01-01\'',
      '  GROUP BY c.region',
      '  ORDER BY revenue DESC',
    ]
    sqlLines.forEach((line) => {
      const t = setTimeout(() => {
        addLine({ text: line, type: 'sql', s: 'sql' })
      }, delay)
      timeoutsRef.current.push(t)
      delay += 120
    })
    delay += 600

    // Stage 4: Results
    const t4 = setTimeout(() => {
      setStage('results')
      addLine({ text: '', type: 'blank' })
      addLine({ text: 'Executing query...', type: 'info', s: 'results' })
    }, delay)
    timeoutsRef.current.push(t4)
    delay += 800

    const t4b = setTimeout(() => {
      addLine({ text: '', type: 'blank' })
      addLine({ text: '  REGION      REVENUE', type: 'header', s: 'results' })
      addLine({ text: '  ─────────   ──────────', type: 'header', s: 'results' })
    }, delay)
    timeoutsRef.current.push(t4b)
    delay += 300

    const resultRows = [
      { text: '  West        $2,412,000', type: 'result', s: 'results' },
      { text: '  East        $1,845,000', type: 'result', s: 'results' },
      { text: '  Central     $1,203,000', type: 'result', s: 'results' },
    ]
    resultRows.forEach((row) => {
      const t = setTimeout(() => { addLine(row) }, delay)
      timeoutsRef.current.push(t)
      delay += 250
    })
    delay += 400

    // Done
    const t5 = setTimeout(() => {
      setStage('done')
      addLine({ text: '', type: 'blank' })
      addLine({ text: '3 rows returned.', type: 'success' })
    }, delay)
    timeoutsRef.current.push(t5)
  }, [addLine])

  const runAnimation = isAI ? runAnimationAI : runAnimationNonAI

  // Reset state when toggling modes
  const handleToggle = (newIsAI) => {
    if (newIsAI === isAI) return
    timeoutsRef.current.forEach(clearTimeout)
    timeoutsRef.current = []
    setIsAI(newIsAI)
    setStage('idle')
    setTerminalLines([])
    setSelectedStage(null)
  }

  const isRunning = stage !== 'idle' && stage !== 'done'

  const stageIdx = animStages.indexOf(stage)
  const getStageState = (s) => {
    const idx = animStages.indexOf(s)
    if (stage === 'idle') return 'idle'
    if (stage === 'done') return 'done'
    if (idx < stageIdx) return 'done'
    if (idx === stageIdx) return 'active'
    return 'idle'
  }

  const stageBoxStyle = (s) => {
    const st = getStageState(s)
    if (st === 'active') return { borderWidth: 2.5 }
    if (st === 'done') return { borderWidth: 1.5 }
    return { borderWidth: 1.5 }
  }

  const stageBoxOpacity = (s) => {
    const st = getStageState(s)
    if (st === 'active') return 1
    if (st === 'done') return 1
    if (stage === 'idle' || stage === 'done') return 1
    return 0.4
  }

  // Color mapping for terminal line highlighting
  const stageHighlightBg = {
    input: 'bg-green-50',
    connector: 'bg-orange-50',
    mcp: 'bg-pink-50',
    metricflow: 'bg-blue-50',
    sql: 'bg-amber-50',
    results: 'bg-purple-50',
  }

  return (
    <div className="space-y-6">
      {/* AI / Non-AI toggle */}
      <div className="flex justify-center">
        <div className="inline-flex bg-gray-100 rounded-xl p-1">
          <button
            onClick={() => handleToggle(false)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              !isAI ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Non-AI Workflow
          </button>
          <button
            onClick={() => handleToggle(true)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              isAI ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            AI Workflow
          </button>
        </div>
      </div>

      {/* Static flow diagram */}
      <AnimatePresence mode="wait">
        {isAI ? (
          <motion.div key="ai-flow" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
            <FlowDiagramAI />
          </motion.div>
        ) : (
          <motion.div key="nonai-flow" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
            <FlowDiagramNonAI />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Interactive animation */}
      <div>
        {/* Header + Run button */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Walk Through a Query
          </h3>
          <button
            onClick={runAnimation}
            disabled={isRunning}
            className={`px-5 py-2 rounded-lg font-medium text-sm transition-all duration-150 shrink-0 ${
              isRunning
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gray-900 text-white hover:bg-gray-800 active:bg-gray-950'
            }`}
          >
            {isRunning ? 'Running...' : stage === 'done' ? 'Run Again' : 'Run Query'}
          </button>
        </div>

        {/* Progress indicator */}
        <div className={`grid gap-3 mb-4`} style={{ gridTemplateColumns: `repeat(${progressSteps.length}, minmax(0, 1fr))` }}>
          {progressSteps.map((s) => {
            const st = getStageState(s.key)
            const isActive = st === 'active'
            const isDone = st === 'done'
            const isSelected = selectedStage === s.key
            const canClick = stage === 'done'
            return (
              <motion.div
                key={s.key}
                onClick={() => canClick && setSelectedStage(isSelected ? null : s.key)}
                animate={{
                  backgroundColor: (isActive || isDone) ? s.color.bg : '#f9fafb',
                  borderColor: isSelected ? s.color.activeBorder : isActive ? s.color.activeBorder : isDone ? s.color.border : '#e5e7eb',
                  opacity: stageBoxOpacity(s.key),
                  ...stageBoxStyle(s.key),
                }}
                whileHover={canClick ? { scale: 1.03, y: -2 } : {}}
                transition={{ duration: 0.4 }}
                className={`border rounded-xl px-3 py-2.5 text-center relative overflow-hidden ${canClick ? 'cursor-pointer' : ''} ${isSelected ? 'ring-2 shadow-sm' : ''}`}
                style={isSelected ? { ringColor: s.color.activeBorder } : {}}
              >
                {isActive && (
                  <motion.div
                    className="absolute inset-0 rounded-xl"
                    style={{ border: `2px solid ${s.color.activeBorder}` }}
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                )}
                <div className="flex items-center justify-center gap-1.5">
                  {isDone && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                      className="text-emerald-500 text-xs"
                    >&#x2713;</motion.span>
                  )}
                  {isActive && (
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="text-xs"
                      style={{ color: s.color.activeBorder }}
                    >&#x25E6;</motion.span>
                  )}
                  <span className="text-xs font-medium" style={{ color: (isActive || isDone) ? s.color.text : '#9ca3af' }}>
                    {s.label}
                  </span>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Terminal output */}
        <div ref={terminalRef} className="bg-white border border-gray-200 rounded-xl p-4 font-mono text-xs max-h-72 overflow-y-auto">
          <AnimatePresence>
            {terminalLines.map((line, i) => {
              const isHighlighted = selectedStage && line.s === selectedStage
              const isDimmed = selectedStage && line.s && line.s !== selectedStage
              const stageTextClass =
                line.type === 'command' ? 'text-emerald-700 font-bold' :
                line.type === 'success' ? 'text-emerald-700 font-bold' :
                line.type === 'blank' ? '' :
                line.s === 'input' ? 'text-green-700 font-bold' :
                line.s === 'connector' ? (line.type === 'info' ? 'text-orange-400' : 'text-orange-600') :
                line.s === 'mcp' ? (line.type === 'info' ? 'text-pink-400' : 'text-pink-600') :
                line.s === 'metricflow' ? (line.type === 'info' ? 'text-blue-400' : 'text-blue-600') :
                line.s === 'sql' ? (line.type === 'info' ? 'text-amber-400' : 'text-amber-700') :
                line.s === 'results' ? (line.type === 'info' ? 'text-purple-400' : line.type === 'header' ? 'text-purple-500 font-semibold' : 'text-purple-700 font-medium') :
                line.type === 'info' ? 'text-gray-400' :
                ''
              const bgClass = isHighlighted ? (
                `${stageHighlightBg[line.s] || ''} -mx-2 px-2 rounded`
              ) : ''
              return (
                <motion.div
                  key={`line-${i}`}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: isDimmed ? 0.3 : 1, y: 0 }}
                  transition={{ duration: 0.15 }}
                  className={`${stageTextClass} ${bgClass}`}
                >
                  {line.text || '\u00A0'}
                </motion.div>
              )
            })}
          </AnimatePresence>
          {terminalLines.length === 0 && (
            <div className="text-gray-400">Click "Run Query" to walk through a Semantic Layer query...</div>
          )}
        </div>

        {stage === 'done' && !selectedStage && (
          <div className="mt-3 text-center text-[10px] text-gray-400">
            Click any stage above to highlight its output.
          </div>
        )}
      </div>
    </div>
  )
}

/* ─── Tab 2: Problem It Solves ─── */
export function ProblemItSolves() {
  const [showWith, setShowWith] = useState(false)

  return (
    <div className="space-y-4">
      {/* Toggle */}
      <div className="flex justify-center">
        <div className="inline-flex bg-gray-100 rounded-xl p-1">
          <button
            onClick={() => setShowWith(false)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              !showWith ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Without Semantic Layer
          </button>
          <button
            onClick={() => setShowWith(true)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              showWith ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            With Semantic Layer
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!showWith ? (
          <motion.div
            key="without"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <WithoutSemanticLayer />
          </motion.div>
        ) : (
          <motion.div
            key="with"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <WithSemanticLayer />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function WithoutSemanticLayer() {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="text-center">
        <p className="text-sm text-gray-500">Every team writes their own queries. Same question, different answers.</p>
      </div>

      {/* Problems grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white border border-gray-200 rounded-xl p-5"
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="w-7 h-7 rounded-lg bg-red-50 border border-red-200 flex items-center justify-center text-red-600 text-xs font-bold">!</span>
            <h4 className="text-sm font-semibold text-gray-900">Hundreds of Tables</h4>
          </div>
          <p className="text-[11px] text-gray-500 leading-relaxed mb-3">
            Hundreds of tables, thousands of columns. No one knows which table is the "right" one for revenue.
          </p>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 font-mono text-[10px] text-gray-600">
            <div className="text-gray-400 mb-1">Where is revenue?</div>
            <div>fct_orders</div>
            <div>rpt_monthly_revenue</div>
            <div>finance_summary</div>
            <div>dashboard_sales_v2</div>
            <div>stg_stripe_payments</div>
            <div className="text-gray-400 mt-1">... 834 more tables</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.08 }}
          className="bg-white border border-gray-200 rounded-xl p-5"
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="w-7 h-7 rounded-lg bg-red-50 border border-red-200 flex items-center justify-center text-red-600 text-xs font-bold">!</span>
            <h4 className="text-sm font-semibold text-gray-900">Inconsistent Definitions</h4>
          </div>
          <p className="text-[11px] text-gray-500 leading-relaxed mb-3">
            Three teams, three definitions of "revenue." The board sees different numbers depending on who built the report.
          </p>
          <div className="space-y-2">
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-2.5 text-[10px]">
              <span className="font-semibold text-orange-800">Finance team:</span>
              <span className="text-gray-600 ml-1">SUM(amount) WHERE status != 'cancelled'</span>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-2.5 text-[10px]">
              <span className="font-semibold text-blue-800">Sales team:</span>
              <span className="text-gray-600 ml-1">SUM(amount), includes pending</span>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-2.5 text-[10px]">
              <span className="font-semibold text-purple-800">Exec dashboard:</span>
              <span className="text-gray-600 ml-1">SUM(net_amount) after returns</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.16 }}
          className="bg-white border border-gray-200 rounded-xl p-5"
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="w-7 h-7 rounded-lg bg-red-50 border border-red-200 flex items-center justify-center text-red-600 text-xs font-bold">!</span>
            <h4 className="text-sm font-semibold text-gray-900">Too Complex for LLMs</h4>
          </div>
          <p className="text-[11px] text-gray-500 leading-relaxed mb-3">
            Giving an LLM raw access to hundreds of tables and asking it to write SQL is too ambitious. It will hallucinate joins and invent metrics.
          </p>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-[10px] space-y-2">
            <div className="flex items-start gap-1.5 text-red-600">
              <span className="mt-0.5">&#x2717;</span>
              <span>LLM joins wrong tables together</span>
            </div>
            <div className="flex items-start gap-1.5 text-red-600">
              <span className="mt-0.5">&#x2717;</span>
              <span>Makes up filter conditions</span>
            </div>
            <div className="flex items-start gap-1.5 text-red-600">
              <span className="mt-0.5">&#x2717;</span>
              <span>Invents metrics that don't exist</span>
            </div>
            <div className="flex items-start gap-1.5 text-red-600">
              <span className="mt-0.5">&#x2717;</span>
              <span>Confident but wrong</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

function WithSemanticLayer() {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="text-center">
        <p className="text-sm text-gray-500">One place to define every metric. Every consumer gets the same governed answer.</p>
      </div>

      {/* Solutions grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white border border-gray-200 rounded-xl p-5"
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 text-xs font-bold">&#x2713;</span>
            <h4 className="text-sm font-semibold text-gray-900">Curated, Certified Tables</h4>
          </div>
          <p className="text-[11px] text-gray-500 leading-relaxed mb-3">
            Instead of 800+ tables, you hand-pick only the validated, production-ready models to expose. Consumers never see the rest.
          </p>
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 font-mono text-[10px] text-emerald-800">
            <div className="text-emerald-600 mb-1">Exposed to Semantic Layer:</div>
            <div className="flex items-center gap-1.5"><span className="text-emerald-500">&#x2713;</span> fct_orders</div>
            <div className="flex items-center gap-1.5"><span className="text-emerald-500">&#x2713;</span> dim_customers</div>
            <div className="flex items-center gap-1.5"><span className="text-emerald-500">&#x2713;</span> fct_subscriptions</div>
            <div className="flex items-center gap-1.5"><span className="text-emerald-500">&#x2713;</span> dim_products</div>
            <div className="text-gray-400 mt-1.5 text-[9px]">836 other tables unused</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.08 }}
          className="bg-white border border-gray-200 rounded-xl p-5"
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 text-xs font-bold">&#x2713;</span>
            <h4 className="text-sm font-semibold text-gray-900">No Ambiguity</h4>
          </div>
          <p className="text-[11px] text-gray-500 leading-relaxed mb-3">
            Revenue means exactly one thing. The definition is authoritative and version-controlled. Changes go through code review.
          </p>
          <div className="space-y-2">
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-2.5 text-[10px]">
              <span className="font-semibold text-emerald-800">Finance team:</span>
              <span className="text-gray-600 ml-1">queries <code className="bg-white px-1 rounded text-emerald-700 font-mono">revenue</code></span>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-2.5 text-[10px]">
              <span className="font-semibold text-emerald-800">Sales team:</span>
              <span className="text-gray-600 ml-1">queries <code className="bg-white px-1 rounded text-emerald-700 font-mono">revenue</code></span>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-2.5 text-[10px]">
              <span className="font-semibold text-emerald-800">Exec dashboard:</span>
              <span className="text-gray-600 ml-1">queries <code className="bg-white px-1 rounded text-emerald-700 font-mono">revenue</code></span>
            </div>
            <div className="text-center text-[10px] text-emerald-600 font-medium mt-1">Same metric → same number → same answer</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.16 }}
          className="bg-white border border-gray-200 rounded-xl p-5"
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 text-xs font-bold">&#x2713;</span>
            <h4 className="text-sm font-semibold text-gray-900">LLM Guardrails</h4>
          </div>
          <p className="text-[11px] text-gray-500 leading-relaxed mb-3">
            LLMs don't write raw SQL. They query well-defined metrics with clear dimensions and filters. Guardrails are built in.
          </p>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-[10px] space-y-2">
            <div className="flex items-start gap-1.5 text-emerald-600">
              <span className="mt-0.5">&#x2713;</span>
              <span>Can only query declared metrics</span>
            </div>
            <div className="flex items-start gap-1.5 text-emerald-600">
              <span className="mt-0.5">&#x2713;</span>
              <span>Dimensions are pre-defined</span>
            </div>
            <div className="flex items-start gap-1.5 text-emerald-600">
              <span className="mt-0.5">&#x2713;</span>
              <span>Filters validated at query time</span>
            </div>
            <div className="flex items-start gap-1.5 text-emerald-600">
              <span className="mt-0.5">&#x2713;</span>
              <span>Reduces risk of hallucinating a metric</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

/* ─── Tab 3: How It's Configured ─── */

// DAG constants (matching StateAwareOrchestration style)
const cfgNodeW = 140
const cfgNodeH = 32

const cfgTypeColors = {
  staging: { bg: '#dbeafe', border: '#93c5fd', text: '#1e3a5f' },
  intermediate: { bg: '#dbeafe', border: '#93c5fd', text: '#1e3a5f' },
  mart: { bg: '#dbeafe', border: '#93c5fd', text: '#1e3a5f' },
  semantic: { bg: '#fdf2f8', border: '#f9a8d4', text: '#9d174d' },
  metric: { bg: '#fefce8', border: '#fde68a', text: '#78350f' },
}

function cfgEdgePath(fromNode, toNode, nw = cfgNodeW, nh = cfgNodeH) {
  const fx = fromNode.x + nw, fy = fromNode.y + nh / 2
  const tx = toNode.x, ty = toNode.y + nh / 2
  const mx = (fx + tx) / 2
  return `M ${fx} ${fy} C ${mx} ${fy}, ${mx} ${ty}, ${tx} ${ty}`
}

// Step 1 DAG: project lineage with semantic layer models branching off gold
const dagNodes = [
  { id: 'stg_orders', label: 'stg_orders', type: 'staging', x: 10, y: 10 },
  { id: 'stg_products', label: 'stg_products', type: 'staging', x: 10, y: 68 },
  { id: 'stg_customers', label: 'stg_customers', type: 'staging', x: 10, y: 140 },
  { id: 'int_order_items', label: 'int_order_items', type: 'intermediate', x: 195, y: 39 },
  { id: 'fct_orders', label: 'fct_orders', type: 'mart', x: 385, y: 25 },
  { id: 'dim_customers', label: 'dim_customers', type: 'mart', x: 385, y: 120 },
  { id: 'sem_orders', label: 'sem_orders', type: 'semantic', x: 575, y: 25 },
  { id: 'sem_customers', label: 'sem_customers', type: 'semantic', x: 575, y: 120 },
]

const dagEdges = [
  { from: 'stg_orders', to: 'int_order_items' },
  { from: 'stg_products', to: 'int_order_items' },
  { from: 'stg_customers', to: 'dim_customers' },
  { from: 'int_order_items', to: 'fct_orders' },
  { from: 'fct_orders', to: 'sem_orders', dashed: true },
  { from: 'dim_customers', to: 'sem_customers', dashed: true },
]

// Step 4 metric lineage DAG
const metricNodes = [
  { id: 'sem_orders_m', label: 'sem_orders', type: 'semantic', x: 10, y: 10 },
  { id: 'revenue', label: 'revenue', type: 'metric', x: 210, y: 10 },
  { id: 'sem_customers_m', label: 'sem_customers', type: 'semantic', x: 10, y: 58 },
  { id: 'customer_count', label: 'customer_count', type: 'metric', x: 210, y: 58 },
]

const metricEdges = [
  { from: 'sem_orders_m', to: 'revenue' },
  { from: 'sem_customers_m', to: 'customer_count' },
]

// Shared DAG renderer with hover support
function DagSvg({ nodes, edges, width, height, labels, nodeW = cfgNodeW, nodeH = cfgNodeH }) {
  const [hovered, setHovered] = useState(null)
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 overflow-x-auto">
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
        {edges.map((edge) => {
          const from = nodes.find(n => n.id === edge.from)
          const to = nodes.find(n => n.id === edge.to)
          return (
            <path
              key={`${edge.from}-${edge.to}`}
              d={cfgEdgePath(from, to, nodeW, nodeH)}
              fill="none"
              stroke="#d1d5db"
              strokeWidth={2}
              strokeDasharray={edge.dashed ? '6 4' : undefined}
            />
          )
        })}
        {nodes.map((node) => {
          const colors = cfgTypeColors[node.type]
          const isSemantic = node.type === 'semantic'
          const isMetric = node.type === 'metric'
          const isHovered = hovered === node.id
          return (
            <motion.g
              key={node.id}
              onMouseEnter={() => setHovered(node.id)}
              onMouseLeave={() => setHovered(null)}
              animate={{ y: isHovered ? -3 : 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              style={{ cursor: 'pointer' }}
            >
              <rect
                x={node.x} y={node.y} width={nodeW} height={nodeH} rx={8}
                fill={colors.bg} stroke={colors.border}
                strokeWidth={(isSemantic || isMetric) ? 2 : 1.5}
              />
              {isHovered && (
                <rect
                  x={node.x - 1} y={node.y - 1} width={nodeW + 2} height={nodeH + 2} rx={9}
                  fill="none" stroke={colors.border} strokeWidth={2} opacity={0.6}
                />
              )}
              <text
                x={node.x + nodeW / 2} y={node.y + nodeH / 2 + 1}
                textAnchor="middle" dominantBaseline="middle"
                fontSize={node.label.length > 13 ? 9 : 11}
                fontFamily="ui-monospace, monospace" fontWeight={600}
                fill={colors.text}
              >
                {node.label}
              </text>
            </motion.g>
          )
        })}
        {labels && labels.map((lbl) => (
          <text key={lbl.text} x={lbl.x} y={lbl.y} textAnchor="middle" fontSize={10} fill="#9ca3af" fontWeight={500}>{lbl.text}</text>
        ))}
      </svg>
    </div>
  )
}

/* Validate Animation sub-component */
function ValidateAnimation() {
  const [lines, setLines] = useState([])
  const [isRunning, setIsRunning] = useState(false)
  const [hasRun, setHasRun] = useState(false)
  const timeoutsRef = useRef([])
  const termRef = useRef(null)

  const addLine = useCallback((line) => {
    setLines(prev => [...prev, line])
    setTimeout(() => {
      if (termRef.current) termRef.current.scrollTop = termRef.current.scrollHeight
    }, 50)
  }, [])

  const run = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout)
    timeoutsRef.current = []
    setLines([])
    setIsRunning(true)
    setHasRun(true)

    const schedule = (fn, delay) => {
      const t = setTimeout(fn, delay)
      timeoutsRef.current.push(t)
    }

    let d = 200
    schedule(() => addLine({ text: '$ dbt sl validate', type: 'command' }), d)
    d += 800

    schedule(() => {
      addLine({ text: '', type: 'blank' })
      addLine({ text: 'Validating semantic models...', type: 'info' })
    }, d)
    d += 600

    const modelChecks = [
      "  \u2713 sem_orders: ref('fct_orders') exists",
      "  \u2713 sem_customers: ref('dim_customers') exists",
      "  \u2713 sem_orders: primary key 'order_id' is unique",
      "  \u2713 sem_orders: foreign key 'customer_id' \u2192 sem_customers",
      "  \u2713 sem_customers: primary key 'customer_id' is unique",
    ]
    modelChecks.forEach(text => {
      schedule(() => addLine({ text, type: 'ok' }), d)
      d += 450
    })

    schedule(() => {
      addLine({ text: '', type: 'blank' })
      addLine({ text: 'Validating dimensions...', type: 'info' })
    }, d)
    d += 600

    const dimChecks = [
      '  \u2713 order_date (time, day granularity)',
      '  \u2713 region (categorical)',
      '  \u2713 customer_segment (categorical)',
    ]
    dimChecks.forEach(text => {
      schedule(() => addLine({ text, type: 'ok' }), d)
      d += 400
    })

    schedule(() => {
      addLine({ text: '', type: 'blank' })
      addLine({ text: 'Validating metrics...', type: 'info' })
    }, d)
    d += 600

    const metricChecks = [
      '  \u2713 revenue \u2192 compiles to valid SQL',
      '  \u2713 customer_count \u2192 compiles to valid SQL',
    ]
    metricChecks.forEach(text => {
      schedule(() => addLine({ text, type: 'ok' }), d)
      d += 400
    })

    d += 500
    schedule(() => {
      setIsRunning(false)
      addLine({ text: '', type: 'blank' })
      addLine({ text: 'All checks passed. 2 semantic models, 3 dimensions, 2 metrics validated.', type: 'success' })
    }, d)
  }, [addLine])

  return (
    <div>
      <div className="flex justify-end mb-3">
        <button onClick={run} disabled={isRunning}
          className={`px-4 py-1.5 rounded-lg font-medium text-xs transition-all duration-150 ${
            isRunning ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gray-900 text-white hover:bg-gray-800'
          }`}
        >
          {isRunning ? 'Running...' : hasRun ? 'Run Again' : 'Run Validation'}
        </button>
      </div>
      <div ref={termRef} className="bg-white border border-gray-200 rounded-lg p-4 font-mono text-[11px] leading-relaxed max-h-56 overflow-y-auto">
        <AnimatePresence>
          {lines.map((line, i) => (
            <motion.div key={`v-${i}`} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.15 }}
              className={
                line.type === 'command' ? 'text-emerald-700 font-bold' :
                line.type === 'info' ? 'text-gray-400' :
                line.type === 'ok' ? 'text-emerald-600' :
                line.type === 'success' ? 'text-emerald-700 font-bold' : ''
              }
            >
              {line.text || '\u00A0'}
            </motion.div>
          ))}
        </AnimatePresence>
        {lines.length === 0 && (
          <div className="text-gray-400">Click "Run Validation" to validate your Semantic Layer configuration...</div>
        )}
      </div>
    </div>
  )
}

const gitNodes = [
  { id: 'feature', label: '', x: 120, y: 55, color: '#a855f7', textColor: '#7c3aed' },
  { id: 'ci', label: 'CI', x: 240, y: 55, color: '#3b82f6', textColor: '#1d4ed8' },
  { id: 'review', label: 'Review', x: 330, y: 55, color: '#f59e0b', textColor: '#b45309' },
  { id: 'merge', label: 'merge', x: 430, y: 20, color: '#22c55e', textColor: '#16a34a', r: 6 },
]

function GitBranchDiagram() {
  const [hovered, setHovered] = useState(null)
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 overflow-x-auto">
      <svg width="580" height="80" viewBox="0 0 580 80" className="w-full h-auto">
        {/* Main branch line */}
        <line x1={20} y1={20} x2={560} y2={20} stroke="#d1d5db" strokeWidth={2} />
        <text x={20} y={12} fontSize={9} fill="#9ca3af" fontWeight={500}>main</text>

        {/* Feature branch lines */}
        <path d="M 80 20 C 100 20, 100 55, 120 55" fill="none" stroke="#a855f7" strokeWidth={2} />
        <line x1={120} y1={55} x2={400} y2={55} stroke="#a855f7" strokeWidth={2} />
        <path d="M 400 55 C 415 55, 415 20, 430 20" fill="none" stroke="#a855f7" strokeWidth={2} />

        {/* Branch-off dot on main */}
        <circle cx={80} cy={20} r={4} fill="#d1d5db" />

        {/* Post-merge dot on main */}
        <circle cx={500} cy={20} r={4} fill="#d1d5db" />

        {/* Interactive nodes */}
        {gitNodes.map((node) => {
          const isH = hovered === node.id
          const r = node.r || 5
          return (
            <motion.g
              key={node.id}
              onMouseEnter={() => setHovered(node.id)}
              onMouseLeave={() => setHovered(null)}
              animate={{ y: isH ? -3 : 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              style={{ cursor: 'pointer' }}
            >
              <circle cx={node.x} cy={node.y} r={isH ? r + 2 : r} fill={node.color} />
              {isH && (
                <circle cx={node.x} cy={node.y} r={r + 5} fill="none" stroke={node.color} strokeWidth={1.5} opacity={0.3} />
              )}
              {node.label && (
                <text
                  x={node.x} y={node.y - (r + 6)}
                  textAnchor="middle" fontSize={8} fill={node.textColor} fontWeight={600}
                >
                  {node.label}
                </text>
              )}
            </motion.g>
          )
        })}

        {/* Feature branch label */}
        <text x={120} y={72} textAnchor="middle" fontSize={9} fill="#a855f7" fontWeight={500}>feature/add-metric</text>

        {/* Live indicator */}
        <rect x={470} y={10} width={80} height={20} rx={10} fill="#dcfce7" stroke="#86efac" strokeWidth={1} />
        <text x={510} y={23} textAnchor="middle" fontSize={8} fill="#166534" fontWeight={600}>metrics live</text>
      </svg>
    </div>
  )
}

export function HowItsConfigured() {
  const [activeStep, setActiveStep] = useState(0)

  const steps = [
    { number: '1', title: 'Select Your Tables', desc: 'Tell dbt which models you want to expose to the Semantic Layer.', color: 'blue' },
    { number: '2', title: 'Define Relationships', desc: 'Declare primary and foreign keys so MetricFlow knows how to join tables.', color: 'purple' },
    { number: '3', title: 'Add Dimensions', desc: 'Specify the columns users can group by and filter on.', color: 'amber' },
    { number: '4', title: 'Define Metrics', desc: 'Declare how each metric is calculated.', color: 'emerald' },
    { number: '5', title: 'Saved Queries (Optional)', desc: 'Pre-build specific metric queries for faster BI performance and easier integrations.', color: 'cyan' },
    { number: '6', title: 'Validate', desc: 'Run Semantic Layer validation to catch issues before deployment.', color: 'orange' },
    { number: '7', title: 'Code Review & Deploy', desc: 'Push through your normal PR process. Same review, same CI, same guardrails.', color: 'gray' },
  ]

  const colorMap = {
    blue: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', badge: 'bg-blue-100 text-blue-800 border-blue-300' },
    purple: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', badge: 'bg-purple-100 text-purple-800 border-purple-300' },
    amber: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', badge: 'bg-amber-100 text-amber-800 border-amber-300' },
    emerald: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', badge: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
    cyan: { bg: 'bg-cyan-50', border: 'border-cyan-200', text: 'text-cyan-700', badge: 'bg-cyan-100 text-cyan-800 border-cyan-300' },
    orange: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', badge: 'bg-orange-100 text-orange-800 border-orange-300' },
    gray: { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-700', badge: 'bg-gray-100 text-gray-800 border-gray-300' },
  }

  const step = steps[activeStep]
  const colors = colorMap[step.color]

  const renderStepContent = () => {
    switch (activeStep) {
      /* Step 1: DAG with semantic models highlighted */
      case 0:
        return (
          <div className="space-y-3">
            <DagSvg
              nodes={dagNodes}
              edges={dagEdges}
              width={730}
              height={195}
              labels={[
                { text: 'Staging', x: 80, y: 190 },
                { text: 'Intermediate', x: 265, y: 190 },
                { text: 'Marts', x: 455, y: 190 },
                { text: 'Semantic Layer', x: 645, y: 190 },
              ]}
            />
          </div>
        )

      /* Step 2: Entities YAML (v2.0 spec) */
      case 1:
        return (
          <div className="space-y-3">
            <div className="bg-white border border-gray-200 rounded-lg p-4 font-mono text-[11px] leading-relaxed overflow-x-auto">
              <div className="text-gray-500 text-[10px] mb-2">models/marts/_models.yml</div>
              <div className="text-gray-700">
                <div><span className="text-blue-600">models:</span></div>
                <div>  - <span className="text-blue-600">name:</span> fct_orders</div>
                <div>    <span className="text-blue-600">semantic_model:</span></div>
                <div>      <span className="text-blue-600">enabled:</span> <span className="text-emerald-600">true</span></div>
                <div>      <span className="text-blue-600">agg_time_dimension:</span> order_date</div>
                <div>      <span className="text-blue-600">columns:</span></div>
                <div>        - <span className="text-blue-600">name:</span> order_id</div>
                <div>          <span className="text-blue-600">entity:</span></div>
                <div>            <span className="text-blue-600">type:</span> <span className="text-purple-600 font-semibold">primary</span>    <span className="text-gray-400"># unique row ID</span></div>
                <div className="text-gray-300 select-none">&nbsp;</div>
                <div>        - <span className="text-blue-600">name:</span> customer_id</div>
                <div>          <span className="text-blue-600">entity:</span></div>
                <div>            <span className="text-blue-600">type:</span> <span className="text-purple-600 font-semibold">foreign</span>    <span className="text-gray-400"># join key</span></div>
                <div>            <span className="text-blue-600">name:</span> customer</div>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="bg-purple-50 border border-purple-200 rounded-lg px-3 py-2 text-[10px] flex items-center gap-1.5">
                <span className="font-mono font-bold text-purple-700">primary</span>
                <span className="text-gray-500">= unique identifier for each row</span>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-lg px-3 py-2 text-[10px] flex items-center gap-1.5">
                <span className="font-mono font-bold text-purple-700">foreign</span>
                <span className="text-gray-500">= auto-joins to another semantic model</span>
              </div>
            </div>
          </div>
        )

      /* Step 3: Dimensions YAML (v2.0 spec) */
      case 2:
        return (
          <div className="space-y-3">
            <div className="bg-white border border-gray-200 rounded-lg p-4 font-mono text-[11px] leading-relaxed overflow-x-auto">
              <div className="text-gray-500 text-[10px] mb-2">Inside semantic_model.columns:</div>
              <div className="text-gray-700">
                <div>      <span className="text-blue-600">columns:</span></div>
                <div>        - <span className="text-blue-600">name:</span> order_date</div>
                <div>          <span className="text-blue-600">dimension:</span></div>
                <div>            <span className="text-blue-600">type:</span> <span className="text-amber-600 font-semibold">time</span></div>
                <div>          <span className="text-blue-600">granularity:</span> <span className="text-amber-600">day</span>       <span className="text-gray-400"># smallest queryable grain</span></div>
                <div className="text-gray-300 select-none">&nbsp;</div>
                <div>        - <span className="text-blue-600">name:</span> region</div>
                <div>          <span className="text-blue-600">dimension:</span></div>
                <div>            <span className="text-blue-600">type:</span> <span className="text-amber-600 font-semibold">categorical</span>  <span className="text-gray-400"># group-by / filter</span></div>
                <div className="text-gray-300 select-none">&nbsp;</div>
                <div>        - <span className="text-blue-600">name:</span> order_status</div>
                <div>          <span className="text-blue-600">dimension:</span></div>
                <div>            <span className="text-blue-600">type:</span> <span className="text-amber-600 font-semibold">categorical</span></div>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-[10px] flex items-center gap-1.5">
                <span className="font-mono font-bold text-amber-700">time</span>
                <span className="text-gray-500">= enables date filtering &amp; time grains (day, month, quarter)</span>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-[10px] flex items-center gap-1.5">
                <span className="font-mono font-bold text-amber-700">categorical</span>
                <span className="text-gray-500">= group by and filter on discrete values</span>
              </div>
            </div>
          </div>
        )

      /* Step 4: Metrics (v2.0 spec — simple metrics live in-model, advanced at top level) */
      case 3:
        return (
          <div className="space-y-3">
            <div className="bg-white border border-gray-200 rounded-lg p-4 font-mono text-[11px] leading-relaxed overflow-x-auto">
              <div className="text-gray-500 text-[10px] mb-2">Simple metrics (defined where the data lives)</div>
              <div className="text-gray-700">
                <div>    <span className="text-blue-600">semantic_model:</span></div>
                <div>      <span className="text-blue-600">metrics:</span></div>
                <div>        - <span className="text-blue-600">name:</span> <span className="text-emerald-700 font-semibold">revenue</span></div>
                <div>          <span className="text-blue-600">type:</span> <span className="text-emerald-600 font-semibold">simple</span></div>
                <div>          <span className="text-blue-600">agg:</span> <span className="text-emerald-600">sum</span></div>
                <div>          <span className="text-blue-600">expr:</span> amount</div>
                <div className="text-gray-300 select-none">&nbsp;</div>
                <div>        - <span className="text-blue-600">name:</span> <span className="text-emerald-700 font-semibold">order_count</span></div>
                <div>          <span className="text-blue-600">type:</span> <span className="text-emerald-600 font-semibold">simple</span></div>
                <div>          <span className="text-blue-600">agg:</span> <span className="text-emerald-600">count</span></div>
                <div>          <span className="text-blue-600">expr:</span> 1</div>
              </div>
              <div className="border-t border-gray-200 mt-3 pt-3">
                <div className="text-gray-500 text-[10px] mb-2">Advanced metrics (combine metrics across models)</div>
                <div className="text-gray-700">
                  <div><span className="text-blue-600">metrics:</span>   <span className="text-gray-400"># top-level key</span></div>
                  <div>  - <span className="text-blue-600">name:</span> <span className="text-emerald-700 font-semibold">revenue_per_customer</span></div>
                  <div>    <span className="text-blue-600">type:</span> <span className="text-emerald-600 font-semibold">ratio</span></div>
                  <div>    <span className="text-blue-600">numerator:</span> revenue</div>
                  <div>    <span className="text-blue-600">denominator:</span> customer_count</div>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2 text-[10px] flex items-center gap-1.5">
                <span className="font-mono font-bold text-emerald-700">simple</span>
                <span className="text-gray-500">= wraps one aggregation (sum, count, avg)</span>
              </div>
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2 text-[10px] flex items-center gap-1.5">
                <span className="font-mono font-bold text-emerald-700">ratio</span>
                <span className="text-gray-500">= numerator / denominator</span>
              </div>
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2 text-[10px] flex items-center gap-1.5">
                <span className="font-mono font-bold text-emerald-700">derived</span>
                <span className="text-gray-500">= combine metrics with math</span>
              </div>
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2 text-[10px] flex items-center gap-1.5">
                <span className="font-mono font-bold text-emerald-700">cumulative</span>
                <span className="text-gray-500">= running totals (MTD, YTD)</span>
              </div>
            </div>
          </div>
        )

      /* Step 5: Saved Queries (optional) */
      case 4:
        return (
          <div className="space-y-3">
            <div className="bg-white border border-gray-200 rounded-lg p-4 font-mono text-[11px] leading-relaxed overflow-x-auto">
              <div className="text-gray-500 text-[10px] mb-2">saved_queries.yml</div>
              <div className="text-gray-700">
                <div><span className="text-blue-600">saved_queries:</span></div>
                <div>  - <span className="text-blue-600">name:</span> <span className="text-cyan-700 font-semibold">revenue_by_region</span></div>
                <div>    <span className="text-blue-600">description:</span> <span className="text-gray-500">"Regional revenue breakdown for exec dashboards"</span></div>
                <div>    <span className="text-blue-600">query_params:</span></div>
                <div>      <span className="text-blue-600">metrics:</span></div>
                <div>        - revenue</div>
                <div>      <span className="text-blue-600">group_by:</span></div>
                <div>        - Dimension('customer__region')</div>
                <div>        - TimeDimension('order__order_date', 'month')</div>
                <div>    <span className="text-blue-600">exports:</span></div>
                <div>      - <span className="text-blue-600">name:</span> <span className="text-cyan-700 font-semibold">revenue_by_region_monthly</span></div>
                <div>        <span className="text-blue-600">config:</span></div>
                <div>          <span className="text-blue-600">export_as:</span> <span className="text-cyan-600 font-semibold">table</span></div>
                <div>          <span className="text-blue-600">schema:</span> analytics</div>
                <div>          <span className="text-blue-600">cache:</span></div>
                <div>            <span className="text-blue-600">enabled:</span> <span className="text-cyan-600 font-semibold">true</span>       <span className="text-gray-400"># declarative cache for fast BI reads</span></div>
              </div>
            </div>
            <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4 text-[11px] space-y-2">
              <div className="font-semibold text-cyan-800 text-xs mb-1">Why saved queries?</div>
              <div className="text-gray-600">Metrics stay centrally defined, but BI tools (Tableau, Looker, etc.) can read from a pre-built, cached table instead of running a live query every time. This gives you:</div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2">
                <div className="bg-white border border-cyan-200 rounded-lg px-3 py-2 text-[10px]">
                  <span className="font-semibold text-cyan-700">Faster dashboards</span>
                  <div className="text-gray-500 mt-0.5">Declarative cache means BI reads pre-computed results</div>
                </div>
                <div className="bg-white border border-cyan-200 rounded-lg px-3 py-2 text-[10px]">
                  <span className="font-semibold text-cyan-700">Centralized logic</span>
                  <div className="text-gray-500 mt-0.5">The metric definition still lives in one place</div>
                </div>
                <div className="bg-white border border-cyan-200 rounded-lg px-3 py-2 text-[10px]">
                  <span className="font-semibold text-cyan-700">Simpler integrations</span>
                  <div className="text-gray-500 mt-0.5">Any tool that can read a table can consume the metric</div>
                </div>
              </div>
            </div>
          </div>
        )

      /* Step 6: Validate animation */
      case 5:
        return <ValidateAnimation />

      /* Step 7: Code review & deploy visual */
      case 6:
        return (
          <div className="space-y-4">
            {/* Pipeline flow */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
              {/* Push */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.03, y: -2 }}
                transition={{ duration: 0.3 }}
                className="bg-purple-50 border border-purple-200 rounded-lg p-3 cursor-pointer"
              >
                <div className="text-[10px] font-semibold text-purple-700 mb-2 flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded bg-purple-200 flex items-center justify-center text-[8px] font-bold text-purple-700">1</span>
                  Push
                </div>
                <div className="font-mono text-[9px] text-purple-600 space-y-0.5">
                  <div className="text-emerald-600">+ sem_orders.yml</div>
                  <div className="text-emerald-600">+ sem_customers.yml</div>
                  <div className="text-emerald-600">+ 2 metrics</div>
                </div>
                <div className="text-[8px] text-purple-400 mt-1.5 font-mono">feature/add-metric</div>
              </motion.div>

              {/* CI Pipeline */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.03, y: -2 }}
                transition={{ duration: 0.3, delay: 0.08 }}
                className="bg-blue-50 border border-blue-200 rounded-lg p-3 cursor-pointer"
              >
                <div className="text-[10px] font-semibold text-blue-700 mb-2 flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded bg-blue-200 flex items-center justify-center text-[8px] font-bold text-blue-700">2</span>
                  CI Pipeline
                </div>
                <div className="text-[9px] space-y-1">
                  <div className="text-emerald-600 flex items-center gap-1">
                    <span>&#x2713;</span> dbt build
                  </div>
                  <div className="text-emerald-600 flex items-center gap-1">
                    <span>&#x2713;</span> dbt sl validate
                  </div>
                  <div className="text-emerald-600 flex items-center gap-1">
                    <span>&#x2713;</span> All tests pass
                  </div>
                </div>
              </motion.div>

              {/* PR Review */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.03, y: -2 }}
                transition={{ duration: 0.3, delay: 0.16 }}
                className="bg-amber-50 border border-amber-200 rounded-lg p-3 cursor-pointer"
              >
                <div className="text-[10px] font-semibold text-amber-700 mb-2 flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded bg-amber-200 flex items-center justify-center text-[8px] font-bold text-amber-700">3</span>
                  Code Review
                </div>
                <div className="text-[9px] text-gray-600 space-y-1">
                  <div>Teammate reviews metric</div>
                  <div>definitions and entities</div>
                  <div className="text-emerald-600 font-medium flex items-center gap-1 mt-1">
                    <span>&#x2713;</span> Approved
                  </div>
                </div>
              </motion.div>

              {/* Merged */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.03, y: -2 }}
                transition={{ duration: 0.3, delay: 0.24 }}
                className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 cursor-pointer"
              >
                <div className="text-[10px] font-semibold text-emerald-700 mb-2 flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded bg-emerald-200 flex items-center justify-center text-[8px] font-bold text-emerald-700">4</span>
                  Merged
                </div>
                <div className="text-[9px] space-y-1">
                  <div className="text-gray-600">Merged to <span className="font-mono font-semibold">main</span></div>
                  <div className="text-emerald-700 font-semibold mt-1">Metrics are live!</div>
                  <div className="text-gray-400 text-[8px]">Available via MCP, APIs, JDBC</div>
                </div>
              </motion.div>
            </div>

            {/* Visual git flow */}
            <GitBranchDiagram />
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="space-y-4">
      <div className="text-center">
        <p className="text-sm text-gray-500">In the same repo where you define your models and docs, you tell dbt about your metrics.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4">
        {/* Step list */}
        <div className="space-y-2">
          {steps.map((s, idx) => {
            const c = colorMap[s.color]
            return (
              <motion.button
                key={idx}
                onClick={() => setActiveStep(idx)}
                whileHover={{ scale: 1.02 }}
                className={`w-full text-left px-4 py-3 rounded-xl border transition-all duration-200 ${
                  activeStep === idx
                    ? `${c.bg} ${c.border} shadow-sm`
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border ${
                    activeStep === idx ? c.badge : 'bg-gray-100 text-gray-500 border-gray-300'
                  }`}>
                    {s.number}
                  </span>
                  <div>
                    <div className={`text-sm font-medium ${activeStep === idx ? c.text : 'text-gray-700'}`}>{s.title}</div>
                    {activeStep === idx && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="text-[10px] text-gray-500 mt-0.5"
                      >
                        {s.desc}
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.button>
            )
          })}
        </div>

        {/* Step content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className={`${colors.bg} border ${colors.border} rounded-xl p-5`}
          >
            <div className="flex items-center gap-2 mb-3">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border ${colors.badge}`}>
                {step.number}
              </span>
              <h4 className={`text-sm font-semibold ${colors.text}`}>{step.title}</h4>
            </div>
            {renderStepContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

/* ─── Main Component ─── */
export default function SemanticLayer() {
  const [activeTab, setActiveTab] = useState('how')

  return (
    <div className="section-container py-8">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">dbt Semantic Layer</h2>
        <div className="inline-flex bg-gray-100 rounded-xl p-1 mt-4">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === tab.key
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-5 text-center">
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.2 }}>
            <p className="text-sm text-gray-500">{tabDescs[activeTab]}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="bg-white border border-gray-200/60 rounded-2xl p-6 shadow-sm">
        <AnimatePresence mode="wait">
          {activeTab === 'how' && (
            <motion.div key="how" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
              <HowItWorks />
            </motion.div>
          )}
          {activeTab === 'problem' && (
            <motion.div key="problem" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
              <ProblemItSolves />
            </motion.div>
          )}
          {activeTab === 'config' && (
            <motion.div key="config" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
              <HowItsConfigured />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
