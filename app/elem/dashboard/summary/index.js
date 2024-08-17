
import dynamic from 'next/dynamic';
import { Button, Container, Row, Col, Form, Accordion } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect, useRef } from 'react'
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

import { numberWithCommas } from '@/app/utils'
import { EmissionChart } from './emission'
import { TotalCostChart } from './total-cost'
import { CostBreakdownChart } from './cost-breakdown'
import { DetailCostBreakdownChart } from './detail-cost-breakdown'

export function Summary() {
  const allData = useSelector((state) => state.data);
  if (allData?.result.length === 0) return <></>

  let buyCost = [], fuelCost = [], sellIncome = []
  let insuranceCost = [], maintenanceCost = [], emission = []

  let car_left = {}
  allData.fleet.map((car) => {
    car_left[car[1]] = car[3]
  })
  for (let year = allData.startYear; year <= allData.endYear; year++) {
    let curBuyCost = 0, curFuelCost = 0, curSellIncome = 0
    let curInsuranceCost = 0, curMaintenanceCost = 0, curEmission = 0
    const buy = allData.result.filter((act) => ((act[0] === year) && (act[3] === "Buy")))
    buy.map((a) => {
      const [y, id, num, act, f, dist, y_r] = a
      const car = allData.vehicles.filter((v) => (v[0] === id))
      const price = car[0][4]
      curBuyCost += (price * num)
      if (!(id in car_left)) car_left[id] = 0
      car_left[id] += num
    })

    const use = allData.result.filter((act) => ((act[0] === year) && (act[3] === "Use")))
    use.map((a) => {
      const [y, id, num, act, f, dist, y_r] = a
      const vf = allData.vehiclesFuels.filter((v) => (v[0] === id))
      const fuel = allData.fuels.filter((v) => ((v[0] === f) && (v[1] === year)))
      const pricePerFuel = fuel[0][3], emissionPerFuel = fuel[0][2], fuelPerKm = vf[0][2]
      curFuelCost += parseInt(num * y_r * fuelPerKm * pricePerFuel)
      curEmission += parseInt(num * y_r * fuelPerKm * emissionPerFuel)
    })

    for (const [id, num] of Object.entries(car_left)) {
      const car = allData.vehicles.filter((v) => (v[0] === id))
      const targetProfileYear = (year-car[0][3]+1), maxYear = allData.costProfiles[allData.costProfiles.length-1]
      const profileYearIdx = (targetProfileYear > maxYear[0]) ? maxYear[0] : targetProfileYear
      const profile = allData.costProfiles.filter((v) => (v[0] === profileYearIdx))
      const price = car[0][4], insurance = profile[0][2], maintenance = profile[0][3]
      const iCost = parseInt(num * price * insurance/100), mCost = parseInt(num * price * maintenance/100)
      curInsuranceCost += iCost
      curMaintenanceCost += mCost
    }

    const sell = allData.result.filter((act) => ((act[0] === year) && (act[3] === "Sell")))
    sell.map((a) => {
      const [y, id, num, act, f, dist, y_r] = a
      const car = allData.vehicles.filter((v) => (v[0] === id))
      const targetProfileYear = (year-car[0][3]+1), maxYear = allData.costProfiles[allData.costProfiles.length-1]
      const profileYearIdx = (targetProfileYear > maxYear[0]) ? maxYear[0] : targetProfileYear
      if (targetProfileYear > allData.maxAgeFleet) {
        console.log("Sell Violation", a)
      }
      const profile = allData.costProfiles.filter((v) => (v[0] === profileYearIdx))
      const price = car[0][4], resaleValue = profile[0][1]
      curSellIncome += parseInt(num * price * resaleValue/100)
      car_left[id] -= num
    })

    buyCost.push(curBuyCost)
    fuelCost.push(curFuelCost)
    sellIncome.push(curSellIncome)
    insuranceCost.push(curInsuranceCost)
    maintenanceCost.push(curMaintenanceCost)
    emission.push(curEmission)
  }

  const unstackSeries = [
    {
      name: 'Buy Cost (-)',
      data: buyCost
    },
    {
      name: 'Fuel Cost (-)',
      data: fuelCost
    },
    {
      name: 'Sell Income (+)',
      data: sellIncome
    },
    {
      name: 'Insurance Cost (-)',
      data: insuranceCost
    },
    {
      name: 'Maintenance Cost (-)',
      data: maintenanceCost
    }
  ];

  let endOfYearAsset = 0
  for (const [id, num] of Object.entries(car_left)) {
    const car = allData.vehicles.filter((v) => (v[0] === id))
    const targetProfileYear = (allData.endYear-car[0][3]+1), maxYear = allData.costProfiles[allData.costProfiles.length-1]
    const profileYearIdx = (targetProfileYear > maxYear[0]) ? maxYear[0] : targetProfileYear
    const profile = allData.costProfiles.filter((v) => (v[0] === profileYearIdx))
    const price = car[0][4], resaleValue = profile[0][1]
    endOfYearAsset += parseInt(num * price * resaleValue/100)
  }

  let totalCost = Array.from({length: allData.endYear - allData.startYear+1},
                  (_, i) => i + allData.startYear);
  unstackSeries.map((series) => {
    series.data.forEach((value, i) => {
      if (series.name.includes('+')){
        totalCost[i] -= value;
      }
      else if (series.name.includes('-')){
        totalCost[i] += value;
      }
    })
  })

  let target_emission = Array.from({length: allData.endYear - allData.startYear+1},
    (_, i) => parseInt(((((100-allData.emissionReductionTarget)/100)**i)*allData.startEmission))
  );

  const totalBuyCost = buyCost.reduce((a, b) => a + b, 0)
  const totalFuelCost = fuelCost.reduce((a, b) => a + b, 0)
  const totalSellIncome = sellIncome.reduce((a, b) => a + b, 0)
  const totalInsuranceCost = insuranceCost.reduce((a, b) => a + b, 0)
  const totalMaintenanceCost = maintenanceCost.reduce((a, b) => a + b, 0)

  return <>
    <Accordion defaultActiveKey="summary" className='mb-2'>
      <Accordion.Item eventKey="summary">
        <Accordion.Header>Summary</Accordion.Header>
        <Accordion.Body>

          <EmissionChart target_emission={target_emission} emission={emission} />
          <TotalCostChart totalCost={totalCost} endOfYearAsset={endOfYearAsset} />
          <CostBreakdownChart totalBuyCost={totalBuyCost} totalFuelCost={totalFuelCost} totalSellIncome={totalSellIncome}
            totalInsuranceCost={totalInsuranceCost} totalMaintenanceCost={totalMaintenanceCost}
          />
          <DetailCostBreakdownChart unstackSeries={unstackSeries} />
          
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  </>
}
  