import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useDispatch } from 'react-redux';

import { setValue } from '../../../store/dataSlice';

export function DemandTable({ rows }) {
  const dispatch = useDispatch();
  const columns = [
    { field: 'dist', headerName: 'D/S' },
    { field: 'S1', headerName: 'S1', editable:true, flex:1, type:"number" },
    { field: 'S2', headerName: 'S2', editable:true, flex:1, type:"number" },
    { field: 'S3', headerName: 'S3', editable:true, flex:1, type:"number" },
    { field: 'S4', headerName: 'S4', editable:true, flex:1, type:"number" },
  ];

  const updateData = (after, before) => {
    for (let i = 1; i <= 4; i++) {
      if (after[`S${i}`] != before[`S${i}`]){
        console.log(after.id, `S${i}`, before[`S${i}`], "->", after[`S${i}`])
        const ids = after.id.split('-')
        try {
          dispatch(setValue({type: "updateDemand", target: ids[i],
            payload: after[`S${i}`]}))
        }
        catch(e) {
          console.log(e)
        }
        console.log("done");
      }
    }
    return after
  };

  return (    
    <div style={{ width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        hideFooter={true}
        autoHeight
        processRowUpdate={updateData}
      />
    </div>
  );
}
