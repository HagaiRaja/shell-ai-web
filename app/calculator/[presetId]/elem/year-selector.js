
import { Row, Col, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react'
import { notFound } from "next/navigation";

import { setValue } from '../store/dataSlice';

export function YearSelector() {
  const allData = useSelector((state) => state.data.value);
  const selectedStartYear = useSelector((state) => state.data.startYear);
  const selectedEndYear = useSelector((state) => state.data.endYear);
  const dispatch = useDispatch();

  const [startYear, setStartYear] = useState(0)
  const [endYear, setEndYear] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    if (!isLoaded && allData?.vehicles) {
      const availYear = allData.vehicles.rows.map((e) => e[3]);
      setIsLoaded(true)
      setStartYear(Math.min(...availYear))
      setEndYear(Math.max(...availYear))
    }
  }, [allData.vehicles, isLoaded]);

  if (allData?.vehicles === null) return notFound();

  let startYears = []
  for (let i = startYear; i <= endYear; i++) {
    startYears.push(i)
  }
  let endYears = []
  const start = (selectedStartYear == 0) ? startYear+1 : selectedStartYear+1
  for (let i = start; i <= endYear; i++) {
    endYears.push(i)
  }

  const adjustEndYear = (e) => {
    console.log(e.target.value)
    const newStartYear = parseInt(e.target.value);
    dispatch(setValue({type: "storeVar", target: "startYear", payload: newStartYear}));
    if (newStartYear >= selectedEndYear) {
      dispatch(setValue({type: "storeVar", target: "endYear", payload: newStartYear+1}));
    }
  };

  const updateEndYear = (e) => {
    const newYear = parseInt(e.target.value);
    dispatch(setValue({type: "storeVar", target: "endYear", payload: newYear}));
  };

  console.log(startYear, endYear, selectedStartYear, selectedEndYear)
  return <>
    <Row className='mb-4'>
      <h4>Year Range</h4>
      <Col>
        <Form.Select aria-label="Default select example"
                    onChange={adjustEndYear}
                    value={selectedStartYear}>
          {startYears.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </Form.Select>
      </Col>
      <Col>
        <Form.Select aria-label="Default select example"
                    onChange={updateEndYear}
                    value={selectedEndYear}>
          {endYears.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </Form.Select>
      </Col>
    </Row>
  </>
}
  