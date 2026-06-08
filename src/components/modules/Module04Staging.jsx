import { StagingTopic } from '../DataModeling'

export default function Module04Staging() {
  return (
    <div className="section-container py-8">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-sm font-bold text-white bg-gray-900 px-3 py-1 rounded-full">Module 04</span>
          <h2 className="text-2xl font-bold text-gray-900">Building staging models</h2>
        </div>
        <p className="text-sm text-gray-500">
          Where renaming, casting, and basic cleanup happen before anything else.
        </p>
      </div>

      <div className="bg-white border border-gray-200/60 rounded-2xl p-6 shadow-sm">
        <StagingTopic />
      </div>
    </div>
  )
}
