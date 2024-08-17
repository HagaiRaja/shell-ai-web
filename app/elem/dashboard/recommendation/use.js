import { Button, Container, Row, Col, Form, Accordion } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import { DataGrid } from '@mui/x-data-grid';
import { useSelector } from 'react-redux';

import { numberWithCommas, createRandomString } from '@/app/utils'

export function UseRecommendation({year}) {
  const result = useSelector((state) => state.data.result);
  const vehiclesFuels = useSelector((state) => state.data.vehiclesFuels);
  const fuels = useSelector((state) => state.data.fuels);
  if (result.length === 0) return <></>;
  
  const columns = [
    { field: 'veh_id', headerName: 'ID', align:'right', headerAlign: 'right', flex:2 },
    { field: 'num', headerName: 'Quantity', align:'right', headerAlign: 'right', flex:1, type:"number" },
    { field: 'fuel', headerName: 'Fuel', align:'right', headerAlign: 'right', flex:1 },
    { field: 'dist', headerName: 'Distance Bucket', align:'right', headerAlign: 'right', flex:2},
    { field: 'distPer', headerName: 'Distance per Vehicle (km)', align:'right', headerAlign: 'right', flex:2, type:"number" },
    { field: 'cost', headerName: 'Fuel Cost', align:'right', headerAlign: 'right', flex:2, type:"number" },
    { field: 'emission', headerName: 'Emission', align:'right', headerAlign: 'right', flex:2, type:"number" },
  ];

  const use = result.filter((act) => ((act[0] === year) && (act[3] === "Use")))
  let series = [], totalCost = 0, totalEmission = 0
  use.map((a) => {
    const [y, veh_id, num, act, fuel, dist, distPer] = a
    const vf = vehiclesFuels.filter((v) => (v[0] === veh_id))
    const fuelData = fuels.filter((v) => ((v[0] === fuel) && (v[1] === year)))
    const pricePerFuel = fuelData[0][3], emissionPerFuel = fuelData[0][2], fuelPerKm = vf[0][2]
    const cost = parseInt(num * distPer * fuelPerKm * pricePerFuel)
    const emission = parseInt(num * distPer * fuelPerKm * emissionPerFuel)
    totalCost += cost
    totalEmission += emission
    series.push({id: createRandomString(5), veh_id, num, fuel, dist, distPer, cost, emission})
  })

  return <>
    <Accordion defaultActiveKey="recom-head-2025" className='mb-2'>
      <Accordion.Item eventKey="recommendation">
        <Accordion.Header>Use</Accordion.Header>
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
              <p style={{textAlign: 'right'}}>Total Fuel Cost: {numberWithCommas(totalCost)}</p>
              <p style={{textAlign: 'right'}}>Total Carbon Emission (CO2/kg): {numberWithCommas(totalEmission)}</p>
            </Col>
          </Row>

        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  </>
}
  