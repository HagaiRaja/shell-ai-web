
import { Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import { Demand } from "./demand";
import { CarbonEmissions } from "./carbon-emissions";
import { Fleet } from "./fleet";


export function MyStatus() {
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
  