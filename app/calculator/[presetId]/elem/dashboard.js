import { Button, Container, Row, Col, Form, Accordion } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import { SaveAlt, LocalPrintshop } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';

import { Summary } from './dashboard/summary';
import { Recommendation } from './dashboard/recommendation';

export function Dashboard() {
  const allData = useSelector((state) => state.data);

  const exportJSON = () => {
    // create file in browser
    const json = JSON.stringify(allData, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const href = URL.createObjectURL(blob);
  
    // create "a" HTLM element with href to file
    const link = document.createElement("a");
    link.href = href;
    link.download = `ZeroAI_${allData.presetId}_out.json`;
    document.body.appendChild(link);
    link.click();
  
    // clean up "a" element & remove ObjectURL
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
  }

  const exportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," +
      "Year,ID,Num_Vehicles,Type,Fuel,Distance_bucket,Distance_per_vehicle(km)\n" +
      allData.result.map(a =>
        `${a[0]},${a[1]},${a[2]},${a[3]},${a[4]},${a[5]},${a[6]}`
      ).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `ZeroAI_${allData.presetId}_result.csv`);
    document.body.appendChild(link);
    link.click();
  }

  const exportPDF = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  }

  if (allData.result.length === 0) return <></>

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
  