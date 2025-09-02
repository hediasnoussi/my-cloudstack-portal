import React from 'react'
import cloudImage from '../assets/concept-cyber-server-cloud-data-storage-cloudscape-digital-online-rack-service-global-network-database-backup-computer-safety-infrastructure-technology.jpg'

export const BrandPanel = () => {
  return (
    <div className="relative h-full w-full overflow-hidden bg-black">
      {/* Full Background Image - High Quality */}
      <div className="absolute inset-0 w-full h-full">
        <img
          src={cloudImage}
          alt="Cloud Computing Technology"
          className="w-full h-full object-cover object-center"
          onError={(e) => {
            console.error('Error loading image:', e)
            e.target.style.display = 'none'
          }}
        />
      </div>
    </div>
  )
}
