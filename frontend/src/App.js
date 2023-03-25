import './App.css';

import React, { useState, useEffect } from 'react';

import axios from 'axios';
// import $ from 'jquery';
import MyChart from './Chart';
import Map from './Map';
import Circle from './components/Circle';

const apiUrl = process.env.REACT_APP_API_URL;
const apiKey = process.env.REACT_APP_GOOGLE_API_KEY;

axios.get(apiUrl)
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.log(error);
  });

const initStatus = {
  zoom: 6,
  center: {
    lat: 65.25,
    lng: 24.75,
  },
}

function App() {
  let chart = null;

  const [file, setFile] = useState(0);
  const [tg, setTG] = useState(1);
  const [process, setProcess] = useState([]);
  const [chartstate, setChartstate] = useState(false);
  // const [mapstate, setMapstate] = useState(null);
  const [fractions, setFractions] = useState([]);
  const [datastate, setDatastate] = useState(false);

  function handleChange(event) {

    setFile(event.target.files[0]);
    setChartstate(false);
    // setMapstate(false);
    // console.log(file.filename)

    // setFileName(event.target.files[0].name)
  }


  function handleTG(event) {
    setTG(event.target.value);
    // console.log(tg);

    // setFileName(event.target.files[0].name)
  }

  function handleSubmit(event) {
    setDatastate(true);
    event.preventDefault();

    const url = `${apiUrl}/process`;

    const formData = new FormData();

    formData.append('file', file);
    formData.append('timegranu', tg);
    console.log(formData.getAll("timegranu"));
    console.log(formData);


    // formData.append('fileName', file.filename);

    const config = {

      headers: {

        'content-type': 'multipart/form-data; boundary=----WebKitFormBoundaryTorHrryEzMAgU0CD'
        // 'content-type': 'application/json',
      },

    };

    axios.post(url, formData, config).then((response) => {

      setFractions(response.data.fractions);
      console.log(response.data);
      setProcess(response.data.process);
      console.log(process);

    });

  }



  function visulizeProcess() {
    if (process.length !== 0) {
      setChartstate(true);
      setDatastate(false);
    }
  };
  // function generateMap() {
  //   if (fractions.length !== 0) {
  //     setMapstate(true);
  //   }
  // };





  return (

    <div className="App">
      <h1>Wind Power Map of Finland</h1>

      <form method="post" onSubmit={handleSubmit}>
        <label>Upload a load process profile which is a list stored as json file:</label>
        <input type="file" onChange={handleChange}></input>
        <br></br>
        <br></br>
        <label htmlFor="name">Time granularity of the process (min):</label>
        <input id="ticketNum" type="number" name="ticketNum" list="defaultNumbers" onChange={handleTG} />
        {/* <span class="validity"></span> */}

        <datalist id="defaultNumbers">
          <option value="1"></option>
          <option value="10"></option>
          <option value="2"></option>
          <option value="30"></option>
        </datalist>
        <br></br>
        <br></br>
        <button type="submit" onSubmit={handleSubmit}>Submit</button>
      </form>

      <br></br>
      {datastate
        ? <div>Processing data ...</div>
        : <div>Waiting for new process</div>
      }

      <hr />
      <button onClick={visulizeProcess}>Visulize the process</button>
      <h2>Visulized Load Process</h2>
      {chartstate
        ? <div>
          <MyChart data={process} />
        </div>
        : <div>No process yet...</div>
      }
      <hr />
      {/* <button onClick={generateMap}>Generate map</button> */}
      <h2>Generated Map</h2>
      {/* {mapstate */}
        {/* ?  */}
        <div>
          <Map
            apiKey={apiKey}
            initStatus={initStatus}
            Component={Circle}
            data={fractions}
          /> </div >
        {/* : <div>No map generated yet </div>} */}

    </div>

  );

}

export default App;