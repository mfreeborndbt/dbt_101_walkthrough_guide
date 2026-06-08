import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

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
            <div className="bg-white border border-gray-200 rounded-lg p-5 font-mono text-[11px] leading-relaxed">
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
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white border border-gray-200 rounded-lg p-3 text-center">
                <p className="text-xs font-semibold text-gray-700">DDL included</p>
                <p className="text-[10px] text-gray-400 mt-0.5">CREATE TABLE is your job</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-3 text-center">
                <p className="text-xs font-semibold text-gray-700">Hardcoded refs</p>
                <p className="text-[10px] text-gray-400 mt-0.5">Table names baked in</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-3 text-center">
                <p className="text-xs font-semibold text-gray-700">No metadata</p>
                <p className="text-[10px] text-gray-400 mt-0.5">Just a SQL file</p>
              </div>
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
                <div className="bg-white border border-gray-200 rounded-lg p-4 font-mono text-[11px] leading-relaxed">
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
                </div>
              </div>

              {/* What makes it a model */}
              <div className="space-y-3">
                <div className="text-xs font-medium text-gray-500 mb-1.5 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  What makes it a model
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-1.5 py-0.5 rounded mt-0.5 shrink-0">config</span>
                    <div>
                      <p className="text-xs font-semibold text-gray-800">Materialization</p>
                      <p className="text-[11px] text-gray-500 mt-0.5">Tells dbt how to build it: <code className="bg-gray-100 px-1 rounded text-[10px]">table</code>, <code className="bg-gray-100 px-1 rounded text-[10px]">view</code>, <code className="bg-gray-100 px-1 rounded text-[10px]">incremental</code>, or <code className="bg-gray-100 px-1 rounded text-[10px]">ephemeral</code>. dbt generates the DDL for you.</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-1.5 py-0.5 rounded mt-0.5 shrink-0">ref()</span>
                    <div>
                      <p className="text-xs font-semibold text-gray-800">Dependencies</p>
                      <p className="text-[11px] text-gray-500 mt-0.5">References other models by name. dbt resolves the schema at compile time and builds them in the right order.</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-1.5 py-0.5 rounded mt-0.5 shrink-0">SELECT</span>
                    <div>
                      <p className="text-xs font-semibold text-gray-800">Just SQL</p>
                      <p className="text-[11px] text-gray-500 mt-0.5">No CREATE TABLE, no DDL. You write the transformation logic. dbt handles the rest.</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <span className="bg-purple-100 text-purple-700 text-[10px] font-bold px-1.5 py-0.5 rounded mt-0.5 shrink-0">file</span>
                    <div>
                      <p className="text-xs font-semibold text-gray-800">One model = one file</p>
                      <p className="text-[11px] text-gray-500 mt-0.5">Each model lives in its own .sql file inside your dbt project. Testable, documented, and version controlled.</p>
                    </div>
                  </div>
                </div>
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

function DagNode({ x, y, label, color = '#10b981' }) {
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

function ModularityVisual({ showDbt }) {
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
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">The int_order_items logic is embedded and repeated in every downstream script</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white border border-gray-200 rounded-lg p-4 font-mono text-[11px] leading-relaxed max-h-[320px] overflow-y-auto">
                <div className="text-red-600 font-bold mb-2 sticky top-0 bg-white pb-1">fct_order_items.sql</div>
                <div className="text-gray-700">
                  <div><span className="text-blue-600">CREATE TABLE</span> analytics.fct_order_items <span className="text-blue-600">AS</span> (</div>
                  <div className="ml-2"></div>
                  <div className="bg-red-50 border-l-2 border-red-400 pl-2 py-0.5">
                    <div><span className="text-blue-600">WITH</span> order_items <span className="text-blue-600">AS</span> (</div>
                    <div className="ml-2"><span className="text-blue-600">SELECT</span></div>
                    <div className="ml-4">l.lineitem_key,</div>
                    <div className="ml-4">l.order_key,</div>
                    <div className="ml-4">l.part_key,</div>
                    <div className="ml-4">l.supplier_key,</div>
                    <div className="ml-4">l.quantity,</div>
                    <div className="ml-4">l.extended_price,</div>
                    <div className="ml-4">l.discount,</div>
                    <div className="ml-4">l.tax,</div>
                    <div className="ml-4">l.extended_price * (1 - l.discount) <span className="text-blue-600">AS</span> discounted_price,</div>
                    <div className="ml-4">l.extended_price * (1 - l.discount) * (1 + l.tax) <span className="text-blue-600">AS</span> total_price,</div>
                    <div className="ml-4">l.ship_date,</div>
                    <div className="ml-4">l.commit_date,</div>
                    <div className="ml-4">l.receipt_date,</div>
                    <div className="ml-4">o.order_date,</div>
                    <div className="ml-4">o.customer_key,</div>
                    <div className="ml-4">o.order_priority,</div>
                    <div className="ml-4">o.status <span className="text-blue-600">AS</span> order_status</div>
                    <div className="ml-2"><span className="text-blue-600">FROM</span> <span className="text-red-600">raw.lineitem</span> l</div>
                    <div className="ml-2"><span className="text-blue-600">JOIN</span> <span className="text-red-600">raw.orders</span> o</div>
                    <div className="ml-4"><span className="text-blue-600">ON</span> l.order_key = o.order_key</div>
                    <div className="ml-2"><span className="text-blue-600">WHERE</span> o.order_date {'>'} <span className="text-green-700">'2020-01-01'</span></div>
                    <div>)</div>
                  </div>
                  <div className="ml-2"></div>
                  <div><span className="text-blue-600">SELECT</span></div>
                  <div className="ml-2">lineitem_key,</div>
                  <div className="ml-2">order_key,</div>
                  <div className="ml-2">part_key,</div>
                  <div className="ml-2">quantity,</div>
                  <div className="ml-2">discounted_price,</div>
                  <div className="ml-2">total_price,</div>
                  <div className="ml-2">order_date,</div>
                  <div className="ml-2">ship_date</div>
                  <div><span className="text-blue-600">FROM</span> order_items</div>
                  <div>);</div>
                </div>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4 font-mono text-[11px] leading-relaxed max-h-[320px] overflow-y-auto">
                <div className="text-red-600 font-bold mb-2 sticky top-0 bg-white pb-1">fct_orders.sql</div>
                <div className="text-gray-700">
                  <div><span className="text-blue-600">CREATE TABLE</span> analytics.fct_orders <span className="text-blue-600">AS</span> (</div>
                  <div className="ml-2"></div>
                  <div className="bg-red-50 border-l-2 border-red-400 pl-2 py-0.5">
                    <div><span className="text-blue-600">WITH</span> order_items <span className="text-blue-600">AS</span> (</div>
                    <div className="ml-2"><span className="text-blue-600">SELECT</span></div>
                    <div className="ml-4">l.lineitem_key,</div>
                    <div className="ml-4">l.order_key,</div>
                    <div className="ml-4">l.part_key,</div>
                    <div className="ml-4">l.supplier_key,</div>
                    <div className="ml-4">l.quantity,</div>
                    <div className="ml-4">l.extended_price,</div>
                    <div className="ml-4">l.discount,</div>
                    <div className="ml-4">l.tax,</div>
                    <div className="ml-4">l.extended_price * (1 - l.discount) <span className="text-blue-600">AS</span> discounted_price,</div>
                    <div className="ml-4">l.extended_price * (1 - l.discount) * (1 + l.tax) <span className="text-blue-600">AS</span> total_price,</div>
                    <div className="ml-4">l.ship_date,</div>
                    <div className="ml-4">l.commit_date,</div>
                    <div className="ml-4">l.receipt_date,</div>
                    <div className="ml-4">o.order_date,</div>
                    <div className="ml-4">o.customer_key,</div>
                    <div className="ml-4">o.order_priority,</div>
                    <div className="ml-4">o.status <span className="text-blue-600">AS</span> order_status</div>
                    <div className="ml-2"><span className="text-blue-600">FROM</span> <span className="text-red-600">raw.lineitem</span> l</div>
                    <div className="ml-2"><span className="text-blue-600">JOIN</span> <span className="text-red-600">raw.orders</span> o</div>
                    <div className="ml-4"><span className="text-blue-600">ON</span> l.order_key = o.order_key</div>
                    <div className="ml-2"><span className="text-blue-600">WHERE</span> o.order_date {'>'} <span className="text-green-700">'2020-01-01'</span></div>
                    <div>)</div>
                  </div>
                  <div className="ml-2"></div>
                  <div><span className="text-blue-600">SELECT</span></div>
                  <div className="ml-2">order_key,</div>
                  <div className="ml-2">customer_key,</div>
                  <div className="ml-2">order_date,</div>
                  <div className="ml-2">order_status,</div>
                  <div className="ml-2">order_priority,</div>
                  <div className="ml-2"><span className="text-blue-600">COUNT</span>(*) <span className="text-blue-600">AS</span> line_item_count,</div>
                  <div className="ml-2"><span className="text-blue-600">SUM</span>(quantity) <span className="text-blue-600">AS</span> total_quantity,</div>
                  <div className="ml-2"><span className="text-blue-600">SUM</span>(discounted_price) <span className="text-blue-600">AS</span> gross_revenue,</div>
                  <div className="ml-2"><span className="text-blue-600">SUM</span>(total_price) <span className="text-blue-600">AS</span> total_revenue</div>
                  <div><span className="text-blue-600">FROM</span> order_items</div>
                  <div><span className="text-blue-600">GROUP BY</span> 1, 2, 3, 4, 5</div>
                  <div>);</div>
                </div>
              </div>
            </div>
            <p className="text-xs text-red-600 font-medium"><span className="inline-block w-3 h-3 bg-red-50 border-l-2 border-red-400 mr-1 align-middle"></span> The highlighted CTE is copy-pasted across both scripts. Change the join, add a filter, or fix a column in one place — the other silently drifts. With dbt, this becomes a single model referenced everywhere.</p>
          </div>
        ) : (
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 space-y-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">int_order_items is defined once and referenced by every downstream model</p>

            {/* Horizontal DAG */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 flex justify-center">
              <svg viewBox="0 0 720 140" className="w-full max-w-2xl h-auto" overflow="visible">
                <defs>
                  <marker id="mod-arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                    <path d="M0,0 L0,6 L6,3 z" fill="#9ca3af" />
                  </marker>
                </defs>
                {/* Edges: sources to int */}
                {[[175,35,270,65],[175,105,270,75]].map(([x1,y1,x2,y2],i) => {
                  const mx=(x1+x2)/2
                  return <path key={`a${i}`} d={`M${x1} ${y1} C${mx} ${y1} ${mx} ${y2} ${x2} ${y2}`} stroke="#d1d5db" strokeWidth="1.5" fill="none" markerEnd="url(#mod-arrow)" />
                })}
                {/* Edges: int to facts */}
                {[[430,65,490,35],[430,75,490,105]].map(([x1,y1,x2,y2],i) => {
                  const mx=(x1+x2)/2
                  return <path key={`b${i}`} d={`M${x1} ${y1} C${mx} ${y1} ${mx} ${y2} ${x2} ${y2}`} stroke="#d1d5db" strokeWidth="1.5" fill="none" markerEnd="url(#mod-arrow)" />
                })}
                {/* Source nodes */}
                <rect x={10} y={22} width={165} height={28} rx={6} fill="#ecfeff" stroke="#a5f3fc" strokeWidth="1.2" />
                <text x={17} y={40} fontSize="7" fontWeight="700" fill="#06b6d4" fontFamily="monospace">SRC</text>
                <text x={40} y={40} fontSize="9" fontWeight="600" fill="#155e75" fontFamily="monospace">tpch_now.lineitem</text>
                <rect x={10} y={92} width={165} height={28} rx={6} fill="#ecfeff" stroke="#a5f3fc" strokeWidth="1.2" />
                <text x={17} y={110} fontSize="7" fontWeight="700" fill="#06b6d4" fontFamily="monospace">SRC</text>
                <text x={40} y={110} fontSize="9" fontWeight="600" fill="#155e75" fontFamily="monospace">tpch_now.orders</text>
                {/* Staging */}
                {/* Int node (highlighted) */}
                <rect x={270} y={50} width={160} height={40} rx={7} fill="#fff7ed" stroke="#f97316" strokeWidth="2.5" />
                <text x={350} y={75} textAnchor="middle" fontSize="10" fontWeight="700" fill="#9a3412" fontFamily="monospace">int_order_items</text>
                <text x={350} y={45} textAnchor="middle" fontSize="8" fill="#9ca3af" fontStyle="italic">defined once</text>
                {/* Fact nodes */}
                <rect x={490} y={22} width={140} height={28} rx={6} fill="#f9fafb" stroke="#d1d5db" strokeWidth="1.2" />
                <text x={560} y={40} textAnchor="middle" fontSize="9" fontWeight="600" fill="#374151" fontFamily="monospace">fct_order_items</text>
                <rect x={490} y={92} width={140} height={28} rx={6} fill="#f9fafb" stroke="#d1d5db" strokeWidth="1.2" />
                <text x={560} y={110} textAnchor="middle" fontSize="9" fontWeight="600" fill="#374151" fontFamily="monospace">fct_orders</text>
                {/* Labels */}
                <text x={92} y={135} textAnchor="middle" fontSize="8" fill="#9ca3af" fontWeight="500">Sources</text>
                <text x={350} y={135} textAnchor="middle" fontSize="8" fill="#9ca3af" fontWeight="500">Intermediate</text>
                <text x={560} y={135} textAnchor="middle" fontSize="8" fill="#9ca3af" fontWeight="500">Marts</text>
              </svg>
            </div>

            {/* Code cards showing how downstream models just ref the int */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-white border-2 border-amber-300 rounded-lg p-3 font-mono text-[10px] leading-relaxed">
                <div className="text-amber-600 font-bold mb-1">int_order_items.sql</div>
                <div className="text-gray-700">
                  <div><span className="text-blue-600">SELECT</span> l.*, o.order_date</div>
                  <div><span className="text-blue-600">FROM</span> <span className="text-emerald-600">{"{{ ref('stg_line_items') }}"}</span> l</div>
                  <div><span className="text-blue-600">JOIN</span> <span className="text-emerald-600">{"{{ ref('stg_orders') }}"}</span> o</div>
                  <div className="ml-2"><span className="text-blue-600">ON</span> l.order_key = o.order_key</div>
                </div>
                <div className="text-[9px] text-amber-500 mt-2 font-semibold">defined once</div>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-3 font-mono text-[10px] leading-relaxed">
                <div className="text-gray-500 font-bold mb-1">fct_order_items.sql</div>
                <div className="text-gray-700">
                  <div><span className="text-blue-600">SELECT</span> *</div>
                  <div className="bg-emerald-50 -mx-1 px-1 rounded"><span className="text-blue-600">FROM</span> <span className="text-emerald-600 font-bold">{"{{ ref('int_order_items') }}"}</span></div>
                </div>
                <div className="text-[9px] text-gray-400 mt-2">just ref() it</div>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-3 font-mono text-[10px] leading-relaxed">
                <div className="text-gray-500 font-bold mb-1">fct_orders.sql</div>
                <div className="text-gray-700">
                  <div><span className="text-blue-600">SELECT</span> order_key,</div>
                  <div className="ml-2"><span className="text-blue-600">SUM</span>(amount) <span className="text-blue-600">AS</span> total</div>
                  <div className="bg-emerald-50 -mx-1 px-1 rounded"><span className="text-blue-600">FROM</span> <span className="text-emerald-600 font-bold">{"{{ ref('int_order_items') }}"}</span></div>
                  <div><span className="text-blue-600">GROUP BY</span> 1</div>
                </div>
                <div className="text-[9px] text-gray-400 mt-2">just ref() it</div>
              </div>
            </div>
            <p className="text-xs text-emerald-700 font-medium">Logic lives in one place. Every downstream model references it. Change it once, everything updates.</p>
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
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-red-600 text-xs font-semibold mb-2">stg_customers.sql</p>
          <pre className="text-gray-700 text-[11px] leading-relaxed whitespace-pre-wrap">{`SELECT
  id,
  name,
  REGEXP_REPLACE(
    REGEXP_REPLACE(phone, '[^0-9]', ''),
    '^1?(\\d{10})$', '(\\1) \\2-\\3'
  ) AS phone_clean
FROM raw.customers`}</pre>
          <p className="text-red-600/60 text-[10px] mt-2">Phone normalization logic inline</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-red-600 text-xs font-semibold mb-2">stg_vendors.sql</p>
          <pre className="text-gray-700 text-[11px] leading-relaxed whitespace-pre-wrap">{`SELECT
  id,
  company_name,
  REGEXP_REPLACE(
    REGEXP_REPLACE(phone, '[^0-9]', ''),
    '^1?(\\d{10})$', '(\\1) \\2-\\3'
  ) AS phone_clean
FROM raw.vendors`}</pre>
          <p className="text-red-600/60 text-[10px] mt-2">Same regex copied. Update one, forget the other.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Macro definition */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 border-l-4 border-l-amber-300">
        <p className="text-amber-600 text-xs font-semibold mb-2">macros/normalize_phone.sql</p>
        <pre className="text-gray-700 text-[11px] leading-relaxed whitespace-pre-wrap">{`{% macro normalize_phone(column_name) %}
  REGEXP_REPLACE(
    REGEXP_REPLACE({{ column_name }}, '[^0-9]', ''),
    '^1?(\\d{10})$', '(\\1) \\2-\\3'
  )
{% endmacro %}`}</pre>
        <p className="text-amber-600/70 text-[10px] mt-2">Defined once. Tested once. Updated once.</p>
      </div>
      {/* Models calling the macro */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white border border-gray-200 rounded-lg p-3">
          <p className="text-emerald-600 text-[10px] font-semibold mb-1">stg_customers.sql</p>
          <pre className="text-gray-700 text-[11px] leading-relaxed whitespace-pre-wrap">{'SELECT\n  id,\n  name,\n  '}<span className="text-amber-600 font-semibold bg-amber-100 px-0.5 rounded">{"{{ normalize_phone('phone') }}"}</span>{'\n    AS phone_clean\nFROM {{ source(\'raw\',\'customers\') }}'}</pre>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-3">
          <p className="text-emerald-600 text-[10px] font-semibold mb-1">stg_vendors.sql</p>
          <pre className="text-gray-700 text-[11px] leading-relaxed whitespace-pre-wrap">{'SELECT\n  id,\n  company_name,\n  '}<span className="text-amber-600 font-semibold bg-amber-100 px-0.5 rounded">{"{{ normalize_phone('phone') }}"}</span>{'\n    AS phone_clean\nFROM {{ source(\'raw\',\'vendors\') }}'}</pre>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  DDL visual                                                        */
/* ------------------------------------------------------------------ */

function DDLVisual({ showDbt }) {
  if (!showDbt) {
    return (
      <div className="space-y-3">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-red-600 text-xs font-semibold mb-2">deploy_incremental_orders.sql</p>
          <pre className="text-gray-700 text-[11px] leading-relaxed whitespace-pre-wrap font-mono">{`-- Create target table if it doesn't exist
`}<span className="text-blue-600">CREATE TABLE IF NOT EXISTS</span>{` analytics.fct_orders (
  order_id    STRING,
  customer_id STRING,
  order_date  DATE,
  amount      NUMERIC,
  status      STRING,
  updated_at  TIMESTAMP
);

-- Incremental merge
`}<span className="text-blue-600">MERGE INTO</span>{` analytics.fct_orders AS target
`}<span className="text-blue-600">USING</span>{` (
  `}<span className="text-blue-600">SELECT</span>{`
    o.order_id,
    o.customer_id,
    o.order_date,
    o.amount,
    o.status,
    CURRENT_TIMESTAMP() AS updated_at
  `}<span className="text-blue-600">FROM</span>{` raw.orders o
  `}<span className="text-blue-600">WHERE</span>{` o.order_date >= DATEADD(day, -3, CURRENT_DATE)
) AS source
`}<span className="text-blue-600">ON</span>{` target.order_id = source.order_id
`}<span className="text-blue-600">WHEN MATCHED THEN UPDATE SET</span>{`
  target.customer_id = source.customer_id,
  target.order_date  = source.order_date,
  target.amount      = source.amount,
  target.status      = source.status,
  target.updated_at  = source.updated_at
`}<span className="text-blue-600">WHEN NOT MATCHED THEN INSERT</span>{` (
  order_id, customer_id, order_date,
  amount, status, updated_at
) `}<span className="text-blue-600">VALUES</span>{` (
  source.order_id, source.customer_id,
  source.order_date, source.amount,
  source.status, source.updated_at
);`}</pre>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <p className="text-gray-500 text-xs font-semibold mb-2">fct_orders.sql</p>
        <div className="font-mono text-[11px] leading-relaxed">
          <div className="bg-amber-50 border-l-2 border-amber-400 -ml-2 pl-2 py-1 mb-2">
            <pre className="text-amber-600 whitespace-pre-wrap">{`{{
  config(
    materialized='incremental',
    unique_key='order_id'
  )
}}`}</pre>
          </div>
          <div className="text-gray-700">
            <div><span className="text-blue-600">SELECT</span></div>
            <div className="ml-2">o.order_id,</div>
            <div className="ml-2">o.customer_id,</div>
            <div className="ml-2">o.order_date,</div>
            <div className="ml-2">o.amount,</div>
            <div className="ml-2">o.status,</div>
            <div className="ml-2">CURRENT_TIMESTAMP() <span className="text-blue-600">AS</span> updated_at</div>
            <div><span className="text-blue-600">FROM</span> <span className="text-emerald-600 font-bold">{"{{ ref('stg_orders') }}"}</span> o</div>
          </div>
          <div className="bg-amber-50 border-l-2 border-amber-400 -ml-2 pl-2 py-1 mt-2">
            <pre className="text-amber-600 whitespace-pre-wrap">{`{% if is_incremental() %}
WHERE updated_at > (
  select max(updated_at) from {{ this }}
)
{% endif %}`}</pre>
          </div>
        </div>
        <p className="text-gray-500 text-[10px] mt-3">dbt generates the full MERGE statement, handles schema changes, transactions, and permissions automatically.</p>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Lineage visual                                                    */
/* ------------------------------------------------------------------ */

function LineageVisual({ showDbt }) {
  if (!showDbt) {
    return (
      <div className="space-y-4">
        <div className="bg-white border border-gray-200 border-l-4 border-l-red-300 rounded-lg p-4">
          <p className="text-red-600 text-xs font-semibold mb-3 flex items-center gap-1.5">
            <span className="text-base">📄</span> Where does this column come from?
          </p>
          <p className="text-gray-700 text-[11px] mb-2">Your documentation:</p>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-2 text-[11px] text-gray-500">
              <span className="w-1.5 h-1.5 rounded-full bg-red-300 shrink-0" />
              Confluence pages (outdated)
            </div>
            <div className="flex items-center gap-2 text-[11px] text-gray-500">
              <span className="w-1.5 h-1.5 rounded-full bg-red-300 shrink-0" />
              Spreadsheets (who updates these?)
            </div>
            <div className="flex items-center gap-2 text-[11px] text-gray-500">
              <span className="w-1.5 h-1.5 rounded-full bg-red-300 shrink-0" />
              Tribal knowledge (hope they stay)
            </div>
            <div className="flex items-center gap-2 text-[11px] text-gray-500">
              <span className="w-1.5 h-1.5 rounded-full bg-red-300 shrink-0" />
              Slack threads (good luck searching)
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 border-l-4 border-l-amber-300 rounded-lg p-4">
          <p className="text-red-600 text-xs font-semibold mb-3 flex items-center gap-1.5">
            <span className="text-base">🔍</span> Impact analysis before changes
          </p>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-2 text-[11px] text-gray-500">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-300 shrink-0" />
              Manually grep through scripts
            </div>
            <div className="flex items-center gap-2 text-[11px] text-gray-500">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-300 shrink-0" />
              Ask around on Slack
            </div>
            <div className="flex items-center gap-2 text-[11px] text-gray-500">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-300 shrink-0" />
              "I think these 3 reports use it"
            </div>
            <div className="flex items-center gap-2 text-[11px] text-gray-500">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-300 shrink-0" />
              Deploy and hope nothing breaks
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 border-l-4 border-l-orange-300 rounded-lg p-4">
          <p className="text-red-600 text-xs font-semibold mb-3 flex items-center gap-1.5">
            <span className="text-base">👋</span> New team member onboarding
          </p>
          <div className="grid grid-cols-1 gap-2">
            <div className="flex items-center gap-2 text-[11px] text-gray-500">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-300 shrink-0" />
              "Talk to Sarah, she built that"
            </div>
            <div className="flex items-center gap-2 text-[11px] text-gray-500">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-300 shrink-0" />
              "Check the wiki, it might be there"
            </div>
            <div className="flex items-center gap-2 text-[11px] text-gray-500">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-300 shrink-0" />
              "Just read the 2000-line SQL file"
            </div>
          </div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-red-700 text-[11px] font-medium text-center">Without lineage, every change is a guessing game. Documentation drifts the moment it is written.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Model lineage DAG */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <p className="text-gray-700 text-xs font-semibold mb-2">Model Lineage (auto-generated)</p>
        <div className="flex justify-center">
          <svg width="560" height="120" viewBox="0 0 560 120">
            {/* Sources */}
            <DagNode x={0} y={10} label="src_orders" color="#6366f1" />
            <DagNode x={0} y={60} label="src_customers" color="#6366f1" />
            {/* Staging */}
            <DagNode x={150} y={10} label="stg_orders" color="#10b981" />
            <DagNode x={150} y={60} label="stg_customers" color="#10b981" />
            {/* Intermediate */}
            <DagNode x={300} y={35} label="int_order_items" color="#f59e0b" />
            {/* Mart */}
            <DagNode x={440} y={35} label="fct_orders" color="#f97316" />
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
      </div>
      {/* Column lineage */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
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
      </div>
      {/* YAML docs */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <p className="text-emerald-700 text-xs font-semibold mb-2">Documentation in YAML (always up to date)</p>
        <pre className="text-gray-700 text-[11px] leading-relaxed whitespace-pre-wrap">{`models:
  - name: fct_orders
    description: "Order-level fact table"
    columns:
      - name: order_id
        description: "Primary key from source"
      - name: revenue
        description: "Total order amount in USD"`}</pre>
      </div>
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
                <div key={e} className="bg-white border border-gray-200 rounded-lg p-4 font-mono text-[10px] leading-relaxed overflow-hidden">
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
                </div>
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

function VersionControlVisual({ showDbt }) {
  if (!showDbt) {
    return (
      <div className="space-y-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
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
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
            <p className="text-red-700 text-xs font-semibold">No history</p>
            <p className="text-red-500 text-[10px] mt-1">Who changed it? When? Why?</p>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
            <p className="text-red-700 text-xs font-semibold">No code review</p>
            <p className="text-red-500 text-[10px] mt-1">Changes go straight to prod</p>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
            <p className="text-red-700 text-xs font-semibold">No rollback plan</p>
            <p className="text-red-500 text-[10px] mt-1">"Does anyone have the old version?"</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Git commit header */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="bg-gray-50 border-b border-gray-200 px-4 py-2">
          <p className="text-xs font-mono text-gray-800">
            <span className="text-amber-600 font-semibold">a3f8c2d</span> - Miles Freeborn - 2 days ago
          </p>
          <p className="text-xs text-gray-600 mt-0.5">fix: update revenue calc to exclude refunded orders</p>
        </div>

        {/* Diff view */}
        <div className="p-4">
          <p className="text-[10px] font-mono text-gray-500 mb-2">models/marts/fct_revenue.sql</p>
          <div className="font-mono text-[11px] leading-relaxed border border-gray-200 rounded overflow-hidden">
            <div className="bg-gray-50 px-3 py-1 text-gray-500 text-[10px] border-b border-gray-200">@@ -5,7 +5,7 @@</div>
            <div className="px-3 py-0.5 text-gray-600">  SELECT</div>
            <div className="px-3 py-0.5 text-gray-600">    customer_id,</div>
            <div className="px-3 py-0.5 text-gray-600">    SUM(amount) AS total_revenue</div>
            <div className="px-3 py-0.5 text-gray-600">  FROM {'{{ ref(\'stg_orders\') }}'}</div>
            <div className="bg-red-50 px-3 py-0.5 text-red-700">- WHERE status != 'cancelled'</div>
            <div className="bg-emerald-50 px-3 py-0.5 text-emerald-700">+ WHERE status NOT IN ('cancelled', 'refunded')</div>
            <div className="px-3 py-0.5 text-gray-600">  GROUP BY 1</div>
          </div>
        </div>
      </div>

      {/* History */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <p className="text-xs font-semibold text-gray-700 mb-2">History</p>
        <div className="space-y-1.5 font-mono text-[10px]">
          <div className="flex gap-2 text-gray-600">
            <span className="text-amber-600 font-semibold">a3f8c2d</span>
            <span>fix: update revenue calc to exclude refunded orders</span>
          </div>
          <div className="flex gap-2 text-gray-600">
            <span className="text-amber-600 font-semibold">b7e1d4a</span>
            <span>feat: add customer lifetime value to fct_revenue</span>
          </div>
          <div className="flex gap-2 text-gray-600">
            <span className="text-amber-600 font-semibold">c92f0b3</span>
            <span>refactor: move revenue calc from raw joins to staging refs</span>
          </div>
          <div className="flex gap-2 text-gray-600">
            <span className="text-amber-600 font-semibold">d1a6e8f</span>
            <span>feat: initial fct_revenue model</span>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Data Quality / Testing Visual                                     */
/* ------------------------------------------------------------------ */

function TestingVisual({ showDbt }) {
  const [nodeStates, setNodeStates] = useState({
    stg_customers: 'idle',
    stg_orders: 'idle',
    int_enriched: 'idle',
    fct_orders: 'idle',
  })
  const timeoutsRef = useRef([])

  const runBuild = () => {
    // Clear any pending timeouts
    timeoutsRef.current.forEach(t => clearTimeout(t))
    timeoutsRef.current = []

    // Reset
    setNodeStates({
      stg_customers: 'idle',
      stg_orders: 'idle',
      int_enriched: 'idle',
      fct_orders: 'idle',
    })

    // stg_customers: running
    const t1 = setTimeout(() => {
      setNodeStates(s => ({ ...s, stg_customers: 'running', stg_orders: 'running' }))
    }, 300)

    // stg_customers: pass, stg_orders still running
    const t2 = setTimeout(() => {
      setNodeStates(s => ({ ...s, stg_customers: 'pass' }))
    }, 1000)

    // stg_orders: fail
    const t3 = setTimeout(() => {
      setNodeStates(s => ({ ...s, stg_orders: 'fail', int_enriched: 'skipped', fct_orders: 'skipped' }))
    }, 1600)

    timeoutsRef.current = [t1, t2, t3]
  }

  if (!showDbt) {
    return (
      <div className="space-y-3">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-gray-500 text-[10px] mb-2">-- Ad-hoc validation (run manually)</p>
          <pre className="text-gray-800 text-[11px] leading-relaxed whitespace-pre-wrap font-mono">{`SELECT COUNT(*) FROM orders
WHERE order_id IS NULL;
-- 3 rows... is that bad?`}</pre>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <pre className="text-gray-800 text-[11px] leading-relaxed whitespace-pre-wrap font-mono">{`SELECT order_id, COUNT(*)
FROM orders GROUP BY 1
HAVING COUNT(*) > 1;
-- Duplicates found. Who gets paged?`}</pre>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <pre className="text-gray-800 text-[11px] leading-relaxed whitespace-pre-wrap font-mono">{`SELECT COUNT(*) FROM orders
WHERE status NOT IN (
  'placed','shipped','returned'
);
-- Unknown statuses. Since when?`}</pre>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-red-50 border border-red-200 rounded-lg p-2 text-center">
            <p className="text-red-700 text-[10px] font-semibold">No framework</p>
            <p className="text-red-500 text-[9px]">Every check is hand-written</p>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-2 text-center">
            <p className="text-red-700 text-[10px] font-semibold">No automation</p>
            <p className="text-red-500 text-[9px]">Someone has to remember to run these</p>
          </div>
        </div>
      </div>
    )
  }

  const nodeColorMap = {
    idle: 'bg-gray-100 border-gray-300 text-gray-500',
    running: 'bg-blue-100 border-blue-400 text-blue-700',
    pass: 'bg-emerald-100 border-emerald-400 text-emerald-700',
    fail: 'bg-red-100 border-red-400 text-red-700',
    skipped: 'bg-gray-100 border-gray-300 text-gray-400',
  }

  return (
    <div className="flex gap-4">
      {/* Left: YAML test definitions */}
      <div className="flex-1 bg-white border border-gray-200 rounded-lg p-4">
        <p className="text-xs font-semibold text-gray-700 mb-2">_stg_models.yml</p>
        <div className="font-mono text-[11px] leading-relaxed">
          <div><span className="text-purple-600">models</span><span className="text-gray-800">:</span></div>
          <div>  - <span className="text-purple-600">name</span><span className="text-gray-800">:</span> <span className="text-emerald-600">stg_orders</span></div>
          <div>    <span className="text-purple-600">columns</span><span className="text-gray-800">:</span></div>
          <div>      - <span className="text-purple-600">name</span><span className="text-gray-800">:</span> <span className="text-emerald-600">order_id</span></div>
          <div>        <span className="text-purple-600">data_tests</span><span className="text-gray-800">:</span></div>
          <div>          - <span className="text-blue-600">unique</span></div>
          <div>          - <span className="text-blue-600">not_null</span></div>
          <div className="mt-1">      - <span className="text-purple-600">name</span><span className="text-gray-800">:</span> <span className="text-emerald-600">status</span></div>
          <div>        <span className="text-purple-600">data_tests</span><span className="text-gray-800">:</span></div>
          <div>          - <span className="text-blue-600">accepted_values</span><span className="text-gray-800">:</span></div>
          <div>              <span className="text-purple-600">values</span><span className="text-gray-800">:</span></div>
          <div>                - <span className="text-emerald-600">'placed'</span></div>
          <div>                - <span className="text-emerald-600">'shipped'</span></div>
          <div>                - <span className="text-emerald-600">'returned'</span></div>
          <div className="mt-1">      - <span className="text-purple-600">name</span><span className="text-gray-800">:</span> <span className="text-emerald-600">customer_id</span></div>
          <div>        <span className="text-purple-600">data_tests</span><span className="text-gray-800">:</span></div>
          <div>          - <span className="text-blue-600">not_null</span></div>
          <div>          - <span className="text-blue-600">relationships</span><span className="text-gray-800">:</span></div>
          <div>              <span className="text-purple-600">to</span><span className="text-gray-800">:</span> <span className="text-emerald-600">ref('stg_customers')</span></div>
          <div>              <span className="text-purple-600">field</span><span className="text-gray-800">:</span> <span className="text-emerald-600">customer_id</span></div>
        </div>
      </div>

      {/* Right: Mini DAG with build button */}
      <div className="flex-1 flex flex-col gap-3">
        <button
          onClick={runBuild}
          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          Run dbt build
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
              {nodeStates[node.key] === 'pass' && ' - PASS'}
              {nodeStates[node.key] === 'fail' && ' - FAIL'}
              {nodeStates[node.key] === 'skipped' && ' - SKIPPED'}
              {nodeStates[node.key] === 'running' && ' ...'}
            </div>
          ))}
          {nodeStates.stg_orders === 'fail' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-2 mt-2">
              <p className="text-red-700 text-xs font-semibold">FAIL: unique test on stg_orders.order_id</p>
              <p className="text-red-700 text-xs mt-0.5">Found 8 duplicate records. Downstream models skipped.</p>
            </div>
          )}
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
              {/* Toggle */}
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
