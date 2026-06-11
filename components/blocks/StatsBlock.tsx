import React from 'react'

export const StatsBlock: React.FC<Record<string, unknown>> = (props) => {
  return (
    <div className="p-12 border border-dashed border-muted text-muted text-center my-8 rounded-lg bg-surface max-w-5xl mx-auto flex flex-col items-center justify-center gap-2">
      <span className="text-xs font-mono uppercase tracking-widest">[ Placeholder ]</span>
      <h2 className="text-xl font-semibold text-text">StatsBlock</h2>
      <pre className="text-xs text-start max-w-full overflow-hidden truncate opacity-50 mt-4 bg-bg p-4 rounded">
        {JSON.stringify(props, null, 2)}
      </pre>
    </div>
  )
}

export default StatsBlock
