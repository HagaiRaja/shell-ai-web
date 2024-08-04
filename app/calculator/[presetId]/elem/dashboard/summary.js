
import { Button, Container, Row, Col, Form, Accordion } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import { useDispatch, useSelector } from 'react-redux';
import Chart from 'react-apexcharts'

export function Summary() {
  const allData = useSelector((state) => state.data.value);
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
      categories: Array.from({length: 2039 - 2025}, (_, i) => i + 2025)
    },
    yaxis: {
      title: {
        text: 'Cost'
      }
    },
    title: {
      text: 'Cost Breakdown',
      align: 'center'
    }
  };

  const unstackSeries = [
    {
      name: 'Buy Cost (-)',
      data: [165671,
        137775,
        197292,
        142280,
        127914,
        186936,
        180269,
        119903,
        127914,
        109364,
        188764,
        130017,
        138693,
        118899]
    },
    {
      name: 'Fuel Cost (-)',
      data: [113384,
        149437,
        120769,
        148316,
        112112,
        112279,
        163434,
        121237,
        102474,
        112112,
        194057,
        176087,
        132845,
        159192]
    },
    {
      name: 'Sell Income (+)',
      data: [123700,
        115032,
        110975,
        103194,
        125186,
        112178,
        110975,
        100276,
        128727,
        108216,
        100278,
        116998,
        124743,
        125988]
    },
    {
      name: 'Insurance Cost (-)',
      data: [15183,
        16588,
        11748,
        17011,
        17895,
        15839,
        11343,
        13213,
        10614,
        19683,
        11837,
        11635,
        10614,
        18038]
    },
    {
      name: 'Maintenance Cost (-)',
      data: [18964,
        14943,
        12573,
        18029,
        17520,
        18559,
        15682,
        17071,
        17179,
        12375,
        18546,
        12200,
        12564,
        18546,]
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
      categories: Array.from({length: 2039 - 2025}, (_, i) => i + 2025)
    },
    yaxis: {
      title: {
        text: 'Cost'
      }
    },
    title: {
      text: 'Total Cost',
      align: 'center'
    }
  };

  const totalSeries = [
    {
      name: 'Cost',
      data: [30, 40, 45, 50, 49]
    }
  ];

  let totalCost = Array.from({length: 2039 - 2025}, (_, i) => 0);
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
  console.log(totalCost)

  totalSeries[0].data = totalCost

  return <>
    <Accordion defaultActiveKey="summary" className='mb-2'>
      <Accordion.Item eventKey="summary">
        <Accordion.Header>Summary</Accordion.Header>
        <Accordion.Body>
          <Chart options={totalOptions} series={totalSeries} type="bar" height={350} />
          <Chart options={unstackOptions} series={unstackSeries} type="bar" height={350} />
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  </>
}
  