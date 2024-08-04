import { Button, Container, Row, Col, Form, Accordion } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import { SaveAlt, LocalPrintshop } from '@mui/icons-material';

import { Summary } from './dashboard/summary';
import { Recommendation } from './dashboard/recommendation';

export function Dashboard() {
  const exportJSON = () => {
  }

  const exportCSV = () => {
  }

  const exportPDF = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  }

  return <>
    <Row>
      <h4>Result</h4>
      <Col>
        <Summary/>
        <Recommendation/>

        <Row className='mt-5 fs-1'>
          <Col style={{textAlign: "right"}}>
            <Button variant="primary" className='btn-add' type="submit" onClick={exportJSON}>
              <SaveAlt/> Export All Data
            </Button>
          </Col>

          <Col style={{textAlign: "center"}}>
            <Button variant="primary" className='btn-add' type="submit" onClick={exportCSV}>
              <SaveAlt/> Export Recommendation
            </Button>
          </Col>

            <Col style={{textAlign: "left"}}>
              <Button variant="primary" className='btn-add' type="submit" onClick={exportPDF}>
                <LocalPrintshop/> Print Report
              </Button>
          </Col>
        </Row>
      </Col>
    </Row>
  </>
}
  