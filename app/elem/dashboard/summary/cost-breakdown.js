
import dynamic from 'next/dynamic';
import 'bootstrap/dist/css/bootstrap.css';
import { useSelector } from 'react-redux';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

import { numberWithCommas } from '@/app/utils'

export function CostBreakdownChart({ totalBuyCost, totalFuelCost, totalSellIncome, totalInsuranceCost, totalMaintenanceCost }) {
  const allData = useSelector((state) => state.data);
  if (allData?.result.length === 0) return <></>

  const costBreakdownSeries = [totalBuyCost, totalFuelCost, totalSellIncome, totalInsuranceCost, totalMaintenanceCost]
  const costBreakdownOption = {
    chart: {
      width: 380,
      type: 'pie',
    },
    title: {
      text: 'Cost Breakdown',
      align: 'left'
    },
    yaxis: {
      labels: {
        formatter: numberWithCommas
      }
    },
    labels: ['Buy Cost (-)', 'Fuel Cost (-)', 'Sell Income (+)', 'Insurance Cost (-)', 'Maintenance Cost (-)'],
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 200
        },
        legend: {
          position: 'bottom'
        }
      }
    }]
  };

  return <>
    <Chart options={costBreakdownOption} series={costBreakdownSeries} type="pie" height={300} />
  </>
}