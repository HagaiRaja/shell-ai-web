
import { Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import { Vehicles } from "./vehicles";
import { CostProfiles } from "./cost-profiles";


export function MarketStatus() {

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
  