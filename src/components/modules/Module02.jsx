import { SourcesTopic } from '../DataModeling'

export default function Module02() {
  return (
    <div className="section-container py-8">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-sm font-bold text-white bg-gray-900 px-3 py-1 rounded-full">Module 02</span>
          <h2 className="text-2xl font-bold text-gray-900">Declaring sources within dbt</h2>
        </div>
        <p className="text-sm text-gray-500">
          How raw data enters your project and whether anyone knows if it is fresh.
        </p>
      </div>

      <div className="bg-white border border-gray-200/60 rounded-2xl p-6 shadow-sm">
        <SourcesTopic />
      </div>
    </div>
  )
}
