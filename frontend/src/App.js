import './App.css';

import React, { useState } from 'react';

import axios from 'axios';
import MyChart from './Chart';
import Map from './Map';

const apiUrl = process.env.REACT_APP_API_URL;

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

  const [file, setFile] = useState(0);
  const [tg, setTG] = useState(1);
  const [process, setProcess] = useState([]);
  const [chartstate, setChartstate] = useState(false);
  // const [mapstate, setMapstate] = useState(null);
  const [fractions, setFractions] = useState([]);
  const [datastate, setDatastate] = useState(false);

  function handleChange(event) {
    if (event.target.files[0] && event.target.files[0].type === 'application/json') {
      setFile(event.target.files[0]);
      setChartstate(false);
    } else {
      // Show error to user about invalid file type
    }
  }

  function handleTG(event) {
    const value = parseInt(event.target.value);
    if (!isNaN(value) && value > 0) {
      setTG(value);
    }
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

    const config = {
      headers: {
        'content-type': 'multipart/form-data'
      }
    };

    axios.post(url, formData, config)
      .then((response) => {
        setFractions(response.data.fractions);
        console.log(response.data);
        setProcess(response.data.process);
        setDatastate(false);
      })
      .catch(error => {
        console.error('Error processing file:', error);
        setDatastate(false);
      });
  }

  function visulizeProcess() {
    if (process.length !== 0) {
      setChartstate(true);
    }
  };

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
        <datalist id="defaultNumbers">
          <option value="1"></option>
          <option value="10"></option>
          <option value="2"></option>
          <option value="30"></option>
        </datalist>
        <br></br>
        <br></br>
        <button type="submit">Submit</button>
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
      <h2>Generated Map</h2>
      <div>
        <Map
          initStatus={initStatus}
          // Component={Circle}
          data={fractions}
        />
      </div>
    </div>
  );
}

export default App;