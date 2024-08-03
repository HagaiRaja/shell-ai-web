import React from 'react';
import { Button, Container, Row, Col, Form, InputGroup } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import { useDispatch } from 'react-redux';

import { YearSelector } from "./elem/year-selector";
import { MyStatus } from "./elem/my-status";
import { MarketStatus } from "./elem/market-status";
import { setValue } from './store/dataSlice';
import { URL } from '@/app/constant'

export function Content({ presetId }) {
  const dispatch = useDispatch();
  fetch(URL + "/api/preset/" + presetId)
    .then((response) => response.json())
    .then((data) => {
      if (data.success){
        dispatch(setValue({type: "storeVar", target: "value", payload: data.data}))
        const availYear = data.data.vehicles.rows.map((e) => e[3]);
        dispatch(setValue({type: "storeVar", target: "startYear", payload: Math.min(...availYear)}))
        dispatch(setValue({type: "storeVar", target: "endYear", payload: Math.max(...availYear)}))
      }else{
        console.log(data)
        dispatch(setValue({type: "storeVar", target: "value", payload: {vehicles: null}}))
      }
    });

  return (
    <div>
      <Container className='p-2 mt-4 mb-2 w-50' style={{minWidth: '700px'}}>
        <h1 className='text-center'>Fleet Planner</h1>
        <YearSelector />
        <MyStatus />
        <MarketStatus />

        <Row className='mt-3'>
          <h6>Rules:</h6>
          <Form>
            <Form.Check // prettier-ignore
                type='checkbox'
                id='optimize-end'
                label={`Optimize sell all asset at end of the year`}
                className='mb-2'
            />

            <InputGroup className="mb-3">
              <InputGroup.Text id="basic-addon3">
                Max sell fleet per year:
              </InputGroup.Text>
              <Form.Control id="basic-url" type="number" defaultValue={20} min={1} max={100} aria-describedby="basic-addon3" />
              <InputGroup.Text>%</InputGroup.Text>
            </InputGroup>


            <InputGroup className="mb-3">
              <InputGroup.Text id="basic-addon3">
                Max age fleet has to sell:
              </InputGroup.Text>
              <Form.Control id="basic-url" type="number" defaultValue={10} min={1} max={100} aria-describedby="basic-addon3" />
              <InputGroup.Text>year(s)</InputGroup.Text>
            </InputGroup>

          </Form>
        </Row>
        <Row>
          <Col className='text-right my-2'>
            <Button variant="danger">
              Reset
            </Button>
          </Col>
        </Row>

        <hr></hr>
        <Col className='text-center mb-4'>
          <Button variant="primary" type="submit">
            Calculate
          </Button>
        </Col>
      </Container>
    </div>
  );
};