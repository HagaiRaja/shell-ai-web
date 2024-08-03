
import { Row, Col, Form, FloatingLabel } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react'
import { notFound } from "next/navigation";

import { setValue } from '../store/dataSlice';

export function YearSelector() {
  const vehicles = useSelector((state) => state.data.vehicles);
  const selectedStartYear = useSelector((state) => state.data.startYear);
  const selectedEndYear = useSelector((state) => state.data.endYear);
  const dispatch = useDispatch();

  const [startYear, setStartYear] = useState(0)
  const [startYears, setStartYears] = useState([])
  const [endYears, setEndYears] = useState([])
  const [endYear, setEndYear] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    if (!isLoaded && vehicles.rows) {
      setIsLoaded(true)
      const availYear = vehicles.rows?.map((e) => e[3]);
      const minYear = Math.min(...availYear)
      const maxYear = Math.max(...availYear)
      setStartYear(minYear)
      setEndYear(maxYear)

      let years = []
      for (let i = minYear; i <= maxYear; i++) {
        years.push(i)
      }
      setStartYears(years)
      years = []
      // const start = (selectedStartYear == 0) ? minYear+1 : selectedStartYear+1
      for (let i = minYear; i <= maxYear; i++) {
        years.push(i)
      }
      setEndYears(years)

    }
  }, [vehicles, isLoaded]);

  if (vehicles === null) return notFound();

  const adjustEndYear = (e) => {
    // console.log(e.target.value)
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
        <FloatingLabel
          controlid="startYear"
          label="Start Year"
          className="mb-3"
        >
          <Form.Select aria-label="Default select example"
                      onChange={adjustEndYear}
                      controlid="startYear"
                      value={selectedStartYear}>
            {startYears.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </Form.Select>
        </FloatingLabel>
      </Col>
      <Col>
        <FloatingLabel
          controlid="enyYear"
          label="End Year"
          className="mb-3"
        >
          <Form.Select aria-label="Default select example"
                      onChange={updateEndYear}
                      controlid="enyYear"
                      value={selectedEndYear}>
            {endYears.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </Form.Select>
        </FloatingLabel>
      </Col>
    </Row>
  </>
}
  