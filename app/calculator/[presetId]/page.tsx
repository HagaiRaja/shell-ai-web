'use client'

import { useEffect, useState } from "react";
import { notFound, useParams } from "next/navigation";
 
export default function Page() {
  const { presetId } = useParams();
  const [demand, setDemand] = useState<[]>()
  const [vehicles, setVehicles] = useState<[]>()
  const [vehiclesFuels, setVehiclesFuels] = useState<[]>()
  const [fuels, setFuels] = useState<[]>()
  const [costProfiles, setCostProfiles] = useState<[]>()
  const [carbonEmissions, setCarbonEmissions] = useState<[]>()
  
  useEffect(() => {
    fetch("/api/preset/demand/" + presetId)
      .then((response) => response.json())
      .then((data) => {
        (data.success) ? setDemand(data.data): console.log(data)
      });
    
    fetch("/api/preset/vehicles/" + presetId)
      .then((response) => response.json())
      .then((data) => {
        (data.success) ? setVehicles(data.data): console.log(data)
      });
    
    fetch("/api/preset/vehicles_fuels/" + presetId)
      .then((response) => response.json())
      .then((data) => {
        (data.success) ? setVehiclesFuels(data.data): console.log(data)
      });

    fetch("/api/preset/fuels/" + presetId)
      .then((response) => response.json())
      .then((data) => {
        (data.success) ? setFuels(data.data): console.log(data)
      });
    
    fetch("/api/preset/cost_profiles/" + presetId)
      .then((response) => response.json())
      .then((data) => {
        (data.success) ? setCostProfiles(data.data): console.log(data)
      });
    
    fetch("/api/preset/carbon_emissions/" + presetId)
      .then((response) => response.json())
      .then((data) => {
        (data.success) ? setCarbonEmissions(data.data): console.log(data)
      });
  }, [presetId]);

  return <>
    <p>Post: {presetId}</p>
    <p>
      {demand}
    </p>
    <p>
      {fuels}
    </p>
  </>
}