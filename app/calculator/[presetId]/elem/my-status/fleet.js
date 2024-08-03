
import { Row, Col, Form, Button, Accordion } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react'

import { setValue } from '../../store/dataSlice';

export function Fleet() {
  const allData = useSelector((state) => state.data.value);
  const [availCarIds, setAvailCarIds] = useState([])
  const [curCarID, setCurCarID] = useState("")
  const [curCarYear, setCurCarYear] = useState(0)
  const [curCarPrice, setCurCarPrice] = useState(0)
  const [curCarQty, setCurCarQty] = useState(1)
  const [isChanged, setIsChanged] = useState(false)
  const [isChangedQty, setIsChangedQty] = useState(false)

  const selectedStartYear = useSelector((state) => state.data.startYear);
  const dispatch = useDispatch();
  const fleet = useSelector((state) => state.data.fleet);

  let minYear = 0
  if (allData?.vehicles) {
    const availYear = allData.vehicles.rows.map((e) => e[3]);
    minYear = Math.min(...availYear);
    if (minYear == selectedStartYear) return <></>;
  }
  let releaseYears = []
  for (let i = minYear; i < selectedStartYear; i++) {
    releaseYears.push(i)
  }

  const adjustAvailCarIds = (e) => {
    console.log(e.target.value)
    const newYear = parseInt(e.target.value);
    setCurCarYear(newYear);
    setAvailCarIds(allData.vehicles.rows.filter((a) => a[3] == newYear));
  };

  const adjustCurCarPrice = (e) => {
    setCurCarID(e.target.value)
    const car = allData.vehicles.rows.filter((a) => a[0] == e.target.value)
    setCurCarPrice(car[0][4])
    setCurCarQty(1)
    setIsChanged(false)
    setIsChangedQty(false)
  };

  const addFleet = () => {
    const newData = [curCarYear, curCarID, parseInt(curCarPrice), parseInt(curCarQty), Math.random()];
    dispatch(setValue({type: "appendFleet", payload: newData}))
  };

  const removeFleet = (fleetId) => {
    console.log("hapus", fleetId)
    dispatch(setValue({type: "removeFleet", payload: fleetId}))
  };

  let curCarExpectedPrice = 0
  if (curCarID != "") {
    const car = allData.vehicles.rows.filter((a) => a[0] == curCarID)
    curCarExpectedPrice = car[0][4]
  }

  return <>
    <Accordion defaultActiveKey="demand" className='mb-2'>
        <Accordion.Item eventKey="demand">
            <Accordion.Header>Current Fleet</Accordion.Header>
            <Accordion.Body>
            <Row className='mb-4'>
              <Col>
                  <Form.Label>Release Year</Form.Label>
                  <Form.Select aria-label="Default select example"
                              onChange={adjustAvailCarIds}
                              controlid="carYear"
                              >
                  {releaseYears.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                  </Form.Select>
                </Col>
                <Col xs={4}>
                  <Form.Label>Vehicle ID</Form.Label>
                  <Form.Select aria-label="Default select example"
                              onChange={adjustCurCarPrice}
                              controlid="vehicleId"
                              // value={null}
                              >
                    {availCarIds.map(car => (
                      <option key={car[0]} value={car[0]}>{car[0]}</option>
                    ))}
                  </Form.Select>
                </Col>

                <Col>
                  <Form.Label>Price</Form.Label>
                  <Form.Control type="number"
                    name="price"
                    value={(isChanged) ? curCarPrice: ""}
                    onChange={(e) => {
                      setCurCarPrice(e.target.value)
                      setIsChanged(true)
                    }}
                    placeholder={curCarExpectedPrice} />
                </Col>

                <Col>
                  <Form.Label>Quantity</Form.Label>
                  <Form.Control type="number"
                    name="qty"
                    min={1}
                    value={(isChangedQty) ? curCarQty: 1}
                    onChange={(e) => {
                      setCurCarQty(e.target.value)
                      setIsChangedQty(true)
                    }}
                    placeholder={'Total qty'} />
                </Col>
                <Col xs={1} className='pt-4'>
                  <Button variant="primary" type="submit" onClick={addFleet}>
                    +
                  </Button>
                </Col>
              </Row>

              {fleet.map(data => (
                <Row className='my-2' key={'row-' + data[4]}>
                  <Col key={'release-' + data[4]}>
                    <Form.Control type="number"
                      key={'form-release-' + data[4]}
                      disabled
                      value={data[0]} />
                  </Col>
                  <Col key={'vehicle-' + data[4]} xs={4}>
                    <Form.Control type="string"
                      key={'form-vehicle-' + data[4]}
                      disabled
                      value={data[1]} />
                  </Col>
                  <Col key={'price-' + data[4]}>
                    <Form.Control type="number"
                      key={'form-price-' + data[4]}
                      disabled
                      value={data[2]} />
                  </Col>
                  <Col key={'qty-' + data[4]}>
                    <Form.Control type="number"
                      key={'from-qty-' + data[4]}
                      disabled
                      value={data[3]} />
                  </Col>
                  <Col key={'btn-' + data[4]} xs={1}>
                    <Button variant="danger" key={'button-' + data[4]}
                          type="submit" onClick={() => {removeFleet(data[4])}}>
                      x
                    </Button>
                  </Col>
                </Row>
              ))}
            </Accordion.Body>
        </Accordion.Item>
    </Accordion>
  </>
}
  