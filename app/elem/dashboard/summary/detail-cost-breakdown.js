
import dynamic from 'next/dynamic';
import 'bootstrap/dist/css/bootstrap.css';
import { useSelector } from 'react-redux';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

import { numberWithCommas } from '@/app/utils'

export function DetailCostBreakdownChart({ unstackSeries }) {
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
      },
      labels: {
        formatter: numberWithCommas
      },
    },
    title: {
      text: 'Detail Cost Breakdown',
      align: 'left'
    }
  };

  return <>
    <Chart options={unstackOptions} series={unstackSeries} type="bar" height={350} />
  </>
}