'use client'

import { useState } from 'react'
import { Button, Form, Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';

export default function Home() {
  const [presetId, setPresetId] = useState<string>()
  const [demand, setDemand] = useState<File>()
  const [vehicles, setVehicles] = useState<File>()
  const [vehiclesFuels, setVehiclesFuels] = useState<File>()
  const [fuels, setFuels] = useState<File>()
  const [costProfiles, setCostProfiles] = useState<File>()
  const [carbonEmissions, setCarbonEmissions] = useState<File>()

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!vehicles || !vehiclesFuels || !fuels || !costProfiles) return

    try {
      const data = new FormData()
      if (presetId) {data.set('presetId', presetId)}
      if (demand) {data.set('demand', demand)}
      data.set('vehicles', vehicles)
      data.set('vehiclesFuels', vehiclesFuels)
      data.set('fuels', fuels)
      data.set('costProfiles', costProfiles)
      if (carbonEmissions) {data.set('carbonEmissions', carbonEmissions)}

      const res = await fetch('/api/preset', {
        method: 'POST',
        body: data
      })
      // handle the error
      if (!res.ok) throw new Error(await res.text())
    } catch (e: any) {
      // Handle errors here
      console.error(e)
    }
  }

  return (
    <main>
      <Container className='p-2 mt-4 mb-2'>
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
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Col>
          </Form>
        </Row>
      </Container>
    </main>
  )
}
