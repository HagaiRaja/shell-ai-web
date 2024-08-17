
import dynamic from 'next/dynamic';
import 'bootstrap/dist/css/bootstrap.css';
import { useSelector } from 'react-redux';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

import { numberWithCommas } from '@/app/utils'

export function EmissionChart({target_emission, emission}) {
  const allData = useSelector((state) => state.data);
  if (allData?.result.length === 0) return <></>

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
    xaxis: {
      categories: Array.from({length: allData.endYear - allData.startYear+1}, (_, i) => i + allData.startYear)
    },
    markers: {
      size: 0
    },
    yaxis: [
      {
        title: {
          text: 'Emission (CO2/kg)',
        },
        labels: {
          formatter: numberWithCommas
        },
      }
    ],
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: function (y) {
          if(typeof y !== "undefined") {
            return  numberWithCommas(y) + " CO2/kg";
          }
          return y;
        }
      }
    },
    title: {
      text: 'Emission Trend',
      align: 'left'
    },
  };

  return <>
    <Chart options={emissionOptions} series={emissionSeries} type="line" height={350} />
  </>
}