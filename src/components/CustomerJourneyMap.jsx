import { useState } from 'react'
import { motion } from 'framer-motion'

const phases = [
  {
    id: 0,
    label: 'Phase 0',
    title: 'Fragmented\n& Reactive',
    bullets: [
      'Siloed transformations',
      'Low data trust',
      'High dashboard maintenance',
      'Rising warehouse costs',
    ],
    color: '#E8D5F5',       // lilac
    colorDim: '#f3ecf8',
    textColor: '#4a1d6e',
  },
  {
    id: 1,
    label: 'Phase 1',
    title: 'Standardized\nFoundation',
    bullets: [
      'Modular development patterns',
      'Governance & documentation',
      'Built-in data quality & testing',
      'CI/CD & version control',
    ],
    color: '#7BA3D9',       // blue
    colorDim: '#c5d6ed',
    textColor: '#1a3a5c',
  },
  {
    id: 2,
    label: 'Phase 2',
    title: 'Scaled\n& Governed',
    bullets: [
      'Org-wide standards',
      'Cost optimization',
      'Self-service development',
      'Semantic layer enablement',
    ],
    color: '#F5D76E',       // gold
    colorDim: '#faedb8',
    textColor: '#5c4a0e',
  },
  {
    id: 3,
    label: 'Phase 3',
    title: 'AI-Ready\nOrganization',
    bullets: [
      'Trusted training data',
      'Predictive use cases',
      'Agentic workflows',
      'Personalized customer experiences',
    ],
    color: '#F97316',       // orange
    colorDim: '#fcc89b',
    textColor: '#7c2d12',
    gradient: 'linear-gradient(135deg, #F97316, #ef4444)',
  },
]

// Step heights: phase 0 is shortest, phase 3 is tallest (staircase going up)
const stepHeights = [120, 190, 260, 340]
const stepWidth = 190
const chartPadding = { left: 60, top: 60, right: 20, bottom: 50 }
const totalWidth = chartPadding.left + stepWidth * 4 + chartPadding.right
const totalHeight = chartPadding.top + 340 + chartPadding.bottom

export default function CustomerJourneyMap({
  highlightedPhase = null,
  togglePhases = null,
  showToggle = true,
  title = 'Customer journey map',
}) {
  const [hoveredPhase, setHoveredPhase] = useState(null)

  // null = all highlighted, number = that phase highlighted
  const [localHighlight, setLocalHighlight] = useState(
    highlightedPhase !== null ? highlightedPhase : null
  )

  const activePhase = highlightedPhase !== null ? highlightedPhase : localHighlight

  // Always show all 4 phase buttons
  const toggleOptions = togglePhases || [0, 1, 2, 3]

  const handleToggle = (phaseId) => {
    // Click same phase again → deselect (show all)
    if (localHighlight === phaseId) {
      setLocalHighlight(null)
    } else {
      setLocalHighlight(phaseId)
    }
  }

  const isHighlighted = (phaseId) => {
    if (activePhase === null || activePhase === undefined) return true
    if (Array.isArray(activePhase)) return activePhase.includes(phaseId)
    return phaseId === activePhase
  }

  return (
    <div className="w-full">
      <h3 className="text-xl font-bold text-gray-900 mb-4">{title}</h3>

      {/* Toggle control */}
      {showToggle && (
        <div className="flex flex-wrap gap-2 mb-6">
          {toggleOptions.map((phaseId) => {
            const phase = phases[phaseId]
            const active = isHighlighted(phaseId)
            return (
              <button
                key={phaseId}
                onClick={() => handleToggle(phaseId)}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border"
                style={{
                  backgroundColor: active ? phase.color : '#f3f4f6',
                  borderColor: active ? phase.textColor : '#d1d5db',
                  color: active ? phase.textColor : '#9ca3af',
                  opacity: active ? 1 : 0.6,
                }}
              >
                {phase.label}: {phase.title.replace('\n', ' ')}
              </button>
            )
          })}
        </div>
      )}

      {/* Chart */}
      <div className="w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${totalWidth} ${totalHeight}`}
          className="w-full h-auto"
          style={{ maxHeight: '480px' }}
        >
          {/* Y-axis */}
          <line
            x1={chartPadding.left}
            y1={chartPadding.top - 10}
            x2={chartPadding.left}
            y2={chartPadding.top + 340 + 5}
            stroke="#374151"
            strokeWidth={1.5}
          />
          <polygon
            points={`${chartPadding.left},${chartPadding.top - 18} ${chartPadding.left - 5},${chartPadding.top - 8} ${chartPadding.left + 5},${chartPadding.top - 8}`}
            fill="#374151"
          />
          <text
            x={18}
            y={chartPadding.top + 170}
            textAnchor="middle"
            fontSize={11}
            fill="#6b7280"
            fontWeight={600}
            transform={`rotate(-90, 18, ${chartPadding.top + 170})`}
          >
            Business Impact
          </text>

          {/* X-axis */}
          <line
            x1={chartPadding.left - 5}
            y1={chartPadding.top + 340}
            x2={chartPadding.left + stepWidth * 4 + 10}
            y2={chartPadding.top + 340}
            stroke="#374151"
            strokeWidth={1.5}
          />
          <polygon
            points={`${chartPadding.left + stepWidth * 4 + 18},${chartPadding.top + 340} ${chartPadding.left + stepWidth * 4 + 8},${chartPadding.top + 335} ${chartPadding.left + stepWidth * 4 + 8},${chartPadding.top + 345}`}
            fill="#374151"
          />
          <text
            x={chartPadding.left + stepWidth * 2}
            y={chartPadding.top + 340 + 35}
            textAnchor="middle"
            fontSize={11}
            fill="#6b7280"
            fontWeight={600}
          >
            Data Maturity
          </text>

          {/* Phase labels at top */}
          {phases.map((phase, i) => (
            <text
              key={`label-${i}`}
              x={chartPadding.left + i * stepWidth + stepWidth / 2}
              y={chartPadding.top - 25}
              textAnchor="middle"
              fontSize={13}
              fontWeight={700}
              fill={isHighlighted(i) ? '#1f2937' : '#d1d5db'}
              style={{ transition: 'fill 0.3s ease' }}
            >
              {phase.label}
            </text>
          ))}

          {/* Vertical dividers between phase labels */}
          {[1, 2, 3].map(i => (
            <line
              key={`div-${i}`}
              x1={chartPadding.left + i * stepWidth}
              y1={chartPadding.top - 38}
              x2={chartPadding.left + i * stepWidth}
              y2={chartPadding.top - 15}
              stroke="#d1d5db"
              strokeWidth={1}
            />
          ))}

          {/* Staircase blocks */}
          {phases.map((phase, i) => {
            const x = chartPadding.left + i * stepWidth
            const h = stepHeights[i]
            const y = chartPadding.top + 340 - h
            const highlighted = isHighlighted(i)
            const hovered = hoveredPhase === i
            const fillColor = highlighted ? phase.color : phase.colorDim

            // Center of the block for scale transform origin
            const cx = x + stepWidth / 2
            const cy = y + h / 2

            return (
              <motion.g
                key={`block-${i}`}
                initial={false}
                animate={{
                  opacity: highlighted ? 1 : 0.35,
                  scale: hovered ? 1.04 : 1,
                  y: hovered ? -4 : 0,
                }}
                transition={{ duration: 0.25, type: 'spring', stiffness: 300, damping: 25 }}
                style={{ transformOrigin: `${cx}px ${cy}px`, cursor: 'pointer' }}
                onMouseEnter={() => setHoveredPhase(i)}
                onMouseLeave={() => setHoveredPhase(null)}
                onClick={() => handleToggle(i)}
              >
                {/* Drop shadow when hovered */}
                {hovered && (
                  <rect
                    x={x + 3}
                    y={y + 5}
                    width={stepWidth}
                    height={h}
                    rx={4}
                    fill="rgba(0,0,0,0.1)"
                  />
                )}

                {/* Block */}
                <rect
                  x={x}
                  y={y}
                  width={stepWidth}
                  height={h}
                  fill={phase.gradient ? 'url(#phase3-gradient)' : fillColor}
                  rx={4}
                  stroke={hovered ? phase.textColor : (highlighted ? phase.textColor : '#e5e7eb')}
                  strokeWidth={hovered ? 2 : (highlighted ? 1.5 : 0.5)}
                  style={{ transition: 'fill 0.3s ease, stroke 0.2s ease, stroke-width 0.2s ease' }}
                />
                {phase.gradient && (
                  <defs>
                    <linearGradient id="phase3-gradient" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor={highlighted ? '#F97316' : '#fcc89b'} />
                      <stop offset="100%" stopColor={highlighted ? '#ef4444' : '#f5b5a3'} />
                    </linearGradient>
                  </defs>
                )}

                {/* Title inside block (bottom area) */}
                {phase.title.split('\n').map((line, li) => (
                  <text
                    key={`title-${i}-${li}`}
                    x={x + 12}
                    y={y + h - 28 + li * 18}
                    fontSize={15}
                    fontWeight={700}
                    fill={highlighted ? phase.textColor : '#9ca3af'}
                    style={{ transition: 'fill 0.3s ease' }}
                  >
                    {line}
                  </text>
                ))}

                {/* Bullet list above/inside block */}
                {phase.bullets.map((bullet, bi) => (
                  <text
                    key={`bullet-${i}-${bi}`}
                    x={x + 12}
                    y={y + 20 + bi * 16}
                    fontSize={10}
                    fill={highlighted ? phase.textColor : '#9ca3af'}
                    style={{ transition: 'fill 0.3s ease' }}
                  >
                    {bullet}
                  </text>
                ))}
              </motion.g>
            )
          })}
        </svg>
      </div>
    </div>
  )
}
