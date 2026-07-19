import React from 'react'

export const AgencyIcon: React.FC = () => {
  return (
    <div className="flex items-center gap-2" style={{ padding: '4px 0' }}>
      <div 
        className="flex items-center justify-center font-bold"
        style={{ 
          width: '32px', 
          height: '32px', 
          borderRadius: '6px', 
          backgroundColor: 'var(--color-accent)', 
          color: 'var(--color-bg)',
          fontSize: '20px'
        }}
      >
        E
      </div>
    </div>
  )
}

export default AgencyIcon
