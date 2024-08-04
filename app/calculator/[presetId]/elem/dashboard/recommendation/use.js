import { Button, Container, Row, Col, Form, Accordion } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import { DataGrid } from '@mui/x-data-grid';

export function UseRecommendation({data}) {
  const columns = [
    { field: 'id', headerName: 'ID', align:'right', headerAlign: 'right', flex:2 },
    { field: 'qty', headerName: 'Quantity', align:'right', headerAlign: 'right', flex:1, type:"number" },
    { field: 'fuel', headerName: 'Fuel', align:'right', headerAlign: 'right', flex:1 },
    { field: 'dist', headerName: 'Distance Bucket', align:'right', headerAlign: 'right', flex:2},
    { field: 'distPer', headerName: 'Distance per Vehicle (km)', align:'right', headerAlign: 'right', flex:2, type:"number" },
  ];
  const rows = [
    {id: "LNG_S1_2025", qty: 2, fuel: "LNG", dist: "D1", distPer: 106000 },
    {id: "LNG_S2_2025", qty: 1, fuel: "LNG", dist: "D2", distPer: 106000 },
    {id: "LNG_S3_2025", qty: 27, fuel: "LNG", dist: "D3", distPer: 106000 },
    {id: "LNG_S4_2025", qty: 1, fuel: "LNG", dist: "D4", distPer: 106000 },
  ];

  return <>
    <Accordion defaultActiveKey="recom-head-2025" className='mb-2'>
      <Accordion.Item eventKey="recommendation">
        <Accordion.Header>Use</Accordion.Header>
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
              <p style={{textAlign: 'right'}}>Total Fuel Cost: 1,887,694</p>
              <p style={{textAlign: 'right'}}>Total Carbon Emission (CO2/kg): 7,264,658</p>
            </Col>
          </Row>

        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  </>
}
  