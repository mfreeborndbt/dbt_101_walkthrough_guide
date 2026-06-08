import { motion } from 'framer-motion'

function YamlLine({ indent = 0, keyText, value, comment, highlight }) {
  const pad = '  '.repeat(indent)
  return (
    <div className={highlight ? 'bg-amber-100 -mx-4 px-4' : ''}>
      <span className="text-gray-500">{pad}</span>
      {keyText && <><span className="text-purple-600">{keyText}</span><span className="text-gray-500">: </span></>}
      {value && <span className="text-emerald-600">{value}</span>}
      {comment && <span className="text-gray-500"> {comment}</span>}
    </div>
  )
}

function YamlListItem({ indent = 0, value }) {
  const pad = '  '.repeat(indent)
  return (
    <div>
      <span className="text-gray-500">{pad}- </span>
      <span className="text-blue-600">{value}</span>
    </div>
  )
}

export default function SettingUpTests() {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-1">
        <span className="w-2 h-2 rounded-full bg-blue-500" />
        Setting Up Tests
      </h3>
      <p className="text-sm text-gray-500 mb-4">Tests are defined in YAML alongside your models. Start simple, then add configuration as needed.</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left: Basic */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          whileHover={{ scale: 1.02, y: -4 }}
          className="transition-shadow duration-200 hover:shadow-lg rounded-xl"
        >
          <div className="text-xs font-medium text-gray-500 mb-1.5 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Basic: just add tests
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4 font-mono text-[11px] leading-relaxed overflow-x-auto">
            <div className="text-gray-500 text-[10px] mb-2">models/staging/_stg_models.yml</div>
            <YamlLine indent={0} keyText="models" value="" />
            <div><span className="text-gray-500">  - </span><span className="text-purple-600">name</span><span className="text-gray-500">: </span><span className="text-emerald-600">stg_orders</span></div>
            <YamlLine indent={2} keyText="columns" value="" />
            <div><span className="text-gray-500">      - </span><span className="text-purple-600">name</span><span className="text-gray-500">: </span><span className="text-emerald-600">order_id</span></div>
            <YamlLine indent={4} keyText="data_tests" value="" />
            <YamlListItem indent={5} value="unique" />
            <YamlListItem indent={5} value="not_null" />
            <div className="mt-2" />
            <div><span className="text-gray-500">      - </span><span className="text-purple-600">name</span><span className="text-gray-500">: </span><span className="text-emerald-600">status</span></div>
            <YamlLine indent={4} keyText="data_tests" value="" />
            <div><span className="text-gray-500">            - </span><span className="text-blue-600">accepted_values</span><span className="text-gray-500">:</span></div>
            <YamlLine indent={7} keyText="values" value="" />
            <div><span className="text-gray-500">                  - </span><span className="text-amber-600">'placed'</span></div>
            <div><span className="text-gray-500">                  - </span><span className="text-amber-600">'shipped'</span></div>
            <div><span className="text-gray-500">                  - </span><span className="text-amber-600">'returned'</span></div>
            <div className="mt-2" />
            <div><span className="text-gray-500">      - </span><span className="text-purple-600">name</span><span className="text-gray-500">: </span><span className="text-emerald-600">customer_id</span></div>
            <YamlLine indent={4} keyText="data_tests" value="" />
            <YamlListItem indent={5} value="not_null" />
            <div><span className="text-gray-500">            - </span><span className="text-blue-600">relationships</span><span className="text-gray-500">:</span></div>
            <YamlLine indent={7} keyText="to" value="ref('stg_customers')" />
            <YamlLine indent={7} keyText="field" value="customer_id" />
          </div>
        </motion.div>

        {/* Right: Advanced */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          whileHover={{ scale: 1.02, y: -4 }}
          className="transition-shadow duration-200 hover:shadow-lg rounded-xl"
        >
          <div className="text-xs font-medium text-gray-500 mb-1.5 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            Advanced: severity, thresholds, and stored failures
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4 font-mono text-[11px] leading-relaxed overflow-x-auto">
            <div className="text-gray-500 text-[10px] mb-2">models/staging/_stg_models.yml</div>
            <YamlLine indent={0} keyText="models" value="" />
            <div><span className="text-gray-500">  - </span><span className="text-purple-600">name</span><span className="text-gray-500">: </span><span className="text-emerald-600">stg_orders</span></div>
            <YamlLine indent={2} keyText="columns" value="" />
            <div><span className="text-gray-500">      - </span><span className="text-purple-600">name</span><span className="text-gray-500">: </span><span className="text-emerald-600">order_id</span></div>
            <YamlLine indent={4} keyText="data_tests" value="" />
            <div><span className="text-gray-500">            - </span><span className="text-blue-600">unique</span><span className="text-gray-500">:</span></div>
            <YamlLine indent={7} keyText="severity" value="error" highlight comment="# blocks downstream" />
            <div><span className="text-gray-500">            - </span><span className="text-blue-600">not_null</span><span className="text-gray-500">:</span></div>
            <YamlLine indent={7} keyText="severity" value="warn" highlight comment="# warns but doesn't block" />
            <div className="mt-2" />
            <div><span className="text-gray-500">      - </span><span className="text-purple-600">name</span><span className="text-gray-500">: </span><span className="text-emerald-600">status</span></div>
            <YamlLine indent={4} keyText="data_tests" value="" />
            <div><span className="text-gray-500">            - </span><span className="text-blue-600">accepted_values</span><span className="text-gray-500">:</span></div>
            <YamlLine indent={7} keyText="values" value="['placed', 'shipped', 'returned']" />
            <YamlLine indent={7} keyText="config" value="" />
            <YamlLine indent={8} keyText="severity" value="error" highlight />
            <YamlLine indent={8} keyText="error_if" value="'>10'" highlight comment="# fail if >10 bad rows" />
            <YamlLine indent={8} keyText="warn_if" value="'>0'" highlight comment="# warn on any bad rows" />
            <div className="mt-2" />
            <div><span className="text-gray-500">      - </span><span className="text-purple-600">name</span><span className="text-gray-500">: </span><span className="text-emerald-600">customer_id</span></div>
            <YamlLine indent={4} keyText="data_tests" value="" />
            <div><span className="text-gray-500">            - </span><span className="text-blue-600">not_null</span><span className="text-gray-500">:</span></div>
            <YamlLine indent={7} keyText="config" value="" />
            <YamlLine indent={8} keyText="store_failures" value="true" highlight comment="# save failures to a table" />
            <div><span className="text-gray-500">            - </span><span className="text-blue-600">relationships</span><span className="text-gray-500">:</span></div>
            <YamlLine indent={7} keyText="to" value="ref('stg_customers')" />
            <YamlLine indent={7} keyText="field" value="customer_id" />
            <YamlLine indent={7} keyText="config" value="" />
            <YamlLine indent={8} keyText="severity" value="error" highlight />
            <YamlLine indent={8} keyText="store_failures" value="true" highlight />
          </div>
        </motion.div>
      </div>
    </div>
  )
}
