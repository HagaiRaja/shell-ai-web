
import { Button, Container, Row, Col, Form, Accordion } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import { useDispatch, useSelector } from 'react-redux';
import { Vehicles } from "./market-status/vehicles";
import { CostProfiles } from "./market-status/cost-profiles";


export function MarketStatus() {
  const allData = useSelector((state) => state.data.value);

  return <>
    <Row>
      <h4>Market Status</h4>
      <Col>
        <Vehicles/>
        <CostProfiles/>
      </Col>
    </Row>
  </>
}
  