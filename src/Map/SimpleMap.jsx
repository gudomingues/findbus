import React,{Component, State, useState} from 'react';
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';
import Search from '../Search';
import './index.css';

 function SimpleMap(props)  {
  const [latitude, setLatitude ] = useState(-23.563259139137);
  const [longitude, setLongitude] = useState(-46.63241903509958);
  const [infoVisible, setInfoVisible] = useState(false);
  const [placeInfo, setPlaceInfo] = useState('Centro');
  const [showInfo, setShowInfo] = useState(false);

 const state = {
    showingInfoWindow: infoVisible,
    activeMarker: {},
    selectedPlace: {},
  };
  
  
  const setMap = (latitude, longitude, nomeParada) =>{
    setLatitude(latitude);
    setLongitude(longitude);
    setPlaceInfo(nomeParada);
  }

  const setInfo = () =>{
    return showInfo ? 'block' : 'none';
  }
  return (
     <div>
        <p className="info" style={{display: setInfo()}}>Nome da Parada: {placeInfo}</p>

      <Map onClick={() =>{
      setShowInfo(false);
      }} google={props.google}
      google={props.google}
      initialCenter={{
        lat: latitude,
        lng: longitude
      }
    }
    center={{
        lat: latitude,
        lng: longitude
        
      }}
      zoom={15}>
            
        <Marker onClick={()=>{
         setShowInfo(true);
        }}
        position = {{
          lat: latitude,
          lng: longitude,
        }}/>
            
        <Search setMap={setMap}/>
       
        <InfoWindow
          marker={state.activeMarker}
          visible={state.showingInfoWindow}>
            <div>
              <h1>{state.selectedPlace.name}</h1>
            </div>
        </InfoWindow>
      </Map>
            </div>
    )
  }

 
export default GoogleApiWrapper({
  apiKey: ('AIzaSyBmcBxeaUVZOJBIiuwD6yOlZJv7JPz2lqc')
})(SimpleMap)