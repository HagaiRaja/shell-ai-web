import { Button, Container, Row, Col, Form, Accordion } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import { DataGrid } from '@mui/x-data-grid';
import { useSelector } from 'react-redux';

import { numberWithCommas } from '@/app/utils'

export function BuyRecommendation({year}) {
  const result = useSelector((state) => state.data.result);
  const vehicles = useSelector((state) => state.data.vehicles);
  if (result.length === 0) return <></>;

  const columns = [
    { field: 'id', headerName: 'ID', align:'right', headerAlign: 'right', flex:2 },
    { field: 'num', headerName: 'Quantity', align:'right', headerAlign: 'right', flex:1, type:"number" },
    { field: 'price', headerName: 'Unit Cost', align:'right', headerAlign: 'right', flex:2, type:"number" },
    { field: 'cost', headerName: 'Total Cost', align:'right', headerAlign: 'right', flex:2, type:"number" },
  ];

  const buy = result.filter((act) => ((act[0] === year) && (act[3] === "Buy")))
  let series = [], totalCost = 0
  buy.map((a) => {
    const [y, id, num, act, f, dist, y_r] = a
    const car = vehicles.filter((v) => (v[0] === id))
    const price = car[0][4]
    totalCost += (price * num)
    series.push({id, num, price, cost: (price * num)})
  })

  return <>
    <Accordion defaultActiveKey="recom-head-2025" className='mb-2'>
      <Accordion.Item eventKey="recommendation">
        <Accordion.Header>Buy</Accordion.Header>
        <Accordion.Body>

          <Row>
            <div style={{ width: '100%' }}>
              <DataGrid
                rows={series}
                columns={columns}
                initialState={{
                  pagination: {
                    paginationModel: { pageSize: 5, page: 0 },
                  },
                }}
                pageSizeOptions={[5, 10, 25]}
                autoHeight
              />
            </div>
          </Row>
          <Row>
            <Col className='mt-2'>
              <p style={{textAlign: 'right'}}>Purchasing Cost: {numberWithCommas(totalCost)}</p>
            </Col>
          </Row>

        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  </>
}
  