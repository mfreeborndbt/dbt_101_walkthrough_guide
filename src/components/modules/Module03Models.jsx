import DbtModels from '../DbtModels'

export default function Module03Models() {
  return (
    <div className="section-container py-8">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-sm font-bold text-white bg-gray-900 px-3 py-1 rounded-full">Module 03</span>
          <h2 className="text-2xl font-bold text-gray-900">Models 101</h2>
        </div>
        <p className="text-sm text-gray-500">
          What dbt models are and why they change how you build data pipelines.
        </p>
      </div>

      <div className="bg-white border border-gray-200/60 rounded-2xl p-6 shadow-sm">
        <DbtModels />
      </div>
    </div>
  )
}
