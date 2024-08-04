import { Button, Container, Row, Col, Form, Accordion } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import { DataGrid } from '@mui/x-data-grid';

export function BuyRecommendation({data}) {

  const columns = [
    { field: 'id', headerName: 'ID', align:'right', headerAlign: 'right', flex:2 },
    { field: 'qty', headerName: 'Quantity', align:'right', headerAlign: 'right', flex:1, type:"number" },
    { field: 'u_cost', headerName: 'Unit Cost', align:'right', headerAlign: 'right', flex:2, type:"number" },
    { field: 't_cost', headerName: 'Total Cost', align:'right', headerAlign: 'right', flex:2, type:"number" },
  ];
  const rows = [
    {id: "LNG_S1_2025", qty: 2, u_cost: 106090, t_cost: (106090*2) },
    {id: "LNG_S2_2025", qty: 1, u_cost: 141099, t_cost: 141099},
    {id: "LNG_S3_2025", qty: 27, u_cost: 160340, t_cost: (160340*27)},
    {id: "LNG_S4_2025", qty: 1, u_cost: 205235, t_cost: 205235},
  ];

  return <>
    <Accordion defaultActiveKey="recom-head-2025" className='mb-2'>
      <Accordion.Item eventKey="recommendation">
        <Accordion.Header>Buy</Accordion.Header>
        <Accordion.Body>

          <Row>
            <div style={{ width: '100%' }}>
              <DataGrid
                rows={rows}
                columns={columns}
                hideFooter={true}
                autoHeight
              />
            </div>
          </Row>
          <Row>
            <Col className='mt-2'>
              <p style={{textAlign: 'right'}}>Purchasing Cost: 4,887,694</p>
            </Col>
          </Row>

        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  </>
}
  