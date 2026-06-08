import { useState } from 'react'
import { motion } from 'framer-motion'

/* ─── Step content components ─────────────────────────────── */

function DbtCloudUIBar() {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
      {/* Top bar — branch indicator */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200">
        <div className="flex items-center gap-1.5 text-sm text-gray-700">
          {/* Branch icon */}
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 3v12m0 0a3 3 0 1 0 3 3M6 15a3 3 0 1 0 3-3m0 0h6m0 0a3 3 0 1 0 3-3V3" />
          </svg>
          <span className="font-medium">main</span>
          <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>
        <div className="flex items-center gap-2">
          <button className="text-sm font-medium text-violet-600 hover:text-violet-700">Change branch</button>
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <rect x="9" y="9" width="13" height="13" rx="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
        </div>
      </div>

      {/* Version control section */}
      <div className="px-3 py-2 border-b border-gray-100">
        <button className="flex items-center gap-1 text-sm font-semibold text-gray-700">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
          Version control
        </button>
      </div>

      {/* Create branch row */}
      <div className="flex items-center px-3 py-2.5">
        <div className="flex items-center gap-2 flex-1 bg-white border border-gray-200 rounded-md px-3 py-2">
          <svg className="w-4 h-4 text-gray-500 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 3v12m0 0a3 3 0 1 0 3 3M6 15a3 3 0 1 0 3-3m0 0h6m0 0a3 3 0 1 0 3-3V3" />
          </svg>
          <span className="text-sm text-gray-700">Create branch</span>
        </div>
        <button className="ml-1 border border-gray-200 rounded-md px-2 py-2 hover:bg-gray-50">
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
    </div>
  )
}

function FileTree() {
  const items = [
    { depth: 0, type: 'dir',  name: 'my-dbt-project/' },
    { depth: 1, type: 'dir',  name: 'models/' },
    { depth: 2, type: 'dir',  name: '01_staging/' },
    { depth: 3, type: 'file', name: 'stg_customers.sql' },
    { depth: 3, type: 'file', name: 'stg_orders.sql' },
    { depth: 2, type: 'dir',  name: '02_int/' },
    { depth: 3, type: 'file', name: 'int_enriched_customer.sql' },
    { depth: 2, type: 'dir',  name: '03_mart/' },
    { depth: 3, type: 'file', name: 'fct_orders_with_customer_details.sql' },
    { depth: 1, type: 'dir',  name: 'tests/' },
    { depth: 0, type: 'file', name: 'dbt_project.yml' },
  ]
  return (
    <div className="border border-gray-200 rounded-lg p-4 font-mono text-sm leading-relaxed bg-gray-50">
      {items.map((item, i) => (
        <div key={i} style={{ paddingLeft: item.depth * 16 }} className="flex items-center gap-1.5 py-0.5">
          <span className="text-gray-400 text-xs">
            {item.type === 'dir' ? '📁' : '📄'}
          </span>
          <span className={item.type === 'dir' ? 'text-blue-600 font-medium' : 'text-gray-700'}>
            {item.name}
          </span>
        </div>
      ))}
    </div>
  )
}

function BranchDiagram() {
  const [hoverMain, setHoverMain] = useState(false)
  const [hoverFeature, setHoverFeature] = useState(false)
  return (
    <div className="relative w-full">
      <svg viewBox="0 0 400 180" className="w-full max-w-sm mx-auto">
        {/* Main branch line */}
        <line x1="0" y1="130" x2="400" y2="130" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" />

        {/* Branch curve to feature */}
        <path
          d="M 160 130 C 180 130 185 70 230 60"
          stroke="#6366f1" strokeWidth="3" fill="none" strokeLinecap="round"
        />
        {/* Feature branch line extending right */}
        <line x1="230" y1="60" x2="400" y2="60" stroke="#6366f1" strokeWidth="3" strokeLinecap="round" strokeDasharray="6 4" />

        {/* Branch point dot */}
        <circle cx="160" cy="130" r="6" fill="#15803d" />

        {/* Main branch node */}
        <g
          onMouseEnter={() => setHoverMain(true)}
          onMouseLeave={() => setHoverMain(false)}
          style={{ cursor: 'pointer' }}
        >
          <rect x="8" y="106" width="148" height="48" rx="10" fill="#f0fdf4" stroke="#22c55e" strokeWidth="2"
            style={{
              transition: 'filter 0.2s, transform 0.2s',
              transformOrigin: '82px 130px',
              transform: hoverMain ? 'scale(1.05)' : 'scale(1)',
              filter: hoverMain ? 'drop-shadow(0 3px 8px rgba(34,197,94,0.3))' : 'none',
            }}
          />
          <text x="22" y="126" fontSize="12" fontWeight="700" fill="#15803d" fontFamily="monospace"
            style={{ transition: 'transform 0.2s', transformOrigin: '82px 130px', transform: hoverMain ? 'scale(1.05)' : 'scale(1)' }}
          >main</text>
          <text x="22" y="144" fontSize="10" fill="#16a34a" fontFamily="ui-sans-serif, system-ui, sans-serif"
            style={{ transition: 'transform 0.2s', transformOrigin: '82px 130px', transform: hoverMain ? 'scale(1.05)' : 'scale(1)' }}
          >Default branch</text>
          <text x="126" y="130" fontSize="16"
            style={{ transition: 'transform 0.2s', transformOrigin: '82px 130px', transform: hoverMain ? 'scale(1.05)' : 'scale(1)' }}
          >🔒</text>
        </g>

        {/* Feature branch node */}
        <g
          onMouseEnter={() => setHoverFeature(true)}
          onMouseLeave={() => setHoverFeature(false)}
          style={{ cursor: 'pointer' }}
        >
          <rect x="232" y="36" width="160" height="48" rx="10" fill="#eef2ff" stroke="#6366f1" strokeWidth="2"
            style={{
              transition: 'filter 0.2s, transform 0.2s',
              transformOrigin: '312px 60px',
              transform: hoverFeature ? 'scale(1.05)' : 'scale(1)',
              filter: hoverFeature ? 'drop-shadow(0 3px 8px rgba(99,102,241,0.3))' : 'none',
            }}
          />
          {/* Step badge */}
          <circle cx="232" cy="36" r="10" fill="#6366f1" />
          <text x="228" y="40" fontSize="11" fontWeight="800" fill="white" fontFamily="ui-sans-serif, system-ui, sans-serif">1</text>
          <text x="248" y="56" fontSize="11" fontWeight="700" fill="#4338ca" fontFamily="monospace"
            style={{ transition: 'transform 0.2s', transformOrigin: '312px 60px', transform: hoverFeature ? 'scale(1.05)' : 'scale(1)' }}
          >feature/new-model</text>
          <text x="248" y="74" fontSize="10" fill="#6366f1" fontFamily="ui-sans-serif, system-ui, sans-serif"
            style={{ transition: 'transform 0.2s', transformOrigin: '312px 60px', transform: hoverFeature ? 'scale(1.05)' : 'scale(1)' }}
          >Your workspace</text>
        </g>
      </svg>
    </div>
  )
}

function CredentialField({ label, value, hint, optional }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-gray-700">{label}</label>
        {optional && <span className="text-xs text-gray-400">Optional</span>}
      </div>
      <div className="border border-gray-300 rounded px-3 py-2 bg-white text-sm text-gray-700 font-mono">
        {value || <span className="text-transparent select-none">placeholder</span>}
      </div>
      {hint && <p className="text-xs text-gray-400 leading-snug">{hint}</p>}
    </div>
  )
}

function DevCredentialsForm() {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm text-sm">
      {/* Form body */}
      <div className="p-5 space-y-4">
        <div>
          <h5 className="font-semibold text-gray-900 text-base mb-1">Development credentials</h5>
          <p className="text-xs text-gray-500 leading-relaxed">
            Enter your <strong className="text-gray-700">personal development credentials</strong> here (not your deployment credentials!).
            dbt will use these to connect to your database on your behalf.
          </p>
        </div>

        {/* Auth method dropdown */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-700">Auth method</label>
          <div className="flex items-center justify-between border border-gray-300 rounded px-3 py-2 bg-white">
            <span className="text-sm text-gray-700">Username and password</span>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        <CredentialField label="Username" value="hello@dbt.com" />
        <CredentialField label="Password" value="" optional />
        <CredentialField
          label="Schema"
          value="dbt_jsmith"
          hint="In development, dbt builds your models into a schema with this name. Keep it unique to you."
        />
      </div>
    </div>
  )
}

function DevelopStep1() {
  return (
    <div className="w-full space-y-6">
      {/* Step headline */}
      <div className="flex items-start gap-4">
        <div className="shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">1</div>
        <div>
          <h4 className="font-bold text-gray-900 text-lg leading-tight">Add Your Development Credentials</h4>
          <p className="text-gray-500 text-sm mt-1">
            Every interaction with the data platform runs under a specific user's permissions.
            You add your personal credentials once and dbt inherits them every time you develop.
          </p>
        </div>
      </div>

      {/* Two-column layout — UI left, notes right */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Left — credentials form mockup */}
        <div className="space-y-3">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">dbt Platform UI</p>
          <DevCredentialsForm />
        </div>

        {/* Right — concept cards */}
        <div className="space-y-3">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Why this matters</p>

          <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
            <span className="text-lg mt-0.5">🎭</span>
            <div>
              <p className="text-sm font-semibold text-blue-800">dbt acts on your behalf</p>
              <p className="text-xs text-blue-700 mt-0.5">
                When dbt runs a model, it connects to your data platform using <em>your</em> credentials, not a shared service account. Whatever your role can do, dbt can do.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
            <span className="text-lg mt-0.5">🏗️</span>
            <div>
              <p className="text-sm font-semibold text-amber-800">Your schema, your sandbox</p>
              <p className="text-xs text-amber-700 mt-0.5">
                The <strong>Schema</strong> field defines where dbt writes your dev models (e.g. <code className="bg-amber-100 px-1 rounded font-mono text-xs">dbt_jsmith</code>). It's personal to you so you never overwrite a teammate's work.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-purple-50 border border-purple-200 rounded-lg px-4 py-3">
            <span className="text-lg mt-0.5">🔄</span>
            <div>
              <p className="text-sm font-semibold text-purple-800">Dev ≠ Production credentials</p>
              <p className="text-xs text-purple-700 mt-0.5">
                These are only used in your Dev environment. Production uses a separate service account with its own role and permissions, configured in the Production environment settings.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function DevelopStep2() {
  return (
    <div className="w-full space-y-6">
      {/* Step headline */}
      <div className="flex items-start gap-4">
        <div className="shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">2</div>
        <div>
          <h4 className="font-bold text-gray-900 text-lg leading-tight">Open dbt Platform &amp; Create a Branch</h4>
          <p className="text-gray-500 text-sm mt-1">
            dbt protects <code className="bg-gray-100 px-1 rounded text-xs font-mono">main</code>. You can never write directly to it.
            Instead, you create a <strong>feature branch</strong>: an isolated copy of the entire codebase where you can build and experiment freely.
          </p>
        </div>
      </div>

      {/* Two-column layout — platform UI left, concept right */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Left — dbt Platform UI + file tree */}
        <div className="space-y-3">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">dbt Platform UI</p>
          <DbtCloudUIBar />
          <FileTree />
        </div>

        {/* Right — branch diagram + explanation */}
        <div className="space-y-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Git branching concept</p>
          <BranchDiagram />

          {/* Callout cards */}
          <div className="space-y-2">
            <div className="flex items-start gap-3 bg-green-50 border border-green-200 rounded-lg px-4 py-3">
              <span className="text-lg mt-0.5">🔒</span>
              <div>
                <p className="text-sm font-semibold text-green-800">main is protected</p>
                <p className="text-xs text-green-700 mt-0.5">No one can push code directly. Every change requires a branch and a review.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-indigo-50 border border-indigo-200 rounded-lg px-4 py-3">
              <span className="text-lg mt-0.5">🌿</span>
              <div>
                <p className="text-sm font-semibold text-indigo-800">Feature branch = your sandbox</p>
                <p className="text-xs text-indigo-700 mt-0.5">A full copy of the project, tied to your Dev environment. Build, break, and iterate. main is untouched.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function CommitSyncPanel() {
  const changes = [
    { name: 'int_customers_by_region.sql', status: 'A', statusLabel: 'A', color: 'text-green-700' },
    { name: 'fct_order_items.sql',         status: 'M', statusLabel: 'M', color: 'text-amber-700' },
  ]
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
      {/* Header row */}
      <div className="flex items-center border-b-2 border-blue-500">
        <div className="flex items-center gap-2 flex-1 px-3 py-2.5">
          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="3" />
            <line x1="12" y1="3" x2="12" y2="9" />
            <line x1="12" y1="15" x2="12" y2="21" />
          </svg>
          <span className="text-sm font-medium text-gray-800">Commit and sync</span>
        </div>
        <button className="px-3 py-2.5 border-l border-gray-200 hover:bg-gray-50">
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Changes list */}
      <div className="p-3">
        <p className="text-xs font-semibold text-gray-700 mb-2">Changes</p>
        <div className="space-y-0.5">
          {changes.map(f => (
            <div key={f.name} className="flex items-center justify-between bg-gray-100 rounded px-3 py-2">
              <div className="flex items-center gap-2">
                <svg className="w-3.5 h-3.5 text-amber-700 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <path d="M3 9h18M9 21V9" />
                </svg>
                <span className={`text-xs font-mono font-medium ${f.color}`}>{f.name}</span>
              </div>
              <span className={`text-xs font-bold ${f.color}`}>{f.statusLabel}</span>
            </div>
          ))}
        </div>

        {/* Commit message input */}
        <div className="mt-3 space-y-2">
          <input
            readOnly
            value="feat: add customers by region model"
            className="w-full border border-gray-300 rounded px-3 py-2 text-xs text-gray-600 font-mono bg-gray-50"
          />
          <button className="w-full bg-gray-900 text-white text-xs font-semibold py-2 rounded hover:bg-gray-700 transition-colors">
            Commit Changes
          </button>
        </div>
      </div>
    </div>
  )
}

function FileTreeWithChanges() {
  const items = [
    { depth: 0, type: 'dir',  name: 'my-dbt-project/',                 state: null },
    { depth: 1, type: 'dir',  name: 'models/',                         state: null },
    { depth: 2, type: 'dir',  name: '01_staging/',                     state: null },
    { depth: 3, type: 'file', name: 'stg_customers.sql',               state: null },
    { depth: 3, type: 'file', name: 'stg_orders.sql',                  state: null },
    { depth: 2, type: 'dir',  name: '02_int/',                         state: null },
    { depth: 3, type: 'file', name: 'int_customers_by_region.sql',     state: 'new' },
    { depth: 3, type: 'file', name: 'int_orders_with_items.sql',       state: null },
    { depth: 2, type: 'dir',  name: '03_mart/',                        state: null },
    { depth: 3, type: 'file', name: 'fct_order_items.sql',             state: 'modified' },
    { depth: 1, type: 'dir',  name: 'tests/',                          state: null },
    { depth: 0, type: 'file', name: 'dbt_project.yml',                 state: null },
  ]
  return (
    <div className="border border-gray-200 rounded-lg p-4 font-mono text-sm leading-relaxed bg-gray-50">
      {items.map((item, i) => (
        <div key={i} style={{ paddingLeft: item.depth * 16 }} className="flex items-center gap-1.5 py-0.5">
          <span className="text-gray-400 text-xs">{item.type === 'dir' ? '📁' : '📄'}</span>
          <span className={
            item.state === 'new'      ? 'text-green-600 font-semibold' :
            item.state === 'modified' ? 'text-amber-600 font-semibold' :
            item.type === 'dir'       ? 'text-blue-600 font-medium'    :
            'text-gray-700'
          }>
            {item.name}
          </span>
          {item.state === 'new'      && <span className="text-xs text-green-500 ml-1">✦ NEW</span>}
          {item.state === 'modified' && <span className="text-xs font-bold text-amber-500 ml-1">M</span>}
        </div>
      ))}
    </div>
  )
}

function DevelopStep3() {
  return (
    <div className="w-full space-y-6">
      {/* Step headline */}
      <div className="flex items-start gap-4">
        <div className="shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">3</div>
        <div>
          <h4 className="font-bold text-gray-900 text-lg leading-tight">Commit &amp; Sync Your Changes</h4>
          <p className="text-gray-500 text-sm mt-1">
            As you build, dbt tracks every file you add or modify. When you're ready, you <strong>commit</strong> those changes, creating a permanent snapshot, and <strong>sync</strong> them to your git remote on your feature branch.
          </p>
        </div>
      </div>

      {/* Two-column layout — platform UI left, notes right */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Left — commit panel + file tree */}
        <div className="space-y-3">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">dbt Platform UI</p>
          <CommitSyncPanel />
          <FileTreeWithChanges />
        </div>

        {/* Right — concept cards */}
        <div className="space-y-3">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">What's happening</p>

          <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
            <span className="text-lg mt-0.5">📸</span>
            <div>
              <p className="text-sm font-semibold text-blue-800">A commit is a snapshot</p>
              <p className="text-xs text-blue-700 mt-0.5">
                Every commit records exactly what changed, who changed it, and when. It's a permanent, rollback-able point in history on your feature branch.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-green-50 border border-green-200 rounded-lg px-4 py-3">
            <span className="text-lg mt-0.5">🔄</span>
            <div>
              <p className="text-sm font-semibold text-green-800">Sync pushes to git remote</p>
              <p className="text-xs text-green-700 mt-0.5">
                "Commit and sync" does both in one click. It saves the snapshot locally and pushes it to your remote feature branch so teammates can see your work.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
            <span className="text-lg mt-0.5">🏷️</span>
            <div>
              <p className="text-sm font-semibold text-amber-800">Change indicators</p>
              <p className="text-xs text-amber-700 mt-0.5">
                <strong className="text-green-700">✦ NEW</strong>: file was added on this branch.{' '}
                <strong className="text-amber-600">M</strong>: file was modified. Only these files are included in your commit.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function CreatePRPanel() {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
      {/* Top bar — branch indicator (feature branch, no lock) */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200">
        <div className="flex items-center gap-1.5 text-sm text-gray-700">
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 3v12m0 0a3 3 0 1 0 3 3M6 15a3 3 0 1 0 3-3m0 0h6m0 0a3 3 0 1 0 3-3V3" />
          </svg>
          <span className="font-medium font-mono text-sm">feature/new-model</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="text-sm font-medium text-violet-600 hover:text-violet-700">Change branch</button>
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <rect x="9" y="9" width="13" height="13" rx="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
        </div>
      </div>

      {/* Version control section */}
      <div className="px-3 py-2 border-b border-gray-100">
        <button className="flex items-center gap-1 text-sm font-semibold text-gray-700">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
          Version control
        </button>
      </div>

      {/* Create PR row */}
      <div className="flex items-center px-3 py-2.5">
        <div className="flex items-center gap-2 flex-1 bg-white border border-gray-200 rounded-md px-3 py-2">
          <svg className="w-4 h-4 text-gray-500 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          <span className="text-sm text-gray-700">Create a pull request</span>
        </div>
        <button className="ml-1 border border-gray-200 rounded-md px-2 py-2 hover:bg-gray-50">
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
    </div>
  )
}

function PRDiagram() {
  const [hoverFeature, setHoverFeature] = useState(false)
  const [hoverMain, setHoverMain] = useState(false)
  const [hoverMerged, setHoverMerged] = useState(false)
  return (
    <svg viewBox="0 0 400 130" className="w-full max-w-sm mx-auto">
      {/* main line */}
      <line x1="0" y1="105" x2="400" y2="105" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" />

      {/* feature branch line (dashed, going into main) */}
      <line x1="0" y1="35" x2="240" y2="35" stroke="#6366f1" strokeWidth="3" strokeLinecap="round" strokeDasharray="6 4" />

      {/* merge curve: feature -> main */}
      <path d="M 240 35 C 280 35 290 80 310 105" stroke="#6366f1" strokeWidth="3" fill="none" strokeLinecap="round" />

      {/* merge point dot on main */}
      <g
        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.3)'; e.currentTarget.style.filter = 'drop-shadow(0 2px 6px rgba(99,102,241,0.4))' }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.filter = 'none' }}
        style={{ cursor: 'pointer', transition: 'transform 0.2s, filter 0.2s', transformOrigin: '310px 105px' }}
      >
        <circle cx="310" cy="105" r="7" fill="#6366f1" stroke="white" strokeWidth="2" />
        <text x="305" y="109" fontSize="9" fontWeight="800" fill="white" fontFamily="ui-sans-serif, system-ui, sans-serif">✓</text>
      </g>

      {/* PR arrow label - centered on the dashed line */}
      <g
        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.1)'; e.currentTarget.style.filter = 'drop-shadow(0 2px 6px rgba(245,158,11,0.4))' }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.filter = 'none' }}
        style={{ cursor: 'pointer', transition: 'transform 0.2s, filter 0.2s', transformOrigin: '205px 35px' }}
      >
        <rect x="170" y="25" width="70" height="20" rx="5" fill="#fef3c7" stroke="#f59e0b" strokeWidth="1.5" />
        <text x="205" y="39" textAnchor="middle" fontSize="9" fontWeight="600" fill="#92400e" fontFamily="ui-sans-serif, system-ui, sans-serif">Pull Request</text>
      </g>

      {/* main node */}
      <g
        onMouseEnter={() => setHoverMain(true)}
        onMouseLeave={() => setHoverMain(false)}
        style={{ cursor: 'pointer' }}
      >
        <rect x="8" y="84" width="100" height="42" rx="10" fill="#f0fdf4" stroke="#22c55e" strokeWidth="2"
          style={{
            transition: 'filter 0.2s, transform 0.2s',
            transformOrigin: '58px 105px',
            transform: hoverMain ? 'scale(1.05)' : 'scale(1)',
            filter: hoverMain ? 'drop-shadow(0 3px 8px rgba(34,197,94,0.3))' : 'none',
          }}
        />
        <text x="22" y="102" fontSize="12" fontWeight="700" fill="#15803d" fontFamily="monospace"
          style={{ transition: 'transform 0.2s', transformOrigin: '58px 105px', transform: hoverMain ? 'scale(1.05)' : 'scale(1)' }}
        >main</text>
        <text x="22" y="118" fontSize="10" fill="#16a34a" fontFamily="ui-sans-serif, system-ui, sans-serif"
          style={{ transition: 'transform 0.2s', transformOrigin: '58px 105px', transform: hoverMain ? 'scale(1.05)' : 'scale(1)' }}
        >protected</text>
      </g>

      {/* feature node */}
      <g
        onMouseEnter={() => setHoverFeature(true)}
        onMouseLeave={() => setHoverFeature(false)}
        style={{ cursor: 'pointer' }}
      >
        <rect x="8" y="12" width="156" height="46" rx="10" fill="#eef2ff" stroke="#6366f1" strokeWidth="2"
          style={{
            transition: 'filter 0.2s, transform 0.2s',
            transformOrigin: '86px 35px',
            transform: hoverFeature ? 'scale(1.05)' : 'scale(1)',
            filter: hoverFeature ? 'drop-shadow(0 3px 8px rgba(99,102,241,0.3))' : 'none',
          }}
        />
        <text x="22" y="32" fontSize="11" fontWeight="700" fill="#4338ca" fontFamily="monospace"
          style={{ transition: 'transform 0.2s', transformOrigin: '86px 35px', transform: hoverFeature ? 'scale(1.05)' : 'scale(1)' }}
        >feature/new-model</text>
        <text x="22" y="48" fontSize="10" fill="#6366f1" fontFamily="ui-sans-serif, system-ui, sans-serif"
          style={{ transition: 'transform 0.2s', transformOrigin: '86px 35px', transform: hoverFeature ? 'scale(1.05)' : 'scale(1)' }}
        >your branch</text>
      </g>

      {/* merged label */}
      <g
        onMouseEnter={() => setHoverMerged(true)}
        onMouseLeave={() => setHoverMerged(false)}
        style={{ cursor: 'pointer' }}
      >
        <rect x="320" y="84" width="75" height="42" rx="10" fill="#f0fdf4" stroke="#22c55e" strokeWidth="2"
          style={{
            transition: 'filter 0.2s, transform 0.2s',
            transformOrigin: '357.5px 105px',
            transform: hoverMerged ? 'scale(1.05)' : 'scale(1)',
            filter: hoverMerged ? 'drop-shadow(0 3px 8px rgba(34,197,94,0.3))' : 'none',
          }}
        />
        <text x="332" y="102" fontSize="10" fontWeight="700" fill="#15803d" fontFamily="ui-sans-serif, system-ui, sans-serif"
          style={{ transition: 'transform 0.2s', transformOrigin: '357.5px 105px', transform: hoverMerged ? 'scale(1.05)' : 'scale(1)' }}
        >merged</text>
        <text x="332" y="118" fontSize="10" fill="#16a34a" fontFamily="ui-sans-serif, system-ui, sans-serif"
          style={{ transition: 'transform 0.2s', transformOrigin: '357.5px 105px', transform: hoverMerged ? 'scale(1.05)' : 'scale(1)' }}
        >into main</text>
      </g>
    </svg>
  )
}

function DevelopStep4() {
  return (
    <div className="w-full space-y-6">
      {/* Step headline */}
      <div className="flex items-start gap-4">
        <div className="shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">4</div>
        <div>
          <h4 className="font-bold text-gray-900 text-lg leading-tight">Open a Pull Request</h4>
          <p className="text-gray-500 text-sm mt-1">
            When your changes are ready, you open a <strong>Pull Request</strong>: a formal proposal to merge your feature branch into <code className="bg-gray-100 px-1 rounded text-xs font-mono">main</code>. It triggers a code review and kicks off automated CI checks before anything touches production.
          </p>
        </div>
      </div>

      {/* Two-column layout — platform UI left, process right */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Left — dbt Platform UI */}
        <div className="space-y-3">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">dbt Platform UI</p>
          <CreatePRPanel />
        </div>

        {/* Right — full PR process */}
        <div className="space-y-3">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">What a PR does</p>
          <PRDiagram />
          <div className="space-y-2">
            <div className="flex items-start gap-3 bg-indigo-50 border border-indigo-200 rounded-lg px-3 py-2.5">
              <span className="text-base mt-0.5">🔀</span>
              <div>
                <p className="text-sm font-semibold text-indigo-800">Proposes merging your branch into main</p>
                <p className="text-xs text-indigo-700 mt-0.5">Your feature branch stays intact until approved. Nothing breaks main in the meantime.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2.5">
              <span className="text-base mt-0.5">⚙️</span>
              <div>
                <p className="text-sm font-semibold text-blue-800">Triggers dbt CI automatically</p>
                <p className="text-xs text-blue-700 mt-0.5">dbt builds only changed models in an isolated QA schema, runs tests, and reports results back to the PR.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-purple-50 border border-purple-200 rounded-lg px-3 py-2.5">
              <span className="text-base mt-0.5">👀</span>
              <div>
                <p className="text-sm font-semibold text-purple-800">Enables peer review</p>
                <p className="text-xs text-purple-700 mt-0.5">A teammate reviews logic and intent. CI catches syntax errors, but humans catch business logic mistakes.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-green-50 border border-green-200 rounded-lg px-3 py-2.5">
              <span className="text-base mt-0.5">✅</span>
              <div>
                <p className="text-sm font-semibold text-green-800">Merge when approved</p>
                <p className="text-xs text-green-700 mt-0.5">Once CI passes and a reviewer approves, the branch merges to main. The next production job picks up the changes.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function CIFlowDiagram() {
  const nodes = [
    { x: 150, y: 44, w: 90,  label: 'Pull Request', fill: '#fef9c3', stroke: '#ca8a04', text: '#92400e' },
    { x: 256, y: 44, w: 100, label: 'dbt CI Job',   fill: '#dbeafe', stroke: '#3b82f6', text: '#1e40af' },
    { x: 370, y: 44, w: 96,  label: 'Peer Review',  fill: '#dbeafe', stroke: '#3b82f6', text: '#1e40af' },
    { x: 480, y: 44, w: 70,  label: 'Merge!',       fill: '#dcfce7', stroke: '#16a34a', text: '#15803d' },
  ]
  return (
    <svg viewBox="0 0 570 118" className="w-full">
      {/* Main branch line */}
      <line x1="0" y1="96" x2="570" y2="96" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" />

      {/* Default branch node — left of branch point */}
      <rect x="4" y="70" width="130" height="34" rx="8" fill="#f0fdf4" stroke="#22c55e" strokeWidth="1.5" />
      <text x="69" y="84" fontSize="9" fontWeight="700" fill="#15803d" textAnchor="middle" fontFamily="monospace">main</text>
      <text x="69" y="97" fontSize="8" fill="#16a34a" textAnchor="middle" fontFamily="ui-sans-serif,system-ui,sans-serif">(default branch)</text>

      {/* Branch point — after node right edge */}
      <circle cx="142" cy="96" r="5" fill="#f59e0b" />

      {/* Arc up from branch point to feature line */}
      <path d="M 142 96 C 142 68 148 58 150 58" stroke="#f59e0b" strokeWidth="2.5" fill="none" strokeLinecap="round" />

      {/* Connectors between nodes */}
      <line x1="240" y1="58" x2="256" y2="58" stroke="#f59e0b" strokeWidth="2.5" />
      <line x1="356" y1="58" x2="370" y2="58" stroke="#f59e0b" strokeWidth="2.5" />
      <line x1="466" y1="58" x2="480" y2="58" stroke="#f59e0b" strokeWidth="2.5" />

      {/* Arc down after Merge */}
      <path d="M 550 58 C 552 58 558 68 558 96" stroke="#f59e0b" strokeWidth="2.5" fill="none" strokeLinecap="round" />

      {/* Merge dot on main */}
      <circle cx="558" cy="96" r="6" fill="#22c55e" stroke="white" strokeWidth="2" />

      {/* Nodes */}
      {nodes.map((n, i) => (
        <g key={i}>
          <rect x={n.x} y={n.y} width={n.w} height={28} rx="8" fill={n.fill} stroke={n.stroke} strokeWidth="1.5" />
          <text x={n.x + n.w / 2} y={n.y + 18} fontSize="10" fontWeight="700" fill={n.text}
            textAnchor="middle" fontFamily="ui-sans-serif, system-ui, sans-serif">{n.label}</text>
        </g>
      ))}
    </svg>
  )
}

function SchemaHierarchy() {
  return (
    <div className="border-2 border-gray-800 rounded-xl p-5 bg-white font-mono text-sm space-y-1">
      <div className="text-gray-500 text-xs">Database:</div>
      <div className="pl-4 font-semibold text-gray-800">QA_Database</div>

      <div className="pl-4 text-gray-500 text-xs pt-1">Schema:</div>
      <div className="pl-8 font-semibold text-amber-700 flex items-center gap-2">
        PR_1234
        <span className="text-xs bg-amber-100 text-amber-700 border border-amber-200 rounded px-1.5 py-0.5 font-sans font-medium">dynamically created</span>
      </div>

      <div className="pl-8 text-gray-500 text-xs pt-1">Tables:</div>
      <div className="pl-12 space-y-1 pt-1">
        {[
          'stg_customers',
          'stg_orders',
          'int_enriched_customer',
          'int_customers_by_region',
          'fct_orders_with_customer_details',
        ].map(t => (
          <div key={t} className="flex items-center gap-2 text-xs text-gray-400 italic">
            <span>-</span>
            <span>{t}</span>
          </div>
        ))}
        <div className="text-xs text-gray-300 italic pl-2">(built by CI job)</div>
      </div>
    </div>
  )
}

function QAStep1() {
  return (
    <div className="w-full space-y-6">
      {/* Step headline */}
      <div className="flex items-start gap-4">
        <div className="shrink-0 w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-sm">1</div>
        <div>
          <h4 className="font-bold text-gray-900 text-lg leading-tight">PR Triggers a CI Job: Schema Spun Up</h4>
          <p className="text-gray-500 text-sm mt-1">
            The moment you open a Pull Request, dbt Platform fires a <strong>CI job</strong>. The first thing it does is dynamically create a fresh, isolated schema named after your PR, so your changes can be built and tested without touching any other environment.
          </p>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Left — CI flow + cards */}
        <div className="space-y-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">The CI pipeline</p>
          <CIFlowDiagram />
          <div className="space-y-2">
            <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
              <span className="text-lg mt-0.5">⚡</span>
              <div>
                <p className="text-sm font-semibold text-blue-800">Automatic, not manual</p>
                <p className="text-xs text-blue-700 mt-0.5">You don't trigger the CI job. Your git platform does, the instant the PR is opened or a new commit is pushed to the branch.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
              <span className="text-lg mt-0.5">🏗️</span>
              <div>
                <p className="text-sm font-semibold text-amber-800">One schema per PR</p>
                <p className="text-xs text-amber-700 mt-0.5">
                  Each open PR gets its own schema (e.g. <code className="bg-amber-100 px-1 rounded font-mono">PR_1234</code>). Multiple engineers can have PRs open simultaneously without stepping on each other.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right — schema hierarchy */}
        <div className="space-y-3">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Isolated schema in the data platform</p>
          <SchemaHierarchy />
          <p className="text-xs text-gray-500 leading-relaxed">
            The schema is empty at first. The CI job will build every model into it, giving you a clean, verifiable copy of your changes in isolation.
          </p>
        </div>
      </div>
    </div>
  )
}

function SelectiveDAG({ changedIds = [], runIds = [], uid = 'a', showDeferralHighlight = false }) {
  const [hoverInt, setHoverInt] = useState(false)
  const [hoverBox, setHoverBox] = useState(false)
  const nodes = [
    { id: 0, x: 5,   y: 10,  w: 92, h: 36, lines: ['stg_customers'] },
    { id: 1, x: 5,   y: 58,  w: 92, h: 36, lines: ['stg_geoinfo'] },
    { id: 2, x: 5,   y: 116, w: 92, h: 36, lines: ['stg_orders'] },
    { id: 3, x: 5,   y: 164, w: 92, h: 36, lines: ['stg_product'] },
    { id: 4, x: 155, y: 30,  w: 114, h: 36, lines: ['int_enriched_', 'customer'] },
    { id: 5, x: 155, y: 122, w: 114, h: 36, lines: ['int_enriched_', 'orders'], hoverable: true },
    { id: 6, x: 332, y: 76,  w: 144, h: 36, lines: ['fct_orders_with_', 'customers_details'] },
  ]
  const edges = [[0,4],[1,4],[2,5],[3,5],[4,6],[5,6]]

  const cy  = n => n.y + n.h / 2
  const isRun     = id => runIds.includes(id)
  const isChanged = id => changedIds.includes(id)
  const edgeLive  = (s, d) => isRun(s) && isRun(d)

  const viewH = 210

  return (
    <svg viewBox={`0 0 480 ${viewH}`} className="w-full" overflow="visible">
      <defs>
        <marker id={`ag-${uid}`} markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L0,6 L6,3 z" fill="#16a34a" />
        </marker>
        <marker id={`ag-gray-${uid}`} markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L0,6 L6,3 z" fill="#d1d5db" />
        </marker>
        {showDeferralHighlight && (
          <marker id={`defr-${uid}`} markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
            <path d="M0,0 L0,7 L7,3.5 z" fill="#3b82f6" />
          </marker>
        )}
      </defs>

      {edges.map(([s, d]) => {
        const src = nodes[s], dst = nodes[d]
        const x1 = src.x + src.w, y1 = cy(src)
        const x2 = dst.x - 6,     y2 = cy(dst)
        const mx = (x1 + x2) / 2
        const live = edgeLive(s, d)
        return (
          <path key={`${s}-${d}`}
            d={`M ${x1} ${y1} C ${mx} ${y1} ${mx} ${y2} ${x2} ${y2}`}
            stroke={live ? '#16a34a' : '#d1d5db'} strokeWidth="1.5" fill="none"
            markerEnd={live ? `url(#ag-${uid})` : `url(#ag-gray-${uid})`}
          />
        )
      })}

      {/* Blue dashed box around stg_orders + stg_product only (deferred inputs) */}
      {showDeferralHighlight && (
        <g onMouseEnter={() => setHoverBox(true)} onMouseLeave={() => setHoverBox(false)} style={{ cursor: 'pointer' }}>
          <rect x="0" y="106" width="102" height="102" rx="8"
            fill={hoverBox ? 'rgba(219,234,254,0.55)' : 'rgba(219,234,254,0.35)'}
            stroke="#3b82f6" strokeWidth={hoverBox ? 2.5 : 2} strokeDasharray="6 3"
            style={{ transition: 'fill 0.2s, stroke-width 0.2s, filter 0.2s', filter: hoverBox ? 'drop-shadow(0 3px 8px rgba(59,130,246,0.3))' : 'none' }}
          />
          <path d="M 51 210 C 51 245 51 258 51 288"
            stroke="#3b82f6" strokeWidth="1.5" fill="none" strokeDasharray="4 2"
            markerEnd={`url(#defr-${uid})`} />
          <text x="60" y="248" fontSize="10" fill="#3b82f6" fontFamily="sans-serif" fontWeight="600">inputs read from PROD</text>
        </g>
      )}

      {nodes.map(n => {
        const run = isRun(n.id), changed = isChanged(n.id)
        const isHoverTarget = n.hoverable
        const hovered = isHoverTarget && hoverInt
        const fill   = run ? '#dcfce7' : '#f3f4f6'
        const stroke = run ? '#16a34a' : '#d1d5db'
        const tColor = run ? '#15803d' : '#9ca3af'
        return (
          <g key={n.id}
            onMouseEnter={() => isHoverTarget && setHoverInt(true)}
            onMouseLeave={() => isHoverTarget && setHoverInt(false)}
            style={{ cursor: isHoverTarget ? 'pointer' : 'default' }}
          >
            <rect x={n.x} y={n.y} width={n.w} height={n.h} rx="7"
              fill={fill} stroke={stroke}
              strokeWidth={changed ? 2.5 : 1.5}
              strokeDasharray={changed ? '5 3' : undefined}
              style={{
                transition: 'transform 0.2s, filter 0.2s',
                transformOrigin: `${n.x + n.w/2}px ${n.y + n.h/2}px`,
                transform: hovered ? 'scale(1.08)' : 'scale(1)',
                filter: hovered ? 'drop-shadow(0 4px 10px rgba(22,163,74,0.35))' : 'none',
              }}
            />
            {n.lines.length === 1
              ? <text x={n.x + n.w/2} y={n.y + n.h/2 + 4} fontSize="9" textAnchor="middle"
                  fontFamily="monospace" fill={tColor} fontWeight="700"
                  style={{ transition: 'transform 0.2s', transformOrigin: `${n.x + n.w/2}px ${n.y + n.h/2}px`, transform: hovered ? 'scale(1.08)' : 'scale(1)' }}
                >{n.lines[0]}</text>
              : <>
                  <text x={n.x + n.w/2} y={n.y + n.h/2 - 2} fontSize="9" textAnchor="middle"
                    fontFamily="monospace" fill={tColor} fontWeight="700"
                    style={{ transition: 'transform 0.2s', transformOrigin: `${n.x + n.w/2}px ${n.y + n.h/2}px`, transform: hovered ? 'scale(1.08)' : 'scale(1)' }}
                  >{n.lines[0]}</text>
                  <text x={n.x + n.w/2} y={n.y + n.h/2 + 11} fontSize="9" textAnchor="middle"
                    fontFamily="monospace" fill={tColor} fontWeight="700"
                    style={{ transition: 'transform 0.2s', transformOrigin: `${n.x + n.w/2}px ${n.y + n.h/2}px`, transform: hovered ? 'scale(1.08)' : 'scale(1)' }}
                  >{n.lines[1]}</text>
                </>
            }
          </g>
        )
      })}
    </svg>
  )
}

function DeferralDiagram() {
  const upstream = ['stg_customers', 'stg_geoinfo', 'stg_orders', 'stg_product', 'int_enriched_customer']
  const built    = ['int_enriched_orders', 'fct_orders_with_customers_details']
  return (
    <div className="flex items-stretch gap-3">
      {/* PROD box */}
      <div className="flex-1 border-2 border-green-300 rounded-xl p-3 bg-green-50 space-y-1">
        <div className="text-xs font-bold text-green-700 mb-2 flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
          PROD.analytics
        </div>
        {[...upstream, ...built].map(m => (
          <div key={m} className="text-xs font-mono px-2 py-1 bg-green-100 text-green-800 rounded border border-green-200">
            {m}
          </div>
        ))}
      </div>

      {/* Arrow */}
      <div className="flex flex-col items-center justify-center gap-1 shrink-0">
        <div className="text-xs text-gray-400 font-medium text-center leading-tight">defers<br/>to</div>
        <svg viewBox="0 0 24 40" className="w-5 h-8">
          <path d="M 12 0 L 12 28 L 6 22 M 12 28 L 18 22" stroke="#9ca3af" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {/* QA box */}
      <div className="flex-1 border-2 border-amber-300 rounded-xl p-3 bg-amber-50 space-y-1">
        <div className="text-xs font-bold text-amber-700 mb-2 flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
          QA.PR_1234
        </div>
        {upstream.map(m => (
          <div key={m} className="text-xs font-mono px-2 py-1 bg-white text-gray-400 rounded border border-dashed border-gray-300 flex justify-between items-center">
            <span>{m}</span>
            <span className="text-gray-300 text-xs font-sans italic">↑ prod</span>
          </div>
        ))}
        <div className="border-t border-amber-200 my-1" />
        {built.map((m, i) => (
          <div key={m} className="text-xs font-mono px-2 py-1 rounded border flex justify-between items-center bg-amber-100 text-amber-800 border-amber-300">
            <span>{m}</span>
            <span className={`text-xs font-sans font-bold ${i === 0 ? 'text-amber-600' : 'text-green-600'}`}>{i === 0 ? 'CHANGED' : 'BUILT'}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function QAStep2() {
  const ALL  = [0,1,2,3,4,5,6]
  const SLIM = [5,6]

  return (
    <div className="w-full space-y-6">
      {/* Step headline */}
      <div className="flex items-start gap-4">
        <div className="shrink-0 w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-sm">2</div>
        <div>
          <h4 className="font-bold text-gray-900 text-lg leading-tight">Deferral + Slim CI: Run Only What Changed</h4>
          <p className="text-gray-500 text-sm mt-1">
            The CI job uses two techniques together: <strong>deferral</strong> (read unchanged upstream results from production instead of rebuilding them) and <strong>slim CI</strong> (only build and test the changed model and its downstream dependents).
          </p>
        </div>
      </div>

      {/* Slim CI */}
      <div className="space-y-3">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Slim CI: build only the changed model + its children</p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
          {/* Without slim CI */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-red-100 border border-red-300 text-red-600 text-xs flex items-center justify-center font-bold shrink-0">✗</span>
              <p className="text-xs font-semibold text-gray-600">Without slim CI: rebuilds all 7</p>
            </div>
            <div className="border border-red-200 rounded-xl p-3 bg-red-50">
              <SelectiveDAG changedIds={[5]} runIds={ALL} uid="full" />
            </div>
          </div>

          {/* With slim CI + deferral code panels */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-green-100 border border-green-300 text-green-600 text-xs flex items-center justify-center font-bold shrink-0">✓</span>
              <p className="text-xs font-semibold text-gray-600">With slim CI: builds changed + downstream only</p>
            </div>
            <div className="border border-green-200 rounded-xl p-3 bg-green-50 overflow-visible">
              <SelectiveDAG changedIds={[5]} runIds={SLIM} uid="slim" showDeferralHighlight />
            </div>
          </div>
        </div>

        {/* Code panels — full width, green left border ties to "With slim CI" */}
        <div className="border-l-4 border-green-400 pl-4 space-y-3 mt-2">
          <p className="text-xs font-semibold text-green-600 uppercase tracking-wider">Deferral: how ref() resolves to production at runtime</p>
          <div className="flex items-stretch gap-3">
            <div className="flex-1 min-w-0 border border-gray-200 rounded-lg p-3 bg-gray-50 text-xs font-mono text-gray-700 leading-relaxed overflow-x-auto">
              <div className="text-gray-400 mb-1">int_enriched_orders.sql</div>
              <div><span className="text-blue-600">with</span> orders <span className="text-blue-600">as</span> {'('}</div>
              <div className="pl-4"><span className="text-blue-600">select</span> * <span className="text-blue-600">from</span> {'{{ '}ref(<span className="text-green-600">'stg_orders'</span>){' }}'}</div>
              <div>{'),'}</div>
              <div>products <span className="text-blue-600">as</span> {'('}</div>
              <div className="pl-4"><span className="text-blue-600">select</span> * <span className="text-blue-600">from</span> {'{{ '}ref(<span className="text-green-600">'stg_product'</span>){' }}'}</div>
              <div>{')'}</div>
            </div>
            <div className="shrink-0 self-center text-gray-400 text-lg">→</div>
            <div className="flex-1 min-w-0 border border-blue-200 rounded-lg p-3 bg-blue-50 text-xs font-mono text-gray-700 leading-relaxed overflow-x-auto">
              <div className="text-gray-400 mb-1">compiled (deferred)</div>
              <div><span className="text-blue-600">with</span> orders <span className="text-blue-600">as</span> {'('}</div>
              <div className="pl-4"><span className="text-blue-600">select</span> * <span className="text-blue-600">from</span> <span className="text-amber-600">PROD.analytics.stg_orders</span></div>
              <div>{'),'}</div>
              <div>products <span className="text-blue-600">as</span> {'('}</div>
              <div className="pl-4"><span className="text-blue-600">select</span> * <span className="text-blue-600">from</span> <span className="text-amber-600">PROD.analytics.stg_product</span></div>
              <div>{')'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function CIFlowMerge() {
  // Same flow as CIFlowDiagram but Peer Review + Merge highlighted with dashed box
  const nodes = [
    { x: 30,  y: 44, w: 90,  label: 'Pull Request', fill: '#fef9c3', stroke: '#ca8a04', text: '#92400e' },
    { x: 148, y: 44, w: 100, label: 'dbt CI Job',    fill: '#dbeafe', stroke: '#3b82f6', text: '#1e40af' },
    { x: 264, y: 44, w: 96,  label: 'Peer Review',  fill: '#dbeafe', stroke: '#3b82f6', text: '#1e40af' },
    { x: 374, y: 44, w: 70,  label: 'Merge!',       fill: '#dcfce7', stroke: '#16a34a', text: '#15803d' },
  ]
  return (
    <svg viewBox="0 0 480 132" className="w-full">
      {/* Main branch line */}
      <line x1="0" y1="106" x2="480" y2="106" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" />

      {/* PR arc up */}
      <path d="M 60 106 C 60 106 60 66 75 66" stroke="#f59e0b" strokeWidth="2.5" fill="none" />
      <line x1="120" y1="66" x2="148" y2="66" stroke="#f59e0b" strokeWidth="2.5" />
      <line x1="248" y1="66" x2="264" y2="66" stroke="#f59e0b" strokeWidth="2.5" />
      <line x1="360" y1="66" x2="374" y2="66" stroke="#f59e0b" strokeWidth="2.5" />
      {/* Merge arc down */}
      <path d="M 444 66 C 444 66 452 66 452 106" stroke="#f59e0b" strokeWidth="2.5" fill="none" />

      {/* Merge dot on main */}
      <circle cx="452" cy="106" r="6" fill="#22c55e" stroke="white" strokeWidth="2" />
      <circle cx="60"  cy="106" r="5" fill="#f59e0b" />

      {/* Dashed highlight box around Peer Review + Merge */}
      <rect x="248" y="34" width="202" height="52" rx="8"
        fill="none" stroke="#374151" strokeWidth="1.5" strokeDasharray="6 3" />

      {/* Nodes */}
      {nodes.map((n, i) => (
        <g key={i}>
          <rect x={n.x} y={n.y} width={n.w} height={28} rx="8" fill={n.fill} stroke={n.stroke} strokeWidth="1.5" />
          <text x={n.x + n.w/2} y={n.y + 18} fontSize="10" fontWeight="700" fill={n.text}
            textAnchor="middle" fontFamily="ui-sans-serif, system-ui, sans-serif">{n.label}</text>
        </g>
      ))}

      {/* Default branch node */}
      <rect x="4" y="82" width="120" height="28" rx="7" fill="#f0fdf4" stroke="#22c55e" strokeWidth="1.5" />
      <text x="64" y="100" fontSize="9" fontWeight="700" fill="#15803d" textAnchor="middle" fontFamily="monospace">main (protected)</text>
    </svg>
  )
}

function DataDiffUI() {
  const modified = ['fct_orders_with_customers_details', 'int_enriched_orders', 'stg_orders', 'stg_customers']
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm text-sm">
      {/* Run header */}
      <div className="px-4 py-3 border-b border-gray-200 space-y-1">
        <div className="flex items-center gap-3">
          <span className="font-bold text-gray-900 text-base">Run #408483885</span>
          <span className="flex items-center gap-1 bg-green-100 text-green-700 border border-green-300 text-xs font-semibold px-2 py-0.5 rounded-full">
            <span>✓</span> Success
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs text-gray-500 flex-wrap">
          <span>⏱ Finished 1m 52s ago</span>
          <span>⌛ 36s</span>
          <span className="text-blue-600 underline cursor-pointer">#b97186f</span>
          <span className="text-blue-600 underline cursor-pointer">Pull Request #13</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 text-xs font-medium text-gray-500">
        {['Run summary', 'Lineage', 'Model timing', 'Artifacts', 'Compare'].map(t => (
          <button key={t} className={`px-4 py-2 border-b-2 transition-colors ${t === 'Compare' ? 'border-gray-900 text-gray-900' : 'border-transparent hover:text-gray-700'}`}>
            {t}
          </button>
        ))}
      </div>

      <div className="p-4 space-y-4">
        <h5 className="font-semibold text-gray-900">Compare changes</h5>

        {/* Summary counters */}
        <div className="border border-gray-200 rounded-lg p-3 flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded bg-amber-500 flex items-center justify-center text-white text-xs font-bold">•</span>
            <span className="text-xs text-gray-600">Modified <strong className="text-gray-900 ml-1">6</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded bg-green-500 flex items-center justify-center text-white text-xs font-bold">+</span>
            <span className="text-xs text-gray-600">Added <strong className="text-gray-900 ml-1">0</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded bg-red-500 flex items-center justify-center text-white text-xs font-bold">−</span>
            <span className="text-xs text-gray-600">Removed <strong className="text-gray-900 ml-1">0</strong></span>
          </div>
        </div>

        {/* Modified list */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-4 h-4 rounded bg-amber-500 flex items-center justify-center text-white text-xs font-bold">•</span>
            <span className="text-xs font-semibold text-gray-700">Modified</span>
          </div>
          <div className="divide-y divide-gray-100 border border-gray-200 rounded-lg overflow-hidden">
            {modified.map(m => (
              <div key={m} className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 cursor-pointer">
                <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <ellipse cx="12" cy="12" rx="9" ry="5.5" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <ellipse cx="12" cy="12" rx="9" ry="5.5" />
                </svg>
                <span className="text-xs text-gray-700">{m}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function ModelDiffDetail() {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm text-sm">
      {/* Model header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200">
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <ellipse cx="12" cy="12" rx="9" ry="5.5" /><line x1="3" y1="12" x2="21" y2="12" />
        </svg>
        <span className="font-semibold text-gray-800">stg_campaigns</span>
      </div>

      {/* Sub-tabs */}
      <div className="flex border-b border-gray-200 text-xs font-medium text-gray-500 px-2">
        {['Overview', 'Primary keys', 'Modified rows ⚠', 'Columns ⚠'].map((t, i) => (
          <button key={t} className={`px-3 py-2 border-b-2 transition-colors ${i === 0 ? 'border-gray-900 text-gray-900' : 'border-transparent'}`}>{t}</button>
        ))}
      </div>

      <div className="p-4">
        <div className="grid grid-cols-3 gap-3">
          {/* Primary keys */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-700">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>
              Primary keys
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[['Added', '0'], ['Removed', '0']].map(([l, v]) => (
                <div key={l} className="text-center">
                  <div className="text-xs text-gray-400">{l}</div>
                  <div className="text-xl font-bold text-gray-900">{v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Rows */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-700">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/></svg>
              Rows
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[['Modified', '1,200'], ['Diff', '100%']].map(([l, v]) => (
                <div key={l} className={`text-center rounded p-1 ${l === 'Diff' || l === 'Modified' ? 'bg-amber-50 border border-amber-200' : ''}`}>
                  <div className="text-xs text-gray-400">{l}</div>
                  <div className="text-xl font-bold text-amber-700">{v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Columns */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-700">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/></svg>
              Columns
            </div>
            <div className="grid grid-cols-2 gap-1">
              {[['Modified', '1'], ['Added', '0']].map(([l, v]) => (
                <div key={l} className={`text-center rounded p-1 ${l === 'Modified' ? 'bg-amber-50 border border-amber-200' : ''}`}>
                  <div className="text-xs text-gray-400">{l}</div>
                  <div className="text-lg font-bold text-gray-900">{v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function QAStep3() {
  return (
    <div className="w-full space-y-6">
      {/* Step headline */}
      <div className="flex items-start gap-4">
        <div className="shrink-0 w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-sm">3</div>
        <div>
          <h4 className="font-bold text-gray-900 text-lg leading-tight">Data Diffing</h4>
          <p className="text-gray-500 text-sm mt-1">
            After CI builds and tests pass, dbt provides <strong>data-level before &amp; after comparisons</strong> between your PR's output and production.
            This catches issues that SQL validation and data quality tests alone can't, like unexpected row changes or column drift.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left — dbt Platform UI */}
        <div className="space-y-3">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">dbt Platform UI: Compare tab</p>
          <DataDiffUI />
          <ModelDiffDetail />
        </div>

        {/* Right — concept cards */}
        <div className="space-y-3">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Why data diffing matters</p>

          <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
            <span className="text-lg mt-0.5">🔬</span>
            <div>
              <p className="text-sm font-semibold text-blue-800">Beyond tests: row-level inspection</p>
              <p className="text-xs text-blue-700 mt-0.5">Tests tell you pass/fail. Data diffing shows you <em>how many rows changed</em>, which columns shifted, and whether primary keys were added or removed.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
            <span className="text-lg mt-0.5">⚠️</span>
            <div>
              <p className="text-sm font-semibold text-amber-800">Catch unexpected side effects</p>
              <p className="text-xs text-amber-700 mt-0.5">A change to a join condition might pass all tests but silently double-count rows. A 100% row diff is a red flag that tests alone would not surface.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-green-50 border border-green-200 rounded-lg px-4 py-3">
            <span className="text-lg mt-0.5">📊</span>
            <div>
              <p className="text-sm font-semibold text-green-800">Model-level and column-level</p>
              <p className="text-xs text-green-700 mt-0.5">Drill from the run-level summary (6 modified models) down to a specific model to see exactly which rows and columns changed.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function QAStep4() {
  return (
    <div className="w-full space-y-6">
      {/* Step headline */}
      <div className="flex items-start gap-4">
        <div className="shrink-0 w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-sm">4</div>
        <div>
          <h4 className="font-bold text-gray-900 text-lg leading-tight">Code Review &amp; Merge</h4>
          <p className="text-gray-500 text-sm mt-1">
            CI passing is necessary but not sufficient. At least one teammate reviews the code before it merges, because code can be <strong>technically valid</strong> yet still fail to answer the right business question.
            Once approved, the branch is merged back into <code className="bg-gray-100 px-1 rounded text-xs font-mono">main</code>.
          </p>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Left — flow diagram */}
        <div className="space-y-3">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Where we are in the pipeline</p>
          <CIFlowMerge />

          <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-xs text-gray-600 leading-relaxed">
            <strong className="text-gray-800">Why not just trust CI?</strong> Automated tests validate that SQL runs and data constraints hold.
            They can't validate that <em>the logic makes business sense</em>. A reviewer checks the intent, not just the syntax.
          </div>
        </div>

        {/* Right — concept cards */}
        <div className="space-y-3">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">The review &amp; merge process</p>

          <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
            <span className="text-lg mt-0.5">👀</span>
            <div>
              <p className="text-sm font-semibold text-blue-800">Peer review on git</p>
              <p className="text-xs text-blue-700 mt-0.5">
                Teammates read the diff, leave comments, and approve or request changes in the PR before anyone clicks merge.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
            <span className="text-lg mt-0.5">🧠</span>
            <div>
              <p className="text-sm font-semibold text-amber-800">Technical ≠ correct</p>
              <p className="text-xs text-amber-700 mt-0.5">
                A model can compile, pass tests, and still calculate revenue wrong. Review catches logic errors, naming issues, and missed edge cases that automated checks can't.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-green-50 border border-green-200 rounded-lg px-4 py-3">
            <span className="text-lg mt-0.5">🔀</span>
            <div>
              <p className="text-sm font-semibold text-green-800">Merge closes the loop</p>
              <p className="text-xs text-green-700 mt-0.5">
                Once approved, the feature branch merges into <code className="bg-green-100 px-1 rounded font-mono text-xs">main</code>. The PR schema in the data platform is cleaned up, and the Production deployment job picks up the new code on its next run.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ProductionJobUI() {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm text-sm divide-y divide-gray-100">

      {/* Execution settings */}
      <div className="grid grid-cols-[160px_1fr] divide-x divide-gray-100">
        <div className="p-4">
          <p className="font-semibold text-gray-900 text-sm">Execution settings</p>
        </div>
        <div className="p-4 space-y-3">
          {/* Commands */}
          <div className="space-y-1.5">
            <label className="text-xs text-gray-500 flex items-center gap-1">
              Commands
              <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4m0-4h.01"/></svg>
            </label>
            <div className="flex items-center gap-2 border border-gray-200 rounded px-3 py-2 bg-white">
              <svg className="w-3.5 h-3.5 text-gray-300 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path d="M7 4a1 1 0 0 0 0 2h6a1 1 0 1 0 0-2H7zm0 4a1 1 0 0 0 0 2h6a1 1 0 1 0 0-2H7zm0 4a1 1 0 0 0 0 2h4a1 1 0 1 0 0-2H7z"/>
              </svg>
              <code className="text-xs text-gray-800">dbt build</code>
            </div>
            <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700">
              <span className="text-base leading-none">+</span> Add command
            </button>
          </div>

          {/* Checkboxes */}
          <div className="space-y-2 pt-1">
            <label className="flex items-start gap-2 cursor-pointer">
              <div className="mt-0.5 w-4 h-4 rounded bg-indigo-600 flex items-center justify-center shrink-0">
                <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20 6L9 17l-5-5"/></svg>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-700">Generate docs on run</p>
                <p className="text-xs text-gray-400">Automatically generate updated project docs each time this job runs</p>
              </div>
            </label>

            <div className="space-y-2">
              <p className="text-xs font-medium text-gray-500 flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/></svg>
                More options
              </p>
              <label className="flex items-start gap-2 cursor-pointer">
                <div className="mt-0.5 w-4 h-4 rounded bg-indigo-600 flex items-center justify-center shrink-0">
                  <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20 6L9 17l-5-5"/></svg>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-700">dbt state</p>
                  <p className="text-xs text-gray-400">Enable orchestration that adapts to state changes.</p>
                </div>
              </label>
              <label className="flex items-start gap-2 cursor-pointer">
                <div className="mt-0.5 w-4 h-4 rounded bg-indigo-600 flex items-center justify-center shrink-0">
                  <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20 6L9 17l-5-5"/></svg>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-700">Efficient Testing</p>
                  <p className="text-xs text-gray-400">Aggregate generic tests into a single query and reuse redundant tests across lineage.</p>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Triggers */}
      <div className="grid grid-cols-[160px_1fr] divide-x divide-gray-100">
        <div className="p-4">
          <p className="font-semibold text-gray-900 text-sm">Triggers</p>
          <p className="text-xs text-gray-400 mt-1">Configure when this job should run.</p>
        </div>
        <div className="p-4 space-y-3">
          <p className="text-xs font-semibold text-gray-700">Schedule</p>

          {/* Run on schedule toggle */}
          <label className="flex items-start gap-3 cursor-pointer">
            <div className="mt-0.5 w-9 h-5 rounded-full bg-indigo-600 flex items-center px-0.5 shrink-0">
              <div className="w-4 h-4 bg-white rounded-full ml-auto" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-800">Run on schedule</p>
              <p className="text-xs text-gray-400">Triggers a run when the schedule is active.</p>
            </div>
          </label>

          {/* Timing */}
          <div className="space-y-1.5">
            <label className="text-xs text-gray-500">Timing</label>
            <div className="flex items-center justify-between border border-gray-200 rounded px-3 py-2 bg-white">
              <span className="text-xs text-gray-700">Intervals</span>
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/></svg>
            </div>
          </div>

          {/* Run every */}
          <div className="space-y-1.5">
            <label className="text-xs text-gray-500">Run every (UTC)</label>
            <div className="flex items-center justify-between border border-gray-200 rounded px-3 py-2 bg-white">
              <span className="text-xs text-gray-700">Every 12 hours</span>
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/></svg>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

function ProductionStep1() {
  return (
    <div className="w-full space-y-6">
      {/* Step headline */}
      <div className="flex items-start gap-4">
        <div className="shrink-0 w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-sm">1</div>
        <div>
          <h4 className="font-bold text-gray-900 text-lg leading-tight">Create a Production Job</h4>
          <p className="text-gray-500 text-sm mt-1">
            A job is created using your <strong>production environment</strong>. This tells dbt which database and schema are considered production and which service account role has permissions to write there.
            The job runs <code className="bg-gray-100 px-1 rounded text-xs font-mono">dbt build</code> on a schedule, rebuilding every model and running every test.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left — dbt Platform UI */}
        <div className="space-y-3">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">dbt Platform UI: Job settings</p>
          <ProductionJobUI />
        </div>

        {/* Right — concept cards */}
        <div className="space-y-3">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">What a production job does</p>

          <div className="flex items-start gap-3 bg-green-50 border border-green-200 rounded-lg px-4 py-3">
            <span className="text-lg mt-0.5">🏭</span>
            <div>
              <p className="text-sm font-semibold text-green-800">Tied to the production environment</p>
              <p className="text-xs text-green-700 mt-0.5">
                The job inherits the env's credentials: the <code className="bg-green-100 px-1 rounded font-mono text-xs">TRANSFORMER</code> role, <code className="bg-green-100 px-1 rounded font-mono text-xs">PROD</code> database, and <code className="bg-green-100 px-1 rounded font-mono text-xs">analytics</code> schema. This is where dashboards read from.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
            <span className="text-lg mt-0.5">⚙️</span>
            <div>
              <p className="text-sm font-semibold text-blue-800"><code className="bg-blue-100 px-1 rounded font-mono text-xs">dbt build</code> = run + test in one</p>
              <p className="text-xs text-blue-700 mt-0.5">
                <code className="bg-blue-100 px-1 rounded font-mono text-xs">dbt build</code> runs models, seeds, snapshots, <em>and</em> tests in dependency order. A full end-to-end pipeline in a single command.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-indigo-50 border border-indigo-200 rounded-lg px-4 py-3">
            <span className="text-lg mt-0.5">🕐</span>
            <div>
              <p className="text-sm font-semibold text-indigo-800">Scheduled to run automatically</p>
              <p className="text-xs text-indigo-700 mt-0.5">
                The job runs on a cron-like schedule (e.g. every 12 hours). No human needs to trigger it. When merged code lands on <code className="bg-indigo-100 px-1 rounded font-mono text-xs">main</code>, the next scheduled run picks it up.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
            <span className="text-lg mt-0.5">🧠</span>
            <div>
              <p className="text-sm font-semibold text-amber-800">dbt state</p>
              <p className="text-xs text-amber-700 mt-0.5">
                With dbt state enabled, prod builds only what actually changed since the last successful run, keeping warehouse costs low on large projects.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Production Step 2 sub-components ─────────────────────── */

function CodeLine({ parts }) {
  const colors = {
    kw:      'text-blue-400',
    jinja:   'text-orange-400',
    fqn:     'text-cyan-400',
    str:     'text-green-400',
    comment: 'text-gray-500 italic',
    dim:     'text-gray-400',
    plain:   'text-gray-200',
  }
  return (
    <div className="leading-5">
      {parts.map((p, i) => (
        <span key={i} className={colors[p.t] || colors.plain}>{p.v}</span>
      ))}
    </div>
  )
}

function GitPanel() {
  const tree = [
    { d: 0, dir: true,  name: 'my-dbt-project/' },
    { d: 1, dir: true,  name: 'models/' },
    { d: 2, dir: true,  name: '01_staging/' },
    { d: 3, dir: false, name: 'stg_customers.sql' },
    { d: 3, dir: false, name: 'stg_orders.sql' },
    { d: 2, dir: true,  name: '02_int/' },
    { d: 3, dir: false, name: 'int_enriched_orders.sql', active: true },
    { d: 2, dir: true,  name: '03_mart/' },
    { d: 3, dir: false, name: 'fct_orders_with_customers_details.sql' },
    { d: 0, dir: false, name: 'dbt_project.yml' },
  ]
  const code = [
    [{ t:'comment', v:'-- int_enriched_orders.sql' }],
    [{ t:'jinja', v:'{{config(materialized=' }, { t:'str', v:"'table'" }, { t:'jinja', v:')}}' }],
    [],
    [{ t:'kw', v:'select' }],
    [{ t:'plain', v:'  c.id, c.name, c.region,' }],
    [{ t:'plain', v:'  o.order_id, o.amount' }],
    [{ t:'kw', v:'from ' }, { t:'jinja', v:"{{ref('int_enriched_customer')}}" }, { t:'plain', v:' c' }],
    [{ t:'kw', v:'join ' }, { t:'jinja', v:"{{ref('stg_orders')}}" }, { t:'plain', v:' o' }],
    [{ t:'plain', v:'  ' }, { t:'kw', v:'on' }, { t:'plain', v:' c.id = o.customer_id' }],
  ]
  return (
    <div className="flex-1 min-w-0 space-y-3">
      {/* Icon + title */}
      <div className="flex flex-col items-center gap-2">
        <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/>
            <path d="M6 9v6M9 6h6M18 15v-3a3 3 0 0 0-3-3h-3"/>
          </svg>
        </div>
        <div className="text-center">
          <p className="font-bold text-gray-900">Git</p>
          <p className="text-xs text-gray-500">Code source of truth</p>
        </div>
      </div>

      {/* File tree */}
      <div className="border border-gray-200 rounded-lg p-3 bg-gray-50 font-mono text-xs leading-5">
        {tree.map((item, i) => (
          <div key={i} style={{ paddingLeft: item.d * 12 }}
            className={`flex items-center gap-1 py-px rounded ${item.active ? 'bg-blue-100' : ''}`}>
            <span className="text-gray-400">{item.dir ? '📁' : '📄'}</span>
            <span className={item.active ? 'text-blue-700 font-semibold' : item.dir ? 'text-blue-600 font-medium' : 'text-gray-600'}>
              {item.name}
            </span>
          </div>
        ))}
      </div>

      {/* dbt source code */}
      <div className="bg-gray-900 rounded-lg p-3 font-mono text-xs overflow-hidden">
        {code.map((parts, i) => (
          parts.length ? <CodeLine key={i} parts={parts} /> : <div key={i} className="h-2" />
        ))}
      </div>
    </div>
  )
}

function DbtPanel() {
  const waves = [
    { label: 'Wave 1 (parallel)', models: ['stg_customers', 'stg_orders'], color: 'bg-orange-100 text-orange-800 border-orange-200' },
    { label: 'Wave 2 (parallel)', models: ['int_enriched_customer', 'int_enriched_orders'], color: 'bg-orange-100 text-orange-800 border-orange-200' },
    { label: 'Wave 3',            models: ['fct_orders_with_customers_details'],             color: 'bg-orange-100 text-orange-800 border-orange-200' },
  ]
  const compiled = [
    [{ t:'kw', v:'create table' }],
    [{ t:'fqn', v:'PROD.analytics.int_enriched_orders' }],
    [{ t:'kw', v:'as select' }],
    [{ t:'plain', v:'  c.id, c.name, c.region,' }],
    [{ t:'plain', v:'  o.order_id, o.amount' }],
    [{ t:'kw', v:'from ' }, { t:'fqn', v:'PROD.analytics.int_enriched_customer' }, { t:'plain', v:' c' }],
    [{ t:'kw', v:'join ' }, { t:'fqn', v:'PROD.analytics.stg_orders' }, { t:'plain', v:' o' }],
    [{ t:'plain', v:'  ' }, { t:'kw', v:'on' }, { t:'plain', v:' c.id = o.customer_id' }],
  ]
  return (
    <div className="flex-1 min-w-0 space-y-3">
      {/* Icon + title */}
      <div className="flex flex-col items-center gap-2">
        <div className="w-14 h-14 rounded-2xl shadow-lg flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #FF694A 0%, #E8521E 100%)' }}>
          <span className="text-white font-black text-xl tracking-tight">dbt</span>
        </div>
        <div className="text-center">
          <p className="font-bold text-gray-900">dbt</p>
          <p className="text-xs text-gray-500">Plans &amp; compiles</p>
        </div>
      </div>

      {/* Execution plan */}
      <div className="border border-orange-200 rounded-lg p-3 bg-orange-50 space-y-2">
        <p className="text-xs font-semibold text-orange-700 mb-2">Execution plan</p>
        {waves.map((w, wi) => (
          <div key={wi}>
            {wi > 0 && (
              <div className="flex items-center gap-1 my-1">
                <div className="flex-1 border-t border-dashed border-orange-200" />
                <span className="text-xs text-orange-400 font-medium">then</span>
                <div className="flex-1 border-t border-dashed border-orange-200" />
              </div>
            )}
            <div>
              <p className="text-xs text-orange-500 mb-1">{w.label}</p>
              <div className="flex flex-wrap gap-1">
                {w.models.map(m => (
                  <span key={m} className={`text-xs font-mono px-1.5 py-0.5 rounded border ${w.color}`}>{m}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Compiled SQL */}
      <div>
        <div className="bg-gray-900 rounded-lg p-3 font-mono text-xs overflow-hidden">
          {compiled.map((parts, i) => (
            parts.length ? <CodeLine key={i} parts={parts} /> : <div key={i} className="h-2" />
          ))}
        </div>
      </div>
    </div>
  )
}

function DataPlatformPanel() {
  const tables = [
    { name: 'stg_customers',                    done: true },
    { name: 'stg_orders',                       done: true },
    { name: 'int_enriched_customer',            done: true },
    { name: 'int_enriched_orders',              done: true,  active: true },
    { name: 'fct_orders_with_customers_details', done: false },
  ]
  return (
    <div className="flex-1 min-w-0 space-y-3">
      {/* Icon + title */}
      <div className="flex flex-col items-center gap-2">
        <div className="w-14 h-14 rounded-2xl bg-green-600 flex items-center justify-center shadow-lg">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
            <ellipse cx="12" cy="5" rx="9" ry="3"/>
            <path d="M3 5v4c0 1.657 4.03 3 9 3s9-1.343 9-3V5"/>
            <path d="M3 9v4c0 1.657 4.03 3 9 3s9-1.343 9-3V9"/>
            <path d="M3 13v4c0 1.657 4.03 3 9 3s9-1.343 9-3v-4"/>
          </svg>
        </div>
        <div className="text-center">
          <p className="font-bold text-gray-900">Data Platform</p>
          <p className="text-xs text-gray-500">Executes &amp; materializes</p>
        </div>
      </div>

      {/* Schema hierarchy */}
      <div className="border border-green-200 rounded-lg overflow-hidden bg-white">
        <div className="bg-green-50 border-b border-green-100 px-3 py-2 flex items-center gap-2">
          <svg className="w-3.5 h-3.5 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <ellipse cx="12" cy="12" rx="9" ry="5.5"/>
          </svg>
          <span className="text-xs font-bold text-green-700 font-mono">PROD</span>
          <span className="text-gray-300 text-xs">›</span>
          <span className="text-xs font-mono text-green-700">analytics</span>
        </div>
        <div className="divide-y divide-gray-50">
          {tables.map(t => (
            <div key={t.name}
              className={`flex items-center justify-between px-3 py-2 ${t.active ? 'bg-green-50' : ''}`}>
              <div className="flex items-center gap-2">
                <svg className={`w-3.5 h-3.5 shrink-0 ${t.done ? 'text-green-500' : 'text-gray-300'}`}
                  fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <ellipse cx="12" cy="12" rx="9" ry="5.5"/>
                  <line x1="3" y1="12" x2="21" y2="12"/>
                </svg>
                <span className={`text-xs font-mono ${t.active ? 'text-green-800 font-semibold' : t.done ? 'text-gray-700' : 'text-gray-400'}`}>
                  {t.name}
                </span>
              </div>
              {t.active && (
                <span className="text-xs bg-green-600 text-white px-1.5 py-0.5 rounded font-medium">building</span>
              )}
              {t.done && !t.active && (
                <svg className="w-3.5 h-3.5 text-green-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                </svg>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Materialization note */}
      <div className="bg-green-50 border border-green-200 rounded-lg px-3 py-3 space-y-1.5">
        <p className="text-xs font-semibold text-green-800">Materialized as a table</p>
        <p className="text-xs text-green-700 leading-relaxed font-mono">PROD.analytics.int_enriched_orders</p>
        <p className="text-xs text-green-600">Physical rows written to your data platform. Downstream models and dashboards can now query it.</p>
      </div>
    </div>
  )
}

function FlowArrow({ label, bidirectional = false }) {
  return (
    <div className="flex flex-col items-center justify-center gap-1 shrink-0 pt-20">
      <svg className="w-8 h-5" viewBox="0 0 32 20" fill="none">
        {bidirectional
          ? <>
              <path d="M2 6 L28 6" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round"/>
              <path d="M22 2 L28 6 L22 10" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              <path d="M30 14 L4 14" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round"/>
              <path d="M10 10 L4 14 L10 18" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            </>
          : <>
              <path d="M2 10 L26 10" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round"/>
              <path d="M20 5 L27 10 L20 15" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            </>
        }
      </svg>
      {label && <span className="text-xs text-gray-400 text-center leading-tight max-w-[70px]">{label}</span>}
    </div>
  )
}

function ProductionStep2() {
  return (
    <div className="w-full space-y-6">
      {/* Step headline */}
      <div className="flex items-start gap-4">
        <div className="shrink-0 w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-sm">2</div>
        <div>
          <h4 className="font-bold text-gray-900 text-lg leading-tight">How a Production Run Works</h4>
          <p className="text-gray-500 text-sm mt-1">
            When the production job fires, three systems work in sequence: <strong>Git</strong> holds the code, <strong>dbt</strong> builds an execution plan and compiles Jinja into raw SQL, and the <strong>data platform</strong> executes that SQL and materializes the results.
          </p>
        </div>
      </div>

      {/* Three-panel flow */}
      <div className="flex items-start gap-2 overflow-hidden">
        <div className="flex-1 min-w-0 overflow-hidden"><GitPanel /></div>
        <FlowArrow label="reads & compiles" />
        <div className="flex-1 min-w-0 overflow-hidden"><DbtPanel /></div>
        <FlowArrow label="executes SQL" />
        <div className="flex-1 min-w-0 overflow-hidden"><DataPlatformPanel /></div>
      </div>
    </div>
  )
}

function PlaceholderContent({ phase, step }) {
  return (
    <div className="flex items-center justify-center min-h-48 text-center text-gray-400">
      <div>
        <p className="text-lg font-medium">{phase} · {step}</p>
        <p className="text-sm mt-1">Coming soon</p>
      </div>
    </div>
  )
}

/* ─── Content router ──────────────────────────────────────── */

function StepContent({ phaseId, stepId }) {
  if (phaseId === 'develop' && stepId === 1) return <DevelopStep1 />
  if (phaseId === 'develop' && stepId === 2) return <DevelopStep2 />
  if (phaseId === 'develop' && stepId === 3) return <DevelopStep3 />
  if (phaseId === 'develop' && stepId === 4) return <DevelopStep4 />
  if (phaseId === 'qa'      && stepId === 1) return <QAStep1 />
  if (phaseId === 'qa'      && stepId === 2) return <QAStep2 />
  if (phaseId === 'qa'      && stepId === 3) return <QAStep3 />
  if (phaseId === 'qa'          && stepId === 4) return <QAStep4 />
  if (phaseId === 'production'  && stepId === 1) return <ProductionStep1 />
  if (phaseId === 'production'  && stepId === 2) return <ProductionStep2 />
  const phase = PHASES.find(p => p.id === phaseId)
  const step  = phase?.steps.find(s => s.id === stepId)
  return <PlaceholderContent phase={phase?.label} step={step?.label} />
}

/* ─── Phase / step data ───────────────────────────────────── */

const PHASES = [
  {
    id: 'develop',
    label: 'Develop',
    color: 'blue',
    steps: [
      { id: 1, label: 'Step 1' },
      { id: 2, label: 'Step 2' },
      { id: 3, label: 'Step 3' },
      { id: 4, label: 'Step 4' },
    ],
  },
  {
    id: 'qa',
    label: 'QA',
    color: 'amber',
    steps: [
      { id: 1, label: 'Step 1' },
      { id: 2, label: 'Step 2' },
      { id: 3, label: 'Step 3' },
      { id: 4, label: 'Step 4' },
    ],
  },
  {
    id: 'production',
    label: 'Production',
    color: 'green',
    steps: [
      { id: 1, label: 'Step 1' },
      { id: 2, label: 'Step 2' },
    ],
  },
]

const PALETTE = {
  blue:  { active: 'bg-gray-900 text-white shadow-sm',  inactive: 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 shadow-sm',  step: 'bg-gray-900 text-white',  stepInactive: 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50' },
  amber: { active: 'bg-gray-900 text-white shadow-sm', inactive: 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 shadow-sm', step: 'bg-gray-900 text-white', stepInactive: 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50' },
  green: { active: 'bg-gray-900 text-white shadow-sm', inactive: 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 shadow-sm', step: 'bg-gray-900 text-white', stepInactive: 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50' },
}

/* ─── Develop-only export (no QA/Prod phase tabs) ──────────── */

export function DevelopPhaseOnly() {
  const [activeStep, setActiveStep] = useState(1)
  const devSteps = [
    { id: 1, label: 'Step 1: Add credentials' },
    { id: 2, label: 'Step 2: Create a branch' },
    { id: 3, label: 'Step 3: Commit & sync' },
    { id: 4, label: 'Step 4: Open a PR' },
  ]

  return (
    <div className="w-full space-y-6">
      {/* Step tabs */}
      <div className="flex gap-2 flex-wrap">
        {devSteps.map(s => (
          <button
            key={s.id}
            onClick={() => setActiveStep(s.id)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 ${
              s.id === activeStep
                ? 'bg-gray-900 text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Content area */}
      <motion.div
        key={activeStep}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="bg-white border border-gray-200 rounded-xl p-6 md:p-8"
      >
        <StepContent phaseId="develop" stepId={activeStep} />
      </motion.div>
    </div>
  )
}

/* ─── Main export ─────────────────────────────────────────── */

export default function DevelopmentWorkflow() {
  const [activePhase, setActivePhase] = useState('develop')
  const [activeStep,  setActiveStep]  = useState(1)

  const phase = PHASES.find(p => p.id === activePhase)
  const pal   = PALETTE[phase.color]

  function switchPhase(id) {
    setActivePhase(id)
    setActiveStep(1)
  }

  return (
    <div className="w-full space-y-6">

      {/* Phase tabs */}
      <div className="flex gap-2">
        {PHASES.map(p => {
          const isActive = p.id === activePhase
          const c = PALETTE[p.color]
          return (
            <button
              key={p.id}
              onClick={() => switchPhase(p.id)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-150 ${isActive ? c.active : c.inactive}`}
            >
              {p.label}
            </button>
          )
        })}
      </div>

      {/* Step tabs */}
      <motion.div
        key={activePhase}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="flex gap-2 flex-wrap"
      >
        {phase.steps.map(s => {
          const isActive = s.id === activeStep
          return (
            <button
              key={s.id}
              onClick={() => setActiveStep(s.id)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 ${isActive ? pal.step : pal.stepInactive}`}
            >
              {s.label}
            </button>
          )
        })}
      </motion.div>

      {/* Content area */}
      <motion.div
        key={`${activePhase}-${activeStep}`}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="bg-white border border-gray-200 rounded-xl p-6 md:p-8"
      >
        <StepContent phaseId={activePhase} stepId={activeStep} />
      </motion.div>
    </div>
  )
}
