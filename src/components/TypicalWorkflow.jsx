import { motion } from 'framer-motion'

function WorkflowDiagram() {
  return (
    <div className="overflow-x-auto">
      <svg viewBox="0 0 680 168" className="w-full min-w-[480px]">
        <style>{`.wf-node { cursor: pointer; transition: transform 0.15s ease-out, filter 0.15s ease-out; } .wf-node:hover { transform: scale(1.08); filter: drop-shadow(0 2px 6px rgba(0,0,0,0.15)); }`}</style>

        {/* ── Main branch line ─────────────────────────── */}
        <line x1="0" y1="152" x2="680" y2="152" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" />

        {/* Default branch label box */}
        <rect x="4" y="134" width="88" height="32" rx="7" fill="#f0fdf4" stroke="#22c55e" strokeWidth="1.5" />
        <text x="48" y="147" textAnchor="middle" fontSize="9" fontWeight="700" fill="#15803d" fontFamily="monospace">main</text>
        <text x="48" y="159" textAnchor="middle" fontSize="8" fill="#16a34a" fontFamily="ui-sans-serif,system-ui,sans-serif">(default branch)</text>

        {/* ── Feature branch arc ───────────────────────── */}
        <path d="M 105 152 C 105 106 140 78 164 78" stroke="#f59e0b" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <line x1="164" y1="78" x2="587" y2="78" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M 623 78 C 645 78 658 106 658 152" stroke="#f59e0b" strokeWidth="2.5" fill="none" strokeLinecap="round" />

        {/* Branch point dot */}
        <circle cx="105" cy="152" r="5" fill="#f59e0b" />
        {/* Merge dot on main */}
        <circle cx="658" cy="152" r="7" fill="#22c55e" stroke="white" strokeWidth="2" />

        {/* ── Step nodes (hoverable) ─────────────────────── */}

        <g className="wf-node" style={{ transformOrigin: '221px 78px' }}>
          <rect x="164" y="64" width="114" height="28" rx="7" fill="#fef9c3" stroke="#ca8a04" strokeWidth="1.5" />
          <text x="221" y="82" textAnchor="middle" fontSize="10" fontWeight="700" fill="#92400e" fontFamily="ui-sans-serif,system-ui,sans-serif">Feature Branch</text>
        </g>

        <g className="wf-node" style={{ transformOrigin: '338px 78px' }}>
          <rect x="288" y="64" width="100" height="28" rx="7" fill="#f3e8ff" stroke="#a855f7" strokeWidth="1.5" />
          <text x="338" y="82" textAnchor="middle" fontSize="10" fontWeight="700" fill="#7e22ce" fontFamily="ui-sans-serif,system-ui,sans-serif">Pull Request</text>
        </g>

        <g className="wf-node" style={{ transformOrigin: '431px 78px' }}>
          <rect x="398" y="64" width="66" height="28" rx="7" fill="#dbeafe" stroke="#3b82f6" strokeWidth="1.5" />
          <text x="431" y="82" textAnchor="middle" fontSize="10" fontWeight="700" fill="#1e40af" fontFamily="ui-sans-serif,system-ui,sans-serif">dbt CI</text>
        </g>

        <g className="wf-node" style={{ transformOrigin: '524px 78px' }}>
          <rect x="474" y="64" width="100" height="28" rx="7" fill="#dbeafe" stroke="#3b82f6" strokeWidth="1.5" />
          <text x="524" y="82" textAnchor="middle" fontSize="10" fontWeight="700" fill="#1e40af" fontFamily="ui-sans-serif,system-ui,sans-serif">Peer Review</text>
        </g>

        <g className="wf-node" style={{ transformOrigin: '605px 78px' }}>
          <circle cx="605" cy="78" r="20" fill="#dcfce7" stroke="#16a34a" strokeWidth="1.5" />
          <text x="605" y="83" textAnchor="middle" fontSize="9" fontWeight="700" fill="#16a34a" fontFamily="ui-sans-serif,system-ui,sans-serif">Merge!</text>
        </g>

      </svg>
    </div>
  )
}

const STEPS = [
  { num: '1', label: 'Feature Branch', color: 'bg-yellow-50 border-yellow-200', text: 'text-yellow-800', badge: 'bg-yellow-400', desc: 'Create an isolated copy of the codebase to develop in, without touching main.' },
  { num: '2', label: 'Pull Request', color: 'bg-purple-50 border-purple-200', text: 'text-purple-800', badge: 'bg-purple-500', desc: 'Formally propose merging your branch into main. This kicks off automated CI.' },
  { num: '3', label: 'dbt CI Job', color: 'bg-blue-50 border-blue-200', text: 'text-blue-800', badge: 'bg-blue-500', desc: 'dbt builds only changed models in an isolated schema, runs tests, and diffs data.' },
  { num: '4', label: 'Peer Review', color: 'bg-blue-50 border-blue-200', text: 'text-blue-800', badge: 'bg-blue-500', desc: "A teammate reviews logic and intent. Automated tests cannot catch business errors." },
  { num: '5', label: 'Merge & Deploy', color: 'bg-green-50 border-green-200', text: 'text-green-800', badge: 'bg-green-500', desc: 'Code merges to main. The next scheduled production job picks up the new code.' },
]

export default function TypicalWorkflow() {
  return (
    <div className="w-full space-y-4">
      <h3 className="text-xl font-bold text-gray-900">Typical development workflow</h3>

      {/* Diagram */}
      <div className="bg-gray-50/50 border border-gray-200/60 rounded-xl p-5">
        <WorkflowDiagram />
      </div>
    </div>
  )
}
