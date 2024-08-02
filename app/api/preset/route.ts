import { mkdir, access } from 'fs/promises'
import { NextRequest, NextResponse } from 'next/server'
import { join } from 'path'
import { createRandomString, writeToFile } from '@/app/utils'
import { PRESET_DIR } from '@/app/constant'

export async function POST(request: NextRequest) {
  const data = await request.formData()

  // checking input
  let presetId: string | null = data.get('presetId') as unknown as string
  const demand: File | null = data.get('demand') as unknown as File
  const vehicles: File | null = data.get('vehicles') as unknown as File
  const vehiclesFuels: File | null = data.get('vehiclesFuels') as unknown as File
  const fuels: File | null = data.get('fuels') as unknown as File
  const costProfiles: File | null = data.get('costProfiles') as unknown as File
  const carbonEmissions: File | null = data.get('carbonEmissions') as unknown as File

  if (!vehicles || !vehiclesFuels || !fuels || !costProfiles) {
    return NextResponse.json({ success: false })
  }
  
  // Managing Folder
  if (presetId){
    let curDir = join(PRESET_DIR, presetId)
    try {
      await access(curDir)
      // return NextResponse.json({ success: false, message: "The ID has been used" })
    } catch (error) {
      mkdir(curDir)
    }
  }
  else {
    while (true){
      presetId = createRandomString(3) + "-" + createRandomString(4) + "-" + createRandomString(3)
      let curDir = join(PRESET_DIR, presetId)
      try {
        await access(curDir)
      } catch (error) {
        mkdir(curDir)
        break
      }
    }
  }

  // Storing files
  let curDir = join(PRESET_DIR, presetId)
  writeToFile(vehicles, join(curDir, "vehicles.csv"))
  writeToFile(vehiclesFuels, join(curDir, "vehicles_fuels.csv"))
  writeToFile(fuels, join(curDir, "fuels.csv"))
  writeToFile(costProfiles, join(curDir, "cost_profiles.csv"))
  if (demand){ writeToFile(demand, join(curDir, "demand.csv")) }
  if (carbonEmissions){ writeToFile(carbonEmissions, join(curDir, "carbon_emissions.csv")) }




  return NextResponse.json({ success: true, id: presetId })
}
