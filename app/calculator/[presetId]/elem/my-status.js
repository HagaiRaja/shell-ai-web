
import { Button, Container, Row, Col, Form, Accordion } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import { useDispatch, useSelector } from 'react-redux';
import { Demand } from "./my-status/demand";
import { CarbonEmissions } from "./my-status/carbon-emissions";
import { Fleet } from "./my-status/fleet";


export function MyStatus() {
  const allData = useSelector((state) => state.data.value);

  return <>
    <Row>
      <h4>My Status</h4>
      <Col>
        <Fleet/>
        <Demand/>
        <CarbonEmissions/>
      </Col>
    </Row>
  </>
}
  