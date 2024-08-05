
import { Accordion } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react'

import { DemandTable } from './demand-table';

export function Demand() {
  const demand = useSelector((state) => state.data.demand);
  const startYear = useSelector((state) => state.data.startYear);
  const endYear = useSelector((state) => state.data.endYear);

  const [isLoaded, setIsLoaded] = useState(false)
  const [years, setYears] = useState([])

  useEffect(() => {
    if (!isLoaded){
      setIsLoaded(true)
    }
    let curYears = []
    for (let year = startYear; year <= endYear; year++) {
      let rows = [
        { id: 1, dist: "D1", S1: 11, S2: 21, S3: 31, S4: 41 },
        { id: 2, dist: "D2", S1: 12, S2: 22, S3: 32, S4: 42 },
        { id: 3, dist: "D3", S1: 13, S2: 23, S3: 33, S4: 43 },
        { id: 4, dist: "D4", S1: 14, S2: 24, S3: 34, S4: 44 },
      ]
      if (demand.length){
        const curDemand = demand.filter((a) => a[0] == year);
        curDemand.sort();
        curDemand.map((e) => {
          rows[parseInt(e[2][1])-1].id += `-${e[4]}`
          rows[parseInt(e[2][1])-1][e[1]] = e[3]
        })
      }
      curYears.push({year, rows})
    }
    setYears(curYears)
  }, [isLoaded, startYear, endYear, demand]);

  return <>
    <Accordion defaultActiveKey="demand" className='mb-2'>
        <Accordion.Item eventKey="demand">
            <Accordion.Header>Demand</Accordion.Header>
            <Accordion.Body>
            {years.map(data => (

              <Accordion className='mb-2' key={"demand-head" + data.year} style={{ width: '100%' }}>
                <Accordion.Item eventKey="demand">
                  <Accordion.Header>{data.year}</Accordion.Header>
                  <Accordion.Body>
                    <DemandTable key={"demand-table" + data.year} rows={data.rows}/>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>

            ))}
            </Accordion.Body>
        </Accordion.Item>
    </Accordion>
  </>
}
  