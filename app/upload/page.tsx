'use client'

import { useState } from 'react'
import { Button, Form, Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import Swal from 'sweetalert2'

import { LoadingSpinner } from '@/app/loading-spinner';
import { URL } from '@/app/constant'

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [presetId, setPresetId] = useState<string>()
  const [demand, setDemand] = useState<File>()
  const [vehicles, setVehicles] = useState<File>()
  const [vehiclesFuels, setVehiclesFuels] = useState<File>()
  const [fuels, setFuels] = useState<File>()
  const [costProfiles, setCostProfiles] = useState<File>()
  const [carbonEmissions, setCarbonEmissions] = useState<File>()

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setLoading(true);
    e.preventDefault()
    if (!vehicles || !vehiclesFuels || !fuels || !costProfiles) return

    try {
      const param = new FormData()
      if (presetId) {param.set('presetId', presetId)}
      if (demand) {param.set('demand', demand)}
      param.set('vehicles', vehicles)
      param.set('vehiclesFuels', vehiclesFuels)
      param.set('fuels', fuels)
      param.set('costProfiles', costProfiles)
      if (carbonEmissions) {param.set('carbonEmissions', carbonEmissions)}

      const res = await fetch('/api/preset', {
        method: 'POST',
        body: param
      })
      const data = await res.json()

      // handle the error
      if (!res.ok) throw new Error(await res.text())
      setLoading(false);
      Swal.fire({
        title: "Upload Preset Success!",
        text: data.message,
        showCancelButton: true,
        confirmButtonText: "Go to Calculator!",
        cancelButtonText: `Stay Here`
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          window.location.href = URL + "/calculator/" + presetId;
        } 
      });
    } catch (e: any) {
      // Handle errors here
      console.error(e)
      Swal.fire({
        title: 'Error!',
        text: 'Something went wrong',
        icon: 'error',
        confirmButtonText: 'Cool'
      })
    }
  }

  return (
    <main>
      <Container className='p-2 mt-4 mb-2' style={{minWidth: '350px', maxWidth: '700px'}}>
        <h1 className='text-center'>Upload file</h1>
        <Row>
          <Form onSubmit={onSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Preset Name</Form.Label>
              <Form.Control type="text"
                name="presetId"
                onChange={(e) => setPresetId(e.target.value)}
                placeholder="Preset name e.g. India-2023-to-2038" />
              <Form.Text className="text-muted">
                {"Preset name will be used as ID. If remain blank, random ID will be generated."}
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Vehicles File *</Form.Label>
              <Form.Control type="file"
                name="vehicles"
                accept=".csv"
                // @ts-ignore
                onChange={(e) => setVehicles(e.target.files?.[0])}/>
              <Form.Text className="text-muted">
                {"Please upload file in .csv download example here: "} <a href='/preset/default/vehicles.csv'>vehicles.csv</a>
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Vehicle Fuels File *</Form.Label>
              <Form.Control type="file"
                name="vehiclesFuels"
                accept=".csv"
                // @ts-ignore
                onChange={(e) => setVehiclesFuels(e.target.files?.[0])}/>
              <Form.Text className="text-muted">
                {"Please upload file in .csv download example here: "} <a href='/preset/default/vehicles_fuels.csv'>vehicles_fuels.csv</a>
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Fuels File *</Form.Label>
              <Form.Control type="file"
                name="fuels"
                accept=".csv"
                // @ts-ignore
                onChange={(e) => setFuels(e.target.files?.[0])}/>
              <Form.Text className="text-muted">
                {"Please upload file in .csv download example here: "} <a href='/preset/default/fuels.csv'>fuels.csv</a>
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Cost Profiles File *</Form.Label>
              <Form.Control type="file"
                name="costProfiles"
                accept=".csv"
                // @ts-ignore
                onChange={(e) => setCostProfiles(e.target.files?.[0])}/>
              <Form.Text className="text-muted">
                {"Please upload file in .csv download example here: "} <a href='/preset/default/cost_profiles.csv'>cost_profiles.csv</a>
              </Form.Text>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Demand File</Form.Label>
              <Form.Control type="file"
                name="demand"
                accept=".csv"
                // @ts-ignore
                onChange={(e) => setDemand(e.target.files?.[0])}/>
              <Form.Text className="text-muted">
                {"Please upload file in .csv download example here: "} <a href='/preset/default/demand.csv'>demand.csv</a>
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Carbon Emissions File</Form.Label>
              <Form.Control type="file"
                name="carbonEmissions"
                accept=".csv"
                // @ts-ignore
                onChange={(e) => setCarbonEmissions(e.target.files?.[0])}/>
              <Form.Text className="text-muted">
                {"Please upload file in .csv download example here: "} <a href='/preset/default/carbon_emissions.csv'>carbon_emissions.csv</a>
              </Form.Text>
            </Form.Group>

            <Col className='text-center mb-4'>
              <Button variant="primary" className="btn-shell" type="submit">
                Submit
              </Button>
            </Col>
          </Form>
        </Row>
      </Container>
      {loading && <LoadingSpinner />}
    </main>
  )
}
