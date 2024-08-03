
import { Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import { Demand } from "./my-status/demand";
import { CarbonEmissions } from "./my-status/carbon-emissions";
import { Fleet } from "./my-status/fleet";


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
  