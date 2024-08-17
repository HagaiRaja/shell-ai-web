'use client'

import { Provider } from 'react-redux';
import { useParams } from "next/navigation";

import { store } from "./store"
import { Content } from "./content.js"
 
export default function Page() {
  const presetId = "default"

  // Drawing
  return <>
    <Provider store={store}>
      <Content presetId={presetId}/>
    </Provider>
  </>
}