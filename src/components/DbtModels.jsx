import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import DependencyManagement from './DependencyManagement'

const advantages = [
  {
    id: 'what_is_model',
    title: 'What is a Model?',
    icon: '📄',
    custom: 'what_is_model',
    section: 'overview',
  },
  {
    id: 'modularity',
    title: 'Modularity',
    icon: '🧩',
    custom: 'modularity',
  },
  {
    id: 'dependency_mgmt',
    title: 'Dependency Management',
    icon: '🔗',
    custom: 'dependency_mgmt',
  },
  {
    id: 'reusable',
    title: 'Reusable Logic',
    icon: '♻️',
    custom: 'reusable',
  },
  {
    id: 'ddl',
    title: 'Abstracts DDL/DML',
    icon: '✨',
    custom: 'ddl',
  },
  {
    id: 'testing',
    title: 'Data Quality Framework',
    icon: '🧪',
    custom: 'testing',
  },
  {
    id: 'lineage',
    title: 'Lineage & Documentation',
    icon: '🗺️',
    custom: 'lineage',
  },
  {
    id: 'environments',
    title: 'Environment Aware',
    icon: '🌍',
    custom: 'environments',
  },
  {
    id: 'versioned',
    title: 'Version Controlled',
    icon: '📦',
    custom: 'versioned',
  },
]

/* ------------------------------------------------------------------ */
/*  What is a Model Visual                                             */
/* ------------------------------------------------------------------ */

function WhatIsModelVisual({ showDbt }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={showDbt ? 'with' : 'without'}
        initial={{ opacity: 0, x: showDbt ? 10 : -10 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: showDbt ? -10 : 10 }}
        transition={{ duration: 0.25 }}
      >
        {!showDbt ? (
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 space-y-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">A traditional SQL script</p>
            <motion.div whileHover={{ y: -3 }} transition={{ type: 'spring', stiffness: 400, damping: 20 }} className="bg-white border border-gray-200 rounded-lg p-5 font-mono text-[11px] leading-relaxed cursor-default hover:shadow-md transition-shadow">
              <div className="text-gray-400 mb-3">-- int_enriched_orders.sql</div>
              <div className="text-gray-700">
                <div><span className="text-blue-600">CREATE OR REPLACE TABLE</span> analytics.int_enriched_orders <span className="text-blue-600">AS</span> (</div>
                <div className="mt-2 ml-2"><span className="text-blue-600">SELECT</span></div>
                <div className="ml-4">o.order_id,</div>
                <div className="ml-4">o.customer_id,</div>
                <div className="ml-4">o.order_date,</div>
                <div className="ml-4">o.status,</div>
                <div className="ml-4">p.product_name,</div>
                <div className="ml-4">p.category,</div>
                <div className="ml-4">p.price</div>
                <div className="ml-2"><span className="text-blue-600">FROM</span> analytics.stg_orders o</div>
                <div className="ml-2"><span className="text-blue-600">LEFT JOIN</span> analytics.stg_product p</div>
                <div className="ml-4"><span className="text-blue-600">ON</span> o.product_id = p.product_id</div>
                <div className="mt-1">);</div>
              </div>
            </motion.div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { title: 'DDL included', desc: 'CREATE TABLE is your job' },
                { title: 'Hardcoded refs', desc: 'Table names baked in' },
                { title: 'No metadata', desc: 'Just a SQL file' },
              ].map((item, i) => (
                <motion.div key={i} whileHover={{ y: -3 }} transition={{ type: 'spring', stiffness: 400, damping: 20 }} className="bg-white border border-gray-200 rounded-lg p-3 text-center cursor-default hover:shadow-md transition-shadow">
                  <p className="text-xs font-semibold text-gray-700">{item.title}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 space-y-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">A dbt model is a SQL SELECT that becomes a table, view, or incremental load</p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* The model */}
              <div>
                <div className="text-xs font-medium text-gray-500 mb-1.5 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  The model file
                </div>
                <motion.div whileHover={{ y: -3 }} transition={{ type: 'spring', stiffness: 400, damping: 20 }} className="bg-white border border-gray-200 rounded-lg p-4 font-mono text-[11px] leading-relaxed cursor-default hover:shadow-md transition-shadow">
                  <div className="text-gray-400 mb-2">models/intermediate/int_enriched_orders.sql</div>
                  <div className="text-gray-700">
                    <div className="bg-amber-50 border-l-2 border-amber-400 -ml-2 pl-2 py-0.5">
                      <span className="text-amber-600 font-bold">{"{{ config(materialized='table') }}"}</span>
                    </div>
                    <div className="mt-2"><span className="text-blue-600">SELECT</span></div>
                    <div className="ml-2">o.order_id,</div>
                    <div className="ml-2">o.customer_id,</div>
                    <div className="ml-2">o.order_date,</div>
                    <div className="ml-2">o.status,</div>
                    <div className="ml-2">p.product_name,</div>
                    <div className="ml-2">p.category,</div>
                    <div className="ml-2">p.price</div>
                    <div className="bg-emerald-50 border-l-2 border-emerald-400 -ml-2 pl-2 py-0.5">
                      <span className="text-blue-600">FROM</span> <span className="text-emerald-600 font-bold">{"{{ ref('stg_orders') }}"}</span> o
                    </div>
                    <div className="bg-emerald-50 border-l-2 border-emerald-400 -ml-2 pl-2 py-0.5">
                      <span className="text-blue-600">LEFT JOIN</span> <span className="text-emerald-600 font-bold">{"{{ ref('stg_product') }}"}</span> p
                    </div>
                    <div className="ml-2"><span className="text-blue-600">ON</span> o.product_id = p.product_id</div>
                  </div>
                </motion.div>
              </div>

              {/* What makes it a model */}
              <div className="space-y-3">
                <div className="text-xs font-medium text-gray-500 mb-1.5 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  What makes it a model
                </div>
                <motion.div whileHover={{ y: -3 }} transition={{ type: 'spring', stiffness: 400, damping: 20 }} className="bg-white border border-gray-200 rounded-lg p-3 cursor-default hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-2">
                    <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-1.5 py-0.5 rounded mt-0.5 shrink-0">config</span>
                    <div>
                      <p className="text-xs font-semibold text-gray-800">Materialization</p>
                      <p className="text-[11px] text-gray-500 mt-0.5">Tells dbt how to build it: <code className="bg-gray-100 px-1 rounded text-[10px]">table</code>, <code className="bg-gray-100 px-1 rounded text-[10px]">view</code>, <code className="bg-gray-100 px-1 rounded text-[10px]">incremental</code>, or <code className="bg-gray-100 px-1 rounded text-[10px]">ephemeral</code>. dbt generates the DDL for you.</p>
                    </div>
                  </div>
                </motion.div>
                <motion.div whileHover={{ y: -3 }} transition={{ type: 'spring', stiffness: 400, damping: 20 }} className="bg-white border border-gray-200 rounded-lg p-3 cursor-default hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-2">
                    <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-1.5 py-0.5 rounded mt-0.5 shrink-0">ref()</span>
                    <div>
                      <p className="text-xs font-semibold text-gray-800">Dependencies</p>
                      <p className="text-[11px] text-gray-500 mt-0.5">References other models by name. dbt resolves the schema at compile time and builds them in the right order.</p>
                    </div>
                  </div>
                </motion.div>
                <motion.div whileHover={{ y: -3 }} transition={{ type: 'spring', stiffness: 400, damping: 20 }} className="bg-white border border-gray-200 rounded-lg p-3 cursor-default hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-2">
                    <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-1.5 py-0.5 rounded mt-0.5 shrink-0">SELECT</span>
                    <div>
                      <p className="text-xs font-semibold text-gray-800">Just SQL</p>
                      <p className="text-[11px] text-gray-500 mt-0.5">No CREATE TABLE, no DDL. You write the transformation logic. dbt handles the rest.</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}

/* ------------------------------------------------------------------ */
/*  DAG helper components                                             */
/* ------------------------------------------------------------------ */

function DagNode({ x, y, label, color = '#10b981', badge }) {
  const badgeColors = {
    fresh: { bg: '#dcfce7', text: '#166534', border: '#bbf7d0' },
    passed: { bg: '#dcfce7', text: '#166534', border: '#bbf7d0' },
    warning: { bg: '#fef9c3', text: '#92400e', border: '#fde68a' },
  }
  const badgeLabels = { fresh: '\u2713 fresh', passed: '\u2713 passed', warning: '\u26A0 warning' }
  const bc = badge ? badgeColors[badge] : null
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={120}
        height={32}
        rx={6}
        fill={color}
        opacity={0.15}
        stroke={color}
        strokeWidth={1.5}
      />
      <text
        x={x + 60}
        y={y + 20}
        textAnchor="middle"
        fill={color}
        fontSize={11}
        fontWeight={600}
        fontFamily="monospace"
      >
        {label}
      </text>
      {badge && bc && (
        <g>
          <rect
            x={x + 120 - 46}
            y={y - 8}
            width={46}
            height={16}
            rx={8}
            fill={bc.bg}
            stroke={bc.border}
            strokeWidth={0.75}
          />
          <text
            x={x + 120 - 23}
            y={y + 3}
            textAnchor="middle"
            fill={bc.text}
            fontSize={7}
            fontWeight={600}
          >
            {badgeLabels[badge]}
          </text>
        </g>
      )}
    </g>
  )
}

function DagEdge({ x1, y1, x2, y2, color = '#10b981' }) {
  const mx = (x1 + x2) / 2
  return (
    <path
      d={`M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}`}
      fill="none"
      stroke={color}
      strokeWidth={1.5}
      opacity={0.5}
    />
  )
}

/* ------------------------------------------------------------------ */
/*  Modularity visual                                                 */
/* ------------------------------------------------------------------ */

// --- Monolithic SQL content for the "Without dbt" state ---

const MOD_HEADER_1 = `-- ============================================================================
-- STORED PROCEDURE: build_fct_order_items
-- Builds the analytics fact table for order line-item reporting.
-- All logic is self-contained in this single script.
--
-- WARNING: Shared logic also exists in build_supplier_performance.sql
--          Any changes here must be manually replicated there.
--
-- Author: jsmith            Last modified: 2024-11-14
-- ============================================================================`.split('\n')

const MOD_SHARED_STEPS = `
-- STEP 1: Extract raw line items from source system
WITH raw_line_items AS (
    SELECT
        l_orderkey          AS order_key,
        l_partkey           AS part_key,
        l_suppkey           AS supplier_key,
        l_linenumber        AS line_number,
        l_quantity          AS quantity,
        l_extendedprice     AS extended_price,
        l_discount          AS discount,
        l_tax               AS tax,
        l_returnflag        AS return_flag,
        l_linestatus        AS line_status,
        l_shipdate          AS ship_date,
        l_commitdate        AS commit_date,
        l_receiptdate       AS receipt_date,
        l_shipinstruct      AS ship_instructions,
        l_shipmode          AS ship_mode,
        l_comment           AS line_comment,
        _etl_loaded_at      AS loaded_at
    FROM raw.tpch.lineitem
    WHERE _etl_loaded_at > '2020-01-01'
      AND l_orderkey IS NOT NULL
),

-- STEP 2: Deduplicate line items
-- Source system occasionally sends duplicate records on re-extraction
deduped_line_items AS (
    SELECT *,
        ROW_NUMBER() OVER (
            PARTITION BY order_key, line_number
            ORDER BY loaded_at DESC
        ) AS row_num
    FROM raw_line_items
),

unique_line_items AS (
    SELECT
        order_key, part_key, supplier_key, line_number,
        quantity, extended_price, discount, tax,
        return_flag, line_status,
        ship_date, commit_date, receipt_date,
        ship_instructions, ship_mode, line_comment
    FROM deduped_line_items
    WHERE row_num = 1
),

-- STEP 3: Cast types and normalize currency to USD
cleaned_line_items AS (
    SELECT
        order_key,
        part_key,
        supplier_key,
        line_number,
        CAST(quantity AS NUMERIC(12,2))           AS quantity,
        CAST(extended_price AS NUMERIC(15,2))     AS extended_price,
        CAST(discount AS NUMERIC(5,4))            AS discount_pct,
        CAST(tax AS NUMERIC(5,4))                 AS tax_rate,
        return_flag,
        line_status,
        CAST(ship_date AS DATE)                   AS ship_date,
        CAST(commit_date AS DATE)                 AS commit_date,
        CAST(receipt_date AS DATE)                AS receipt_date,
        TRIM(LOWER(ship_mode))                    AS ship_mode,
        ROUND(extended_price * (1 - discount), 2) AS discounted_price,
        ROUND(
            extended_price * (1 - discount) * (1 + tax), 2
        )                                         AS total_price
    FROM unique_line_items
),

-- STEP 4: Extract raw orders from source system
raw_orders AS (
    SELECT
        o_orderkey      AS order_key,
        o_custkey        AS customer_key,
        o_orderstatus   AS order_status,
        o_totalprice    AS order_total,
        o_orderdate     AS order_date,
        o_orderpriority AS order_priority,
        o_clerk         AS clerk_id,
        o_shippriority  AS ship_priority,
        o_comment       AS order_comment,
        _etl_loaded_at  AS loaded_at
    FROM raw.tpch.orders
    WHERE _etl_loaded_at > '2020-01-01'
      AND o_orderkey IS NOT NULL
),

-- STEP 5: Deduplicate orders (same pattern as line items)
deduped_orders AS (
    SELECT *,
        ROW_NUMBER() OVER (
            PARTITION BY order_key
            ORDER BY loaded_at DESC
        ) AS row_num
    FROM raw_orders
),

unique_orders AS (
    SELECT
        order_key, customer_key, order_status,
        CAST(order_total AS NUMERIC(15,2)) AS order_total,
        CAST(order_date AS DATE)           AS order_date,
        order_priority, clerk_id, ship_priority
    FROM deduped_orders
    WHERE row_num = 1
),

-- STEP 6: Map order status codes to human-readable labels
mapped_orders AS (
    SELECT
        order_key, customer_key, order_total,
        order_date, order_priority, clerk_id,
        ship_priority,
        CASE order_status
            WHEN 'O' THEN 'open'
            WHEN 'F' THEN 'fulfilled'
            WHEN 'P' THEN 'processing'
            ELSE 'unknown'
        END AS order_status
    FROM unique_orders
),

-- STEP 7: Join line items to orders
order_items AS (
    SELECT
        li.order_key,
        li.part_key,
        li.supplier_key,
        li.line_number,
        li.quantity,
        li.extended_price,
        li.discount_pct,
        li.tax_rate,
        li.discounted_price,
        li.total_price,
        li.return_flag,
        li.line_status,
        li.ship_date,
        li.commit_date,
        li.receipt_date,
        li.ship_mode,
        o.customer_key,
        o.order_date,
        o.order_status,
        o.order_priority,
        o.clerk_id
    FROM cleaned_line_items li
    INNER JOIN mapped_orders o
        ON li.order_key = o.order_key
),`.trim().split('\n')

const MOD_FINAL_1 = `
-- STEP 8: Calculate pricing tiers and discount flags
priced_items AS (
    SELECT
        *,
        CASE
            WHEN total_price >= 50000 THEN 'enterprise'
            WHEN total_price >= 10000 THEN 'mid-market'
            WHEN total_price >= 1000  THEN 'small-business'
            ELSE 'consumer'
        END AS pricing_tier,
        CASE
            WHEN discount_pct > 0.05 THEN TRUE
            ELSE FALSE
        END AS is_heavily_discounted,
        ROUND(extended_price - discounted_price, 2) AS discount_amount
    FROM order_items
),

-- STEP 9: Compute shipping metrics
shipping_enriched AS (
    SELECT
        *,
        DATEDIFF('day', order_date, ship_date)   AS days_to_ship,
        DATEDIFF('day', ship_date, receipt_date)  AS days_in_transit,
        DATEDIFF('day', order_date, receipt_date) AS total_fulfillment_days,
        CASE
            WHEN ship_date <= commit_date THEN 'on_time'
            ELSE 'late'
        END AS shipment_timeliness,
        CASE
            WHEN DATEDIFF('day', order_date, ship_date) <= 3 THEN 'express'
            WHEN DATEDIFF('day', order_date, ship_date) <= 7 THEN 'standard'
            ELSE 'economy'
        END AS effective_ship_speed
    FROM priced_items
),

-- STEP 10: Date dimension rollups
with_date_parts AS (
    SELECT
        *,
        DATE_TRUNC('month', order_date)   AS order_month,
        DATE_TRUNC('quarter', order_date) AS order_quarter,
        DATE_TRUNC('year', order_date)    AS order_year,
        EXTRACT('dow' FROM order_date)    AS order_day_of_week,
        CASE
            WHEN EXTRACT('dow' FROM order_date) IN (0, 6) THEN TRUE
            ELSE FALSE
        END AS is_weekend_order
    FROM shipping_enriched
),

-- STEP 11: Null handling and QA validation
qa_validated AS (
    SELECT
        *,
        COALESCE(total_price, 0) AS total_price_clean,
        CASE
            WHEN quantity IS NULL OR quantity <= 0 THEN FALSE
            WHEN order_date IS NULL THEN FALSE
            WHEN order_key IS NULL THEN FALSE
            ELSE TRUE
        END AS passes_qa
    FROM with_date_parts
),

-- STEP 12: Final dedup with window functions
final_deduped AS (
    SELECT *,
        ROW_NUMBER() OVER (
            PARTITION BY order_key, line_number
            ORDER BY order_date DESC
        ) AS final_row_num
    FROM qa_validated
    WHERE passes_qa = TRUE
)

-- FINAL: Materialize the analytics table
CREATE TABLE analytics.fct_order_items AS
SELECT
    order_key, part_key, supplier_key, line_number,
    customer_key, order_date, order_month,
    order_quarter, order_year, order_status,
    order_priority, quantity, extended_price,
    discount_pct, tax_rate, discounted_price,
    total_price_clean AS total_price,
    discount_amount, pricing_tier,
    is_heavily_discounted, ship_date, commit_date,
    receipt_date, ship_mode, days_to_ship,
    days_in_transit, total_fulfillment_days,
    shipment_timeliness, effective_ship_speed,
    is_weekend_order, return_flag,
    line_status, clerk_id
FROM final_deduped
WHERE final_row_num = 1;`.trim().split('\n')

const MOD_HEADER_2 = `-- ============================================================================
-- STORED PROCEDURE: build_supplier_performance
-- Builds supplier-level metrics for the procurement dashboard.
-- All logic is self-contained in this single script.
--
-- NOTE: Steps 1-7 were copy-pasted from build_fct_order_items.sql
--       Last synced: 2024-09-22 (may have drifted since then)
--
-- Author: amendes           Last modified: 2024-12-01
-- ============================================================================`.split('\n')

const MOD_FINAL_2 = `
-- STEP 8: Extract raw supplier data
raw_suppliers AS (
    SELECT
        s_suppkey    AS supplier_key,
        s_name       AS supplier_name,
        s_nationkey  AS nation_key,
        s_acctbal    AS account_balance,
        s_phone      AS phone,
        s_address    AS address
    FROM raw.tpch.supplier
),

-- STEP 9: Clean and deduplicate suppliers
deduped_suppliers AS (
    SELECT *,
        ROW_NUMBER() OVER (
            PARTITION BY supplier_key
            ORDER BY supplier_key
        ) AS row_num
    FROM raw_suppliers
),

unique_suppliers AS (
    SELECT
        supplier_key, supplier_name,
        nation_key, account_balance, phone
    FROM deduped_suppliers
    WHERE row_num = 1
),

-- STEP 10: Join order items to suppliers
supplier_order_items AS (
    SELECT
        oi.order_key, oi.supplier_key,
        oi.quantity, oi.total_price,
        oi.discounted_price, oi.order_date,
        oi.ship_date, oi.return_flag,
        s.supplier_name, s.nation_key,
        s.account_balance
    FROM order_items oi
    INNER JOIN unique_suppliers s
        ON oi.supplier_key = s.supplier_key
),

-- STEP 11: Aggregate supplier-level metrics
supplier_metrics AS (
    SELECT
        supplier_key,
        supplier_name,
        nation_key,
        COUNT(DISTINCT order_key) AS total_orders,
        SUM(quantity)             AS total_units,
        SUM(total_price)          AS total_revenue,
        AVG(total_price)          AS avg_order_value,
        MIN(order_date)           AS first_order_date,
        MAX(order_date)           AS last_order_date,
        SUM(CASE WHEN return_flag = 'R'
            THEN 1 ELSE 0 END)   AS return_count
    FROM supplier_order_items
    GROUP BY 1, 2, 3
)

-- FINAL: Materialize the analytics table
CREATE TABLE analytics.supplier_performance AS
SELECT
    supplier_key, supplier_name, nation_key,
    total_orders, total_units, total_revenue,
    avg_order_value, first_order_date,
    last_order_date, return_count,
    ROUND(
        return_count * 100.0 / NULLIF(total_orders, 0), 2
    ) AS return_rate_pct
FROM supplier_metrics;`.trim().split('\n')

// Compose full scripts & track duplicate range in script 2
const MOD_SCRIPT_1 = [...MOD_HEADER_1, '', ...MOD_SHARED_STEPS, '', ...MOD_FINAL_1]
const MOD_SCRIPT_2 = [...MOD_HEADER_2, '', ...MOD_SHARED_STEPS, '', ...MOD_FINAL_2]
const MOD_DUP_START = MOD_HEADER_2.length + 1
const MOD_DUP_END = MOD_DUP_START + MOD_SHARED_STEPS.length

// --- SQL syntax highlighting (all content is static/hardcoded) ---
function modEscHTML(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function modHighlightLine(rawLine) {
  const trimmed = rawLine.trim()
  if (!trimmed) return '&nbsp;'
  if (trimmed.startsWith('--')) {
    const cls = /^-- (={3,}|STEP \d|FINAL)/.test(trimmed) ? 'text-gray-400 font-semibold' : 'text-gray-500'
    return `<span class="${cls}">${modEscHTML(rawLine)}</span>`
  }
  let line = modEscHTML(rawLine)
  line = line.replace(/'[^']*'/g, '<span class="text-green-700">$&</span>')
  line = line.replace(
    /\b(SELECT|FROM|JOIN|LEFT|RIGHT|INNER|OUTER|CROSS|ON|WHERE|AND|OR|NOT|IN|AS|WITH|GROUP|BY|ORDER|HAVING|UNION|ALL|DISTINCT|CASE|WHEN|THEN|ELSE|END|CREATE|TABLE|DROP|INSERT|INTO|IF|EXISTS|IS|NULL|BETWEEN|LIKE|LIMIT|OVER|PARTITION|TRUE|FALSE|ASC|DESC)\b/gi,
    '<span class="text-blue-600">$&</span>'
  )
  line = line.replace(
    /\b(COUNT|SUM|AVG|MIN|MAX|ROUND|COALESCE|CAST|NULLIF|TRIM|LOWER|UPPER|ROW_NUMBER|RANK|DATEDIFF|DATE_TRUNC|EXTRACT|ABS|NVL)(?=\s*\()/gi,
    '<span class="text-purple-600">$&</span>'
  )
  return line
}

function ModSQLBlock({ lines, dupRange }) {
  return (
    <div className="font-mono text-[10px] leading-[15px] max-h-[280px] overflow-y-auto overscroll-contain pr-1">
      {lines.map((raw, i) => {
        const isDup = dupRange && i >= dupRange[0] && i < dupRange[1]
        return (
          <div
            key={i}
            className={isDup ? 'bg-red-50 border-l-2 border-red-300 pl-1 -ml-1' : ''}
            dangerouslySetInnerHTML={{ __html: modHighlightLine(raw) }}
          />
        )
      })}
    </div>
  )
}

function ModTableOutput({ name, columns, rows }) {
  return (
    <div className="flex flex-col items-center">
      {/* Connector arrow */}
      <div className="flex flex-col items-center -mb-px">
        <div className="w-px h-4 bg-gray-300" />
        <span className="text-[9px] font-medium text-gray-400 bg-gray-50 border border-gray-200 rounded-full px-2 py-0.5">
          runs → creates table
        </span>
        <div className="w-px h-3 bg-gray-300" />
        <svg width="10" height="6" viewBox="0 0 10 6" className="text-gray-300 -mt-px">
          <polygon points="0,0 10,0 5,6" fill="currentColor" />
        </svg>
      </div>
      {/* Table block */}
      <div className="w-full bg-white border border-gray-300 rounded-lg overflow-hidden shadow-sm">
        {/* Header */}
        <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 border-b border-gray-200">
          <span className="text-[8px] font-bold uppercase tracking-wider text-gray-400 bg-gray-200 rounded px-1.5 py-0.5">Table</span>
          <span className="text-[11px] font-mono font-bold text-gray-700">{name}</span>
        </div>
        {/* Data grid */}
        <div className="overflow-x-auto">
          <table className="w-full text-[10px] font-mono">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/50">
                {columns.map(col => (
                  <th key={col} className="px-2.5 py-1.5 text-left font-semibold text-gray-500 whitespace-nowrap">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className={i % 2 === 1 ? 'bg-gray-50/40' : ''}>
                  {row.map((cell, j) => (
                    <td key={j} className={`px-2.5 py-1 whitespace-nowrap text-gray-600 ${typeof cell === 'number' ? 'text-right tabular-nums' : ''}`}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function ModularityDAG({ showNew, onNodeClick, activeNode }) {
  const baseNodes = [
    { id: 'li', x: 5,   y: 10,  w: 150, h: 26, label: 'tpch_now.lineitem',   type: 'source' },
    { id: 'or', x: 5,   y: 60,  w: 150, h: 26, label: 'tpch_now.orders',     type: 'source' },
    { id: 'cu', x: 5,   y: 110, w: 150, h: 26, label: 'tpch_now.customer',   type: 'source' },
    { id: 'sl', x: 185, y: 10,  w: 120, h: 26, label: 'stg_line_items',      type: 'staging' },
    { id: 'so', x: 185, y: 60,  w: 120, h: 26, label: 'stg_orders',          type: 'staging' },
    { id: 'sc', x: 185, y: 110, w: 120, h: 26, label: 'stg_customers',       type: 'staging' },
    { id: 'io', x: 335, y: 35,  w: 160, h: 26, label: 'int_order_items',     type: 'intermediate' },
    { id: 'ic', x: 335, y: 85,  w: 160, h: 26, label: 'int_customer_orders', type: 'intermediate' },
    { id: 'fo', x: 530, y: 55,  w: 130, h: 36, label: 'fct_orders',          type: 'mart' },
  ]

  const baseEdges = [
    ['li', 'sl'], ['or', 'so'], ['cu', 'sc'],
    ['sl', 'io'], ['so', 'io'], ['so', 'ic'], ['sc', 'ic'],
    ['io', 'fo'], ['ic', 'fo'],
  ]

  const addedNodes = [
    { id: 'pa', x: 5,   y: 165, w: 150, h: 26, label: 'tpch_now.payments',  type: 'source' },
    { id: 'sp', x: 185, y: 165, w: 120, h: 26, label: 'stg_payments',       type: 'staging' },
    { id: 'fp', x: 530, y: 160, w: 155, h: 36, label: 'fct_order_payments', type: 'new-mart' },
  ]

  const addedEdges = [
    ['pa', 'sp'],
    ['sp', 'fp'],
    ['ic', 'fp'],
  ]

  const allNodes = showNew ? [...baseNodes, ...addedNodes] : baseNodes
  const allEdges = showNew ? [...baseEdges, ...addedEdges] : baseEdges
  const nodeMap = Object.fromEntries(allNodes.map(n => [n.id, n]))
  const viewH = showNew ? 220 : 160

  const typeStyles = {
    source:       { fill: '#ecfeff', stroke: '#a5f3fc', text: '#155e75', tag: '#06b6d4', tagLabel: 'SRC' },
    staging:      { fill: '#f0fdf4', stroke: '#86efac', text: '#166534', tag: '#22c55e', tagLabel: 'STG' },
    intermediate: { fill: '#f9fafb', stroke: '#d1d5db', text: '#374151', tag: '#6b7280', tagLabel: 'INT' },
    mart:         { fill: '#fff7ed', stroke: '#f97316', text: '#9a3412', tag: '#f97316', tagLabel: 'MRT', sw: 2.5 },
    'new-mart':   { fill: '#fefce8', stroke: '#eab308', text: '#854d0e', tag: '#eab308', tagLabel: 'NEW', sw: 2 },
  }

  return (
    <svg viewBox={`-10 -6 720 ${viewH + 12}`} className="w-full max-w-3xl h-auto" style={{ transition: 'height 0.4s ease', overflow: 'visible' }}>
      <defs>
        <marker id="mod-dag-arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L0,6 L6,3 z" fill="#9ca3af" />
        </marker>
        <marker id="mod-dag-arrow-gold" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L0,6 L6,3 z" fill="#eab308" />
        </marker>
        <filter id="dag-hover-shadow" x="-10%" y="-10%" width="120%" height="130%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.18" />
        </filter>
        <style>{`
          .dag-node-hover {
            transition: transform 0.2s ease, filter 0.2s ease;
            transform-box: fill-box;
            transform-origin: center;
          }
          .dag-node-hover:hover {
            transform: scale(1.04);
            filter: url(#dag-hover-shadow);
          }
        `}</style>
      </defs>

      {/* Edges */}
      {allEdges.map(([fromId, toId], i) => {
        const f = nodeMap[fromId], t = nodeMap[toId]
        if (!f || !t) return null
        const x1 = f.x + f.w, y1 = f.y + f.h / 2
        const x2 = t.x, y2 = t.y + t.h / 2
        const mx = (x1 + x2) / 2
        const isNew = i >= baseEdges.length
        return (
          <motion.path
            key={`${fromId}-${toId}`}
            d={`M${x1} ${y1} C${mx} ${y1} ${mx} ${y2} ${x2} ${y2}`}
            stroke={isNew ? '#eab308' : '#d1d5db'}
            strokeWidth={isNew ? 2 : 1.5}
            fill="none"
            markerEnd={isNew ? 'url(#mod-dag-arrow-gold)' : 'url(#mod-dag-arrow)'}
            initial={isNew ? { pathLength: 0, opacity: 0 } : false}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: isNew ? 0.15 : 0 }}
          />
        )
      })}

      {/* Nodes */}
      {allNodes.map((node) => {
        const s = typeStyles[node.type]
        const isNew = addedNodes.some(n => n.id === node.id)
        const fontSize = node.label.length > 16 ? 7 : 8
        const isClickable = node.type !== 'source' && onNodeClick
        const isActive = activeNode === node.id
        return (
          <motion.g
            key={node.id}
            className={isClickable ? 'dag-node-hover' : undefined}
            style={isClickable ? { cursor: 'pointer' } : undefined}
            onClick={isClickable ? () => onNodeClick(node.id) : undefined}
            initial={isNew ? { opacity: 0, y: 10 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: isNew ? 0.05 : 0 }}
          >
            <rect
              x={node.x} y={node.y} width={node.w} height={node.h}
              rx={node.type === 'mart' || node.type === 'new-mart' ? 7 : 6}
              fill={s.fill} stroke={isActive ? '#f59e0b' : s.stroke} strokeWidth={isActive ? 3 : (s.sw || 1.2)}
            />
            <text x={node.x + 6} y={node.y + node.h / 2 + 1} fontSize="6" fontWeight="700" fill={s.tag} fontFamily="monospace" dominantBaseline="middle">{s.tagLabel}</text>
            <text x={node.x + 27} y={node.y + node.h / 2 + 1} fontSize={fontSize} fontWeight="600" fill={s.text} fontFamily="monospace" dominantBaseline="middle">{node.label}</text>
            {isClickable && (
              <text x={node.x + node.w - 10} y={node.y + node.h / 2 + 1} fontSize="7" fill={s.tag} fontFamily="monospace" dominantBaseline="middle" opacity={0.5}>{'</>'}</text>
            )}
          </motion.g>
        )
      })}

      {/* Layer labels */}
      <text x={80} y={viewH - 3} textAnchor="middle" fontSize="8" fill="#9ca3af" fontWeight="500">Sources</text>
      <text x={245} y={viewH - 3} textAnchor="middle" fontSize="8" fill="#9ca3af" fontWeight="500">Staging</text>
      <text x={415} y={viewH - 3} textAnchor="middle" fontSize="8" fill="#9ca3af" fontWeight="500">Intermediate</text>
      <text x={600} y={viewH - 3} textAnchor="middle" fontSize="8" fill="#9ca3af" fontWeight="500">Marts</text>
    </svg>
  )
}

// --- Programmatic ~1000-line SQL script generators for Without dbt panel ---

function generateCteBlock(stepNum, cteName, columns, fromTable, joinTable, joinOn, extraWhere) {
  const lines = []
  lines.push(`-- STEP ${stepNum}: Build ${cteName}`)
  lines.push(`${stepNum === 1 ? 'WITH' : ','} ${cteName} AS (`)
  lines.push(`    SELECT`)
  columns.forEach((col, i) => {
    lines.push(`        ${col}${i < columns.length - 1 ? ',' : ''}`)
  })
  lines.push(`    FROM ${fromTable}`)
  if (joinTable) {
    lines.push(`    INNER JOIN ${joinTable}`)
    lines.push(`        ON ${joinOn}`)
  }
  if (extraWhere) lines.push(`    WHERE ${extraWhere}`)
  lines.push(`)`)
  lines.push(``)
  return lines
}

function generateDedupeBlock(stepNum, cteName, sourceCte, partitionCols, orderCol) {
  return [
    `-- STEP ${stepNum}: Deduplicate ${cteName}`,
    `, ${cteName}_ranked AS (`,
    `    SELECT *,`,
    `        ROW_NUMBER() OVER (`,
    `            PARTITION BY ${partitionCols}`,
    `            ORDER BY ${orderCol} DESC`,
    `        ) AS row_num`,
    `    FROM ${sourceCte}`,
    `)`,
    ``,
    `, ${cteName} AS (`,
    `    SELECT *`,
    `    FROM ${cteName}_ranked`,
    `    WHERE row_num = 1`,
    `)`,
    ``,
  ]
}

function generateCastBlock(stepNum, cteName, sourceCte, castCols) {
  const lines = [
    `-- STEP ${stepNum}: Cast and normalize ${cteName}`,
    `, ${cteName} AS (`,
    `    SELECT`,
  ]
  castCols.forEach((c, i) => {
    lines.push(`        ${c}${i < castCols.length - 1 ? ',' : ''}`)
  })
  lines.push(`    FROM ${sourceCte}`)
  lines.push(`)`)
  lines.push(``)
  return lines
}

function generateAggBlock(stepNum, cteName, sourceCte, groupCols, aggCols) {
  const lines = [
    `-- STEP ${stepNum}: Aggregate ${cteName}`,
    `, ${cteName} AS (`,
    `    SELECT`,
  ]
  groupCols.forEach(c => lines.push(`        ${c},`))
  aggCols.forEach((c, i) => {
    lines.push(`        ${c}${i < aggCols.length - 1 ? ',' : ''}`)
  })
  lines.push(`    FROM ${sourceCte}`)
  lines.push(`    GROUP BY ${groupCols.map((_, i) => i + 1).join(', ')}`)
  lines.push(`)`)
  lines.push(``)
  return lines
}

function buildFctOrderItemsScript() {
  const lines = []
  lines.push(`-- ============================================================================`)
  lines.push(`-- STORED PROCEDURE: build_fct_order_items`)
  lines.push(`-- Builds the analytics fact table for order line-item reporting.`)
  lines.push(`-- All logic is self-contained in this single script.`)
  lines.push(`--`)
  lines.push(`-- WARNING: Shared logic also exists in build_supplier_performance.sql`)
  lines.push(`--          Any changes here must be manually replicated there.`)
  lines.push(`--`)
  lines.push(`-- Author: jsmith            Last modified: 2024-11-14`)
  lines.push(`-- ============================================================================`)
  lines.push(``)

  // Step 1: raw line items
  lines.push(...generateCteBlock(1, 'raw_line_items', [
    `l_orderkey          AS order_key`,
    `l_partkey           AS part_key`,
    `l_suppkey           AS supplier_key`,
    `l_linenumber        AS line_number`,
    `l_quantity          AS quantity`,
    `l_extendedprice     AS extended_price`,
    `l_discount          AS discount`,
    `l_tax               AS tax`,
    `l_returnflag        AS return_flag`,
    `l_linestatus        AS line_status`,
    `l_shipdate          AS ship_date`,
    `l_commitdate        AS commit_date`,
    `l_receiptdate       AS receipt_date`,
    `l_shipinstruct      AS ship_instructions`,
    `l_shipmode          AS ship_mode`,
    `l_comment           AS line_comment`,
    `_etl_loaded_at      AS loaded_at`,
  ], 'raw.tpch.lineitem', null, null, `_etl_loaded_at > '2020-01-01'`))

  // Step 2: dedup line items
  lines.push(...generateDedupeBlock(2, 'unique_line_items', 'raw_line_items', 'order_key, line_number', 'loaded_at'))

  // Step 3: cast line items
  lines.push(...generateCastBlock(3, 'cleaned_line_items', 'unique_line_items', [
    `order_key`, `part_key`, `supplier_key`, `line_number`,
    `CAST(quantity AS NUMERIC(12,2))           AS quantity`,
    `CAST(extended_price AS NUMERIC(15,2))     AS extended_price`,
    `CAST(discount AS NUMERIC(5,4))            AS discount_pct`,
    `CAST(tax AS NUMERIC(5,4))                 AS tax_rate`,
    `return_flag`, `line_status`,
    `CAST(ship_date AS DATE)                   AS ship_date`,
    `CAST(commit_date AS DATE)                 AS commit_date`,
    `CAST(receipt_date AS DATE)                AS receipt_date`,
    `TRIM(LOWER(ship_mode))                    AS ship_mode`,
    `ROUND(extended_price * (1 - discount), 2) AS discounted_price`,
    `ROUND(extended_price * (1 - discount) * (1 + tax), 2) AS total_price`,
  ]))

  // Step 4: raw orders
  lines.push(...generateCteBlock(4, 'raw_orders', [
    `o_orderkey      AS order_key`,
    `o_custkey        AS customer_key`,
    `o_orderstatus   AS order_status`,
    `o_totalprice    AS order_total`,
    `o_orderdate     AS order_date`,
    `o_orderpriority AS order_priority`,
    `o_clerk         AS clerk_id`,
    `o_shippriority  AS ship_priority`,
    `o_comment       AS order_comment`,
    `_etl_loaded_at  AS loaded_at`,
  ], 'raw.tpch.orders', null, null, `_etl_loaded_at > '2020-01-01'`))

  // Step 5: dedup orders
  lines.push(...generateDedupeBlock(5, 'unique_orders', 'raw_orders', 'order_key', 'loaded_at'))

  // Step 6: map order status
  lines.push(`-- STEP 6: Map order status codes to human-readable labels`)
  lines.push(`, mapped_orders AS (`)
  lines.push(`    SELECT`)
  lines.push(`        order_key, customer_key, order_total,`)
  lines.push(`        order_date, order_priority, clerk_id,`)
  lines.push(`        ship_priority,`)
  lines.push(`        CASE order_status`)
  lines.push(`            WHEN 'O' THEN 'open'`)
  lines.push(`            WHEN 'F' THEN 'fulfilled'`)
  lines.push(`            WHEN 'P' THEN 'processing'`)
  lines.push(`            ELSE 'unknown'`)
  lines.push(`        END AS order_status`)
  lines.push(`    FROM unique_orders`)
  lines.push(`)`)
  lines.push(``)

  // Step 7: raw parts
  lines.push(...generateCteBlock(7, 'raw_parts', [
    `p_partkey       AS part_key`,
    `p_name          AS part_name`,
    `p_mfgr          AS manufacturer`,
    `p_brand         AS brand`,
    `p_type          AS part_type`,
    `p_size          AS part_size`,
    `p_container     AS container`,
    `p_retailprice   AS retail_price`,
    `p_comment       AS part_comment`,
  ], 'raw.tpch.part', null, null, null))

  // Step 8: dedup parts
  lines.push(...generateDedupeBlock(8, 'unique_parts', 'raw_parts', 'part_key', 'part_key'))

  // Step 9: join line items to orders
  lines.push(...generateCteBlock(9, 'order_items', [
    `li.order_key`, `li.part_key`, `li.supplier_key`, `li.line_number`,
    `li.quantity`, `li.extended_price`, `li.discount_pct`, `li.tax_rate`,
    `li.discounted_price`, `li.total_price`,
    `li.return_flag`, `li.line_status`,
    `li.ship_date`, `li.commit_date`, `li.receipt_date`, `li.ship_mode`,
    `o.customer_key`, `o.order_date`, `o.order_status`,
    `o.order_priority`, `o.clerk_id`,
  ], 'cleaned_line_items li', 'mapped_orders o', 'li.order_key = o.order_key', null))

  // Step 10: join parts
  lines.push(...generateCteBlock(10, 'order_items_with_parts', [
    `oi.*`,
    `p.part_name`, `p.manufacturer`, `p.brand`, `p.part_type`,
    `p.part_size`, `p.container`, `p.retail_price`,
  ], 'order_items oi', 'unique_parts p', 'oi.part_key = p.part_key', null))

  // Step 11: pricing tiers
  lines.push(`-- STEP 11: Calculate pricing tiers and discount flags`)
  lines.push(`, priced_items AS (`)
  lines.push(`    SELECT`)
  lines.push(`        *,`)
  lines.push(`        CASE`)
  lines.push(`            WHEN total_price >= 50000 THEN 'enterprise'`)
  lines.push(`            WHEN total_price >= 10000 THEN 'mid-market'`)
  lines.push(`            WHEN total_price >= 1000  THEN 'small-business'`)
  lines.push(`            ELSE 'consumer'`)
  lines.push(`        END AS pricing_tier,`)
  lines.push(`        CASE`)
  lines.push(`            WHEN discount_pct > 0.05 THEN TRUE`)
  lines.push(`            ELSE FALSE`)
  lines.push(`        END AS is_heavily_discounted,`)
  lines.push(`        ROUND(extended_price - discounted_price, 2) AS discount_amount`)
  lines.push(`    FROM order_items_with_parts`)
  lines.push(`)`)
  lines.push(``)

  // Step 12: shipping metrics
  lines.push(`-- STEP 12: Compute shipping metrics`)
  lines.push(`, shipping_enriched AS (`)
  lines.push(`    SELECT`)
  lines.push(`        *,`)
  lines.push(`        DATEDIFF('day', order_date, ship_date)   AS days_to_ship,`)
  lines.push(`        DATEDIFF('day', ship_date, receipt_date)  AS days_in_transit,`)
  lines.push(`        DATEDIFF('day', order_date, receipt_date) AS total_fulfillment_days,`)
  lines.push(`        CASE`)
  lines.push(`            WHEN ship_date <= commit_date THEN 'on_time'`)
  lines.push(`            ELSE 'late'`)
  lines.push(`        END AS shipment_timeliness,`)
  lines.push(`        CASE`)
  lines.push(`            WHEN DATEDIFF('day', order_date, ship_date) <= 3 THEN 'express'`)
  lines.push(`            WHEN DATEDIFF('day', order_date, ship_date) <= 7 THEN 'standard'`)
  lines.push(`            ELSE 'economy'`)
  lines.push(`        END AS effective_ship_speed`)
  lines.push(`    FROM priced_items`)
  lines.push(`)`)
  lines.push(``)

  // Step 13: date rollups
  lines.push(`-- STEP 13: Date dimension rollups`)
  lines.push(`, with_date_parts AS (`)
  lines.push(`    SELECT`)
  lines.push(`        *,`)
  lines.push(`        DATE_TRUNC('month', order_date)   AS order_month,`)
  lines.push(`        DATE_TRUNC('quarter', order_date) AS order_quarter,`)
  lines.push(`        DATE_TRUNC('year', order_date)    AS order_year,`)
  lines.push(`        EXTRACT('dow' FROM order_date)    AS order_day_of_week,`)
  lines.push(`        CASE`)
  lines.push(`            WHEN EXTRACT('dow' FROM order_date) IN (0, 6) THEN TRUE`)
  lines.push(`            ELSE FALSE`)
  lines.push(`        END AS is_weekend_order`)
  lines.push(`    FROM shipping_enriched`)
  lines.push(`)`)
  lines.push(``)

  // Step 14: null handling / QA
  lines.push(`-- STEP 14: Null handling and QA validation`)
  lines.push(`, qa_validated AS (`)
  lines.push(`    SELECT`)
  lines.push(`        *,`)
  lines.push(`        COALESCE(total_price, 0) AS total_price_clean,`)
  lines.push(`        CASE`)
  lines.push(`            WHEN quantity IS NULL OR quantity <= 0 THEN FALSE`)
  lines.push(`            WHEN order_date IS NULL THEN FALSE`)
  lines.push(`            WHEN order_key IS NULL THEN FALSE`)
  lines.push(`            ELSE TRUE`)
  lines.push(`        END AS passes_qa`)
  lines.push(`    FROM with_date_parts`)
  lines.push(`)`)
  lines.push(``)

  // Step 15: final dedup
  lines.push(...generateDedupeBlock(15, 'final_deduped', 'qa_validated', 'order_key, line_number', 'order_date'))

  // Step 16: brand rollups
  lines.push(...generateAggBlock(16, 'brand_summary', 'final_deduped', [
    'brand', 'manufacturer',
  ], [
    `COUNT(DISTINCT order_key) AS brand_order_count`,
    `SUM(quantity)             AS brand_total_units`,
    `SUM(total_price_clean)    AS brand_total_revenue`,
    `AVG(discount_pct)         AS brand_avg_discount`,
  ]))

  // Step 17: container rollups
  lines.push(...generateAggBlock(17, 'container_summary', 'final_deduped', [
    'container', 'part_type',
  ], [
    `COUNT(*)                  AS container_record_count`,
    `SUM(quantity)             AS container_total_units`,
    `AVG(retail_price)         AS container_avg_retail`,
  ]))

  // Step 18: monthly rollups
  lines.push(...generateAggBlock(18, 'monthly_summary', 'final_deduped', [
    'order_month', 'order_status',
  ], [
    `COUNT(DISTINCT order_key) AS monthly_orders`,
    `COUNT(DISTINCT customer_key) AS monthly_customers`,
    `SUM(total_price_clean)    AS monthly_revenue`,
    `SUM(quantity)             AS monthly_units`,
  ]))

  // Step 19: shipping summary
  lines.push(...generateAggBlock(19, 'shipping_summary', 'final_deduped', [
    'ship_mode', 'shipment_timeliness',
  ], [
    `COUNT(*)                  AS shipment_count`,
    `AVG(days_to_ship)         AS avg_days_to_ship`,
    `AVG(days_in_transit)      AS avg_transit_days`,
    `AVG(total_fulfillment_days) AS avg_fulfillment_days`,
  ]))

  // Step 20: final select
  lines.push(`-- STEP 20: Final materialization`)
  lines.push(`CREATE TABLE analytics.fct_order_items AS`)
  lines.push(`SELECT`)
  lines.push(`    order_key, part_key, supplier_key, line_number,`)
  lines.push(`    customer_key, order_date, order_month,`)
  lines.push(`    order_quarter, order_year, order_status,`)
  lines.push(`    order_priority, quantity, extended_price,`)
  lines.push(`    discount_pct, tax_rate, discounted_price,`)
  lines.push(`    total_price_clean AS total_price,`)
  lines.push(`    discount_amount, pricing_tier,`)
  lines.push(`    is_heavily_discounted, ship_date, commit_date,`)
  lines.push(`    receipt_date, ship_mode, days_to_ship,`)
  lines.push(`    days_in_transit, total_fulfillment_days,`)
  lines.push(`    shipment_timeliness, effective_ship_speed,`)
  lines.push(`    is_weekend_order, return_flag,`)
  lines.push(`    line_status, clerk_id,`)
  lines.push(`    part_name, manufacturer, brand, part_type,`)
  lines.push(`    part_size, container, retail_price`)
  lines.push(`FROM final_deduped`)
  lines.push(`WHERE row_num = 1;`)

  // Pad to ~1000 lines with repeated validation/audit blocks
  while (lines.length < 1000) {
    const n = lines.length
    lines.push(``)
    lines.push(`-- AUDIT BLOCK ${Math.floor((n - 500) / 30) + 1}: Validation check`)
    lines.push(`-- Inserted by data-ops team to catch regressions after incident INC-${1000 + n}`)
    lines.push(`-- SELECT COUNT(*) FROM analytics.fct_order_items`)
    lines.push(`--   WHERE order_key IS NULL;  -- should return 0`)
    lines.push(`-- SELECT COUNT(*) FROM analytics.fct_order_items`)
    lines.push(`--   WHERE total_price < 0;    -- should return 0`)
    lines.push(`-- SELECT COUNT(DISTINCT order_month)`)
    lines.push(`--   FROM analytics.fct_order_items`)
    lines.push(`--   WHERE order_year = DATE_TRUNC('year', CURRENT_DATE);`)
    lines.push(`-- Expected: current year month count matches calendar`)
  }

  return lines
}

function buildSupplierPerfScript() {
  const lines = []
  lines.push(`-- ============================================================================`)
  lines.push(`-- STORED PROCEDURE: build_supplier_performance`)
  lines.push(`-- Builds supplier-level metrics for the procurement dashboard.`)
  lines.push(`-- All logic is self-contained in this single script.`)
  lines.push(`--`)
  lines.push(`-- NOTE: Steps 1-10 were copy-pasted from build_fct_order_items.sql`)
  lines.push(`--       Last synced: 2024-09-22 (may have drifted since then)`)
  lines.push(`--       TODO: reconcile differences — extract/cast logic has diverged`)
  lines.push(`--`)
  lines.push(`-- Author: amendes           Last modified: 2024-12-01`)
  lines.push(`-- ============================================================================`)
  lines.push(``)

  // Steps 1-10: copy-pasted from fct_order_items (same generators)
  lines.push(`-- ---------------------------------------------------------------`)
  lines.push(`-- Steps 1-10: COPY-PASTED from build_fct_order_items.sql`)
  lines.push(`-- WARNING: This block must be kept in sync manually.`)
  lines.push(`--          Last verified: 2024-09-22`)
  lines.push(`-- ---------------------------------------------------------------`)
  lines.push(``)

  lines.push(...generateCteBlock(1, 'raw_line_items', [
    `l_orderkey          AS order_key`,
    `l_partkey           AS part_key`,
    `l_suppkey           AS supplier_key`,
    `l_linenumber        AS line_number`,
    `l_quantity          AS quantity`,
    `l_extendedprice     AS extended_price`,
    `l_discount          AS discount`,
    `l_tax               AS tax`,
    `l_returnflag        AS return_flag`,
    `l_linestatus        AS line_status`,
    `l_shipdate          AS ship_date`,
    `l_commitdate        AS commit_date`,
    `l_receiptdate       AS receipt_date`,
    `l_shipinstruct      AS ship_instructions`,
    `l_shipmode          AS ship_mode`,
    `l_comment           AS line_comment`,
    `_etl_loaded_at      AS loaded_at`,
  ], 'raw.tpch.lineitem', null, null, `_etl_loaded_at > '2020-01-01'`))

  lines.push(...generateDedupeBlock(2, 'unique_line_items', 'raw_line_items', 'order_key, line_number', 'loaded_at'))

  lines.push(...generateCastBlock(3, 'cleaned_line_items', 'unique_line_items', [
    `order_key`, `part_key`, `supplier_key`, `line_number`,
    `CAST(quantity AS NUMERIC(12,2))           AS quantity`,
    `CAST(extended_price AS NUMERIC(15,2))     AS extended_price`,
    `CAST(discount AS NUMERIC(5,4))            AS discount_pct`,
    `CAST(tax AS NUMERIC(5,4))                 AS tax_rate`,
    `return_flag`, `line_status`,
    `CAST(ship_date AS DATE)                   AS ship_date`,
    `CAST(commit_date AS DATE)                 AS commit_date`,
    `CAST(receipt_date AS DATE)                AS receipt_date`,
    `TRIM(LOWER(ship_mode))                    AS ship_mode`,
    `ROUND(extended_price * (1 - discount), 2) AS discounted_price`,
    `ROUND(extended_price * (1 - discount) * (1 + tax), 2) AS total_price`,
  ]))

  lines.push(...generateCteBlock(4, 'raw_orders', [
    `o_orderkey      AS order_key`,
    `o_custkey        AS customer_key`,
    `o_orderstatus   AS order_status`,
    `o_totalprice    AS order_total`,
    `o_orderdate     AS order_date`,
    `o_orderpriority AS order_priority`,
    `o_clerk         AS clerk_id`,
    `o_shippriority  AS ship_priority`,
    `o_comment       AS order_comment`,
    `_etl_loaded_at  AS loaded_at`,
  ], 'raw.tpch.orders', null, null, `_etl_loaded_at > '2020-01-01'`))

  lines.push(...generateDedupeBlock(5, 'unique_orders', 'raw_orders', 'order_key', 'loaded_at'))

  lines.push(`-- STEP 6: Map order status codes`)
  lines.push(`, mapped_orders AS (`)
  lines.push(`    SELECT`)
  lines.push(`        order_key, customer_key, order_total,`)
  lines.push(`        order_date, order_priority, clerk_id, ship_priority,`)
  lines.push(`        CASE order_status`)
  lines.push(`            WHEN 'O' THEN 'open'`)
  lines.push(`            WHEN 'F' THEN 'fulfilled'`)
  lines.push(`            WHEN 'P' THEN 'processing'`)
  lines.push(`            ELSE 'unknown'`)
  lines.push(`        END AS order_status`)
  lines.push(`    FROM unique_orders`)
  lines.push(`)`)
  lines.push(``)

  lines.push(...generateCteBlock(7, 'raw_parts', [
    `p_partkey       AS part_key`,
    `p_name          AS part_name`,
    `p_mfgr          AS manufacturer`,
    `p_brand         AS brand`,
    `p_type          AS part_type`,
    `p_size          AS part_size`,
    `p_container     AS container`,
    `p_retailprice   AS retail_price`,
  ], 'raw.tpch.part', null, null, null))

  lines.push(...generateDedupeBlock(8, 'unique_parts', 'raw_parts', 'part_key', 'part_key'))

  lines.push(...generateCteBlock(9, 'order_items', [
    `li.order_key`, `li.part_key`, `li.supplier_key`, `li.line_number`,
    `li.quantity`, `li.extended_price`, `li.discount_pct`, `li.tax_rate`,
    `li.discounted_price`, `li.total_price`,
    `li.return_flag`, `li.line_status`,
    `li.ship_date`, `li.commit_date`, `li.receipt_date`, `li.ship_mode`,
    `o.customer_key`, `o.order_date`, `o.order_status`,
    `o.order_priority`, `o.clerk_id`,
  ], 'cleaned_line_items li', 'mapped_orders o', 'li.order_key = o.order_key', null))

  lines.push(...generateCteBlock(10, 'order_items_with_parts', [
    `oi.*`, `p.part_name`, `p.manufacturer`, `p.brand`,
    `p.part_type`, `p.part_size`, `p.container`, `p.retail_price`,
  ], 'order_items oi', 'unique_parts p', 'oi.part_key = p.part_key', null))

  lines.push(`-- ---------------------------------------------------------------`)
  lines.push(`-- END OF COPY-PASTED BLOCK`)
  lines.push(`-- Steps below are specific to supplier performance`)
  lines.push(`-- ---------------------------------------------------------------`)
  lines.push(``)

  // Step 11: raw suppliers
  lines.push(...generateCteBlock(11, 'raw_suppliers', [
    `s_suppkey    AS supplier_key`,
    `s_name       AS supplier_name`,
    `s_nationkey  AS nation_key`,
    `s_acctbal    AS account_balance`,
    `s_phone      AS phone`,
    `s_address    AS address`,
  ], 'raw.tpch.supplier', null, null, null))

  lines.push(...generateDedupeBlock(12, 'unique_suppliers', 'raw_suppliers', 'supplier_key', 'supplier_key'))

  // Step 13: join to suppliers
  lines.push(...generateCteBlock(13, 'supplier_order_items', [
    `oi.order_key`, `oi.supplier_key`,
    `oi.quantity`, `oi.total_price`,
    `oi.discounted_price`, `oi.order_date`,
    `oi.ship_date`, `oi.return_flag`,
    `s.supplier_name`, `s.nation_key`,
    `s.account_balance`,
  ], 'order_items_with_parts oi', 'unique_suppliers s', 'oi.supplier_key = s.supplier_key', null))

  // Step 14: aggregate
  lines.push(...generateAggBlock(14, 'supplier_metrics', 'supplier_order_items', [
    'supplier_key', 'supplier_name', 'nation_key',
  ], [
    `COUNT(DISTINCT order_key) AS total_orders`,
    `SUM(quantity)             AS total_units`,
    `SUM(total_price)          AS total_revenue`,
    `AVG(total_price)          AS avg_order_value`,
    `MIN(order_date)           AS first_order_date`,
    `MAX(order_date)           AS last_order_date`,
    `SUM(CASE WHEN return_flag = 'R' THEN 1 ELSE 0 END) AS return_count`,
  ]))

  // Step 15: monthly supplier rollups
  lines.push(...generateAggBlock(15, 'supplier_monthly', 'supplier_order_items', [
    'supplier_key', 'supplier_name',
    `DATE_TRUNC('month', order_date) AS perf_month`,
  ], [
    `COUNT(DISTINCT order_key) AS monthly_orders`,
    `SUM(quantity)             AS monthly_units`,
    `SUM(total_price)          AS monthly_revenue`,
  ]))

  // Step 16: supplier quality scoring
  lines.push(`-- STEP 16: Supplier quality scoring`)
  lines.push(`, supplier_quality AS (`)
  lines.push(`    SELECT`)
  lines.push(`        sm.*,`)
  lines.push(`        ROUND(return_count * 100.0 / NULLIF(total_orders, 0), 2) AS return_rate_pct,`)
  lines.push(`        CASE`)
  lines.push(`            WHEN return_count * 100.0 / NULLIF(total_orders, 0) < 2 THEN 'excellent'`)
  lines.push(`            WHEN return_count * 100.0 / NULLIF(total_orders, 0) < 5 THEN 'good'`)
  lines.push(`            WHEN return_count * 100.0 / NULLIF(total_orders, 0) < 10 THEN 'fair'`)
  lines.push(`            ELSE 'poor'`)
  lines.push(`        END AS quality_tier,`)
  lines.push(`        DATEDIFF('day', first_order_date, last_order_date) AS active_days,`)
  lines.push(`        ROUND(total_revenue / NULLIF(DATEDIFF('day', first_order_date, last_order_date), 0), 2) AS revenue_per_day`)
  lines.push(`    FROM supplier_metrics sm`)
  lines.push(`)`)
  lines.push(``)

  // Final
  lines.push(`-- STEP 17: Final materialization`)
  lines.push(`CREATE TABLE analytics.supplier_performance AS`)
  lines.push(`SELECT`)
  lines.push(`    supplier_key, supplier_name, nation_key,`)
  lines.push(`    total_orders, total_units, total_revenue,`)
  lines.push(`    avg_order_value, first_order_date,`)
  lines.push(`    last_order_date, return_count,`)
  lines.push(`    return_rate_pct, quality_tier,`)
  lines.push(`    active_days, revenue_per_day`)
  lines.push(`FROM supplier_quality;`)

  // Pad to ~1000 lines
  while (lines.length < 1000) {
    const n = lines.length
    lines.push(``)
    lines.push(`-- AUDIT BLOCK ${Math.floor((n - 500) / 30) + 1}: Validation check`)
    lines.push(`-- Inserted by data-ops team for supplier data quality monitoring`)
    lines.push(`-- SELECT COUNT(*) FROM analytics.supplier_performance`)
    lines.push(`--   WHERE supplier_key IS NULL;  -- should return 0`)
    lines.push(`-- SELECT COUNT(*) FROM analytics.supplier_performance`)
    lines.push(`--   WHERE total_revenue < 0;     -- should return 0`)
    lines.push(`-- SELECT SUM(total_orders) FROM analytics.supplier_performance;`)
    lines.push(`-- Expected: should match fct_order_items distinct order count`)
    lines.push(`-- DISCREPANCY LOG: last checked 2024-10-15, off by 342 rows`)
    lines.push(`-- Root cause unknown — likely drift from build_fct_order_items.sql`)
  }

  return lines
}

const GENERATED_SCRIPT_1 = buildFctOrderItemsScript()
const GENERATED_SCRIPT_2 = buildSupplierPerfScript()

// --- Short dbt model SQL for With dbt drilldown ---
const MODEL_SQL = {
  sl: [
    `{{ config(materialized='view') }}`,
    ``,
    `select`,
    `    l_orderkey      as order_key,`,
    `    l_partkey       as part_key,`,
    `    l_suppkey       as supplier_key,`,
    `    l_linenumber    as line_number,`,
    `    l_quantity      as quantity,`,
    `    l_extendedprice as extended_price,`,
    `    l_discount      as discount,`,
    `    l_tax           as tax,`,
    `    l_shipdate      as ship_date,`,
    `    l_returnflag    as return_flag`,
    `from {{ source('tpch', 'lineitem') }}`,
  ],
  so: [
    `{{ config(materialized='view') }}`,
    ``,
    `select`,
    `    o_orderkey      as order_key,`,
    `    o_custkey       as customer_key,`,
    `    o_orderstatus   as order_status,`,
    `    o_totalprice    as order_total,`,
    `    o_orderdate     as order_date,`,
    `    o_orderpriority as order_priority`,
    `from {{ source('tpch', 'orders') }}`,
  ],
  sc: [
    `{{ config(materialized='view') }}`,
    ``,
    `select`,
    `    c_custkey    as customer_key,`,
    `    c_name       as customer_name,`,
    `    c_nationkey  as nation_key,`,
    `    c_acctbal    as account_balance,`,
    `    c_mktsegment as market_segment`,
    `from {{ source('tpch', 'customer') }}`,
  ],
  sp: [
    `{{ config(materialized='view') }}`,
    ``,
    `select`,
    `    p_paykey   as payment_key,`,
    `    p_orderkey as order_key,`,
    `    p_amount   as amount,`,
    `    p_method   as payment_method,`,
    `    p_status   as payment_status,`,
    `    p_date     as payment_date`,
    `from {{ source('tpch', 'payments') }}`,
  ],
  io: [
    `select`,
    `    li.order_key,`,
    `    li.part_key,`,
    `    li.supplier_key,`,
    `    li.line_number,`,
    `    li.quantity,`,
    `    li.extended_price,`,
    `    li.discount,`,
    `    li.tax,`,
    `    o.customer_key,`,
    `    o.order_date,`,
    `    o.order_status`,
    `from {{ ref('stg_line_items') }} li`,
    `inner join {{ ref('stg_orders') }} o`,
    `    on li.order_key = o.order_key`,
  ],
  ic: [
    `select`,
    `    o.order_key,`,
    `    o.order_date,`,
    `    o.order_status,`,
    `    o.order_total,`,
    `    c.customer_key,`,
    `    c.customer_name,`,
    `    c.market_segment`,
    `from {{ ref('stg_orders') }} o`,
    `inner join {{ ref('stg_customers') }} c`,
    `    on o.customer_key = c.customer_key`,
  ],
  fo: [
    `{{ config(materialized='table') }}`,
    ``,
    `select`,
    `    oi.order_key,`,
    `    oi.order_date,`,
    `    oi.customer_key,`,
    `    oi.order_status,`,
    `    count(oi.line_number)  as line_count,`,
    `    sum(oi.extended_price) as gross_revenue,`,
    `    sum(oi.quantity)       as total_quantity`,
    `from {{ ref('int_order_items') }} oi`,
    `group by 1, 2, 3, 4`,
  ],
  fp: [
    `{{ config(materialized='table') }}`,
    ``,
    `select`,
    `    co.order_key,`,
    `    co.customer_name,`,
    `    co.order_date,`,
    `    co.order_total,`,
    `    p.payment_method,`,
    `    p.amount as payment_amount`,
    `from {{ ref('int_customer_orders') }} co`,
    `inner join {{ ref('stg_payments') }} p`,
    `    on co.order_key = p.order_key`,
  ],
}

const MODEL_FILENAMES = {
  sl: 'stg_line_items.sql', so: 'stg_orders.sql', sc: 'stg_customers.sql',
  sp: 'stg_payments.sql', io: 'int_order_items.sql', ic: 'int_customer_orders.sql',
  fo: 'fct_orders.sql', fp: 'fct_order_payments.sql',
}

function ModularityVisual({ showDbt }) {
  const [showSecond, setShowSecond] = useState(false)
  const [drilldown, setDrilldown] = useState(null) // null | 'script-1' | 'script-2' | 'table-1' | 'table-2'
  const secondRef = useRef(null)

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={showDbt ? 'with' : 'without'}
        initial={{ opacity: 0, x: showDbt ? 10 : -10 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: showDbt ? -10 : 10 }}
        transition={{ duration: 0.25 }}
      >
        {!showDbt ? (
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 space-y-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Raw sources go in, one table comes out. Everything in between is a single massive script
            </p>

            {/* Horizontal lineage SVG */}
            <div className="bg-white border border-gray-200 rounded-lg p-5 flex justify-center overflow-visible">
              <svg viewBox={`-10 -6 760 ${showSecond ? 340 : 172}`} className="w-full max-w-3xl h-auto" style={{ transition: 'height 0.5s ease', overflow: 'visible' }}>
                <defs>
                  <marker id="without-arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                    <path d="M0,0 L0,6 L6,3 z" fill="#9ca3af" />
                  </marker>
                  <marker id="without-arrow-dark" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                    <path d="M0,0 L0,6 L6,3 z" fill="#6b7280" />
                  </marker>
                  <filter id="mod-hover-shadow" x="-10%" y="-10%" width="120%" height="130%">
                    <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.18" />
                  </filter>
                  <style>{`
                    .mod-node-hover {
                      transition: transform 0.2s ease, filter 0.2s ease;
                      transform-box: fill-box;
                      transform-origin: center;
                    }
                    .mod-node-hover:hover {
                      transform: scale(1.04);
                      filter: url(#mod-hover-shadow);
                    }
                  `}</style>
                </defs>

                {/* ===== ROW 1: Sources → build_fct_order_items → fct_order_items ===== */}

                {/* Source nodes (left) */}
                {[
                  { label: 'tpch.lineitem', y: 20 },
                  { label: 'tpch.orders', y: 68 },
                  { label: 'tpch.part', y: 116 },
                ].map((src, i) => (
                  <g key={`src1-${i}`} className="mod-node-hover">
                    <rect x={0} y={src.y} width={130} height={26} rx={6}
                      fill="#ecfeff" stroke="#a5f3fc" strokeWidth={1.2} />
                    <text x={6} y={src.y + 14} fontSize="6" fontWeight="700" fill="#06b6d4" fontFamily="monospace" dominantBaseline="middle">SRC</text>
                    <text x={27} y={src.y + 14} fontSize={8} fontWeight="600" fill="#155e75" fontFamily="monospace" dominantBaseline="middle">{src.label}</text>
                  </g>
                ))}

                {/* Arrows: sources → black box 1 */}
                {[33, 81, 129].map((sy, i) => (
                  <path key={`e1-${i}`}
                    d={`M130 ${sy} C165 ${sy} 165 80 200 80`}
                    fill="none" stroke="#d1d5db" strokeWidth={1.5}
                    markerEnd="url(#without-arrow)"
                  />
                ))}

                {/* Black box 1 */}
                <g className="mod-node-hover" style={{ cursor: 'pointer' }} onClick={() => setDrilldown(drilldown === 'script-1' ? null : 'script-1')}>
                  <rect x={200} y={18} width={300} height={124} rx={8}
                    fill="#1f2937" stroke={drilldown === 'script-1' ? '#f59e0b' : '#374151'} strokeWidth={drilldown === 'script-1' ? 3 : 2} />
                  <rect x={200} y={18} width={300} height={28} rx={8} fill="#111827" />
                  <rect x={200} y={38} width={300} height={8} fill="#111827" />
                  <text x={212} y={36} fontSize="9" fontWeight="700" fill="#9ca3af" fontFamily="monospace" dominantBaseline="middle">
                    build_fct_order_items.sql
                  </text>
                  {[
                    { text: 'WITH raw_line_items AS (', y: 58 },
                    { text: '    SELECT l_orderkey AS order_key,', y: 70 },
                    { text: '           l_partkey  AS part_key, ...', y: 82 },
                    { text: '    FROM raw.tpch.lineitem', y: 94 },
                    { text: '    WHERE _etl_loaded_at > ...', y: 106 },
                    { text: '), deduped AS ( ... ), cleaned AS ( ...', y: 118 },
                    { text: 'CREATE TABLE analytics.fct_order_items', y: 130 },
                  ].map((line, i) => (
                    <text key={i} x={212} y={line.y} fontSize="7" fill="#a1a1aa"
                      fontFamily="monospace" opacity={0.7 - i * 0.03} dominantBaseline="middle">
                      {line.text}
                    </text>
                  ))}
                  <rect x={275} y={92} width={150} height={22} rx={11} fill="#374151" stroke="#4b5563" strokeWidth={1} />
                  <text x={350} y={104} textAnchor="middle" fontSize="8" fontWeight="600" fill="#d1d5db" fontFamily="monospace" dominantBaseline="middle">
                    Click to see full script
                  </text>
                </g>

                {/* Arrow: box 1 → fact table 1 */}
                <path d="M500 80 C540 80 540 80 570 80"
                  fill="none" stroke="#6b7280" strokeWidth={2}
                  markerEnd="url(#without-arrow-dark)"
                />

                {/* Fact table 1 */}
                <g className="mod-node-hover" style={{ cursor: 'pointer' }} onClick={() => setDrilldown(drilldown === 'table-1' ? null : 'table-1')}>
                  <rect x={575} y={60} width={160} height={40} rx={7}
                    fill="#fff7ed" stroke={drilldown === 'table-1' ? '#f59e0b' : '#f97316'} strokeWidth={drilldown === 'table-1' ? 3 : 2} />
                  <text x={583} y={81} fontSize="6" fontWeight="700" fill="#f97316" fontFamily="monospace" dominantBaseline="middle">TABLE</text>
                  <text x={612} y={74} fontSize="7.5" fontWeight="600" fill="#9a3412" fontFamily="monospace" dominantBaseline="middle">analytics.</text>
                  <text x={612} y={88} fontSize="8" fontWeight="700" fill="#9a3412" fontFamily="monospace" dominantBaseline="middle">fct_order_items</text>
                </g>

                {/* Layer labels */}
                <text x={65} y={showSecond ? 325 : 155} textAnchor="middle" fontSize="8" fill="#9ca3af" fontWeight="500">Sources</text>
                <text x={350} y={showSecond ? 325 : 155} textAnchor="middle" fontSize="8" fill="#9ca3af" fontWeight="500">Scripts</text>
                <text x={655} y={showSecond ? 325 : 155} textAnchor="middle" fontSize="8" fill="#9ca3af" fontWeight="500">Tables</text>

                {/* ===== ROW 2: 4 sources → build_supplier_performance → supplier_performance ===== */}
                {showSecond && (
                  <motion.g
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                  >
                    {/* 4 source nodes (re-reads same 3 + new supplier) */}
                    {[
                      { label: 'tpch.lineitem', y: 170 },
                      { label: 'tpch.orders', y: 206 },
                      { label: 'tpch.part', y: 242 },
                      { label: 'tpch.supplier', y: 278 },
                    ].map((src, i) => (
                      <g key={`src2-${i}`} className="mod-node-hover">
                        <rect x={0} y={src.y} width={130} height={26} rx={6}
                          fill="#ecfeff" stroke="#a5f3fc" strokeWidth={1.2} />
                        <text x={6} y={src.y + 14} fontSize="6" fontWeight="700" fill="#06b6d4" fontFamily="monospace" dominantBaseline="middle">SRC</text>
                        <text x={27} y={src.y + 14} fontSize={8} fontWeight="600" fill="#155e75" fontFamily="monospace" dominantBaseline="middle">{src.label}</text>
                      </g>
                    ))}

                    {/* Arrows: 4 sources → black box 2 */}
                    {[183, 219, 255, 291].map((sy, i) => (
                      <path key={`e2-${i}`}
                        d={`M130 ${sy} C165 ${sy} 165 237 200 237`}
                        fill="none" stroke="#d1d5db" strokeWidth={1.5}
                        markerEnd="url(#without-arrow)"
                      />
                    ))}

                    {/* Black box 2 (same size/style as box 1) */}
                    <g className="mod-node-hover" style={{ cursor: 'pointer' }} onClick={() => setDrilldown(drilldown === 'script-2' ? null : 'script-2')}>
                      <rect x={200} y={175} width={300} height={124} rx={8}
                        fill="#1f2937" stroke={drilldown === 'script-2' ? '#f59e0b' : '#374151'} strokeWidth={drilldown === 'script-2' ? 3 : 2} />
                      <rect x={200} y={175} width={300} height={28} rx={8} fill="#111827" />
                      <rect x={200} y={195} width={300} height={8} fill="#111827" />
                      <text x={212} y={193} fontSize="9" fontWeight="700" fill="#9ca3af" fontFamily="monospace" dominantBaseline="middle">
                        build_supplier_performance.sql
                      </text>
                      {[
                        { text: '-- Steps 1-7 copied from build_fct_order_items', y: 215 },
                        { text: 'WITH raw_line_items AS (', y: 227 },
                        { text: '    SELECT l_orderkey AS order_key,', y: 239 },
                        { text: '    ... (same extract + dedup + join) ...', y: 251 },
                        { text: '), supplier_metrics AS ( ... )', y: 263 },
                        { text: 'CREATE TABLE analytics.supplier_performance', y: 275 },
                        { text: '-- WARNING: may have drifted from source', y: 287 },
                      ].map((line, i) => (
                        <text key={i} x={212} y={line.y} fontSize="7" fill="#a1a1aa"
                          fontFamily="monospace" opacity={0.7 - i * 0.03} dominantBaseline="middle">
                          {line.text}
                        </text>
                      ))}
                      <rect x={275} y={249} width={150} height={22} rx={11} fill="#374151" stroke="#4b5563" strokeWidth={1} />
                      <text x={350} y={261} textAnchor="middle" fontSize="8" fontWeight="600" fill="#d1d5db" fontFamily="monospace" dominantBaseline="middle">
                        Click to see full script
                      </text>
                    </g>

                    {/* Arrow: box 2 → fact table 2 */}
                    <path d="M500 237 C540 237 540 237 570 237"
                      fill="none" stroke="#6b7280" strokeWidth={2}
                      markerEnd="url(#without-arrow-dark)"
                    />

                    {/* Fact table 2 */}
                    <g className="mod-node-hover" style={{ cursor: 'pointer' }} onClick={() => setDrilldown(drilldown === 'table-2' ? null : 'table-2')}>
                      <rect x={575} y={217} width={160} height={40} rx={7}
                        fill="#fff7ed" stroke={drilldown === 'table-2' ? '#f59e0b' : '#f97316'} strokeWidth={drilldown === 'table-2' ? 3 : 2} />
                      <text x={583} y={238} fontSize="6" fontWeight="700" fill="#f97316" fontFamily="monospace" dominantBaseline="middle">TABLE</text>
                      <text x={612} y={231} fontSize="7.5" fontWeight="600" fill="#9a3412" fontFamily="monospace" dominantBaseline="middle">analytics.</text>
                      <text x={612} y={245} fontSize="7.5" fontWeight="700" fill="#9a3412" fontFamily="monospace" dominantBaseline="middle">supplier_performance</text>
                    </g>
                  </motion.g>
                )}
              </svg>
            </div>

            {/* Button */}
            <div className="flex justify-center">
              <button
                onClick={() => {
                  const next = !showSecond
                  setShowSecond(next)
                  if (!next) setDrilldown(null)
                }}
                className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
              >
                {showSecond ? 'Remove data product' : 'Create new data product'}
              </button>
            </div>

            {/* Expandable drilldown panel (script or table — one slot) */}
            <AnimatePresence mode="wait">
              {drilldown && (
                <motion.div
                  key={drilldown}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  {drilldown.startsWith('script') ? (
                    <div className="bg-white rounded-lg overflow-hidden border border-gray-300 shadow-sm">
                      <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-200">
                        <span className="text-xs font-mono font-bold text-gray-700">
                          {drilldown === 'script-1' ? 'build_fct_order_items.sql' : 'build_supplier_performance.sql'}
                          <span className="ml-2 text-gray-400 font-normal">
                            ({(drilldown === 'script-1' ? GENERATED_SCRIPT_1 : GENERATED_SCRIPT_2).length} lines)
                          </span>
                        </span>
                        <button onClick={() => setDrilldown(null)}
                          className="text-gray-400 hover:text-gray-700 text-sm font-bold px-1.5 leading-none">×</button>
                      </div>
                      <div className="max-h-[400px] overflow-y-auto font-mono text-[10px] leading-[16px]">
                        {(drilldown === 'script-1' ? GENERATED_SCRIPT_1 : GENERATED_SCRIPT_2).map((line, i) => (
                          <div key={i} className={`flex ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                            <span className="text-gray-400 select-none w-10 shrink-0 text-right pr-3 py-px bg-gray-50 border-r border-gray-200">{i + 1}</span>
                            <span className="pl-3 py-px text-gray-800" dangerouslySetInnerHTML={{ __html: modHighlightLine(line) }} />
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white rounded-lg overflow-hidden border border-gray-300 shadow-sm">
                      <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-200">
                        <div className="flex items-center gap-2">
                          <span className="text-[8px] font-bold uppercase tracking-wider text-gray-400 bg-gray-200 rounded px-1.5 py-0.5">Table</span>
                          <span className="text-xs font-mono font-bold text-gray-700">
                            {drilldown === 'table-1' ? 'analytics.fct_order_items' : 'analytics.supplier_performance'}
                          </span>
                        </div>
                        <button onClick={() => setDrilldown(null)}
                          className="text-gray-400 hover:text-gray-700 text-sm font-bold px-1.5 leading-none">×</button>
                      </div>
                      <div className="overflow-auto max-h-[400px]">
                        <table className="w-full text-[11px] font-mono">
                          <thead>
                            <tr className="border-b border-gray-200 bg-gray-50/60">
                              {(drilldown === 'table-1'
                                ? ['order_key', 'line_number', 'part_key', 'supplier_key', 'quantity', 'order_date']
                                : ['supplier_key', 'supplier_name', 'total_quantity', 'total_revenue', 'order_count']
                              ).map(col => (
                                <th key={col} className="px-3 py-2 text-left font-semibold text-gray-500 whitespace-nowrap">{col}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {(drilldown === 'table-1' ? [
                              [1, 1, 1551894, 76910, 17, '1996-03-13'],
                              [1, 2, 673091, 73092, 36, '1996-03-13'],
                              [1, 3, 636178, 11179, 8, '1996-03-13'],
                              [2, 1, 1059142, 9143, 38, '1996-12-01'],
                              [3, 1, 298631, 48634, 45, '1993-10-29'],
                              [3, 2, 473423, 23424, 49, '1993-10-29'],
                              [4, 1, 880439, 5440, 30, '1995-10-11'],
                              [5, 1, 374623, 24624, 15, '1994-07-30'],
                              [5, 2, 951893, 1894, 28, '1994-07-30'],
                              [5, 3, 163489, 13490, 24, '1994-07-30'],
                              [6, 1, 1130114, 30115, 32, '1992-02-21'],
                              [7, 1, 821282, 71283, 44, '1996-01-10'],
                              [7, 2, 615438, 65439, 27, '1996-01-10'],
                              [7, 3, 289830, 39831, 12, '1996-01-10'],
                              [32, 1, 827530, 77531, 28, '1995-07-16'],
                              [32, 2, 1005011, 55012, 38, '1995-07-16'],
                              [33, 1, 447685, 97686, 31, '1993-10-27'],
                              [34, 1, 614894, 14895, 26, '1998-07-21'],
                            ] : [
                              [76910, 'Supplier#076910', 48205, 2841903.47, 1842],
                              [9143, 'Supplier#009143', 24817, 1503662.11, 956],
                              [48634, 'Supplier#048634', 61440, 3672415.90, 2310],
                              [73092, 'Supplier#073092', 29853, 1789204.33, 1124],
                              [23424, 'Supplier#023424', 17296, 1045830.56, 687],
                              [5440, 'Supplier#005440', 31204, 1892447.63, 1205],
                              [24624, 'Supplier#024624', 19873, 1238921.04, 814],
                              [1894, 'Supplier#001894', 42610, 2567103.88, 1653],
                              [13490, 'Supplier#013490', 8912, 524831.19, 397],
                              [30115, 'Supplier#030115', 55210, 3241089.72, 2187],
                              [71283, 'Supplier#071283', 14503, 879462.50, 612],
                              [65439, 'Supplier#065439', 37841, 2145930.33, 1489],
                              [39831, 'Supplier#039831', 22160, 1342705.91, 923],
                              [77531, 'Supplier#077531', 11294, 698204.17, 485],
                              [55012, 'Supplier#055012', 46820, 2789310.44, 1901],
                              [97686, 'Supplier#097686', 6430, 391856.22, 271],
                              [14895, 'Supplier#014895', 33507, 2014583.60, 1347],
                              [80201, 'Supplier#080201', 28942, 1729481.05, 1098],
                            ]).map((row, ri) => (
                              <tr key={ri} className={`border-b border-gray-100 ${ri % 2 === 1 ? 'bg-gray-50/40' : ''}`}>
                                {row.map((cell, ci) => (
                                  <td key={ci} className={`px-3 py-1.5 whitespace-nowrap text-gray-600 ${typeof cell === 'number' ? 'text-right tabular-nums' : ''}`}>
                                    {typeof cell === 'number' ? cell.toLocaleString() : cell}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 space-y-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Logic is modular: new products reference existing nodes
            </p>

            {/* Lineage DAG */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col items-center transition-all duration-500 overflow-visible">
              <ModularityDAG
                showNew={showSecond}
                onNodeClick={(id) => setDrilldown(drilldown === `model-${id}` ? null : `model-${id}`)}
                activeNode={drilldown?.startsWith('model-') ? drilldown.slice(6) : null}
              />
              <p className="text-[10px] text-gray-400 mt-2 italic">Click any model to view its code</p>
            </div>

            {/* Button */}
            <div className="flex justify-center">
              <button
                onClick={() => { setShowSecond(v => !v); setDrilldown(null) }}
                className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
              >
                {showSecond ? 'Remove data product' : 'Create new data product'}
              </button>
            </div>

            {/* Model code drilldown */}
            <AnimatePresence mode="wait">
              {drilldown?.startsWith('model-') && MODEL_SQL[drilldown.slice(6)] && (
                <motion.div
                  key={drilldown}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="bg-white rounded-lg overflow-hidden border border-gray-300 shadow-sm">
                    <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-200">
                      <span className="text-xs font-mono font-bold text-gray-700">
                        {MODEL_FILENAMES[drilldown.slice(6)]}
                      </span>
                      <button onClick={() => setDrilldown(null)}
                        className="text-gray-400 hover:text-gray-700 text-sm font-bold px-1.5 leading-none">×</button>
                    </div>
                    <div className="max-h-[400px] overflow-y-auto font-mono text-[11px] leading-[20px]">
                      {MODEL_SQL[drilldown.slice(6)].map((line, i) => (
                        <div key={i} className={`flex ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                          <span className="text-gray-400 select-none w-8 shrink-0 text-right pr-3 py-px bg-gray-50 border-r border-gray-200">{i + 1}</span>
                          <span className="pl-3 py-px text-gray-800" dangerouslySetInnerHTML={{ __html: modHighlightLine(line) }} />
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}


/* ------------------------------------------------------------------ */
/*  Reusable Logic visual                                             */
/* ------------------------------------------------------------------ */

function ReusableLogicVisual({ showDbt }) {
  if (!showDbt) {
    return (
      <div className="space-y-4">
        <motion.div whileHover={{ y: -3 }} transition={{ type: 'spring', stiffness: 400, damping: 20 }} className="bg-white border border-gray-200 rounded-lg p-4 cursor-default hover:shadow-md transition-shadow">
          <p className="text-red-600 text-xs font-semibold mb-2">stg_customers.sql</p>
          <pre className="text-gray-700 text-[11px] leading-relaxed whitespace-pre-wrap">{'SELECT\n  id,\n  name,\n'}<span className="bg-red-50 border-l-2 border-red-300 -ml-2 pl-2 block py-0.5">{'  REGEXP_REPLACE(\n    REGEXP_REPLACE(phone, \'[^0-9]\', \'\'),\n    \'^1?(\\d{10})$\', \'(\\1) \\2-\\3\'\n  ) AS phone_clean'}</span>{'\nFROM raw.customers'}</pre>
          <p className="text-red-600/60 text-[10px] mt-2">Phone normalization logic inline</p>
        </motion.div>
        <motion.div whileHover={{ y: -3 }} transition={{ type: 'spring', stiffness: 400, damping: 20 }} className="bg-white border border-gray-200 rounded-lg p-4 cursor-default hover:shadow-md transition-shadow">
          <p className="text-red-600 text-xs font-semibold mb-2">stg_vendors.sql</p>
          <pre className="text-gray-700 text-[11px] leading-relaxed whitespace-pre-wrap">{'SELECT\n  id,\n  company_name,\n'}<span className="bg-red-50 border-l-2 border-red-300 -ml-2 pl-2 block py-0.5">{'  REGEXP_REPLACE(\n    REGEXP_REPLACE(phone, \'[^0-9]\', \'\'),\n    \'^1?(\\d{10})$\', \'(\\1) \\2-\\3\'\n  ) AS phone_clean'}</span>{'\nFROM raw.vendors'}</pre>
          <p className="text-red-600/60 text-[10px] mt-2">Same regex copied. Update one, forget the other.</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Macro definition */}
      <motion.div whileHover={{ y: -3 }} transition={{ type: 'spring', stiffness: 400, damping: 20 }} className="bg-white border border-gray-200 rounded-lg p-4 border-l-4 border-l-amber-300 cursor-default hover:shadow-md transition-shadow">
        <p className="text-amber-600 text-xs font-semibold mb-2">macros/normalize_phone.sql</p>
        <pre className="text-gray-700 text-[11px] leading-relaxed whitespace-pre-wrap">{`{% macro normalize_phone(column_name) %}
  REGEXP_REPLACE(
    REGEXP_REPLACE({{ column_name }}, '[^0-9]', ''),
    '^1?(\\d{10})$', '(\\1) \\2-\\3'
  )
{% endmacro %}`}</pre>
        <p className="text-amber-600/70 text-[10px] mt-2">Defined once. Tested once. Updated once.</p>
      </motion.div>
      {/* Models calling the macro */}
      <div className="grid grid-cols-2 gap-3">
        <motion.div whileHover={{ y: -3 }} transition={{ type: 'spring', stiffness: 400, damping: 20 }} className="bg-white border border-gray-200 rounded-lg p-3 cursor-default hover:shadow-md transition-shadow">
          <p className="text-emerald-600 text-[10px] font-semibold mb-1">stg_customers.sql</p>
          <pre className="text-gray-700 text-[11px] leading-relaxed whitespace-pre-wrap">{'SELECT\n  id,\n  name,\n  '}<span className="text-amber-600 font-semibold bg-amber-100 px-0.5 rounded">{"{{ normalize_phone('phone') }}"}</span>{'\n    AS phone_clean\nFROM {{ source(\'raw\',\'customers\') }}'}</pre>
        </motion.div>
        <motion.div whileHover={{ y: -3 }} transition={{ type: 'spring', stiffness: 400, damping: 20 }} className="bg-white border border-gray-200 rounded-lg p-3 cursor-default hover:shadow-md transition-shadow">
          <p className="text-emerald-600 text-[10px] font-semibold mb-1">stg_vendors.sql</p>
          <pre className="text-gray-700 text-[11px] leading-relaxed whitespace-pre-wrap">{'SELECT\n  id,\n  company_name,\n  '}<span className="text-amber-600 font-semibold bg-amber-100 px-0.5 rounded">{"{{ normalize_phone('phone') }}"}</span>{'\n    AS phone_clean\nFROM {{ source(\'raw\',\'vendors\') }}'}</pre>
        </motion.div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  DDL visual                                                        */
/* ------------------------------------------------------------------ */

function DDLVisual({ showDbt }) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left: Table materialization */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Table</p>
          <AnimatePresence mode="wait">
            <motion.div
              key={showDbt ? 'table-with' : 'table-without'}
              initial={{ opacity: 0, x: showDbt ? 10 : -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: showDbt ? -10 : 10 }}
              transition={{ duration: 0.25 }}
            >
              {showDbt ? (
                <motion.div whileHover={{ y: -3 }} transition={{ type: 'spring', stiffness: 400, damping: 20 }} className="bg-white border border-gray-200 rounded-lg p-3 cursor-default hover:shadow-md transition-shadow">
                  <p className="text-gray-500 text-[10px] font-semibold mb-2 font-mono">fct_orders.sql</p>
                  <div className="font-mono text-[11px] leading-relaxed">
                    <div className="bg-amber-50 border-l-2 border-amber-400 -ml-2 pl-2 py-0.5 mb-2">
                      <span className="text-amber-600 font-bold">{"{{ config(materialized='table') }}"}</span>
                    </div>
                    <div className="text-gray-700">
                      <div><span className="text-blue-600">SELECT</span></div>
                      <div className="ml-2">o.order_id,</div>
                      <div className="ml-2">o.customer_id,</div>
                      <div className="ml-2">o.order_date,</div>
                      <div className="ml-2">o.amount,</div>
                      <div className="ml-2">o.status</div>
                      <div><span className="text-blue-600">FROM</span> <span className="text-emerald-600 font-bold">{"{{ ref('stg_orders') }}"}</span> o</div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div whileHover={{ y: -3 }} transition={{ type: 'spring', stiffness: 400, damping: 20 }} className="bg-white border border-gray-200 rounded-lg p-3 cursor-default hover:shadow-md transition-shadow">
                  <p className="text-red-600 text-[10px] font-semibold mb-2 font-mono">fct_orders.sql</p>
                  <pre className="text-gray-700 text-[11px] leading-relaxed whitespace-pre-wrap font-mono"><span className="text-blue-600">CREATE OR REPLACE TABLE</span>{` analytics.fct_orders (
  order_id     STRING,
  customer_id  STRING,
  order_date   DATE,
  amount       NUMERIC,
  status       STRING,
  updated_at   TIMESTAMP
) `}<span className="text-blue-600">AS</span>{`

`}<span className="text-blue-600">SELECT</span>{`
  o.order_id,
  o.customer_id,
  o.order_date,
  o.amount,
  o.status,
  CURRENT_TIMESTAMP() AS updated_at
`}<span className="text-blue-600">FROM</span>{` raw.orders o;`}</pre>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right: Incremental materialization */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Incremental</p>
          <AnimatePresence mode="wait">
            <motion.div
              key={showDbt ? 'inc-with' : 'inc-without'}
              initial={{ opacity: 0, x: showDbt ? 10 : -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: showDbt ? -10 : 10 }}
              transition={{ duration: 0.25 }}
            >
              {showDbt ? (
                <motion.div whileHover={{ y: -3 }} transition={{ type: 'spring', stiffness: 400, damping: 20 }} className="bg-white border border-gray-200 rounded-lg p-3 cursor-default hover:shadow-md transition-shadow">
                  <p className="text-gray-500 text-[10px] font-semibold mb-2 font-mono">fct_orders.sql</p>
                  <div className="font-mono text-[11px] leading-relaxed">
                    <div className="bg-amber-50 border-l-2 border-amber-400 -ml-2 pl-2 py-1 mb-2">
                      <pre className="text-amber-600 whitespace-pre-wrap font-bold">{`{{
  config(
    materialized='incremental',
    incremental_strategy='microbatch',
    event_time='order_date',
    batch_size='day',
  )
}}`}</pre>
                    </div>
                    <div className="text-gray-700">
                      <div><span className="text-blue-600">SELECT</span></div>
                      <div className="ml-2">o.order_id,</div>
                      <div className="ml-2">o.customer_id,</div>
                      <div className="ml-2">o.order_date,</div>
                      <div className="ml-2">o.amount,</div>
                      <div className="ml-2">o.status</div>
                      <div><span className="text-blue-600">FROM</span> <span className="text-emerald-600 font-bold">{"{{ ref('stg_orders') }}"}</span> o</div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div whileHover={{ y: -3 }} transition={{ type: 'spring', stiffness: 400, damping: 20 }} className="bg-white border border-gray-200 rounded-lg p-3 max-h-[420px] overflow-y-auto cursor-default hover:shadow-md transition-shadow">
                  <p className="text-red-600 text-[10px] font-semibold mb-2 font-mono">fct_orders.sql</p>
                  <pre className="text-gray-700 text-[11px] leading-relaxed whitespace-pre-wrap font-mono"><span className="text-gray-400">-- 1. Create target table if it doesn't exist</span>{'\n'}<span className="text-blue-600">CREATE TABLE IF NOT EXISTS</span>{` analytics.fct_orders (
  order_id     STRING,
  customer_id  STRING,
  order_date   DATE,
  amount       NUMERIC,
  status       STRING,
  updated_at   TIMESTAMP
);

`}<span className="text-gray-400">-- 2. Figure out which day-batches to reload</span>{'\n'}<span className="text-blue-600">SET</span>{` batch_end   = CURRENT_DATE;
`}<span className="text-blue-600">SET</span>{` batch_start = DATEADD(day, -3, CURRENT_DATE);

`}<span className="text-gray-400">-- 3. Day 1 batch</span>{'\n'}<span className="text-blue-600">MERGE INTO</span>{` analytics.fct_orders AS target
`}<span className="text-blue-600">USING</span>{` (
  `}<span className="text-blue-600">SELECT</span>{`
    o.order_id,
    o.customer_id,
    o.order_date,
    o.amount,
    o.status,
    CURRENT_TIMESTAMP() AS updated_at
  `}<span className="text-blue-600">FROM</span>{` raw.orders o
  `}<span className="text-blue-600">WHERE</span>{` o.order_date >= $batch_start
    `}<span className="text-blue-600">AND</span>{` o.order_date < DATEADD(day, 1, $batch_start)
) AS source
`}<span className="text-blue-600">ON</span>{` target.order_id = source.order_id
`}<span className="text-blue-600">WHEN MATCHED THEN UPDATE SET</span>{`
  target.order_id    = source.order_id,
  target.customer_id = source.customer_id,
  target.order_date  = source.order_date,
  target.amount      = source.amount,
  target.status      = source.status,
  target.updated_at  = source.updated_at
`}<span className="text-blue-600">WHEN NOT MATCHED THEN INSERT</span>{` (
  order_id, customer_id, order_date,
  amount, status, updated_at
) `}<span className="text-blue-600">VALUES</span>{` (
  source.order_id,
  source.customer_id,
  source.order_date,
  source.amount,
  source.status,
  source.updated_at
);

`}<span className="text-gray-400">-- 4. Day 2 batch: repeat the entire MERGE
--    with shifted window boundaries</span>{'\n'}<span className="text-blue-600">MERGE INTO</span>{` analytics.fct_orders AS target
`}<span className="text-blue-600">USING</span>{` (
  `}<span className="text-blue-600">SELECT</span>{`
    o.order_id,
    o.customer_id,
    o.order_date,
    o.amount,
    o.status,
    CURRENT_TIMESTAMP() AS updated_at
  `}<span className="text-blue-600">FROM</span>{` raw.orders o
  `}<span className="text-blue-600">WHERE</span>{` o.order_date >= DATEADD(day, 1, $batch_start)
    `}<span className="text-blue-600">AND</span>{` o.order_date < DATEADD(day, 2, $batch_start)
) AS source
`}<span className="text-blue-600">ON</span>{` target.order_id = source.order_id
`}<span className="text-blue-600">WHEN MATCHED THEN UPDATE SET</span>{`
  target.order_id    = source.order_id,
  target.customer_id = source.customer_id,
  target.order_date  = source.order_date,
  target.amount      = source.amount,
  target.status      = source.status,
  target.updated_at  = source.updated_at
`}<span className="text-blue-600">WHEN NOT MATCHED THEN INSERT</span>{` (
  order_id, customer_id, order_date,
  amount, status, updated_at
) `}<span className="text-blue-600">VALUES</span>{` (
  source.order_id,
  source.customer_id,
  source.order_date,
  source.amount,
  source.status,
  source.updated_at
);

`}<span className="text-gray-400">-- ... repeat for every remaining day in the batch window</span></pre>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Lineage visual                                                    */
/* ------------------------------------------------------------------ */

function LineageVisual({ showDbt }) {
  if (!showDbt) {
    const tableRows = [
      ['order_id', 'INTEGER'],
      ['customer_id', 'INTEGER'],
      ['order_total', 'NUMERIC(10,2)'],
      ['status', 'INTEGER'],
      ['created_at', 'TIMESTAMP'],
      ['discount_cd', 'VARCHAR'],
      ['col_7', 'VARCHAR'],
      ['updated_at', 'TIMESTAMP'],
      ['region_id', 'INTEGER'],
      ['src_system', 'VARCHAR'],
    ]
    const callouts = [
      { icon: '\uD83D\uDEAB', title: 'No lineage', desc: 'No way to trace where order_total originates or which models depend on it.', borderColor: 'border-l-red-400' },
      { icon: '\u2753', title: 'Unclear definitions', desc: "The model's purpose is undocumented, and column meanings like status and col_7 are unknown.", borderColor: 'border-l-red-400' },
      { icon: '\uD83D\uDD51', title: 'No freshness', desc: 'No indication of when this data was last loaded.', borderColor: 'border-l-amber-400' },
      { icon: '\u26A0\uFE0F', title: 'No data quality metrics', desc: 'No checks for nulls, duplicates, or failed loads before the data reaches production.', borderColor: 'border-l-amber-400' },
    ]
    return (
      <div className="grid grid-cols-1 md:grid-cols-[55%_1fr] gap-4 items-start">
        {/* Left column: raw warehouse table */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <p className="font-mono text-xs font-bold text-gray-500 mb-3 tracking-wide">ORDERS_RAW</p>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-300">
                  <th className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider py-1.5 pr-4">Column</th>
                  <th className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider py-1.5">Type</th>
                </tr>
              </thead>
              <tbody>
                {tableRows.map(([col, type]) => (
                  <tr key={col} className="border-b border-gray-100">
                    <td className="font-mono text-[11px] text-gray-600 py-1.5 pr-4">{col}</td>
                    <td className="font-mono text-[11px] text-gray-400 py-1.5">{type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right column: warning callouts */}
        <div className="flex flex-col gap-3 min-w-0">
          {callouts.map((c) => (
            <motion.div
              key={c.title}
              whileHover={{ y: -3 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              className={`bg-white border border-gray-200 border-l-4 ${c.borderColor} rounded-lg px-3 py-2.5 cursor-default hover:shadow-md hover:border-gray-300 transition-shadow`}
            >
              <p className="text-gray-800 text-xs font-semibold flex items-center gap-1.5">
                <span className="text-sm">{c.icon}</span> {c.title}
              </p>
              <p className="text-gray-500 text-[11px] mt-0.5">{c.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Model lineage DAG */}
      <motion.div whileHover={{ y: -3 }} transition={{ type: 'spring', stiffness: 400, damping: 20 }} className="bg-white border border-gray-200 rounded-lg p-4 cursor-default hover:shadow-md hover:border-gray-300 transition-shadow">
        <p className="text-gray-700 text-xs font-semibold mb-2">Model Lineage (auto-generated)</p>
        <div className="flex justify-center">
          <svg width="560" height="130" viewBox="0 -10 560 130">
            {/* Sources */}
            <DagNode x={0} y={10} label="src_orders" color="#6366f1" badge="fresh" />
            <DagNode x={0} y={60} label="src_customers" color="#6366f1" badge="fresh" />
            {/* Staging */}
            <DagNode x={150} y={10} label="stg_orders" color="#10b981" badge="passed" />
            <DagNode x={150} y={60} label="stg_customers" color="#10b981" badge="warning" />
            {/* Intermediate */}
            <DagNode x={300} y={35} label="int_order_items" color="#f59e0b" badge="passed" />
            {/* Mart */}
            <DagNode x={440} y={35} label="fct_orders" color="#f97316" badge="passed" />
            {/* Edges: src to stg */}
            <DagEdge x1={120} y1={26} x2={150} y2={26} color="#6366f1" />
            <DagEdge x1={120} y1={76} x2={150} y2={76} color="#6366f1" />
            {/* Edges: stg to int */}
            <DagEdge x1={270} y1={26} x2={300} y2={51} color="#10b981" />
            <DagEdge x1={270} y1={76} x2={300} y2={51} color="#10b981" />
            {/* Edge: int to mart */}
            <DagEdge x1={420} y1={51} x2={440} y2={51} color="#f59e0b" />
            {/* Layer labels */}
            <text x={60} y={105} textAnchor="middle" fontSize="8" fill="#9ca3af" fontWeight="500">Sources</text>
            <text x={210} y={105} textAnchor="middle" fontSize="8" fill="#9ca3af" fontWeight="500">Staging</text>
            <text x={360} y={105} textAnchor="middle" fontSize="8" fill="#9ca3af" fontWeight="500">Intermediate</text>
            <text x={500} y={105} textAnchor="middle" fontSize="8" fill="#9ca3af" fontWeight="500">Marts</text>
          </svg>
        </div>
      </motion.div>
      {/* Column lineage */}
      <motion.div whileHover={{ y: -3 }} transition={{ type: 'spring', stiffness: 400, damping: 20 }} className="bg-white border border-gray-200 rounded-lg p-4 cursor-default hover:shadow-md hover:border-gray-300 transition-shadow">
        <p className="text-gray-700 text-xs font-semibold mb-2">Column-level Lineage</p>
        <div className="flex items-center justify-center gap-3 text-[10px] font-mono">
          <div className="flex flex-col items-center gap-1">
            <span className="bg-indigo-100 text-indigo-700 text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wide">Raw</span>
            <div className="bg-indigo-50 border border-indigo-200 rounded px-3 py-2 text-indigo-700">
              <p className="font-semibold mb-1">src_orders</p>
              <p>order_total</p>
            </div>
          </div>
          <span className="text-gray-400 mt-4">-&gt;</span>
          <div className="flex flex-col items-center gap-1">
            <span className="bg-emerald-100 text-emerald-700 text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wide">Rename</span>
            <div className="bg-emerald-50 border border-emerald-200 rounded px-3 py-2 text-emerald-700">
              <p className="font-semibold mb-1">stg_orders</p>
              <p>amount</p>
            </div>
          </div>
          <span className="text-gray-400 mt-4">-&gt;</span>
          <div className="flex flex-col items-center gap-1">
            <span className="bg-amber-100 text-amber-700 text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wide">Transformation</span>
            <div className="bg-amber-50 border border-amber-200 rounded px-3 py-2 text-amber-700">
              <p className="font-semibold mb-1">int_order_items</p>
              <p>net_amount</p>
            </div>
          </div>
          <span className="text-gray-400 mt-4">-&gt;</span>
          <div className="flex flex-col items-center gap-1">
            <span className="bg-orange-100 text-orange-700 text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wide">Passthrough</span>
            <div className="bg-orange-50 border border-orange-200 rounded px-3 py-2 text-orange-700">
              <p className="font-semibold mb-1">fct_orders</p>
              <p>revenue</p>
            </div>
          </div>
        </div>
      </motion.div>
      {/* YAML docs */}
      <motion.div whileHover={{ y: -3 }} transition={{ type: 'spring', stiffness: 400, damping: 20 }} className="bg-white border border-gray-200 rounded-lg p-4 cursor-default hover:shadow-md hover:border-gray-300 transition-shadow">
        <p className="text-emerald-700 text-xs font-semibold mb-2">Documentation in YAML (always up to date)</p>
        <pre className="text-gray-700 text-[11px] leading-relaxed whitespace-pre-wrap">{`models:
  - name: fct_orders
    description: "Order-level fact table"
    columns:
      - name: order_id
        description: "Primary key from source"
      - name: revenue
        description: "Total order amount in USD"`}</pre>
      </motion.div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Environment Aware Visual                                          */
/* ------------------------------------------------------------------ */

const envTabs = [
  { key: 'logical', label: 'Logical', color: 'gray', schema: null },
  { key: 'dev', label: 'Dev', color: 'blue', schema: 'dev.dbt_user1' },
  { key: 'qa', label: 'QA', color: 'amber', schema: 'qa.pr_1234' },
  { key: 'prod', label: 'Prod', color: 'emerald', schema: 'prod.analytics' },
]

const envTabColors = {
  gray: { active: 'bg-gray-700 text-white', inactive: 'bg-white text-gray-600 border border-gray-200' },
  blue: { active: 'bg-blue-600 text-white', inactive: 'bg-white text-gray-600 border border-gray-200' },
  amber: { active: 'bg-amber-500 text-white', inactive: 'bg-white text-gray-600 border border-gray-200' },
  emerald: { active: 'bg-emerald-600 text-white', inactive: 'bg-white text-gray-600 border border-gray-200' },
}

const envBadgeColors = {
  blue: 'bg-blue-600 text-white',
  amber: 'bg-amber-500 text-white',
  emerald: 'bg-emerald-600 text-white',
}

function EnvironmentVisual({ showDbt }) {
  const [activeEnv, setActiveEnv] = useState('logical')
  const env = envTabs.find(e => e.key === activeEnv)

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={showDbt ? 'with' : 'without'}
        initial={{ opacity: 0, x: showDbt ? 10 : -10 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: showDbt ? -10 : 10 }}
        transition={{ duration: 0.25 }}
      >
        {!showDbt ? (
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 space-y-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">You maintain separate scripts for each environment</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { env: 'dev', schema: 'dev_db.dev_schema', color: 'blue' },
                { env: 'qa', schema: 'staging_db.qa_schema', color: 'amber' },
                { env: 'prod', schema: 'prod_db.analytics', color: 'emerald' },
              ].map(({ env: e, schema, color }) => (
                <motion.div key={e} whileHover={{ y: -3 }} transition={{ type: 'spring', stiffness: 400, damping: 20 }} className="bg-white border border-gray-200 rounded-lg p-4 font-mono text-[10px] leading-relaxed overflow-hidden cursor-default hover:shadow-md transition-shadow">
                  <div className="text-gray-500 mb-2">-- {e}_int_enriched_customer.sql</div>
                  <div className="text-gray-800">
                    <div><span className="text-blue-600">CREATE TABLE</span></div>
                    <div className={`text-${color}-600 font-bold`}>  {schema}.int_enriched_customer</div>
                    <div><span className="text-blue-600">AS</span></div>
                    <div className="mt-1"><span className="text-blue-600">SELECT</span></div>
                    <div>  c.customer_id,</div>
                    <div>  c.customer_name,</div>
                    <div>  c.email,</div>
                    <div>  g.region,</div>
                    <div>  g.country</div>
                    <div><span className="text-blue-600">FROM</span> <span className={`text-${color}-600`}>{schema}.stg_customers</span> c</div>
                    <div><span className="text-blue-600">LEFT JOIN</span> <span className={`text-${color}-600`}>{schema}.stg_geoinfo</span> g</div>
                    <div><span className="text-blue-600">ON</span> c.geo_id = g.geo_id</div>
                  </div>
                </motion.div>
              ))}
            </div>
            <p className="text-xs text-red-600 font-medium">Three copies of the same logic. Different schemas hardcoded throughout. Change the query? Update all three files.</p>
          </div>
        ) : (
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 space-y-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">One codebase. dbt compiles ref() to the right schema per environment.</p>

            {/* Environment tabs */}
            <div className="flex gap-2">
              {envTabs.map(tab => {
                const colors = envTabColors[tab.color]
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveEnv(tab.key)}
                    className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                      activeEnv === tab.key ? colors.active : colors.inactive
                    }`}
                  >
                    {tab.label}
                  </button>
                )
              })}
            </div>

            {/* Code display */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeEnv}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
              >
                <div className="bg-white border border-gray-200 rounded-xl p-5 font-mono text-[11px] leading-relaxed">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-200">
                    <div className="text-gray-500 flex items-center gap-2">
                      <span>📄</span> int_enriched_customer.sql
                    </div>
                    {env.schema && (
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${envBadgeColors[env.color]}`}>
                        compiled · {env.schema}
                      </span>
                    )}
                  </div>

                  {activeEnv === 'logical' ? (
                    /* Logical view - the source code with ref() */
                    <div className="text-gray-800 space-y-1">
                      <div><span className="text-amber-600">{"{{ config(materialized='table') }}"}</span></div>
                      <div className="mt-2"><span className="text-blue-600">select</span></div>
                      <div>c.customer_id,</div>
                      <div>c.customer_name,</div>
                      <div>c.email,</div>
                      <div>g.region,</div>
                      <div>g.country</div>
                      <div><span className="text-blue-600">from</span> <span className="text-emerald-600">{"{{ ref('stg_customers') }}"}</span> c</div>
                      <div><span className="text-blue-600">left join</span> <span className="text-emerald-600">{"{{ ref('stg_geoinfo') }}"}</span> g</div>
                      <div><span className="text-blue-600">on</span> c.geo_id = g.geo_id</div>
                    </div>
                  ) : (
                    /* Compiled view - schema resolved */
                    <div className="text-gray-800 space-y-1">
                      <div className="text-gray-400">-- compiled for: {env.schema}</div>
                      <div className="mt-2"><span className="text-blue-600">create table</span> <span className="text-cyan-600">{env.schema}.int_enriched_customer</span> <span className="text-blue-600">as</span></div>
                      <div className="mt-2"><span className="text-blue-600">select</span></div>
                      <div>c.customer_id,</div>
                      <div>c.customer_name,</div>
                      <div>c.email,</div>
                      <div>g.region,</div>
                      <div>g.country</div>
                      <div><span className="text-blue-600">from</span> <span className="text-cyan-600">{env.schema}.stg_customers</span> c</div>
                      <div><span className="text-blue-600">left join</span> <span className="text-cyan-600">{env.schema}.stg_geoinfo</span> g</div>
                      <div><span className="text-blue-600">on</span> c.geo_id = g.geo_id</div>
                    </div>
                  )}

                  {/* Callout */}
                  {activeEnv !== 'logical' && (
                    <div className="mt-4 pt-3 border-l-2 border-cyan-500 pl-3">
                      <p className="text-xs text-gray-500">
                        <span className="text-cyan-600 font-bold">One codebase.</span> The SQL didn't change, only the destination schema. <code className="text-cyan-600">{'{{ ref() }}'}</code> compiled to <span className="text-cyan-600">{env.schema}</span>.
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}

/* ------------------------------------------------------------------ */
/*  Version Controlled Visual                                         */
/* ------------------------------------------------------------------ */

const vcCommits = [
  {
    hash: 'a3f8c2d',
    author: 'Miles Freeborn',
    time: '2 days ago',
    message: 'fix: update revenue calc to exclude refunded orders',
    file: 'models/marts/fct_revenue.sql',
    lines: [
      { text: '  SELECT', type: 'ctx' },
      { text: '    customer_id,', type: 'ctx' },
      { text: '    SUM(amount) AS total_revenue', type: 'ctx' },
      { text: "  FROM {{ ref('stg_orders') }}", type: 'ctx' },
      { text: "- WHERE status != 'cancelled'", type: 'del' },
      { text: "+ WHERE status NOT IN ('cancelled', 'refunded')", type: 'add' },
      { text: '  GROUP BY 1', type: 'ctx' },
    ],
  },
  {
    hash: 'b7e1d4a',
    author: 'Miles Freeborn',
    time: '5 days ago',
    message: 'feat: add customer lifetime value to fct_revenue',
    file: 'models/marts/fct_revenue.sql',
    lines: [
      { text: '  SELECT', type: 'ctx' },
      { text: '    customer_id,', type: 'ctx' },
      { text: '    SUM(amount) AS total_revenue,', type: 'ctx' },
      { text: "+   COUNT(DISTINCT order_id) AS lifetime_orders,", type: 'add' },
      { text: "+   MIN(order_date) AS first_order_date", type: 'add' },
      { text: "  FROM {{ ref('stg_orders') }}", type: 'ctx' },
      { text: "  WHERE status != 'cancelled'", type: 'ctx' },
      { text: '  GROUP BY 1', type: 'ctx' },
    ],
  },
  {
    hash: 'c92f0b3',
    author: 'Miles Freeborn',
    time: '2 weeks ago',
    message: 'refactor: move revenue calc from raw joins to staging refs',
    file: 'models/marts/fct_revenue.sql',
    lines: [
      { text: '  SELECT', type: 'ctx' },
      { text: '    customer_id,', type: 'ctx' },
      { text: '    SUM(amount) AS total_revenue', type: 'ctx' },
      { text: '- FROM raw.orders', type: 'del' },
      { text: "+ FROM {{ ref('stg_orders') }}", type: 'add' },
      { text: "  WHERE status != 'cancelled'", type: 'ctx' },
      { text: '  GROUP BY 1', type: 'ctx' },
    ],
  },
  {
    hash: 'd1a6e8f',
    author: 'Miles Freeborn',
    time: '3 weeks ago',
    message: 'feat: initial fct_revenue model',
    file: 'models/marts/fct_revenue.sql',
    lines: [
      { text: '+ SELECT', type: 'add' },
      { text: '+   customer_id,', type: 'add' },
      { text: '+   SUM(amount) AS total_revenue', type: 'add' },
      { text: '+ FROM raw.orders', type: 'add' },
      { text: "+ WHERE status != 'cancelled'", type: 'add' },
      { text: '+ GROUP BY 1', type: 'add' },
    ],
  },
]

function VersionControlVisual({ showDbt }) {
  const [activeCommit, setActiveCommit] = useState(0)

  if (!showDbt) {
    return (
      <div className="space-y-4">
        <motion.div whileHover={{ y: -3 }} transition={{ type: 'spring', stiffness: 400, damping: 20 }} className="bg-white border border-gray-200 rounded-lg p-4 cursor-default hover:shadow-md transition-shadow">
          <p className="text-red-600 text-xs font-semibold mb-2">sp_calculate_revenue (stored procedure)</p>
          <pre className="text-gray-800 text-[11px] leading-relaxed whitespace-pre-wrap font-mono">{`CREATE OR REPLACE PROCEDURE sp_calculate_revenue()
RETURNS STRING
LANGUAGE SQL
AS
$$
BEGIN
  CREATE OR REPLACE TABLE analytics.revenue AS
  SELECT
    customer_id,
    SUM(amount) AS total_revenue
  FROM raw.orders
  WHERE status != 'cancelled'
  GROUP BY 1;
  RETURN 'done';
END;
$$;`}</pre>
        </motion.div>
        <div className="grid grid-cols-3 gap-2">
          {[
            { title: 'No history', desc: 'Who changed it? When? Why?' },
            { title: 'No code review', desc: 'Changes go straight to prod' },
            { title: 'No rollback plan', desc: '"Does anyone have the old version?"' },
          ].map((item, i) => (
            <motion.div key={i} whileHover={{ y: -3 }} transition={{ type: 'spring', stiffness: 400, damping: 20 }} className="bg-red-50 border border-red-200 rounded-lg p-3 text-center cursor-default hover:shadow-md transition-shadow">
              <p className="text-red-700 text-xs font-semibold">{item.title}</p>
              <p className="text-red-500 text-[10px] mt-1">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    )
  }

  const commit = vcCommits[activeCommit]

  return (
    <div className="space-y-4">
      {/* Git commit header + diff */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="bg-gray-50 border-b border-gray-200 px-4 py-2">
          <p className="text-xs font-mono text-gray-800">
            <span className="text-amber-600 font-semibold">{commit.hash}</span> - {commit.author} - {commit.time}
          </p>
          <p className="text-xs text-gray-600 mt-0.5">{commit.message}</p>
        </div>

        {/* Diff view */}
        <div className="p-4">
          <p className="text-[10px] font-mono text-gray-500 mb-2">{commit.file}</p>
          <div className="font-mono text-[11px] leading-relaxed border border-gray-200 rounded overflow-hidden">
            {commit.lines.map((line, i) => (
              <div
                key={`${commit.hash}-${i}`}
                className={`px-3 py-0.5 ${
                  line.type === 'del' ? 'bg-red-50 text-red-700'
                  : line.type === 'add' ? 'bg-emerald-50 text-emerald-700'
                  : 'text-gray-600'
                }`}
              >
                {line.text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* History */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <p className="text-xs font-semibold text-gray-700 mb-2">History</p>
        <div className="space-y-1 font-mono text-[10px]">
          {vcCommits.map((c, i) => (
            <motion.button
              key={c.hash}
              onClick={() => setActiveCommit(i)}
              whileHover={{ y: -2 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              className={`flex gap-2 w-full text-left px-2 py-1.5 rounded-md transition-all duration-150 cursor-pointer ${
                activeCommit === i
                  ? 'bg-amber-50 ring-1 ring-amber-200 text-gray-800'
                  : 'text-gray-600 hover:bg-gray-50 hover:shadow-sm'
              }`}
            >
              <span className="text-amber-600 font-semibold shrink-0">{c.hash}</span>
              <span className="truncate">{c.message}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Data Quality / Testing Visual                                     */
/* ------------------------------------------------------------------ */

function TestingVisual({ showDbt }) {
  // Phases per model: section highlight → test highlight → result, then next model
  // idle → section-customers → test-customers → result-customers
  //      → section-orders → test-orders → done
  const [testPhase, setTestPhase] = useState('idle')
  const [nodeStates, setNodeStates] = useState({
    stg_customers: 'idle',
    stg_orders: 'idle',
    int_enriched: 'idle',
    fct_orders: 'idle',
  })
  const [hasRun, setHasRun] = useState(false)
  const [showFailDetail, setShowFailDetail] = useState(false)
  const [hoveredIssue, setHoveredIssue] = useState(null) // null | 'null' | 'dup' | 'status'
  const timeoutsRef = useRef([])

  // Whole-section highlight (soft bg, no pulse)
  const sectionCustomers = testPhase === 'section-customers' || testPhase === 'test-customers'
  const sectionOrders = testPhase === 'section-orders' || testPhase === 'test-orders'
  // Narrowed test-line highlight (with pulse)
  const testCustomers = testPhase === 'test-customers'
  const testOrders = testPhase === 'test-orders'

  const isRunning = !['idle', 'done'].includes(testPhase)

  const runTest = () => {
    timeoutsRef.current.forEach(t => clearTimeout(t))
    timeoutsRef.current = []
    setHasRun(true)
    setShowFailDetail(false)

    setNodeStates({
      stg_customers: 'idle',
      stg_orders: 'idle',
      int_enriched: 'idle',
      fct_orders: 'idle',
    })

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) {
      setNodeStates({ stg_customers: 'pass', stg_orders: 'fail', int_enriched: 'skipped', fct_orders: 'skipped' })
      setShowFailDetail(true)
      setTestPhase('done')
      return
    }

    const schedule = (fn, ms) => {
      const t = setTimeout(fn, ms)
      timeoutsRef.current.push(t)
    }

    // stg_customers: highlight whole section
    setTestPhase('section-customers')

    // Narrow to test lines
    schedule(() => setTestPhase('test-customers'), 1200)

    // stg_customers → PASS, clear highlight
    schedule(() => {
      setNodeStates(s => ({ ...s, stg_customers: 'pass' }))
      setTestPhase('result-customers')
    }, 2800)

    // stg_orders: highlight whole section
    schedule(() => setTestPhase('section-orders'), 3600)

    // Narrow to test lines
    schedule(() => setTestPhase('test-orders'), 4800)

    // stg_orders → FAIL + downstream skipped
    schedule(() => {
      setNodeStates(s => ({ ...s, stg_orders: 'fail', int_enriched: 'skipped', fct_orders: 'skipped' }))
      setTestPhase('done')
    }, 6400)

    // Show fail detail callout after a beat
    schedule(() => setShowFailDetail(true), 7100)
  }

  if (!showDbt) {
    const issueHighlight = (issue) => hoveredIssue === issue ? 'outline outline-2 outline-red-400 -outline-offset-2' : ''

    return (
      <div className="space-y-3">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {/* Left: sample data table */}
          <motion.div whileHover={{ y: -3 }} transition={{ type: 'spring', stiffness: 400, damping: 20 }} className="bg-white border border-gray-200 rounded-lg p-3 cursor-default hover:shadow-md transition-shadow">
            <p className="text-xs font-semibold text-gray-700 mb-2"><code className="bg-gray-100 px-1.5 py-0.5 rounded text-[10px] font-mono">orders</code> (raw table)</p>
            <div className="overflow-x-auto">
              <table className="w-full text-[10px] font-mono">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-500">
                    <th className="text-left py-1 px-1.5 font-semibold">order_id</th>
                    <th className="text-left py-1 px-1.5 font-semibold">customer_id</th>
                    <th className="text-left py-1 px-1.5 font-semibold">status</th>
                    <th className="text-right py-1 px-1.5 font-semibold">amount</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700">
                  <tr className="border-b border-gray-100"><td className="py-1 px-1.5">1001</td><td className="py-1 px-1.5">42</td><td className="py-1 px-1.5">placed</td><td className="py-1 px-1.5 text-right">89.00</td></tr>
                  <tr className="border-b border-gray-100"><td className="py-1 px-1.5">1002</td><td className="py-1 px-1.5">17</td><td className="py-1 px-1.5">shipped</td><td className="py-1 px-1.5 text-right">214.50</td></tr>
                  <tr className="border-b border-gray-100"><td className="py-1 px-1.5">1003</td><td className="py-1 px-1.5">61</td><td className="py-1 px-1.5">placed</td><td className="py-1 px-1.5 text-right">175.00</td></tr>
                  <tr className="border-b border-gray-100 bg-red-50 cursor-pointer transition-all duration-200 hover:bg-red-100" onMouseEnter={() => setHoveredIssue('null')} onMouseLeave={() => setHoveredIssue(null)}><td className="py-1 px-1.5 text-red-600 font-bold">NULL</td><td className="py-1 px-1.5">83</td><td className="py-1 px-1.5">placed</td><td className="py-1 px-1.5 text-right">45.00</td></tr>
                  <tr className="border-b border-gray-100"><td className="py-1 px-1.5">1004</td><td className="py-1 px-1.5">55</td><td className="py-1 px-1.5">returned</td><td className="py-1 px-1.5 text-right">132.00</td></tr>
                  <tr className="border-b border-gray-100"><td className="py-1 px-1.5">1005</td><td className="py-1 px-1.5">29</td><td className="py-1 px-1.5">shipped</td><td className="py-1 px-1.5 text-right">67.25</td></tr>
                  <tr className="border-b border-gray-100 bg-red-50 cursor-pointer transition-all duration-200 hover:bg-red-100" onMouseEnter={() => setHoveredIssue('dup')} onMouseLeave={() => setHoveredIssue(null)}><td className="py-1 px-1.5 text-red-600 font-bold">1002</td><td className="py-1 px-1.5">17</td><td className="py-1 px-1.5">shipped</td><td className="py-1 px-1.5 text-right">214.50</td></tr>
                  <tr className="border-b border-gray-100"><td className="py-1 px-1.5">1007</td><td className="py-1 px-1.5">14</td><td className="py-1 px-1.5">placed</td><td className="py-1 px-1.5 text-right">310.00</td></tr>
                  <tr className="border-b border-gray-100"><td className="py-1 px-1.5">1008</td><td className="py-1 px-1.5">72</td><td className="py-1 px-1.5">shipped</td><td className="py-1 px-1.5 text-right">58.90</td></tr>
                  <tr className="border-b border-gray-100 bg-red-50 cursor-pointer transition-all duration-200 hover:bg-red-100" onMouseEnter={() => setHoveredIssue('status')} onMouseLeave={() => setHoveredIssue(null)}><td className="py-1 px-1.5">1009</td><td className="py-1 px-1.5">38</td><td className="py-1 px-1.5 text-red-600 font-bold">pending</td><td className="py-1 px-1.5 text-right">99.00</td></tr>
                  <tr><td className="py-1 px-1.5">1010</td><td className="py-1 px-1.5">46</td><td className="py-1 px-1.5">returned</td><td className="py-1 px-1.5 text-right">185.75</td></tr>
                </tbody>
              </table>
            </div>
            <p className="text-[9px] text-gray-400 mt-1.5 italic">Hover a red row to see which test catches it.</p>
          </motion.div>

          {/* Right: manual test SQL blocks */}
          <div className="space-y-3">
            <motion.div whileHover={{ y: -3 }} transition={{ type: 'spring', stiffness: 400, damping: 20 }} className={`bg-white border border-gray-200 rounded-lg p-3 cursor-default hover:shadow-md transition-all duration-200 ${issueHighlight('null')}`}>
              <pre className="text-gray-800 text-[11px] leading-relaxed whitespace-pre-wrap font-mono"><span className="text-gray-400">-- Check for null order_id</span>{'\n'}SELECT COUNT(*) <span className="bg-amber-100 text-amber-800 rounded px-0.5">FROM orders</span>{'\n'}WHERE order_id IS NULL;</pre>
            </motion.div>
            <motion.div whileHover={{ y: -3 }} transition={{ type: 'spring', stiffness: 400, damping: 20 }} className={`bg-white border border-gray-200 rounded-lg p-3 cursor-default hover:shadow-md transition-all duration-200 ${issueHighlight('dup')}`}>
              <pre className="text-gray-800 text-[11px] leading-relaxed whitespace-pre-wrap font-mono"><span className="text-gray-400">-- Check for duplicate order_id</span>{'\n'}SELECT order_id, COUNT(*){'\n'}<span className="bg-amber-100 text-amber-800 rounded px-0.5">FROM orders</span> GROUP BY 1{'\n'}HAVING COUNT(*) &gt; 1;</pre>
            </motion.div>
            <motion.div whileHover={{ y: -3 }} transition={{ type: 'spring', stiffness: 400, damping: 20 }} className={`bg-white border border-gray-200 rounded-lg p-3 cursor-default hover:shadow-md transition-all duration-200 ${issueHighlight('status')}`}>
              <pre className="text-gray-800 text-[11px] leading-relaxed whitespace-pre-wrap font-mono"><span className="text-gray-400">-- Check for unexpected status values</span>{'\n'}SELECT COUNT(*) <span className="bg-amber-100 text-amber-800 rounded px-0.5">FROM orders</span>{'\n'}WHERE status NOT IN ({'\n'}  'placed','shipped','returned'{'\n'});</pre>
            </motion.div>
            <p className="text-[10px] text-gray-500 italic">Every check hardcodes the table name. No shared reference — change the table and you fix each query by hand.</p>
          </div>
        </div>

        {/* Callout cards */}
        <div className="grid grid-cols-2 gap-2">
          {[
            { title: 'No framework', desc: 'Every check is hand-written' },
            { title: 'No automation', desc: 'Someone has to remember to run these' },
          ].map((item, i) => (
            <motion.div key={i} whileHover={{ y: -3 }} transition={{ type: 'spring', stiffness: 400, damping: 20 }} className="bg-red-50 border border-red-200 rounded-lg p-2 text-center cursor-default hover:shadow-md transition-shadow">
              <p className="text-red-700 text-[10px] font-semibold">{item.title}</p>
              <p className="text-red-500 text-[9px]">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    )
  }

  const nodeColorMap = {
    idle: 'bg-gray-100 border-gray-300 text-gray-500',
    pass: 'bg-emerald-100 border-emerald-400 text-emerald-700',
    fail: 'bg-red-100 border-red-400 text-red-700',
    skipped: 'bg-gray-100 border-gray-300 text-gray-400',
  }

  // Inline CSS for pulse (reuse same keyframe as dependency management)
  const pulseStyle = `
    @keyframes test-pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.4; }
    }
    .test-pulse { animation: test-pulse 0.8s ease-in-out infinite; }
  `

  return (
    <div className="flex gap-4">
      <style>{pulseStyle}</style>

      {/* Left: YAML test definitions */}
      <div className="flex-1 bg-white border border-gray-200 rounded-lg p-4">
        <p className="text-xs font-semibold text-gray-700 mb-2">_stg_models.yml</p>
        <div className="font-mono text-[11px] leading-relaxed">
          <div><span className="text-purple-600">models</span><span className="text-gray-800">:</span></div>

          {/* stg_customers block */}
          <div className={`rounded -mx-2 px-2 py-0.5 transition-all duration-300 ${sectionCustomers ? 'bg-emerald-50/60' : ''}`}>
            <div>  - <span className="text-purple-600">name</span><span className="text-gray-800">:</span> <span className="text-emerald-600">stg_customers</span></div>
            <div>    <span className="text-purple-600">columns</span><span className="text-gray-800">:</span></div>
            <div>      - <span className="text-purple-600">name</span><span className="text-gray-800">:</span> <span className="text-emerald-600">customer_id</span></div>
            <div className={`rounded -mx-1 px-1 transition-all duration-300 ${testCustomers ? 'bg-emerald-100 border-l-2 border-emerald-400 test-pulse' : 'border-l-2 border-transparent'}`}>
              <div>        <span className="text-purple-600">data_tests</span><span className="text-gray-800">:</span></div>
              <div>          - <span className="text-blue-600">unique</span></div>
              <div>          - <span className="text-blue-600">not_null</span></div>
            </div>
          </div>

          {/* stg_orders block */}
          <div className={`rounded -mx-2 px-2 py-0.5 mt-1 transition-all duration-300 ${sectionOrders ? 'bg-emerald-50/60' : ''}`}>
            <div>  - <span className="text-purple-600">name</span><span className="text-gray-800">:</span> <span className="text-emerald-600">stg_orders</span></div>
            <div>    <span className="text-purple-600">columns</span><span className="text-gray-800">:</span></div>
            <div>      - <span className="text-purple-600">name</span><span className="text-gray-800">:</span> <span className="text-emerald-600">order_id</span></div>
            <div className={`rounded -mx-1 px-1 transition-all duration-300 ${testOrders ? 'bg-emerald-100 border-l-2 border-emerald-400 test-pulse' : 'border-l-2 border-transparent'}`}>
              <div>        <span className="text-purple-600">data_tests</span><span className="text-gray-800">:</span></div>
              <div>          - <span className="text-blue-600">unique</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* Right: results + button */}
      <div className="flex-1 flex flex-col gap-3">
        <button
          onClick={runTest}
          disabled={isRunning}
          className={`text-xs font-semibold px-4 py-2 rounded-lg transition-all duration-150 ${
            isRunning
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-gray-900 text-white hover:bg-gray-800 active:bg-gray-950'
          }`}
        >
          {isRunning ? 'Running...' : hasRun ? 'Replay' : 'Run dbt test'}
        </button>
        <div className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col gap-2">
          {[
            { key: 'stg_customers', label: 'stg_customers' },
            { key: 'stg_orders', label: 'stg_orders' },
            { key: 'int_enriched', label: 'int_enriched' },
            { key: 'fct_orders', label: 'fct_orders' },
          ].map(node => (
            <div
              key={node.key}
              className={`border rounded px-3 py-2 text-xs font-mono font-semibold text-center transition-all duration-300 ${nodeColorMap[nodeStates[node.key]]}`}
            >
              {node.label}
              {nodeStates[node.key] === 'pass' && ' — PASS'}
              {nodeStates[node.key] === 'fail' && ' — FAIL'}
              {nodeStates[node.key] === 'skipped' && ' — SKIPPED'}
            </div>
          ))}
          <AnimatePresence>
            {showFailDetail && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-red-50 border border-red-200 rounded-lg p-2 mt-2"
              >
                <p className="text-red-700 text-xs font-semibold">FAIL: unique test on stg_orders.order_id</p>
                <p className="text-red-700 text-xs mt-0.5">Found 8 duplicate records. Downstream models skipped.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

/*  Main component                                                    */
/* ------------------------------------------------------------------ */

export default function DbtModels() {
  const [activeId, setActiveId] = useState('what_is_model')
  const [showDbt, setShowDbt] = useState(false)
  const active = advantages.find(a => a.id === activeId)

  const renderCustomVisual = () => {
    switch (active.custom) {
      case 'what_is_model':
        return <WhatIsModelVisual showDbt={showDbt} />
      case 'modularity':
        return <ModularityVisual showDbt={showDbt} />
      case 'dependency_mgmt':
        return <DependencyManagement showDbt={showDbt} />
      case 'reusable':
        return <ReusableLogicVisual showDbt={showDbt} />
      case 'ddl':
        return <DDLVisual showDbt={showDbt} />
      case 'lineage':
        return <LineageVisual showDbt={showDbt} />
      case 'environments':
        return <EnvironmentVisual showDbt={showDbt} />
      case 'versioned':
        return <VersionControlVisual showDbt={showDbt} />
      case 'testing':
        return <TestingVisual showDbt={showDbt} />
      default:
        return null
    }
  }

  return (
    <div className="section-container py-8 pb-16">
      <div className="bg-white border border-gray-200/60 rounded-2xl shadow-sm overflow-hidden">
        <div className="flex flex-col lg:flex-row">
          {/* Left sidebar: feature buttons */}
          <div className="lg:w-64 shrink-0 bg-gray-50 border-b lg:border-b-0 lg:border-r border-gray-200/60 p-3">
            <div className="flex lg:flex-col gap-1.5 overflow-x-auto lg:overflow-x-visible">
              {/* What is a Model - top section */}
              {advantages.filter(a => a.section === 'overview').map((adv) => {
                const isActive = activeId === adv.id
                return (
                  <button
                    key={adv.id}
                    onClick={() => { setActiveId(adv.id); setShowDbt(false) }}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all duration-150 whitespace-nowrap text-left w-full ${
                      isActive
                        ? 'bg-white text-gray-900 shadow-sm ring-1 ring-gray-200'
                        : 'text-gray-500 hover:bg-white/60 hover:text-gray-700'
                    }`}
                  >
                    <span className="text-base">{adv.icon}</span>
                    <span>{adv.title}</span>
                  </button>
                )
              })}

              {/* Divider */}
              <div className="hidden lg:block my-1.5">
                <div className="border-t border-gray-200" />
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mt-2 mb-1 px-1">Advantages</p>
              </div>

              {/* Benefits */}
              {advantages.filter(a => a.section !== 'overview').map((adv) => {
                const isActive = activeId === adv.id
                return (
                  <button
                    key={adv.id}
                    onClick={() => { setActiveId(adv.id); setShowDbt(false) }}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 whitespace-nowrap text-left w-full ${
                      isActive
                        ? 'bg-white text-gray-900 shadow-sm ring-1 ring-gray-200'
                        : 'text-gray-500 hover:bg-white/60 hover:text-gray-700'
                    }`}
                  >
                    <span className="text-base">{adv.icon}</span>
                    <span>{adv.title}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Right content area */}
          <div className="flex-1 p-6">
            {/* Header + toggle */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <span className="text-xl">{active.icon}</span>
                  {active.title}
                </h3>
              </div>
              <div className="inline-flex bg-gray-100 rounded-lg p-0.5">
                <button
                  onClick={() => setShowDbt(false)}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                    !showDbt
                      ? 'bg-white text-red-700 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Without dbt
                </button>
                <button
                  onClick={() => setShowDbt(true)}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                    showDbt
                      ? 'bg-white text-emerald-700 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  With dbt
                </button>
              </div>
            </div>

            {/* Content area */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeId}-${showDbt}`}
                initial={{ opacity: 0, x: showDbt ? 10 : -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: showDbt ? -10 : 10 }}
                transition={{ duration: 0.2 }}
              >
                {active.custom ? (
                  <div className="min-h-[380px] max-h-[480px] overflow-y-auto">
                    {renderCustomVisual()}
                  </div>
                ) : (
                  <div className="bg-gray-950 rounded-xl p-5 font-mono text-[11px] leading-relaxed min-h-[380px] max-h-[480px] overflow-y-auto">
                    <pre className="text-gray-300 whitespace-pre-wrap">{showDbt ? active.with_dbt : active.without}</pre>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}
