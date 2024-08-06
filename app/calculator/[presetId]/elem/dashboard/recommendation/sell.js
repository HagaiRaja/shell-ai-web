import { Button, Container, Row, Col, Form, Accordion } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import { DataGrid } from '@mui/x-data-grid';
import { useSelector } from 'react-redux';

import { numberWithCommas } from '@/app/utils'

export function SellRecommendation({year}) {
  const result = useSelector((state) => state.data.result);
  const vehicles = useSelector((state) => state.data.vehicles);
  const costProfiles = useSelector((state) => state.data.costProfiles);
  if (result.length === 0) return <></>;

  const columns = [
    { field: 'id', headerName: 'ID', align:'right', headerAlign: 'right', flex:2 },
    { field: 'num', headerName: 'Quantity', align:'right', headerAlign: 'right', flex:1, type:"number" },
    { field: 'price', headerName: 'Buy Price', align:'right', headerAlign: 'right', flex:2, type:"number" },
    { field: 'sell', headerName: 'Target Sell Price', align:'right', headerAlign: 'right', flex:2, type:"number" },
    { field: 'totalSell', headerName: 'Total Sell', align:'right', headerAlign: 'right', flex:2, type:"number" },
  ];

  const sell = result.filter((act) => ((act[0] === year) && (act[3] === "Sell")))
  let series = [], totalIncome = 0
  sell.map((a) => {
    const [y, id, num, act, f, dist, y_r] = a
    const car = vehicles.filter((v) => (v[0] === id))
    // console.log("debug", (year-car[0][3]+1), maxYear)
    const targetProfileYear = (year-car[0][3]+1), maxYear = costProfiles[costProfiles.length-1]
    const profileYearIdx = (targetProfileYear > maxYear[0]) ? maxYear[0] : targetProfileYear
    const profile = costProfiles.filter((v) => (v[0] === profileYearIdx))
    const price = car[0][4], resaleValue = profile[0][1]
    const sell = parseInt(price * resaleValue/100)
    const totalSell = num * sell
    totalIncome += totalSell
    series.push({id, num, price, sell, totalSell})
  })

  return <>
    <Accordion defaultActiveKey="recom-head-2025" className='mb-2'>
      <Accordion.Item eventKey="recommendation">
        <Accordion.Header>Sell</Accordion.Header>
        <Accordion.Body>

          <Row>
            <div style={{ width: '100%' }}>
              <DataGrid
                rows={series}
                columns={columns}
                hideFooter={true}
                autoHeight
              />
            </div>
          </Row>
          <Row>
            <Col className='mt-2'>
              <p style={{textAlign: 'right'}}>Selling Income: {numberWithCommas(totalIncome)}</p>
            </Col>
          </Row>

        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  </>
}
  