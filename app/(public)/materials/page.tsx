// Material Index Page
// app\(public)\materials\page.tsx

import { MaterialCardIndex } from "@/features/materials/components/MaterialCard"
import { materialData } from "@/app/data"

export default function MaterialsPage() {

    return (
                <div className="min-h-screen bg-gray-100 flex justify-center">
          <div id="materialCard" className="p-6 gap-6 grid grid-cols-2 md:grid-cols-4">
            {materialData.map((item) => {
              return <div key={item.id}>
                        <MaterialCardIndex material={item} />
                      </div>
                    })}
          </div>
        </div>
    )
}