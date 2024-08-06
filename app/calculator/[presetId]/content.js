import React from 'react';
import { Button, Container, Row, Col, Form, InputGroup } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect, useRef } from 'react'
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import UploadIcon from '@mui/icons-material/Upload';

import { YearSelector } from "./elem/year-selector";
import { MyStatus } from "./elem/my-status";
import { MarketStatus } from "./elem/market-status";
import { Dashboard } from "./elem/dashboard";
import { setValue } from './store/dataSlice';
import { URL } from '@/app/constant'
import { LoadingSpinner } from '@/app/loading-spinner';
import { createRandomString, argMin } from '@/app/utils';

export function Content({ presetId }) {
  const dispatch = useDispatch();
  const allData = useSelector((state) => state.data);
  const [baseData, setBaseData] = useState({})
  const [maxSellFleet, setMaxSellFleet] = useState(20)
  const [maxAgeFleet, setMaxAgeFleet] = useState(10)
  const [loading, setLoading] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false)
  const fileInputRef = useRef(null);

  useEffect(() => {
    console.log("ENV", URL)
    if (!isLoaded){
      setLoading(true)
      setIsLoaded(true)
      dispatch(setValue({type: "storeVar", target: "presetId", payload: presetId}))
      fetch(URL + "/api/preset/" + presetId)
        .then((response) => response.json())
        .then((data) => {
          if (data.success){
            dispatch(setValue({type: "storeVar", target: "carbonEmissions",
                                payload: addId(data.data.carbonEmissions.rows)}))
            dispatch(setValue({type: "storeVar", target: "costProfiles",
                                payload: addId(data.data.costProfiles.rows)}))
            dispatch(setValue({type: "storeVar", target: "demand",
                                payload: addId(data.data.demand.rows)}))
            dispatch(setValue({type: "storeVar", target: "fuels",
                                payload: addId(data.data.fuels.rows)}))
            dispatch(setValue({type: "storeVar", target: "vehiclesFuels",
                                payload: addId(data.data.vehiclesFuels.rows)}))
            dispatch(setValue({type: "storeVar", target: "vehicles",
                                payload: addId(data.data.vehicles.rows)}))
            
            let startY = 0, endY = 0
            if (data.data.vehicles.rows) {
              const availYear = data.data.vehicles.rows.map((e) => e[3]);
              startY = Math.min(...availYear)
              endY = Math.max(...availYear)
              dispatch(setValue({type: "storeVar", target: "startYear", payload: startY}))
              dispatch(setValue({type: "storeVar", target: "endYear", payload: endY}))
            }
            setBaseData({
              carbonEmissions: addId(data.data.carbonEmissions.rows),
              costProfiles: addId(data.data.costProfiles.rows),
              demand: addId(data.data.demand.rows),
              fuels: addId(data.data.fuels.rows),
              vehiclesFuels: addId(data.data.vehiclesFuels.rows),
              vehicles: addId(data.data.vehicles.rows),
              startYear: startY,
              endYear: endY,
            })
          } else{
            dispatch(setValue({type: "storeVar", target: "vehicles", payload: null}))
          }
        }
      );
      setTimeout(() => {
        setLoading(false)
      }, 2000);
    }
  }, [isLoaded, dispatch, presetId]);

  const addId = (arr) => {
    if (!arr) return arr
    arr = arr.map((e) => {
      return [...e, createRandomString(5)]
    })
    return arr
  }

  const calculate = async () => {
    // await setLoading(true) # TODO: Remove this
    const fuelCache = {};
    // year.fuel: cost, emissions, uncertainty
    await allData.fuels.map((f) => {
      const [fuel, year, emissions, cost, uncertainty] = f
      if (!fuelCache[year]) {
        fuelCache[year] = {};
      }
      fuelCache[year][fuel] = {cost, emissions, uncertainty};
    })
  
    const costProfiles = {};
    // endOfYear: resale, insurance, maintenance, cost, avgPerYear, costPerYear
    let sumProfile = 0, prevSale = 100;
    await allData.costProfiles.map((f) => {
      const [endOfYear, resale, insurance, maintenance] = f
      const cost = insurance + maintenance + sumProfile + 100 - resale
      const avgPerYear = cost / endOfYear
      const costPerYear = insurance + maintenance + prevSale - resale
      costProfiles[endOfYear] = {
        resale, insurance, maintenance, cost, avgPerYear, costPerYear
      };
      sumProfile += insurance + maintenance
      prevSale = resale
    })

    const getCurVeh = async () => {
      let veh_comb = []
      await allData.vehicles.map((v) => {
        const curFuels = allData.vehiclesFuels.filter((vf) => (vf[0] === v[0]))
        curFuels.map((vh) => {
          const row = {
            id: vh[0],
            fuel: vh[1], 
            consumption: vh[2], 
            vehicle: v[1], 
            size: v[2], 
            year: v[3], 
            cost: v[4], 
            yearRange: v[5], 
            dist: v[6], 
            yearSize: v[3] + v[2], 
            fuelSize: vh[1] + v[2], 
            fillDemand: v[2] + v[6]
          }
          const useCost = fuelCache[row.year][row.fuel].cost*row.consumption*row.yearRange;
          const yearFullCost = useCost + (row.cost*costProfiles[1].costPerYear/100);
          const costPerKm = yearFullCost / row.yearRange;
          const emissionKm = fuelCache[row.year][row.fuel].emissions*row.consumption;
          veh_comb.push({...row, 
            yearFullCost, costPerKm, emissionKm,})
        })
      })
      return veh_comb;
    }
    const veh_comb = await getCurVeh();

    let curCar = {S1:[], S2:[], S3:[], S4:[]};
    allData.fleet.map((car) => {
      const carDetail = veh_comb.filter((v) => (v.id === car[1]))[0]
      const thisFleet = {
        ...carDetail,
        cost: car[2]
      }
      curCar[thisFleet.size].push([thisFleet, car[3]])
    })

    const compute_demand = (year, epsilon=0.0001) => {
      const demandMap = {S1:{}, S2:{}, S3:{}, S4:{}}

      const curDemand = allData.demand.filter((a) => a[0] == year);
      curDemand.sort();
      curDemand.map((e) => {
        demandMap[e[1]][e[2]] = e[3] + epsilon
      })
      return demandMap
    }

    const sort_best_usage = (year, car_list) => {
      let data = []
      car_list.map((e) => {
        const [car, num] = e
        const cost_per_km = car.consumption*fuelCache[year][car.fuel].cost
        data.push([
          cost_per_km, `${car.vehicle}_${car.size}_${car.year}`,
          num, car.fuel, car.yearRange, car.emissionKm
        ])
      })
      data.sort()
      return data
    }

    const sort_by_price = (year, cars) => {
      let data = [], total_car = 0
      for (const [s, car_list] of Object.entries(cars)) {
        car_list.map((e) => {
          const [car, num] = e
          const targetProfileYear = (year-car.year+1), maxYear = allData.costProfiles[allData.costProfiles.length-1]
          const profileYearIdx = (targetProfileYear > maxYear[0]) ? maxYear[0] : targetProfileYear
          const profile = allData.costProfiles.filter((v) => (v[0] === profileYearIdx))
          const resaleValue = profile[0][1]
          total_car += num
          data.push([
            car.cost*resaleValue, car.id, num
          ])
        })
      }
      data.sort().reverse()
      return [data, total_car]
    }

    const get_4inefficient_car = (cars) => {
      let ineff_cars = [], eff_cars = []
      for (let i = cars.length-1; i >= 0; i--) {
        let [_, car_id, num, fuel, y_r, e_k] = cars[i];
        while ((ineff_cars.length < 4) && (num > 0)) {
          num -= 1
          ineff_cars.push([car_id, fuel, y_r, e_k])
        }
        if (num > 0){
          eff_cars.push([car_id, num, fuel, y_r, e_k])
        }
      }
      return [eff_cars, ineff_cars]
    }

    const get_best_cars = (year, s, is_max_dist=true, dist=0, min_d="D1") => {
      min_d = parseInt(min_d[1])
      const cur_veh = veh_comb.filter((car) => ((car.year === year) && (car.size === s)))
      let cost_per_km = []
      cur_veh.map((car) => {
        let usage_cost = 0
        if (is_max_dist) {
          dist = car.yearRange
        }
        usage_cost = dist*car.consumption*fuelCache[year][car.fuel].cost

        const purchase_cost = car.cost * costProfiles[1].costPerYear / 100 // depreciation cost for 1y
        const total_usage_cost = usage_cost + purchase_cost
        if (min_d > parseInt(car.dist[1])) {
          cost_per_km.push(9999999999999)
        }
        else {
          cost_per_km.push(total_usage_cost/dist)
        }
      })

      const best_choice = argMin(cost_per_km)
      return cur_veh[best_choice]
    }

    const get_car_by_id = (car_id) => {
      const [ID, fuel] = car_id.split("-")
      let [car_v, car_s, car_y] = ID.split("_")
      car_y = parseInt(car_y)
      const cur_veh = veh_comb.filter((car) => ((car.year === car_y) && (car.size === car_s) && (car.fuel == fuel)))
      return cur_veh[0]
    }

    const fuelID_to_carID = (car_id) => {
      const [car_f, car_s, car_y] = car_id.split("_")
      let ID = ""
      if ((car_f === "LNG") || (car_f === "BioLNG")) ID = `LNG_${car_s}_${car_y}`
      else if ((car_f === "B20") || (car_f === "HVO")) ID = `Diesel_${car_s}_${car_y}`
      else ID = `BEV_${car_s}_${car_y}`
      return [ID, car_f]
    }

    const get_profile_age = (cur_year, car_year) => {
      const profileLength = Object.keys(costProfiles).length
      if ((cur_year - car_year) >= profileLength){
        return costProfiles[profileLength-1].costPerYear 
      }
      try {
        const val = costProfiles[cur_year-car_year+1].costPerYear
        return val
      }
      catch (e){
        console.log("getProfileAge", cur_year, car_year, cur_year-car_year+1, costProfiles, e)
      }
    }

    const compute_usage_cost = (spec, year) => {
      const car_id = `${spec.fuel}_${spec.size}_${spec.year}`
      const depreciation_cost = spec.cost * get_profile_age(year, spec.year) / 100
      const usage_cost = spec.consumption * spec.yearRange * fuelCache[year][spec.fuel].cost
      return [car_id, depreciation_cost, usage_cost]
    }

    const remove_20percent_usebase = async (actions) => {
      // get comparison price
      let comparison = []
      let total_car = 0
      await actions.map(async (action) => {
        let [year, car_id, num, _, fuel, d, dist] = action
        year = parseInt(year)
        const spec = get_car_by_id(`${car_id}-${fuel}`)
        const [car_id1, dep1, usa1] = compute_usage_cost(spec, year)

        // get this year head to head car
        const cur_car = await get_best_cars(year, spec.size, false, dist, spec.dist)
        const [car_id2, dep2, usa2] = compute_usage_cost(cur_car, year)

        // after 10 (allData.maxAgeFleet) years,
        // the cars are unusable so it's better to sell 5 years before the end period
        let end_period_cost = 0
        if ((year - spec.year) > (allData.maxAgeFleet-1)){
          if ((10 - (year - spec.year)) < 1){
            end_period_cost = spec.cost
          }
          else {
            end_period_cost = spec.cost / (allData.maxAgeFleet - (year - spec.year))
          }
        }

        if (spec.year !== year){
          comparison.push([(dep1+usa1) - (dep2+usa2) + end_period_cost, num, car_id1, car_id2, action])
          total_car += num
        }
      })
      comparison.sort((a, b) => a[0] - b[0]).reverse()

      // The rule to only allow sell 20% (allData.maxSellFleet) of the current fleet
      let plan_to_sell = Math.floor(total_car*allData.maxSellFleet/100)
      let car_left = {}, target_sell = {}, updated_actions = [], new_buy_actions = []
      console.log("comparison", actions[0][0], comparison)
      comparison.map((el) => {
        const [prio, num, car_id1, car_id2, action] = el
        let [year, car_id, qty, act, fuel, d, dist] = action
        year = parseInt(year)
        const spec1 = get_car_by_id(`${car_id}-${fuel}`)
        const [_, car_s2, car_y2] = car_id2.split("_")
        const [ID2, car_f2] = fuelID_to_carID(car_id2)
        const spec2 = get_car_by_id(`${ID2}-${car_f2}`)
        
        if (plan_to_sell == 0){ // sell nothing
          updated_actions.push(action)
          if (!(car_s2 in car_left)) car_left[car_s2] = []
          car_left[car_s2].push([spec1, num])
        }       
        else if (num > plan_to_sell){ // sell some
          // update actions
          updated_actions.push([year, car_id, num-plan_to_sell, "Use", fuel, d, dist])
          new_buy_actions.push([year, ID2, plan_to_sell, "Buy", "", "", 0])
          updated_actions.push([year, ID2, plan_to_sell, "Use", car_f2, d, dist])
          // update car_left
          if (!(car_s2 in car_left)) car_left[car_s2] = []
          car_left[car_s2].push([spec1, num-plan_to_sell])
          car_left[car_s2].push([spec2, plan_to_sell])
          // add to target sell
          if (!(car_id1 in target_sell)) target_sell[car_id1] = 0
          target_sell[car_id1] += plan_to_sell
          plan_to_sell = 0
        }
        else { // sell all
          // update actions
          new_buy_actions.push([year, ID2, num, "Buy", "", "", 0])
          updated_actions.push([year, ID2, num, "Use", car_f2, d, dist])
          // update car_left
          if (!(car_s2 in car_left)) car_left[car_s2] = []
          car_left[car_s2].push([spec2, num])
          // add to target sell
          if (!(car_id1 in target_sell)) target_sell[car_id1] = 0
          target_sell[car_id1] += num
          plan_to_sell -= num
        }
      })
      return [car_left, target_sell, new_buy_actions, updated_actions]
    }

    const get_emission_comparison = (car_id, year) => {
      let [car_v, car_s, car_y] = car_id.split("_")
      car_y = parseInt(car_y)
      let f1, f2
      if (car_v == "LNG"){
        f1 = 'LNG'
        f2 = 'BioLNG'
      }
      else if (car_v == "Diesel"){
        f1 = 'B20'
        f2 = 'HVO'
      }
      else return [0, 0]
      const t1 = veh_comb.filter((car) => ((car.year === car_y) && (car.size === car_s) && (car.fuel === f1)))
      const t1_val = t1[0]
      const t2 = veh_comb.filter((car) => ((car.year === car_y) && (car.size === car_s) && (car.fuel === f2)))
      const t2_val = t2[0]
  
      const t1_emission_per_km = fuelCache[year][f1].emissions*t1_val.consumption
      const t2_emission_per_km = fuelCache[year][f2].emissions*t2_val.consumption
      const t1_cost_per_km = fuelCache[year][f1].cost*t1_val.consumption
      const t2_cost_per_km = fuelCache[year][f2].cost*t2_val.consumption

      const emission_reduce_per_km = t1_emission_per_km - t2_emission_per_km
      const cost_added_per_km = t2_cost_per_km - t1_cost_per_km
      const emission_prio = emission_reduce_per_km / cost_added_per_km
      return [emission_prio, emission_reduce_per_km]
    }

    const adjust_use_actions = (actions, total_emission, target_emission) => {
      if (total_emission <= target_emission) return [total_emission, actions]
      console.log("Let's adjust the emission!")
      
      let temp_actions = []
      let final_actions = []
      actions.map((action) => {
        const [year, car_id, num, use_case, fuel, d, dist] = action
        if (use_case == "Buy"){
          final_actions.push(action)
        }
        else {
          const [emission_prio, emission_reduce_per_km] = get_emission_comparison(car_id, year)
          temp_actions.push([-emission_prio, dist, emission_reduce_per_km, year, car_id, num, fuel, d])
        }
      })
      
      temp_actions.sort((a, b) => a[0] - b[0])
      temp_actions.map((temp_action) => {
        const [_, dist, erpkm, year, car_id, num, fuel, d] = temp_action
        if (total_emission > target_emission) {
          let can_be_reduce = erpkm*dist*num
          let f1, f2
          if (fuel == "LNG"){
            f1 = 'LNG'
            f2 = 'BioLNG'
          }
          else if (fuel == "BioLNG"){
            f1 = 'LNG'
            f2 = 'LNG'
          }
          else if (fuel == "B20"){
            f1 = 'B20'
            f2 = 'HVO'
          }
          else if (fuel == "HVO"){
            f1 = 'HVO'
            f2 = 'HVO'
          }
          else if (fuel == "Electricity"){
            f1 = 'Electricity'
            f2 = 'Electricity'
          }
          else {
            console.log("weird", temp_action)
          }
          
          if (can_be_reduce >= (total_emission-target_emission)){
            let km_need_to_change = (total_emission-target_emission) / erpkm
            let num_car_change = Math.ceil(km_need_to_change/dist)
            let num_car_stay = num - num_car_change
            final_actions.push([year, car_id, num_car_change, "Use", f2, d, dist])
            if (num_car_stay > 0) final_actions.push([year, car_id, num_car_stay, "Use", f1, d, dist])
            total_emission -= erpkm*dist*num_car_change
          }
          else {
            final_actions.push([year, car_id, num, "Use", f2, d, dist])
            total_emission -= can_be_reduce
          }
        }
        else {
          final_actions.push([year, car_id, num, "Use", fuel, d, dist])
        }
      })
              
      return [total_emission, final_actions]
    }

    const summarize_submission = (df) => {
      const act = {}
      df.map((row) => {
        const ID = `${row[0]}-${row[1]}-${row[3]}-${row[4]}-${row[5]}-${row[6]}`
        if (!(ID in act)) act[ID] = 0
        act[ID] += row[2]
      })

      let actions = []
      for (const [ID, val] of Object.entries(act)) {
        const [year, car_id, action, fuel, dist, dist_per] = ID.split("-")
        const [car_f, car_s, car_y] = car_id.split("_")
        actions.push([parseInt(year), car_s, dist, car_id, act[ID], action, fuel, parseFloat(dist_per)])
      }
      actions.sort()
  
      let new_act = []
      for (let year = allData.startYear; year <= allData.endYear; year++) {
        const buy = actions.filter((act) => ((act[0] === year) && (act[5] === "Buy")))
        buy.map((a) => {
          new_act.push([a[0], a[3], a[4], a[5], a[6], a[2], a[7]])
        })
        const use = actions.filter((act) => ((act[0] === year) && (act[5] === "Use")))
        use.map((a) => {
          new_act.push([a[0], a[3], a[4], a[5], a[6], a[2], a[7]])
        })
        const sell = actions.filter((act) => ((act[0] === year) && (act[5] === "Sell")))
        sell.map((a) => {
          new_act.push([a[0], a[3], a[4], a[5], a[6], a[2], a[7]])
        })
      }
              
      return new_act
    }

    // implement search
    const search2 = async () => {
      let actions2 = []
      let cars_step2 = structuredClone(curCar)
      for (let year = allData.startYear; year <= allData.endYear; year++) {
        let car_left = structuredClone(cars_step2)
        
        const carbon_reduced = ((100-allData.emissionReductionTarget)/100)**(year-allData.startYear)
        const target_emission = allData.startEmission*carbon_reduced
        const cur_demand = await compute_demand(year)

        // buy and use cars
        let total_emission = 0
        let all_use_actions = []
        let all_buy_actions = []
        for (const [s, s_demand] of Object.entries(cur_demand)) {
          let buy_actions = {}, use_actions = []

          const can_use_car = sort_best_usage(year, car_left[s])
          const [avail_car, four_ineff] = get_4inefficient_car(can_use_car)

          for (const [d, demand] of Object.entries(s_demand)) {
            const idx = parseInt(d[1]) - 1;
            if (four_ineff.length === idx) break
            const car1 = await get_best_cars(year, s, true, 0, d)

            const left_over_dist = cur_demand[s][d] % car1.yearRange
            const [car_id_x, fuel_x, y_r_x, ek_x] = four_ineff[idx]
            use_actions.push([year, car_id_x, 1, "Use", fuel_x, d, left_over_dist])
            total_emission += left_over_dist*ek_x
            cur_demand[s][d] -= left_over_dist
          }

          // use the rest to fullfill all demand with max capacity from d4 down to d1
          let car_idx = 0
          for (let d_idx = 4; d_idx > 0; d_idx--) {
            const d = `D${d_idx}`
            while ((car_idx < avail_car.length) && (cur_demand[s][d] > 0)) {
              const [car_id_x, num_x, fuel_x, y_r_x, ek_x] = avail_car[car_idx]
              let need_to_use = 0;
              if (y_r_x*num_x >= cur_demand[s][d]){
                need_to_use = Math.floor(cur_demand[s][d] / y_r_x)
              }
              else {
                need_to_use = num_x
              }
              use_actions.push([year, car_id_x, need_to_use, "Use", fuel_x, d, y_r_x])
              total_emission += need_to_use * y_r_x * ek_x
              cur_demand[s][d] -= need_to_use * y_r_x
              avail_car[car_idx][1] -= need_to_use

              if (avail_car[car_idx][1] == 0) {car_idx += 1}
            }
          }

          // buy if we need more and use
          for (const [d, demand] of Object.entries(s_demand)) {
            if (cur_demand[s][d] > 0) {
              const car1 = await get_best_cars(year, s, true, 0, d)
              const car_id1 = `${car1.vehicle}_${car1.size}_${car1.year}-${car1.fuel}`

              const max_use_buy = Math.floor(cur_demand[s][d]/car1.yearRange)
              if (max_use_buy){
                if (!(car_id1 in buy_actions)) buy_actions[car_id1] = 0
                buy_actions[car_id1] += max_use_buy
                use_actions.push([year, car_id1.split("-")[0], max_use_buy, "Use", car1.fuel, d, car1.yearRange])
                total_emission += max_use_buy*car1.yearRange*car1.emissionKm
              }

              const leftover_dist = cur_demand[s][d]%car1.yearRange
              if (leftover_dist > 0) {
                const car2 = await get_best_cars(year, s, false, leftover_dist, d)
                const leftover_use_buy = Math.ceil(leftover_dist/car2.yearRange)
                const car_id2 = `${car2.vehicle}_${car2.size}_${car2.year}-${car2.fuel}`
                if (!(car_id2 in buy_actions)) buy_actions[car_id2] = 0
                buy_actions[car_id2] += leftover_use_buy
                use_actions.push([year, car_id2.split("-")[0], leftover_use_buy, "Use", car2.fuel, d, leftover_dist/leftover_use_buy])
                total_emission += leftover_dist*car2.emissionKm
              }

            }
          }
          
          for (const [car_id, num] of Object.entries(buy_actions)) {
            all_buy_actions.push([year, car_id.split("-")[0], num, "Buy", "", "", 0])
            car_left[s].push([get_car_by_id(car_id), num])
          }
          
          all_use_actions.push(...use_actions)
        }

        // removing 20% cars
        if (year !== allData.startYear) {
          const [new_car_left, target_sell, new_buy_actions, updated_use_actions] = await remove_20percent_usebase(all_use_actions)
          let all_sell_actions = []
          for (const [car_id, num] of Object.entries(target_sell)) {
            const [ID, car_f] = fuelID_to_carID(car_id)
            all_sell_actions.push([year-1, ID, target_sell[car_id], "Sell", "", "", 0])
          }
          all_use_actions = updated_use_actions
          all_buy_actions.push(...new_buy_actions)
          actions2.push(...all_sell_actions)
          car_left = new_car_left
          console.log(year-1, "sell", all_sell_actions)
        }
        cars_step2 = car_left

        const [new_total_emission, good_use_actions] = adjust_use_actions(all_use_actions, total_emission, target_emission)
        actions2.push(...all_buy_actions)
        actions2.push(...good_use_actions)
        console.log(year, "buy", all_buy_actions)
        console.log(year, "use before", all_use_actions)
        console.log(year, "use", good_use_actions)
        console.log(year, "emission", total_emission, new_total_emission, target_emission, new_total_emission <= target_emission)

      }

      // final sell: remove all the most expensive car
      let all_sell_actions = []
      const [sellOrder, total_car] = sort_by_price(allData.endYear, cars_step2)
      let target_sell = Math.floor(total_car*allData.maxSellFleet/100) // change later with rule
      let idx = 0
      while (target_sell && (idx < sellOrder.length)) {
        if (sellOrder[idx][2] >= target_sell) {
          target_sell = 0
          all_sell_actions.push([allData.endYear, sellOrder[idx][1], target_sell, "Sell", "", "", 0])
        }
        else {
          target_sell -= sellOrder[idx][2]
          all_sell_actions.push([allData.endYear, sellOrder[idx][1], sellOrder[idx][2], "Sell", "", "", 0])
        }
        idx += 1
      }
      actions2.push(...all_sell_actions)

      return actions2
    }
    const df = await search2();
    const submit = summarize_submission(df);
    console.log("result", submit)
    dispatch(setValue({type: "storeVar", target: "result",
                        payload: submit}))
    setTimeout(() => {
      setLoading(false)
    }, 1000);
  }

  const clickReset = () => {
    for (const [key, val] of Object.entries(baseData)) {
      dispatch(setValue({type: "storeVar", target: key, payload: val}))
    }
    dispatch(setValue({type: "storeVar", target: "result", payload: []}))
  }

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target.result);
        for (const [key, val] of Object.entries(json)) {
          dispatch(setValue({type: "storeVar", target: key, payload: val}))
        }
      } catch (err) {
        console.error("Error parsing JSON:", err);
      }
    };

    if (file) {
      reader.readAsText(file);
    }
  };

  const importData = () => {
    fileInputRef.current.click();
  };

  return (
    <div>
      {loading && <LoadingSpinner />}
      <Container className='p-2 mt-4 mb-2 w-50' style={{minWidth: '700px'}}>
        <h1 className='text-center'>Shell Fleet Zero AI</h1>
        <YearSelector />
        <MyStatus />
        <MarketStatus />

        <Row className='mt-3'>
          <h6>Rules:</h6>
          <Form>
            <Form.Check // prettier-ignore
                type='checkbox'
                id='optimize-end'
                label={`Optimize sell expensive asset at end of the year`}
                className='mb-2'
            />

            <InputGroup className="mb-3">
              <InputGroup.Text id="basic-addon3">
                Max sell fleet per year:
              </InputGroup.Text>
              <Form.Control id="basic-url" type="number" value={maxSellFleet}
                min={1} max={100} aria-describedby="basic-addon3"
                onChange={(e) => {
                  setMaxSellFleet(e.target.value)
                  dispatch(setValue({type: "storeVar", target: "maxSellFleet",
                    payload: parseInt(e.target.value)
                  }))
                }}
              />
              <InputGroup.Text>%</InputGroup.Text>
            </InputGroup>


            <InputGroup className="mb-3">
              <InputGroup.Text id="basic-addon3">
                Max age fleet has to sell:
              </InputGroup.Text>
              <Form.Control id="basic-url" type="number" value={maxAgeFleet}
                min={1} max={100} aria-describedby="basic-addon3"
                onChange={(e) => {
                  setMaxAgeFleet(e.target.value)
                  dispatch(setValue({type: "storeVar", target: "maxAgeFleet",
                    payload: parseInt(e.target.value)
                  }))
                }}
              />
              <InputGroup.Text>year(s)</InputGroup.Text>
            </InputGroup>

          </Form>
        </Row>
        <Row xs="auto">
          <Col>
              <Button variant="danger" onClick={clickReset}>
                <RestartAltIcon/> Reset
              </Button>
          </Col>
          <Col>
              <Button variant="success" onClick={importData}>
                <UploadIcon/> Import
              </Button>
              <input
                type="file"
                accept=".json"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileUpload}
              />
          </Col>
        </Row>

        <hr></hr>
        <Col className='text-center mb-4'>
          <Button variant="primary" className='btn-add' type="submit" size="lg" onClick={calculate}>
            Calculate
          </Button>
        </Col>
        
        <Dashboard />
      </Container>
    </div>
  );
};