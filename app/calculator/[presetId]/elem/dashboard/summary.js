
import dynamic from 'next/dynamic';
import { Button, Container, Row, Col, Form, Accordion } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect, useRef } from 'react'
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export function Summary() {
  const allData = useSelector((state) => state.data);
  if (allData?.result.length === 0) return <></>

  const unstackOptions = {
    chart: {
      type: 'bar'
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%'
      }
    },
    dataLabels: {
      enabled: false
    },
    xaxis: {
      categories: Array.from({length: allData.endYear - allData.startYear+1}, (_, i) => i + allData.startYear)
    },
    yaxis: {
      title: {
        text: 'Cost ($)'
      }
    },
    title: {
      text: 'Cost Breakdown',
      align: 'center'
    }
  };
  const totalOptions = {
    chart: {
      type: 'bar'
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%'
      }
    },
    dataLabels: {
      enabled: false
    },
    xaxis: {
      categories: Array.from({length: allData.endYear - allData.startYear+1}, (_, i) => i + allData.startYear)
    },
    yaxis: {
      title: {
        text: 'Cost ($)'
      }
    },
    title: {
      text: 'Total Cost',
      align: 'center'
    }
  };
  const emissionOptions = {
    chart: {
      height: 350,
      type: 'line',
    },
    stroke: {
      curve: 'smooth'
    },
    fill: {
      type:'solid',
      opacity: [0.35, 1],
    },
    labels: Array.from({length: allData.endYear - allData.startYear+1}, (_, i) => i + allData.startYear),
    markers: {
      size: 0
    },
    yaxis: [
      {
        title: {
          text: 'Emission (CO2/kg)',
        },
      }
    ],
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: function (y) {
          if(typeof y !== "undefined") {
            return  y.toFixed(0) + " CO2/kg";
          }
          return y;
        }
      }
    },
    title: {
      text: 'Emission Trend',
      align: 'center'
    },
  };

  let buyCost = [], fuelCost = [], sellIncome = []
  let insuranceCost = [], maintenanceCost = [], emission = []

  for (let year = allData.startYear; year <= allData.endYear; year++) {
    let curBuyCost = 0, curFuelCost = 0, curSellIncome = 0
    let curInsuranceCost = 0, curMaintenanceCost = 0, curEmission = 0
    let car_left = {}
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
      const profile = allData.costProfiles.filter((v) => (v[0] === (year-car[0][3]+1)))
      const price = car[0][4], insurance = profile[0][2], maintenance = profile[0][3]
      curInsuranceCost += parseInt(num * price * insurance/100)
      curMaintenanceCost += parseInt(num * price * maintenance/100)
    }

    const sell = allData.result.filter((act) => ((act[0] === year) && (act[3] === "Sell")))
    sell.map((a) => {
      const [y, id, num, act, f, dist, y_r] = a
      const car = allData.vehicles.filter((v) => (v[0] === id))
      const profile = allData.costProfiles.filter((v) => (v[0] === (year-car[0][3]+1)))
      console.log("debug", year, a, profile, car)
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
    (_, i) => parseInt(((((100-allData.emissionReductionTarget)/100)**i)*allData.startEmission)));
  
  const totalSeries = [
    {
      name: 'Cost',
      data: totalCost
    }
  ];

  const emissionSeries = [{
    name: 'Target Emission',
    type: 'area',
    data: target_emission
  }, {
    name: 'Emission',
    type: 'line',
    data: emission
  }
  ]

  return <>
    <Accordion defaultActiveKey="summary" className='mb-2'>
      <Accordion.Item eventKey="summary">
        <Accordion.Header>Summary</Accordion.Header>
        <Accordion.Body>
          <Chart options={emissionOptions} series={emissionSeries} type="line" height={350} />
          <Chart options={totalOptions} series={totalSeries} type="bar" height={350} />
          <Chart options={unstackOptions} series={unstackSeries} type="bar" height={350} />
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  </>
}
  