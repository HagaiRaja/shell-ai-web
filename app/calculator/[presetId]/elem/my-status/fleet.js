
import { Row, Col, Form, Button, Accordion } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react'

import { setValue } from '../../store/dataSlice';

export function Fleet() {
  const vehicles = useSelector((state) => state.data.vehicles);
  const [availCarIds, setAvailCarIds] = useState([])
  const [curCarID, setCurCarID] = useState("")
  const [curCarYear, setCurCarYear] = useState(0)
  const [curCarPrice, setCurCarPrice] = useState(0)
  const [curCarQty, setCurCarQty] = useState(1)
  const [curCarExpectedPrice, setCurCarExpectedPrice] = useState(1)
  const [releaseYears, setReleaseYears] = useState([])
  const [minYear, setMinYear] = useState(0)
  const [isChanged, setIsChanged] = useState(false)
  const [isChangedQty, setIsChangedQty] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  const selectedStartYear = useSelector((state) => state.data.startYear);
  const dispatch = useDispatch();
  const fleet = useSelector((state) => state.data.fleet);

  useEffect(() => {
    if (vehicles.length) {
      if (!isLoaded){
        setIsLoaded(true)
        const availYear = vehicles.map((e) => e[3]);
        setMinYear(Math.min(...availYear));
      }

      let years = []
      for (let i = minYear; i < selectedStartYear; i++) {
        years.push(i)
      }
      setReleaseYears(years)

      if (curCarID != "") {
        const car = vehicles.filter((a) => a[0] == curCarID)
        setCurCarExpectedPrice(car[0][4])
      }
    }
  }, [selectedStartYear, vehicles, curCarID, minYear, isLoaded]);

  const adjustAvailCarIds = (e) => {
    const newYear = parseInt(e.target.value);
    setCurCarYear(newYear);
    setAvailCarIds(vehicles.filter((a) => a[3] == newYear));
  };

  const adjustCurCarPrice = (e) => {
    setCurCarID(e.target.value)
    const car = vehicles.filter((a) => a[0] == e.target.value)
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
    dispatch(setValue({type: "removeFleet", payload: fleetId}))
  };

  if (isLoaded && minYear === selectedStartYear) return <></>;
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
                    min={1}
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
                  <Button variant="primary" className="btn-add" type="submit" onClick={addFleet}>
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
  