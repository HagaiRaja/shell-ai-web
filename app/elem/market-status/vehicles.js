import { Accordion } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import { DataGrid } from '@mui/x-data-grid';
import { useDispatch, useSelector } from 'react-redux';

import { setValue } from '../../store/dataSlice';

export function Vehicles() {
  const vehicles = useSelector((state) => state.data.vehicles);

  const dispatch = useDispatch();
  const columns = [
    { field: 'id', headerName: 'ID', flex:2 },
    { field: 'vehicle', headerName: 'Vehicle', flex:1 },
    { field: 'size', headerName: 'Size', flex:1 },
    { field: 'year', headerName: 'Year', flex:1 },
    { field: 'cost', headerName: 'Cost ($)', flex:2, type:"number" },
    { field: 'yearRange', headerName: 'Yearly range (km)', flex:2, type:"number" },
    { field: 'dist', headerName: 'Distance', flex:1 },
  ];

  let rows = []
  vehicles.map(vehicle => {
    rows.push({
      id: vehicle[0],
      vehicle: vehicle[1],
      size: vehicle[2],
      year: vehicle[3],
      cost: vehicle[4],
      yearRange: vehicle[5],
      dist: vehicle[6],
    })
  })

  return <>
    <Accordion className='mb-2'>
        <Accordion.Item eventKey="vehicles">
            <Accordion.Header>Vehicles</Accordion.Header>
            <Accordion.Body>
              <DataGrid
                rows={rows}
                columns={columns}
                initialState={{
                  pagination: {
                    paginationModel: { pageSize: 10, page: 0 },
                  },
                }}
                pageSizeOptions={[5, 10, 25]}
                autoHeight
              />
            </Accordion.Body>
        </Accordion.Item>
    </Accordion>
  </>
}
  