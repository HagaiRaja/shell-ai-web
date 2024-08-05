import { access, readFile } from 'fs/promises'
import { join } from 'path'
import { NextResponse } from 'next/server'

import { PRESET_DIR } from '@/app/constant'

async function getData(curDir:string, file:string) {
  const filepath = join(curDir, file + ".csv");
  try {
    await access(filepath)
  } catch (error) {
    if (file == "demand"){
      return {
        columns: ['Year', 'Size', 'Distance', 'Demand (km)'],
        rows: []
      }
    }
    else if (file == "carbon_emissions"){
      return {
        columns: ['Year', 'Carbon emission CO2/kg'],
        rows: []
      }
    }
  }

  const removeNull = (arr:((string | number)[] | undefined)[]) => {
    return arr.filter((a) => !a?.includes(NaN) && !a?.includes('undefined'));
  }

  const text = await readFile(filepath, 'utf8');
  const splitted_text = text.split('\n')
  const columns = splitted_text[0].split(',')
  const rows = splitted_text.slice(1);
  const clean = rows.map((row) => {
    let arr = row.split(',')
    if (file == "demand"){
      return [parseInt(arr[0]), arr[1], arr[2], parseInt(arr[3])]
    }
    else if (file == "carbon_emissions"){
      return [parseInt(arr[0]), parseFloat(arr[1])]
    }
    else if (file == "cost_profiles"){
      return arr.map((e) => parseInt(e))
    }
    else if (file == "fuels"){
      return [arr[0], parseInt(arr[1]), parseFloat(arr[2]), parseFloat(arr[3]), parseInt(arr[4])]
    }
    else if (file == "vehicles_fuels"){
      return [arr[0], arr[1], parseFloat(arr[2])]
    }
    else if (file == "vehicles"){
      return [arr[0], arr[1], arr[2], parseInt(arr[3]), parseInt(arr[4]), parseInt(arr[5]), arr[6]]
    }
  });

  return {
    columns,
    rows: removeNull(clean)
  }
}

export async function GET(
  _request: Request,
  { params: { presetId } }: { params: { presetId: string } }
) {
  // if (!["carbon_emissions", "cost_profiles", "demand",
  //       "fuels", "vehicles_fuels", "vehicles"].includes(file)) {
  //   return NextResponse.json({
  //     success: false, message: "File is not recognized"
  //   })
  // }

  const curDir = join(PRESET_DIR, presetId);
  try {
    await access(curDir)
  } catch (error) {
    return NextResponse.json({
      success: false, message: "Preset NOT Found"
    })
  }
  const carbonEmissions = await getData(curDir, "carbon_emissions")
  const costProfiles = await getData(curDir, "cost_profiles")
  const demand = await getData(curDir, "demand")
  const fuels = await getData(curDir, "fuels")
  const vehiclesFuels = await getData(curDir, "vehicles_fuels")
  const vehicles = await getData(curDir, "vehicles")
  const data = {
    carbonEmissions,
    costProfiles,
    demand,
    fuels,
    vehiclesFuels,
    vehicles,
  }
  

  return NextResponse.json({
    success: true,
    data,
  });
}
