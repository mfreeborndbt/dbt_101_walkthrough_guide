import { motion } from 'framer-motion'
import { useState } from 'react'

const CATEGORIES = [
  {
    id: 'auth',
    number: 1,
    label: 'Authentication',
    color: 'blue',
    icon: '🔑',
    description: 'Proves to the data platform who is connecting.',
    fields: [
      { name: 'Account',              value: 'zna84829',           hint: 'The data platform account to connect to' },
      { name: 'Auth method',          value: 'Key pair',           hint: 'How the connection is authenticated' },
      { name: 'Username',             value: 'service_user__sa_demo', hint: 'Service account used for this environment' },
      { name: 'Private key',          value: '••••••••••••••',      hint: 'Encrypted private key for key-pair auth' },
      { name: 'Private key passphrase', value: '••••••••••••••',   hint: 'Passphrase to decrypt the private key' },
    ],
  },
  {
    id: 'authz',
    number: 2,
    label: 'Authorization',
    color: 'purple',
    icon: '🛡️',
    description: 'Defines what the connection is allowed to do.',
    fields: [
      { name: 'Role',      value: 'TRANSFORMER',     hint: 'Default role assumed when connecting to the data platform' },
      { name: 'Warehouse', value: 'TRANSFORMING_V2', hint: 'Virtual warehouse used for running queries' },
    ],
  },
  {
    id: 'dest',
    number: 3,
    label: 'Destination',
    color: 'green',
    icon: '🎯',
    description: 'Tells dbt where to write its output tables.',
    fields: [
      { name: 'Database', value: 'DATA_ENGINEERING', hint: 'The logical database dbt writes models into' },
      { name: 'Schema',   value: 'PRODUCTION',       hint: 'Default schema. dbt can override per model' },
    ],
  },
  {
    id: 'dbt',
    number: 4,
    label: 'dbt Interaction',
    color: 'orange',
    icon: '⚙️',
    description: 'Sets how the dbt platform treats this environment.',
    fields: [
      { name: 'Environment name', value: 'Production',  hint: 'Friendly name shown in the dbt platform' },
      { name: 'Environment type', value: 'Deployment',  hint: 'Development or Deployment' },
      { name: 'Deployment type',  value: 'PROD',        hint: 'General · STG · Staging · PROD Production' },
    ],
  },
]

const PALETTE = {
  blue:   { bg: 'bg-blue-50',   border: 'border-blue-300',   badge: 'bg-blue-600',   text: 'text-blue-900',   field: 'bg-blue-100 text-blue-800' },
  purple: { bg: 'bg-purple-50', border: 'border-purple-300', badge: 'bg-purple-600', text: 'text-purple-900', field: 'bg-purple-100 text-purple-800' },
  green:  { bg: 'bg-green-50',  border: 'border-green-300',  badge: 'bg-green-600',  text: 'text-green-900',  field: 'bg-green-100 text-green-800' },
  orange: { bg: 'bg-orange-50', border: 'border-orange-300', badge: 'bg-orange-500', text: 'text-orange-900', field: 'bg-orange-100 text-orange-800' },
}

export default function EnvironmentsSection() {
  const [active, setActive] = useState(null)

  return (
    <div className="w-full space-y-8">
      {/* Header */}
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Environments: Four Things They Define</h3>
        <p className="text-gray-600">
          A dbt environment is a named configuration that tells dbt <em>how</em> to connect to the data platform
          and <em>where</em> to write. Every environment specifies the same four groups of settings.
        </p>
      </div>

      {/* Four category cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {CATEGORIES.map((cat, idx) => {
          const p = PALETTE[cat.color]
          const isActive = active === cat.id
          return (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              viewport={{ once: true }}
              onClick={() => setActive(isActive ? null : cat.id)}
              className={`${p.bg} ${p.border} border rounded-xl p-5 cursor-pointer select-none transition-all duration-200 ${isActive ? 'shadow-md ring-2 ring-offset-1 ring-current' : 'hover:shadow-sm'}`}
            >
              {/* Card header */}
              <div className="flex items-center gap-3 mb-3">
                <span className={`${p.badge} text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shrink-0`}>
                  {cat.number}
                </span>
                <span className="text-lg">{cat.icon}</span>
                <h4 className={`font-bold text-base ${p.text}`}>{cat.label}</h4>
                <span className="ml-auto text-gray-400 text-xs">{isActive ? '▲ hide' : '▼ show'}</span>
              </div>

              <p className="text-sm text-gray-600 mb-3">{cat.description}</p>

              {/* Field list — visible when expanded */}
              {isActive && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-2 mt-1"
                >
                  {cat.fields.map((f) => (
                    <div key={f.name} className="rounded-lg overflow-hidden border border-white/60">
                      <div className="text-xs text-gray-500 px-3 pt-2 pb-0.5">{f.name}</div>
                      <div className={`font-mono text-sm font-semibold px-3 pb-2 ${p.field.split(' ')[1]}`}>{f.value}</div>
                      <div className="text-xs text-gray-400 italic px-3 pb-2">{f.hint}</div>
                    </div>
                  ))}
                </motion.div>
              )}

              {/* Field name pills when collapsed */}
              {!isActive && (
                <div className="flex flex-wrap gap-1.5">
                  {cat.fields.map((f) => (
                    <span key={f.name} className={`text-xs px-2 py-0.5 rounded-full font-mono ${p.field}`}>
                      {f.name}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          )
        })}
      </div>

      {/* Multiple environments callout */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        viewport={{ once: true }}
        className="bg-white border border-gray-200/60 rounded-xl overflow-hidden"
      >
        {/* Header */}
        <div className="px-6 pt-5 pb-3 border-b border-gray-100">
          <h4 className="text-base font-bold text-gray-900 mb-1">You create multiple environments for specific purposes</h4>
          <p className="text-sm text-gray-500">Each environment isolates credentials, schema, and deployment behavior so teams can work safely in parallel.</p>
        </div>

        {/* Environment rows */}
        <div className="divide-y divide-gray-100">
          {[
            {
              name: 'Development',
              badge: 'DEV',
              badgeColor: 'bg-blue-100 text-blue-700',
              desc: 'Personal sandbox. Each developer gets their own schema. Safe to break things.',
              schema: 'dev.dbt_<username>',
              schemaColor: 'text-blue-600',
            },
            {
              name: 'QA / Staging',
              badge: 'STG',
              badgeColor: 'bg-amber-100 text-amber-700',
              desc: 'Validates pull requests in an isolated schema before merging. CI runs here.',
              schema: 'qa.pr_<number>',
              schemaColor: 'text-amber-600',
            },
            {
              name: 'Production',
              badge: 'PROD',
              badgeColor: 'bg-green-100 text-green-700',
              desc: 'The live environment. Scheduled jobs run here. Feeds dashboards and downstream consumers.',
              schema: 'prod.analytics',
              schemaColor: 'text-green-600',
            },
          ].map((env, idx) => (
            <motion.div
              key={env.name}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.08 }}
              viewport={{ once: true }}
              className="flex items-start gap-4 px-6 py-4"
            >
              {/* Left: name + badge */}
              <div className="min-w-[180px]">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-gray-900 text-sm">{env.name}</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${env.badgeColor}`}>{env.badge}</span>
                </div>
              </div>

              {/* Divider */}
              <div className="w-px self-stretch bg-gray-100 mx-2" />

              {/* Right: description + schema */}
              <div className="flex-1">
                <p className="text-sm text-gray-600">{env.desc}</p>
                <p className={`text-xs font-mono mt-1 ${env.schemaColor}`}>schema → {env.schema}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
