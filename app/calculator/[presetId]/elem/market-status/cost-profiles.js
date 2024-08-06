
import { Accordion } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import { DataGrid } from '@mui/x-data-grid';
import { useDispatch, useSelector } from 'react-redux';

import { setValue } from '../../store/dataSlice';

export function CostProfiles() {
  const costProfiles = useSelector((state) => state.data.costProfiles);

  const dispatch = useDispatch();
  const columns = [
    { field: 'year', headerName: 'End of Year', flex:1, type:"number" },
    { field: 'resale', headerName: 'Resale Value %', editable:true, flex:1, type:"number" },
    { field: 'insurance', headerName: 'Insurance Cost %', editable:true, flex:1, type:"number" },
    { field: 'maintenance', headerName: 'Maintenance Cost %', editable:true, flex:1, type:"number" },
  ];

  let rows = []
  costProfiles.map(profile => {
    rows.push({
      id: profile[4],
      year: profile[0],
      resale: profile[1],
      insurance: profile[2],
      maintenance: profile[3],
    })
  })

  const updateData = (after, before) => {
    const fields = ["resale", "insurance", "maintenance"]
    fields.map((field) => {
      if (after[field] !== before.field) {
        try {
          const newField = [after.year, parseInt(after.resale), parseInt(after.insurance), parseInt(after.maintenance), after.id]
          dispatch(setValue({type: "updateCostProfile", target: after.id, payload: newField}))
        }
        catch(e) {
          console.log("demand update error", e)
        }
      }
    })
    return after
  };

  return <>
    <Accordion className='mb-2'>
        <Accordion.Item eventKey="costProfiles">
            <Accordion.Header>Cost Profiles</Accordion.Header>
            <Accordion.Body>
              <DataGrid
                rows={rows}
                columns={columns}
                autoHeight
                processRowUpdate={updateData}
                initialState={{
                  pagination: {
                    paginationModel: { pageSize: 5, page: 0 },
                  },
                }}
                pageSizeOptions={[5, 10, 25]}
              />
            </Accordion.Body>
        </Accordion.Item>
    </Accordion>
  </>
}
  