

import React from 'react'

const MaterialButton = ({
    material,
}: {
    material: {
        id: string
        material: string
        img: string
    }
}) => {
  return (
    <div>
      <h3>{material.material}</h3>
    </div>
  )
}

export default MaterialButton
