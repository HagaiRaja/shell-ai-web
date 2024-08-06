
import dynamic from 'next/dynamic';
import { Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import { useSelector } from 'react-redux';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

import { numberWithCommas } from '@/app/utils'

export function TotalCostChart({ totalCost, endOfYearAsset }) {
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
    }
  };

  return <>
    <Row>
      <Col>
        <h6><strong>{`Total Cost: ${numberWithCommas(totalCostSum)}`}</strong></h6>
        <h6><strong>{`Net Cost: ${numberWithCommas(totalCostSum-endOfYearAsset)}`}</strong></h6>
      </Col>
      <Col>
        <h6><strong>{`Asset at End of Year: ${numberWithCommas(endOfYearAsset)}`}</strong></h6>
      </Col>
    </Row>

    <Chart options={totalOptions} series={totalSeries} type="bar" height={350} />
  </>
}