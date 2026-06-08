import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const models = [
  { name: 'stg_customers', file: 'stg_customers.sql' },
  { name: 'stg_geoinfo', file: 'stg_geoinfo.sql' },
  { name: 'stg_orders', file: 'stg_orders.sql' },
  { name: 'stg_product', file: 'stg_product.sql' },
  { name: 'int_enriched_customer', file: 'int_enriched_customer.sql' },
  { name: 'int_enriched_orders', file: 'int_enriched_orders.sql' },
  { name: 'fct_orders_with_customers_details', file: 'fct_orders_with_customers_details.sql' },
]

const platforms = {
  snowflake: {
    label: 'Snowflake Tasks',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    steps: [
      { step: 1, name: 'TASK_STG_CUSTOMERS', dep: "SCHEDULE = 'USING CRON 0 6 * * * UTC'", code: "CREATE OR REPLACE TASK task_stg_customers\n  WAREHOUSE = transform_wh\n  SCHEDULE = 'USING CRON 0 6 * * * UTC'\nAS\n  CREATE OR REPLACE TABLE stg_customers AS\n  SELECT * FROM raw_customers;" },
      { step: 2, name: 'TASK_STG_GEOINFO', dep: 'AFTER task_stg_customers', code: "CREATE OR REPLACE TASK task_stg_geoinfo\n  WAREHOUSE = transform_wh\n  AFTER task_stg_customers\nAS\n  CREATE OR REPLACE TABLE stg_geoinfo AS\n  SELECT * FROM raw_geoinfo;" },
      { step: 3, name: 'TASK_STG_ORDERS', dep: 'AFTER task_stg_geoinfo', code: "CREATE OR REPLACE TASK task_stg_orders\n  WAREHOUSE = transform_wh\n  AFTER task_stg_geoinfo\nAS\n  CREATE OR REPLACE TABLE stg_orders AS\n  SELECT * FROM raw_orders;" },
      { step: 4, name: 'TASK_STG_PRODUCT', dep: 'AFTER task_stg_orders', code: "CREATE OR REPLACE TASK task_stg_product\n  WAREHOUSE = transform_wh\n  AFTER task_stg_orders\nAS\n  CREATE OR REPLACE TABLE stg_product AS\n  SELECT * FROM raw_product;" },
      { step: 5, name: 'TASK_INT_ENRICHED_CUSTOMER', dep: 'AFTER task_stg_product', code: "CREATE OR REPLACE TASK task_int_enriched_customer\n  WAREHOUSE = transform_wh\n  AFTER task_stg_product\nAS\n  CREATE OR REPLACE TABLE int_enriched_customer AS\n  SELECT ... FROM stg_customers\n  JOIN stg_geoinfo ...;" },
      { step: 6, name: 'TASK_INT_ENRICHED_ORDERS', dep: 'AFTER task_int_enriched_customer', code: "CREATE OR REPLACE TASK task_int_enriched_orders\n  WAREHOUSE = transform_wh\n  AFTER task_int_enriched_customer\nAS\n  CREATE OR REPLACE TABLE int_enriched_orders AS\n  SELECT ... FROM stg_orders\n  JOIN stg_product ...;" },
      { step: 7, name: 'TASK_FCT_ORDERS', dep: 'AFTER task_int_enriched_orders', code: "CREATE OR REPLACE TASK task_fct_orders\n  WAREHOUSE = transform_wh\n  AFTER task_int_enriched_orders\nAS\n  CREATE OR REPLACE TABLE\n    fct_orders_with_customers_details AS\n  SELECT ... FROM int_enriched_customer\n  JOIN int_enriched_orders ...;" },
    ],
  },
  databricks: {
    label: 'Databricks Notebooks',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M3 3h18v18H3V3zm2 2v14h14V5H5zm2 2h10v2H7V7zm0 4h10v2H7v-2zm0 4h7v2H7v-2z" />
      </svg>
    ),
    steps: [
      { step: 1, name: '01_stg_customers', dep: 'Job trigger (scheduled)', code: '# Databricks Notebook: 01_stg_customers\nspark.sql("""\n  CREATE OR REPLACE TABLE stg_customers AS\n  SELECT * FROM raw_customers\n""")' },
      { step: 2, name: '02_stg_geoinfo', dep: 'Depends on: 01_stg_customers', code: '# Databricks Notebook: 02_stg_geoinfo\ndbutils.notebook.run("01_stg_customers", 600)\nspark.sql("""\n  CREATE OR REPLACE TABLE stg_geoinfo AS\n  SELECT * FROM raw_geoinfo\n""")' },
      { step: 3, name: '03_stg_orders', dep: 'Depends on: 02_stg_geoinfo', code: '# Databricks Notebook: 03_stg_orders\ndbutils.notebook.run("02_stg_geoinfo", 600)\nspark.sql("""\n  CREATE OR REPLACE TABLE stg_orders AS\n  SELECT * FROM raw_orders\n""")' },
      { step: 4, name: '04_stg_product', dep: 'Depends on: 03_stg_orders', code: '# Databricks Notebook: 04_stg_product\ndbutils.notebook.run("03_stg_orders", 600)\nspark.sql("""\n  CREATE OR REPLACE TABLE stg_product AS\n  SELECT * FROM raw_product\n""")' },
      { step: 5, name: '05_int_enriched_customer', dep: 'Depends on: 04_stg_product', code: '# Databricks Notebook: 05_int_enriched_customer\ndbutils.notebook.run("04_stg_product", 600)\nspark.sql("""\n  CREATE OR REPLACE TABLE int_enriched_customer\n  AS SELECT ... FROM stg_customers\n  JOIN stg_geoinfo ...\n""")' },
      { step: 6, name: '06_int_enriched_orders', dep: 'Depends on: 05_int_enriched_customer', code: '# Databricks Notebook: 06_int_enriched_orders\ndbutils.notebook.run("05_int_enriched_customer", 600)\nspark.sql("""\n  CREATE OR REPLACE TABLE int_enriched_orders\n  AS SELECT ... FROM stg_orders\n  JOIN stg_product ...\n""")' },
      { step: 7, name: '07_fct_orders', dep: 'Depends on: 06_int_enriched_orders', code: '# Databricks Notebook: 07_fct_orders\ndbutils.notebook.run("06_int_enriched_orders", 600)\nspark.sql("""\n  CREATE OR REPLACE TABLE\n    fct_orders_with_customers_details\n  AS SELECT ... FROM int_enriched_customer\n  JOIN int_enriched_orders ...\n""")' },
    ],
  },
  airflow: {
    label: 'Airflow',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
      </svg>
    ),
    steps: [
      { step: 1, name: 'stg_customers', dep: 'schedule_interval="0 6 * * *"', code: 'stg_customers = SnowflakeOperator(\n  task_id="stg_customers",\n  sql="CREATE OR REPLACE TABLE stg_customers\n    AS SELECT * FROM raw_customers"\n)' },
      { step: 2, name: 'stg_geoinfo', dep: 'stg_customers >> stg_geoinfo', code: 'stg_geoinfo = SnowflakeOperator(\n  task_id="stg_geoinfo",\n  sql="CREATE OR REPLACE TABLE stg_geoinfo\n    AS SELECT * FROM raw_geoinfo"\n)' },
      { step: 3, name: 'stg_orders', dep: 'stg_geoinfo >> stg_orders', code: 'stg_orders = SnowflakeOperator(\n  task_id="stg_orders",\n  sql="CREATE OR REPLACE TABLE stg_orders\n    AS SELECT * FROM raw_orders"\n)' },
      { step: 4, name: 'stg_product', dep: 'stg_orders >> stg_product', code: 'stg_product = SnowflakeOperator(\n  task_id="stg_product",\n  sql="CREATE OR REPLACE TABLE stg_product\n    AS SELECT * FROM raw_product"\n)' },
      { step: 5, name: 'int_enriched_customer', dep: 'stg_product >> int_enriched_customer', code: 'int_enriched_customer = SnowflakeOperator(\n  task_id="int_enriched_customer",\n  sql="CREATE OR REPLACE TABLE\n    int_enriched_customer AS SELECT ...\n    FROM stg_customers JOIN stg_geoinfo"\n)' },
      { step: 6, name: 'int_enriched_orders', dep: 'int_enriched_customer >> int_enriched_orders', code: 'int_enriched_orders = SnowflakeOperator(\n  task_id="int_enriched_orders",\n  sql="CREATE OR REPLACE TABLE\n    int_enriched_orders AS SELECT ...\n    FROM stg_orders JOIN stg_product"\n)' },
      { step: 7, name: 'fct_orders', dep: 'int_enriched_orders >> fct_orders', code: 'fct_orders = SnowflakeOperator(\n  task_id="fct_orders",\n  sql="CREATE OR REPLACE TABLE\n    fct_orders_with_customers_details\n    AS SELECT ... FROM int_enriched_customer\n    JOIN int_enriched_orders"\n)' },
    ],
  },
}

const tabColors = {
  snowflake: { bg: 'bg-sky-50', border: 'border-sky-200', activeBg: 'bg-sky-100', activeText: 'text-sky-800', ring: 'ring-sky-300' },
  databricks: { bg: 'bg-red-50', border: 'border-red-200', activeBg: 'bg-red-100', activeText: 'text-red-800', ring: 'ring-red-300' },
  airflow: { bg: 'bg-teal-50', border: 'border-teal-200', activeBg: 'bg-teal-100', activeText: 'text-teal-800', ring: 'ring-teal-300' },
}

const stepColors = {
  snowflake: 'bg-sky-50 border-sky-200',
  databricks: 'bg-red-50 border-red-200',
  airflow: 'bg-teal-50 border-teal-200',
}

export default function PreDbtOrchestration() {
  const [activePlatform, setActivePlatform] = useState('snowflake')
  const platform = platforms[activePlatform]
  const colors = tabColors[activePlatform]

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left side: dbt models list */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-3">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Your dbt Models
            </h3>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4 font-mono text-sm space-y-1">
            <div className="text-gray-500 text-xs mb-2">models/</div>
            {models.map((m, i) => (
              <motion.div
                key={m.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08, duration: 0.3 }}
                className="flex items-center gap-2 text-gray-700 py-1 px-2 rounded hover:bg-gray-100 transition-colors"
              >
                <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>{m.file}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right side: Platform tabs */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="mb-3">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              Without dbt
            </h3>
          </div>

          {/* Platform tabs */}
          <div className="flex gap-1.5 mb-3">
            {Object.entries(platforms).map(([key, p]) => {
              const isActive = activePlatform === key
              const tc = tabColors[key]
              return (
                <button
                  key={key}
                  onClick={() => setActivePlatform(key)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 ${
                    isActive
                      ? `${tc.activeBg} ${tc.activeText} ring-1 ${tc.ring}`
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-150 hover:text-gray-700'
                  }`}
                >
                  {p.icon}
                  {p.label}
                </button>
              )
            })}
          </div>

          {/* Steps */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activePlatform}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="space-y-2 max-h-[520px] overflow-y-auto pr-1"
            >
              {platform.steps.map((task, i) => (
                <motion.div
                  key={task.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.25 }}
                  className={`border rounded-lg p-3 ${stepColors[activePlatform]}`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-gray-900 text-white text-[10px] font-bold flex items-center justify-center">
                        {task.step}
                      </span>
                      <span className="font-mono text-xs font-semibold text-gray-800">{task.name}</span>
                    </div>
                    <span className="text-[10px] font-mono text-gray-500 bg-white/60 px-1.5 py-0.5 rounded">
                      {task.dep}
                    </span>
                  </div>
                  <pre className="text-[10px] leading-relaxed text-gray-600 font-mono bg-white/40 rounded p-2 overflow-x-auto">
                    {task.code}
                  </pre>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  )
}
