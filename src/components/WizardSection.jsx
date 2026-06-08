import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'

/* ═══════════════════════════════════════════════════
   Design tokens (matches existing app)
   ═══════════════════════════════════════════════════ */
const NAVY = '#111827'
const GREEN = '#059669'
const GREEN_LIGHT = '#f0fdf4'
const RED = '#dc2626'
const RED_LIGHT = '#fef2f2'
const BLUE = '#3b82f6'
const BLUE_LIGHT = '#eff6ff'
const AMBER = '#d97706'

const fadeSlide = {
  initial: { opacity: 0, x: 16 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -16 },
  transition: { duration: 0.3 },
}

/* ═══════════════════════════════════════════════════
   Tabs & descriptions
   ═══════════════════════════════════════════════════ */
const topics = [
  { key: 'intelligence', label: 'Intelligence' },
  { key: 'scope', label: 'Scope' },
  { key: 'tokens', label: 'Token efficiency' },
]

const topicDescs = {
  intelligence: 'dbt Wizard understands the right validation checks and always routes to the right tool. It self-validates before showing you anything.',
  scope: 'dbt Wizard can troubleshoot failed jobs and read from production after making changes, so it can confirm work will hold up in other environments.',
  tokens: "dbt's native metadata engine retrieves exactly what the agent needs before it writes a single line, so you get more accurate output while spending fewer tokens.",
}

/* ═══════════════════════════════════════════════════
   Toggle (kept from original)
   ═══════════════════════════════════════════════════ */
function Toggle({ value, onChange }) {
  return (
    <div className="inline-flex bg-gray-100 rounded-xl p-1" role="radiogroup" aria-label="Comparison mode">
      <button
        role="radio"
        aria-checked={value === 'without'}
        onClick={() => onChange('without')}
        className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
          value === 'without' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        Without dbt Wizard
      </button>
      <button
        role="radio"
        aria-checked={value === 'with'}
        onClick={() => onChange('with')}
        className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
          value === 'with' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        With dbt Wizard
      </button>
    </div>
  )
}

/* ═══════════════════════════════════════════════════
   Play button
   ═══════════════════════════════════════════════════ */
function PlayButton({ playing, hasPlayed, onPlay }) {
  return (
    <button
      onClick={onPlay}
      disabled={playing}
      className={`px-5 py-2 rounded-lg font-medium text-sm transition-all duration-150 ${
        playing ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gray-900 text-white hover:bg-gray-800'
      }`}
    >
      {playing ? 'Running...' : hasPlayed ? 'Run again' : 'Run simulation'}
    </button>
  )
}

/* ═══════════════════════════════════════════════════
   Shared animation helpers
   ═══════════════════════════════════════════════════ */
function useLoopIndex(items, intervalMs, enabled = true) {
  const [index, setIndex] = useState(0)
  const prefersReduced = useReducedMotion()
  useEffect(() => {
    if (!enabled || prefersReduced) return
    const id = setInterval(() => setIndex(i => (i + 1) % items.length), intervalMs)
    return () => clearInterval(id)
  }, [items.length, intervalMs, enabled, prefersReduced])
  useEffect(() => { setIndex(0) }, [enabled])
  return index
}

function SectionLabel({ children }) {
  return <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-3">{children}</p>
}

/* ═══════════════════════════════════════════════════
   SECTION 1 — Intelligence
   ═══════════════════════════════════════════════════ */

/* ─── Intelligence: Without side ─── */
const WITHOUT_PROBLEMS = [
  {
    label: 'No project conventions loaded', icon: '?',
    means: 'A generic agent does not know your naming standards, folder layout, or materialization defaults, so it invents its own.',
    example: 'It writes a model called customers_final when your standard is dim_customers, and uses a CTE style your linter rejects.',
  },
  {
    label: 'No lineage or model relationships', icon: '?',
    means: 'It cannot see your DAG, so it does not know what feeds what or what sits downstream.',
    example: 'Asked to change a column in stg_orders, it has no idea that 12 models depend on it, so it cannot warn you what will break.',
  },
  {
    label: 'No test or contract awareness', icon: '?',
    means: 'It does not know which tests and contracts exist, so it cannot tell whether a change violates them.',
    example: 'It renames a column that a downstream not_null test relies on, and the failure only shows up when the build runs.',
  },
  {
    label: 'Re-paste your standards every session', icon: '?',
    means: 'It keeps no project memory, so every new session starts from zero.',
    example: 'You paste your style guide and model list at the start of every chat, and still get drift halfway through.',
  },
  {
    label: 'Generates code it can\u2019t validate', icon: '!',
    means: 'It can write SQL but cannot compile it, run tests, or check downstream impact, so the output is unverified.',
    example: 'It produces a model that references a column that does not exist, with no way to catch it before you run.',
  },
]

/* ─── Intelligence: With side ─── */
const WIZARD_SKILLS = [
  {
    label: 'Analytics engineering',
    detail: 'Knows staging/intermediate/mart layering, ref() patterns, and how to structure incremental models. Follows your project conventions automatically.',
  },
  {
    label: 'Semantic layer',
    detail: 'Understands metrics, dimensions, entities, and time spines. Can create and modify semantic models that compile correctly on the first pass.',
  },
  {
    label: 'Testing patterns',
    detail: 'Generates the right tests for the context: not_null, unique, accepted_values, relationships. Knows when to add a test and when one already covers the case.',
  },
  {
    label: 'Migration workflow',
    detail: 'Classifies compatibility errors during platform migrations and applies validated fixes. Knows dialect differences between Snowflake, Databricks, BigQuery, and others.',
  },
  {
    label: 'Documentation',
    detail: 'Writes model and column descriptions that match your existing style. Generates doc blocks and keeps YAML in sync with SQL changes.',
  },
]

const VALIDATIONS = [
  {
    change: 'SQL generation', check: 'compile',
    detail: 'Every generated SQL statement is compiled against the project before surfacing. Syntax errors and missing refs are caught immediately.',
  },
  {
    change: 'Test generation', check: 'run new tests',
    detail: 'New tests are executed, not just written. You see pass/fail results before the diff is shown.',
  },
  {
    change: 'Refactor', check: 'verify downstream ref()s',
    detail: 'When a model is renamed or a column changes, all downstream ref() calls are checked to confirm they still resolve.',
  },
  {
    change: 'Contract change', check: 'check schema compatibility',
    detail: 'Schema contracts are validated so downstream consumers are not broken by column type or naming changes.',
  },
  {
    change: 'Semantic model', check: 'compile semantic defs',
    detail: 'Semantic model YAML is compiled to confirm measures, dimensions, and entities are valid before any change is proposed.',
  },
  {
    change: 'Job investigation', check: 'analyze run results',
    detail: 'Pulls the failed run, identifies the failing model and error, and traces the root cause through logs and lineage.',
  },
]

function IntelligenceContent({ mode }) {
  const [expandedRow, setExpandedRow] = useState(null)
  const [expandedSkill, setExpandedSkill] = useState(null)
  const [expandedValidation, setExpandedValidation] = useState(null)
  const [openSection, setOpenSection] = useState('skills')

  return (
    <AnimatePresence mode="wait">
      <motion.div key={`intel-${mode}`} {...fadeSlide}>
        {mode === 'without' ? (
          <div className="space-y-3">
            <div className="border border-gray-200 rounded-xl p-4 bg-white">
              <SectionLabel>What a generic coding agent does</SectionLabel>
              <p className="text-[10px] text-gray-400 mb-3">No dbt project context. No skills. No validation.</p>
              <div className="space-y-2">
                {WITHOUT_PROBLEMS.map((p, i) => {
                  const isOpen = expandedRow === i
                  return (
                    <motion.div
                      key={p.label}
                      layout
                      whileHover={!isOpen ? { y: -2, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' } : {}}
                      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                      className="bg-red-50/50 border border-red-200/60 rounded-lg overflow-hidden"
                    >
                      <button
                        onClick={() => setExpandedRow(isOpen ? null : i)}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setExpandedRow(isOpen ? null : i) } }}
                        aria-expanded={isOpen}
                        className="w-full flex items-center gap-3 px-3 py-2 text-left cursor-pointer"
                      >
                        <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                          <span className="text-red-500 text-[10px] font-bold">{p.icon}</span>
                        </div>
                        <p className="text-xs text-gray-700 flex-1">{p.label}</p>
                        <motion.svg
                          width="12" height="12" viewBox="0 0 12 12"
                          animate={{ rotate: isOpen ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                          className="text-red-300 shrink-0"
                        >
                          <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                        </motion.svg>
                      </button>
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="px-3 pb-3 ml-9 space-y-1.5">
                              <div>
                                <p className="text-[10px] font-semibold text-gray-500">What it means</p>
                                <p className="text-[10px] text-gray-600 leading-relaxed">{p.means}</p>
                              </div>
                              <div>
                                <p className="text-[10px] font-semibold text-gray-500">Example</p>
                                <p className="text-[10px] text-gray-600 leading-relaxed italic">{p.example}</p>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )
                })}
              </div>
            </div>
            <div className="border border-amber-200 bg-amber-50/50 rounded-xl p-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-amber-200 flex items-center justify-center shrink-0">
                  <span className="text-amber-700 text-[10px] font-bold">!</span>
                </div>
                <div>
                  <p className="text-xs font-semibold text-amber-800">Output is unchecked</p>
                  <p className="text-[10px] text-amber-600">Code may not compile, tests aren&apos;t run, downstream impact unknown</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Skills */}
            <div className="border border-gray-200 rounded-xl bg-white overflow-hidden">
              <button
                onClick={() => setOpenSection(openSection === 'skills' ? null : 'skills')}
                aria-expanded={openSection === 'skills'}
                className="w-full flex items-center justify-between px-4 py-3 text-left cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <div>
                  <SectionLabel>dbt Agent Skills + project context</SectionLabel>
                  <p className="text-[10px] text-gray-400">Reusable, governed skills load automatically. Add your own as SKILL.md files.</p>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-3">
                  <span className="text-[9px] font-medium text-gray-400">{WIZARD_SKILLS.length} skills</span>
                  <motion.svg width="14" height="14" viewBox="0 0 14 14" animate={{ rotate: openSection === 'skills' ? 180 : 0 }} transition={{ duration: 0.2 }} className="text-gray-400">
                    <path d="M3.5 5.25L7 8.75L10.5 5.25" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  </motion.svg>
                </div>
              </button>
              <AnimatePresence>
                {openSection === 'skills' && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
                    <div className="px-4 pb-4 space-y-2">
                {WIZARD_SKILLS.map((s, i) => {
                  const isOpen = expandedSkill === i
                  return (
                    <motion.div
                      key={s.label}
                      layout
                      whileHover={!isOpen ? { y: -2, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' } : {}}
                      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                      className="bg-green-50 border border-green-200 rounded-lg overflow-hidden"
                    >
                      <button
                        onClick={() => setExpandedSkill(isOpen ? null : i)}
                        aria-expanded={isOpen}
                        className="w-full flex items-center gap-2 px-3 py-2 text-left cursor-pointer"
                      >
                        <span className="text-green-600 text-[10px] font-bold shrink-0">&#10003;</span>
                        <span className="text-[10px] font-medium text-gray-700 flex-1">{s.label}</span>
                        <motion.svg
                          width="12" height="12" viewBox="0 0 12 12"
                          animate={{ rotate: isOpen ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                          className="text-green-300 shrink-0"
                        >
                          <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                        </motion.svg>
                      </button>
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="px-3 pb-2.5 ml-5">
                              <p className="text-[10px] text-gray-600 leading-relaxed">{s.detail}</p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )
                })}
                {/* Custom skill */}
                <motion.div
                  whileHover={{ y: -2, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 cursor-default"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-blue-600 text-[10px] font-bold">+</span>
                    <span className="text-[10px] font-medium text-blue-700">custom-style</span>
                  </div>
                  <p className="text-[9px] text-gray-400 mt-0.5 font-mono">.agents/skills/SKILL.md</p>
                </motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Validations */}
            <div className="border border-gray-200 rounded-xl bg-white overflow-hidden">
              <button
                onClick={() => setOpenSection(openSection === 'validations' ? null : 'validations')}
                aria-expanded={openSection === 'validations'}
                className="w-full flex items-center justify-between px-4 py-3 text-left cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <div>
                  <SectionLabel>Self-validates before showing you anything</SectionLabel>
                  <p className="text-[10px] text-gray-400">Each change type is checked automatically before the diff is surfaced.</p>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-3">
                  <span className="text-[9px] font-medium text-gray-400">{VALIDATIONS.length} checks</span>
                  <motion.svg width="14" height="14" viewBox="0 0 14 14" animate={{ rotate: openSection === 'validations' ? 180 : 0 }} transition={{ duration: 0.2 }} className="text-gray-400">
                    <path d="M3.5 5.25L7 8.75L10.5 5.25" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  </motion.svg>
                </div>
              </button>
              <AnimatePresence>
                {openSection === 'validations' && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
                    <div className="px-4 pb-4 space-y-2">
                {VALIDATIONS.map((v, i) => {
                  const isOpen = expandedValidation === i
                  return (
                    <motion.div
                      key={v.change}
                      layout
                      whileHover={!isOpen ? { y: -2, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' } : {}}
                      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                      className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden"
                    >
                      <button
                        onClick={() => setExpandedValidation(isOpen ? null : i)}
                        aria-expanded={isOpen}
                        className="w-full flex items-center gap-2 px-3 py-2 text-left cursor-pointer"
                      >
                        <span className="text-green-500 text-[10px] font-bold shrink-0">&#10003;</span>
                        <div className="flex-1">
                          <p className="text-[10px] font-medium text-gray-700">{v.change}</p>
                          <p className="text-[9px] text-gray-400">{v.check}</p>
                        </div>
                        <motion.svg
                          width="12" height="12" viewBox="0 0 12 12"
                          animate={{ rotate: isOpen ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                          className="text-gray-300 shrink-0"
                        >
                          <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                        </motion.svg>
                      </button>
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="px-3 pb-2.5 ml-5">
                              <p className="text-[10px] text-gray-600 leading-relaxed">{v.detail}</p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )
                })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Output callout */}
            <div className="border border-green-200 bg-green-50/50 rounded-xl p-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center shrink-0">
                  <span className="text-white text-[10px] font-bold">&#10003;</span>
                </div>
                <div>
                  <p className="text-xs font-semibold text-green-800">Only validated diffs are surfaced</p>
                  <p className="text-[10px] text-green-600">Checks pass before you see anything. If a check fails, it adjusts and retries.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}

/* ═══════════════════════════════════════════════════
   SECTION 2 — Scope (static comparison)
   ═══════════════════════════════════════════════════ */

const SCOPE_WITHOUT_POINTS = [
  'No concept of production. You cannot see what is running live or what the production data looks like.',
  'No visibility into failed jobs or tests. A broken run in another environment stays invisible until someone flags it.',
  'No way to know how a change behaves elsewhere. Passing in dev does not mean it passes in production.',
]

function ScopeContent({ mode }) {
  const [openItem, setOpenItem] = useState('job')
  const [activeStep, setActiveStep] = useState('1')
  const [diffExpanded, setDiffExpanded] = useState(true)

  return (
    <AnimatePresence mode="wait">
      <motion.div key={`scope-${mode}`} {...fadeSlide}>
        {mode === 'without' ? (
          <div className="border border-gray-200 rounded-xl p-4 bg-white">
            <p className="text-xs font-bold text-gray-900 mb-1">Scope: your local codebase in VS Code</p>
            <p className="text-[10px] text-gray-500 mb-3">Without dbt Wizard you are working inside a single codebase and a local development environment. That is the whole picture.</p>
            <div className="space-y-2">
              {SCOPE_WITHOUT_POINTS.map((point) => (
                <motion.div
                  key={point}
                  whileHover={{ y: -2, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  className="flex items-start gap-2 px-3 py-2 bg-red-50/50 border border-red-200/60 rounded-lg cursor-default"
                >
                  <div className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-red-500 text-[8px] font-bold">x</span>
                  </div>
                  <p className="text-[10px] text-gray-700 leading-relaxed">{point}</p>
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="border border-gray-200 rounded-xl p-4 bg-white">
              <p className="text-xs font-bold text-gray-900 mb-1">Scope: across environments, including production</p>
              <p className="text-[10px] text-gray-500 mb-3">dbt Wizard can troubleshoot failed jobs and read from production after making changes, so it can confirm work will hold up in other environments.</p>
            </div>

            {/* Accordion item 1: Job failure diagnosis */}
            <div className="border border-gray-200 rounded-xl bg-white overflow-hidden">
              <button
                onClick={() => setOpenItem(openItem === 'job' ? null : 'job')}
                aria-expanded={openItem === 'job'}
                className="w-full flex items-center justify-between px-4 py-3 text-left cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center shrink-0">
                    <span className="text-white text-[9px] font-bold">&#10003;</span>
                  </div>
                  <p className="text-xs font-semibold text-gray-900">Job failure diagnosis</p>
                </div>
                <motion.svg width="14" height="14" viewBox="0 0 14 14" animate={{ rotate: openItem === 'job' ? 180 : 0 }} transition={{ duration: 0.2 }} className="text-gray-400 shrink-0">
                  <path d="M3.5 5.25L7 8.75L10.5 5.25" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </motion.svg>
              </button>
              <AnimatePresence>
                {openItem === 'job' && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
                    <div className="px-4 pb-4">
                      <p className="text-[10px] text-gray-400 mb-3">Instead of waiting for someone to report it, dbt Wizard traces the failure automatically.</p>
                      {/* Clickable step boxes */}
                      <div className="flex items-stretch gap-2 mb-3">
                        {[
                          { step: '1', title: 'Detect', color: '#dc2626', bg: '#fef2f2', border: '#fecaca', lines: ['Job #4821 failed', '1 model errored'] },
                          { step: '2', title: 'Pinpoint', color: '#d97706', bg: '#fffbeb', border: '#fde68a', lines: ['fct_order_items', 'Ambiguous column'] },
                          { step: '3', title: 'Fix', color: '#059669', bg: '#f0fdf4', border: '#86efac', lines: ['orders.order_date', 'Compiled + tests pass'] },
                        ].map((s) => {
                          const isActive = activeStep === s.step
                          return (
                            <button
                              key={s.step}
                              onClick={() => setActiveStep(s.step)}
                              className={`flex-1 rounded-lg p-2.5 border text-left transition-all duration-200 cursor-pointer ${isActive ? 'ring-2 shadow-sm' : 'opacity-60 hover:opacity-90'}`}
                              style={{ backgroundColor: s.bg, borderColor: s.border, '--tw-ring-color': s.color }}
                            >
                              <div className="flex items-center gap-1 mb-1">
                                <div className="w-4 h-4 rounded-full flex items-center justify-center text-white text-[8px] font-bold" style={{ backgroundColor: s.color }}>{s.step}</div>
                                <p className="text-[9px] font-bold" style={{ color: s.color }}>{s.title}</p>
                              </div>
                              {s.lines.map((line, j) => (
                                <p key={j} className="text-[9px] text-gray-600 leading-relaxed">{line}</p>
                              ))}
                            </button>
                          )
                        })}
                      </div>
                      {/* Detail panel */}
                      <AnimatePresence mode="wait">
                        {activeStep === '1' && (
                          <motion.div key="detect" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }}
                            className="border border-red-200 bg-red-50/30 rounded-lg p-3">
                            <p className="text-[10px] font-semibold text-red-700 mb-1.5">Failed job detected</p>
                            <div className="space-y-1 text-[10px] text-gray-600">
                              <p>Job #4821, scheduled run, status <span className="font-semibold text-red-600">Failed</span>.</p>
                              <p>22 of 23 models passed, 1 errored.</p>
                              <p>Errored model: <code className="bg-white px-1 rounded text-[9px] font-mono border border-red-200">fct_order_items</code></p>
                            </div>
                            <p className="text-[9px] text-gray-400 mt-2">dbt Wizard flagged this automatically, so no one had to report it.</p>
                          </motion.div>
                        )}
                        {activeStep === '2' && (
                          <motion.div key="pinpoint" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }}
                            className="border border-amber-200 bg-amber-50/30 rounded-lg p-3">
                            <p className="text-[10px] font-semibold text-amber-700 mb-1.5">Root cause pinpointed</p>
                            <div className="space-y-1 text-[10px] text-gray-600">
                              <p>Compilation error in <code className="bg-white px-1 rounded text-[9px] font-mono border border-amber-200">fct_order_items</code>:</p>
                              <p>Ambiguous column reference <code className="bg-white px-1 rounded text-[9px] font-mono border border-amber-200">order_date</code>, which now exists in both <code className="bg-white px-1 rounded text-[9px] font-mono border border-gray-200">stg_orders</code> and <code className="bg-white px-1 rounded text-[9px] font-mono border border-gray-200">stg_payments</code> after a recent join.</p>
                            </div>
                            <div className="mt-2 bg-white border border-amber-200 rounded px-2.5 py-1.5 font-mono text-[9px]">
                              <span className="text-gray-400">select</span> <span className="text-amber-600 font-semibold bg-amber-100 px-0.5 rounded">order_date</span><span className="text-gray-400">,</span> <span className="text-gray-500">customer_id, ...</span>
                            </div>
                          </motion.div>
                        )}
                        {activeStep === '3' && (
                          <motion.div key="fix" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }}
                            className="border border-green-200 bg-green-50/30 rounded-lg p-3">
                            <p className="text-[10px] font-semibold text-green-700 mb-1.5">Fix proposed and validated</p>
                            <div className="bg-white border border-gray-200 rounded px-2.5 py-1.5 font-mono text-[9px] space-y-0.5 mb-2">
                              <div className="text-red-600 bg-red-50 px-1 rounded">- select order_date</div>
                              <div className="text-green-700 bg-green-50 px-1 rounded">+ select orders.order_date</div>
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center gap-1.5 text-[10px]">
                                <span className="text-green-500 font-bold shrink-0">&#10003;</span>
                                <span className="text-gray-600"><code className="bg-gray-100 px-1 rounded text-[9px] font-mono">dbt parse</code> passed</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-[10px]">
                                <span className="text-green-500 font-bold shrink-0">&#10003;</span>
                                <span className="text-gray-600"><code className="bg-gray-100 px-1 rounded text-[9px] font-mono">fct_order_items</code> compiled successfully</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-[10px]">
                                <span className="text-green-500 font-bold shrink-0">&#10003;</span>
                                <span className="text-gray-600">All tests pass</span>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Accordion item 2: Compare changes against production */}
            <div className="border border-gray-200 rounded-xl bg-white overflow-hidden">
              <button
                onClick={() => setOpenItem(openItem === 'compare' ? null : 'compare')}
                aria-expanded={openItem === 'compare'}
                className="w-full flex items-center justify-between px-4 py-3 text-left cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center shrink-0">
                    <span className="text-white text-[9px] font-bold">&#10003;</span>
                  </div>
                  <p className="text-xs font-semibold text-gray-900">Compare changes against production</p>
                </div>
                <motion.svg width="14" height="14" viewBox="0 0 14 14" animate={{ rotate: openItem === 'compare' ? 180 : 0 }} transition={{ duration: 0.2 }} className="text-gray-400 shrink-0">
                  <path d="M3.5 5.25L7 8.75L10.5 5.25" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </motion.svg>
              </button>
              <AnimatePresence>
                {openItem === 'compare' && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
                    <div className="px-4 pb-4 space-y-3">
                      <span className="inline-block text-[9px] font-mono text-gray-400 bg-gray-100 px-2 py-0.5 rounded">invoke_dbt</span>

                      {/* Validation status */}
                      <div className="space-y-1.5">
                        <p className="text-[10px] font-semibold text-gray-700">Validation status</p>
                        <div className="flex items-center gap-1.5 text-[10px]">
                          <span className="text-green-500 font-bold shrink-0">&#10003;</span>
                          <span className="text-gray-600"><code className="bg-gray-100 px-1 rounded text-[9px] font-mono">dbt parse</code> passed and the updated model compiled successfully.</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px]">
                          <span className="text-green-500 font-bold shrink-0">&#10003;</span>
                          <span className="text-gray-600"><code className="bg-gray-100 px-1 rounded text-[9px] font-mono">dbt compare --select int_accounts</code> completed with matching row counts and no unexpected differences.</span>
                        </div>
                      </div>

                      {/* Compare changes panel */}
                      <div className="border border-gray-200 rounded-lg p-3">
                        <p className="text-[10px] font-semibold text-gray-700 mb-2">Compare changes</p>
                        <div className="flex gap-3 mb-3">
                          <span className="text-[10px] font-semibold px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 border border-amber-200">Modified: 2</span>
                          <span className="text-[10px] font-semibold px-2.5 py-1 rounded-lg bg-green-50 text-green-700 border border-green-200">Added: 1</span>
                          <span className="text-[10px] font-semibold px-2.5 py-1 rounded-lg bg-red-50 text-red-600 border border-red-200">Removed: 0</span>
                        </div>
                        <p className="text-[9px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Modified</p>
                        {/* Expandable int_accounts row */}
                        <div className="border border-amber-200/60 rounded-lg overflow-hidden">
                          <button
                            onClick={() => setDiffExpanded(d => !d)}
                            aria-expanded={diffExpanded}
                            className="w-full flex items-center gap-2 px-3 py-2 bg-amber-50/50 text-left cursor-pointer hover:bg-amber-50 transition-colors"
                          >
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0">
                              <rect x="1" y="1" width="12" height="12" rx="2" stroke="#d97706" strokeWidth="1.2" />
                              <path d="M4 5h6M4 7h4M4 9h5" stroke="#d97706" strokeWidth="0.8" strokeLinecap="round" />
                            </svg>
                            <code className="text-[10px] font-mono font-medium text-gray-700 flex-1">int_accounts</code>
                            <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-amber-100 text-amber-700">Different</span>
                            <motion.svg width="12" height="12" viewBox="0 0 12 12" animate={{ rotate: diffExpanded ? 180 : 0 }} transition={{ duration: 0.2 }} className="text-amber-400 shrink-0 ml-1">
                              <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                            </motion.svg>
                          </button>
                          <AnimatePresence>
                            {diffExpanded && (
                              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                                <div className="px-3 pb-3 space-y-3">
                                  {/* What changed (logic) */}
                                  <div>
                                    <p className="text-[9px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5 mt-2">What changed (logic)</p>
                                    <div className="bg-white border border-gray-200 rounded px-2.5 py-1.5 font-mono text-[9px] space-y-0.5">
                                      <div className="text-red-600 bg-red-50 px-1 rounded">- customer_status derived via CASE over stg_stripe_subscriptions</div>
                                      <div className="text-green-700 bg-green-50 px-1 rounded">+ customer_status read from accounts source (Salesforce aligned)</div>
                                      <div className="text-red-600 bg-red-50 px-1 rounded">- join to stg_stripe_subscriptions removed</div>
                                    </div>
                                  </div>

                                  {/* Checked against previous production run */}
                                  <div>
                                    <p className="text-[9px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Checked against the previous production run</p>
                                    <div className="flex items-center gap-3 mb-2 text-[10px]">
                                      <span className="text-gray-500">Row count:</span>
                                      <span className="font-medium text-gray-700">Production 48,210</span>
                                      <span className="text-gray-300">|</span>
                                      <span className="font-medium text-gray-700">Dev 48,210</span>
                                      <span className="text-green-600 font-semibold text-[9px] bg-green-50 px-1.5 py-0.5 rounded">Match</span>
                                    </div>
                                    <table className="w-full text-[10px]">
                                      <thead>
                                        <tr className="text-left text-[9px] text-gray-400 uppercase tracking-wider">
                                          <th className="pb-1 font-semibold">Status</th>
                                          <th className="pb-1 font-semibold text-right">Prod</th>
                                          <th className="pb-1 font-semibold text-right">Dev</th>
                                        </tr>
                                      </thead>
                                      <tbody className="text-gray-700">
                                        <tr className="border-t border-gray-100"><td className="py-1 font-mono">active</td><td className="py-1 text-right">31,402</td><td className="py-1 text-right">31,402</td></tr>
                                        <tr className="border-t border-gray-100"><td className="py-1 font-mono">prospect</td><td className="py-1 text-right">12,118</td><td className="py-1 text-right">12,118</td></tr>
                                        <tr className="border-t border-gray-100"><td className="py-1 font-mono">churned</td><td className="py-1 text-right">4,690</td><td className="py-1 text-right">4,690</td></tr>
                                      </tbody>
                                    </table>
                                    <p className="text-[9px] text-gray-400 mt-1.5">No rows added or dropped. Only the source of <code className="bg-gray-100 px-1 rounded font-mono">customer_status</code> changed.</p>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>

                      <p className="text-[10px] text-gray-600 leading-relaxed">
                        The only changed field was <code className="bg-gray-100 px-1 rounded text-[9px] font-mono">customer_status</code>, which now matches Salesforce, so it is safe to ship.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}

/* ═══════════════════════════════════════════════════
   SECTION 3 — Token efficiency
   ═══════════════════════════════════════════════════ */

const GENERIC_STEPS = [
  { action: 'read', file: 'dbt_project.yml' },
  { action: 'read', file: 'models/schema.yml' },
  { action: 'read', file: 'models/stg_orders.sql' },
  { action: 'read', file: 'models/stg_customers.sql' },
  { action: 'read', file: 'models/stg_payments.sql' },
  { action: 'grep', file: '"churn" across 47 files — 0 results' },
  { action: 'read', file: 'models/stg_subscriptions.sql' },
  { action: 'read', file: 'models/stg_invoices.sql' },
  { action: 'read', file: 'models/int_enriched.sql' },
  { action: 'read', file: 'models/int_customer_orders.sql' },
  { action: 'compile', file: 'int_customer_orders.sql — checking refs...' },
  { action: 'read', file: 'models/fct_orders.sql' },
  { action: 'read', file: 'models/fct_revenue.sql' },
  { action: 'read', file: 'models/fct_subscriptions.sql' },
  { action: 'grep', file: '"segment" across 47 files — 3 results' },
  { action: 'read', file: 'models/dim_products.sql' },
  { action: 'read', file: 'models/dim_customers.sql' },
  { action: 'read', file: 'models/dim_dates.sql' },
  { action: 'read', file: 'models/dim_regions.sql' },
  { action: 'read', file: 'tests/schema.yml' },
  { action: 'read', file: 'tests/fct_orders_tests.yml' },
  { action: 'read', file: 'tests/int_enriched_tests.yml' },
  { action: 'compile', file: 'fct_subscriptions.sql — resolving columns...' },
  { action: 'read', file: 'macros/utils.sql' },
  { action: 'read', file: 'macros/date_spine.sql' },
  { action: 'read', file: 'macros/churn_logic.sql' },
  { action: 'compile', file: 'draft query — syntax check...' },
  { action: 'error', file: 'column "customer_segment" not found — retrying' },
  { action: 'read', file: 'models/dim_customers.sql (re-read)' },
  { action: 'grep', file: '"customer_segment" across 47 files — 1 result' },
  { action: 'read', file: 'snapshots/scd_customers.sql' },
  { action: 'read', file: 'models/dim_channels.sql' },
  { action: 'compile', file: 'draft query v2 — syntax check...' },
  { action: 'read', file: 'packages.yml' },
  { action: 'read', file: 'models/marts/fct_churn.sql' },
  { action: 'compile', file: 'final query — validating...' },
]

const METADATA_LOOKUPS = [
  'Lineage graph',
  'Model health',
  'Test definitions',
  'Contracts',
  'Run results',
  'Semantic definitions',
]

const TOKEN_PROMPT = '"What is our monthly churn rate by customer segment, broken down by region?"'

function TokenUsage({ mode, runId, onDone }) {
  const prefersReduced = useReducedMotion()
  const [visibleFiles, setVisibleFiles] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const scrollRef = useRef(null)
  const timeoutsRef = useRef([])
  const onDoneRef = useRef(onDone)
  onDoneRef.current = onDone

  useEffect(() => {
    timeoutsRef.current.forEach(clearTimeout)
    timeoutsRef.current = []
    setVisibleFiles(0)
    setShowResult(false)

    if (runId === 0) return

    if (mode === 'without') {
      const fileDelay = prefersReduced ? 0 : 180
      GENERIC_STEPS.forEach((_, i) => {
        const t = setTimeout(() => {
          setVisibleFiles(i + 1)
          if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }, fileDelay * (i + 1))
        timeoutsRef.current.push(t)
      })
      const resultT = setTimeout(() => {
        setShowResult(true)
        onDoneRef.current?.()
      }, fileDelay * (GENERIC_STEPS.length + 1) + 800)
      timeoutsRef.current.push(resultT)
    } else {
      const lookupDelay = prefersReduced ? 0 : 250
      METADATA_LOOKUPS.forEach((_, i) => {
        const t = setTimeout(() => setVisibleFiles(i + 1), lookupDelay * (i + 1))
        timeoutsRef.current.push(t)
      })
      const resultT = setTimeout(() => {
        setShowResult(true)
        onDoneRef.current?.()
      }, lookupDelay * (METADATA_LOOKUPS.length + 1) + 400)
      timeoutsRef.current.push(resultT)
    }

    return () => timeoutsRef.current.forEach(clearTimeout)
  }, [runId, mode, prefersReduced])

  const hasContent = runId > 0

  return (
    <div className="border border-gray-200 rounded-xl p-4 bg-white">
      <SectionLabel>Token usage</SectionLabel>

      <div className="bg-gray-50 rounded-lg px-3 py-2 mb-4">
        <p className="text-[10px] text-gray-400 font-medium mb-0.5">Prompt</p>
        <p className="text-xs text-gray-700 font-medium italic">{TOKEN_PROMPT}</p>
      </div>

      {!hasContent ? (
        <div className="py-4 text-center text-xs text-gray-300">Press &quot;Run simulation&quot; to see how tokens are consumed</div>
      ) : (
        <div>
          <p className="text-xs font-semibold text-gray-700 mb-2">
            {mode === 'without' ? 'Generic agent' : 'dbt Wizard'}
          </p>
          <p className="text-[10px] text-gray-400 mb-2">
            {mode === 'without'
              ? 'Reads files one by one to reconstruct context'
              : 'Queries the native metadata engine in a single call'}
          </p>
          <div
            ref={scrollRef}
            className={`space-y-1 overflow-y-auto ${mode === 'without' ? 'max-h-56' : ''} mb-4`}
          >
            {mode === 'without' ? (
              GENERIC_STEPS.slice(0, visibleFiles).map((step, i) => {
                const actionColor =
                  step.action === 'read' ? 'text-red-400' :
                  step.action === 'grep' ? 'text-amber-500' :
                  step.action === 'compile' ? 'text-blue-500' :
                  step.action === 'error' ? 'text-red-600 font-semibold' :
                  'text-gray-400'
                return (
                  <div key={`${step.action}-${i}`} className="flex items-center gap-1.5 text-[10px] font-mono text-gray-400">
                    <span className={`shrink-0 ${actionColor}`}>{step.action}</span>
                    <span className={`truncate ${step.action === 'error' ? 'text-red-500' : ''}`}>{step.file}</span>
                  </div>
                )
              })
            ) : (
              METADATA_LOOKUPS.slice(0, visibleFiles).map((item) => (
                <div key={item} className="flex items-center gap-1.5 text-[10px]">
                  <span className="text-green-500 text-xs font-bold">&#10003;</span>
                  <span className="text-gray-700 font-medium">{item}</span>
                </div>
              ))
            )}
          </div>

          {showResult && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-[10px] text-gray-400 font-medium">Tokens consumed</p>
                <p className={`text-lg font-bold tabular-nums ${mode === 'without' ? 'text-red-600' : 'text-green-700'}`}>
                  {mode === 'without' ? '~48k' : '~3.2k'}
                </p>
              </div>
              <div className="h-4 bg-gray-100 rounded-full overflow-hidden mb-3">
                <motion.div
                  className={`h-full rounded-full ${mode === 'without' ? 'bg-red-400' : 'bg-green-500'}`}
                  initial={{ width: 0 }}
                  animate={{ width: mode === 'without' ? '100%' : '6.7%' }}
                  transition={{ duration: prefersReduced ? 0 : 0.8, ease: 'easeOut' }}
                />
              </div>
              {mode === 'without' ? (
                <div className="border border-red-200 bg-red-50/50 rounded-lg px-3 py-2">
                  <p className="text-[10px] text-red-700 font-semibold">~48k tokens to get context</p>
                </div>
              ) : (
                <div className="border border-green-200 bg-green-50/50 rounded-lg px-3 py-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-green-800 font-semibold">~3.2k tokens — 93% fewer</p>
                    </div>
                    <p className="text-[10px] font-semibold text-green-700">Cheaper and more accurate</p>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>
      )}
    </div>
  )
}

function TokenContent({ mode, runId, onDone }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div key={`tokens-${mode}`} {...fadeSlide}>
        <TokenUsage mode={mode} runId={runId} onDone={onDone} />
      </motion.div>
    </AnimatePresence>
  )
}

/* ═══════════════════════════════════════════════════
   Main export
   ═══════════════════════════════════════════════════ */
export default function WizardSection() {
  const [activeTopic, setActiveTopic] = useState('intelligence')
  const [mode, setMode] = useState('without')
  const [playing, setPlaying] = useState(false)
  const [hasPlayed, setHasPlayed] = useState(false)
  const [tokenRunId, setTokenRunId] = useState(0)

  // Reset playing state when tab or mode changes
  const handleTopicChange = (key) => {
    setActiveTopic(key)
    setMode('without')
    setPlaying(false)
    setHasPlayed(false)
    setTokenRunId(0)
  }
  const handleModeChange = (m) => {
    setMode(m)
    setPlaying(false)
    setHasPlayed(false)
    setTokenRunId(0)
  }
  const handlePlay = () => {
    if (activeTopic === 'tokens') {
      setTokenRunId(r => r + 1)
      setPlaying(true)
      setHasPlayed(true)
    } else {
      setPlaying(true)
      setHasPlayed(true)
    }
  }

  return (
    <div>
      {/* Topic tabs + toggle + play button */}
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div className="inline-flex bg-gray-100 rounded-xl p-1" role="tablist" aria-label="Wizard comparison topics">
          {topics.map(t => (
            <button
              key={t.key}
              role="tab"
              aria-selected={activeTopic === t.key}
              aria-controls={`panel-${t.key}`}
              onClick={() => handleTopicChange(t.key)}
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
        <div className="flex items-center gap-3">
          <Toggle value={mode} onChange={handleModeChange} />
          {activeTopic === 'tokens' && (
            <PlayButton playing={playing} hasPlayed={hasPlayed} onPlay={handlePlay} />
          )}
        </div>
      </div>

      {/* Description */}
      <AnimatePresence mode="wait">
        <motion.p
          key={activeTopic}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2 }}
          className="text-sm text-gray-500 mb-5"
        >
          {topicDescs[activeTopic]}
        </motion.p>
      </AnimatePresence>

      {/* Content */}
      <AnimatePresence mode="wait">
        {activeTopic === 'intelligence' && (
          <motion.div key="intelligence" id="panel-intelligence" role="tabpanel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <IntelligenceContent mode={mode} />
          </motion.div>
        )}
        {activeTopic === 'scope' && (
          <motion.div key="scope" id="panel-scope" role="tabpanel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <ScopeContent mode={mode} />
          </motion.div>
        )}
        {activeTopic === 'tokens' && (
          <motion.div key="tokens" id="panel-tokens" role="tabpanel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <TokenContent mode={mode} runId={tokenRunId} onDone={() => setPlaying(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
