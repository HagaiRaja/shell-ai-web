
import { Button, Container, Row, Col, Form, Accordion, InputGroup } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react'

import { setValue } from '../../store/dataSlice';

export function CarbonEmissions() {
  const carbonEmissions = useSelector((state) => state.data.carbonEmissions);
  const startYear = useSelector((state) => state.data.startYear);
  const endYear = useSelector((state) => state.data.endYear);
  const dispatch = useDispatch();

  const [lastStartYear, setLastStartYear] = useState(false)
  const [lastEndYear, setLastEndYear] = useState(false)
  const [startEmission, setStartEmission] = useState(false)
  const [emissionReductionTarget, setEmissionReductionTarget] = useState(false)

  useEffect(() => {
    if (startYear !== 0 && ((lastStartYear !== startYear) | (lastEndYear !== endYear))) {
      setLastStartYear(startYear)
      setLastEndYear(endYear)

      const startEmission = carbonEmissions.filter((a) => a[0] == startYear)
      dispatch(setValue({type: "storeVar", target: "startEmission", payload: startEmission[0][1]}));
      setStartEmission(startEmission[0][1])

      let sumPercentage = 0.0, prev = startEmission[0][1];
      for (let i = startYear+1; i <= endYear; i++) {
        const curEmission = carbonEmissions.filter((a) => a[0] == i)
        sumPercentage += ( (1-(curEmission[0][1]/prev))* 100)
        prev = curEmission[0][1]
      }
      let avgReduction = sumPercentage / (endYear-startYear)
      avgReduction = parseFloat(avgReduction.toFixed(2))
      dispatch(setValue({type: "storeVar", target: "emissionReductionTarget", payload: avgReduction}));
      setEmissionReductionTarget(avgReduction)
    }
  }, [carbonEmissions, dispatch, endYear, startYear, lastStartYear, lastEndYear]);

  return <>
    <Accordion defaultActiveKey="carbonEmissions" className='mb-4'>
        <Accordion.Item eventKey="carbonEmissions">
            <Accordion.Header>Carbon Emission Target</Accordion.Header>
            <Accordion.Body>
              <InputGroup className="mb-3">
                <InputGroup.Text id="basic-addon3">
                  Starting year total emission:
                </InputGroup.Text>
                <Form.Control id="basic-url" type="number" value={startEmission} min={1} max={100} aria-describedby="basic-addon3"  onChange={(e) => {
                  const target = parseInt(e.target.value)
                  setStartEmission(target)
                  dispatch(setValue({type: "storeVar", target: "startEmission",
                    payload: target}));
                }}/>
                <InputGroup.Text>CO2/kg</InputGroup.Text>
              </InputGroup>


              <InputGroup className="mb-3">
                <InputGroup.Text id="basic-addon3">
                  Target reduction per year:
                </InputGroup.Text>
                <Form.Control id="basic-url" type="number" value={emissionReductionTarget} step={0.01} min={1} max={100} aria-describedby="basic-addon3" onChange={(e) => {
                  const target = parseFloat(e.target.value)
                  setEmissionReductionTarget(target)
                  dispatch(setValue({type: "storeVar", target: "emissionReductionTarget",
                    payload: target}));
                }}/>
                <InputGroup.Text>%</InputGroup.Text>
              </InputGroup>
            </Accordion.Body>
        </Accordion.Item>
    </Accordion>
  </>
}
  