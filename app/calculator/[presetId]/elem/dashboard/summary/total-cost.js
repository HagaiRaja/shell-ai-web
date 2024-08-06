
import dynamic from 'next/dynamic';
import 'bootstrap/dist/css/bootstrap.css';
import { useSelector } from 'react-redux';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

import { numberWithCommas } from '@/app/utils'

export function TotalCostChart({ totalCost }) {
  const allData = useSelector((state) => state.data);
  if (allData?.result.length === 0) return <></>

  const totalCostSum = totalCost.reduce((a, b) => a + b, 0)
  const totalSeries = [
    {
      name: 'Cost',
      data: totalCost
    }
  ];
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
      },
      labels: {
        formatter: numberWithCommas
      }
    },
    title: {
      text: `Total Cost: ${numberWithCommas(totalCostSum)}`,
      align: 'left'
    }
  };

  return <>
    <Chart options={totalOptions} series={totalSeries} type="bar" height={350} />
  </>
}