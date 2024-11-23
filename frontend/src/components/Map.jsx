import React from 'react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import "leaflet/dist/leaflet.css"
import { latLngBounds, Icon } from 'leaflet'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Configure default icon
delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});


const Map = ({items}) => {  
  // Default center (fallback coordinates)
  const defaultCenter = [22.521437, 88.425290]; 
  
  // calculaing bounds only if items exist and have valid coordinates
  const bounds = items?.length > 0 ? 
    latLngBounds(
      items
        .filter(item => item?.lat && item?.lon)
        .map(item => [Number(item.lat), Number(item.lon)])
    ) : null;

  // calculating center with fallback
  const center = bounds?.isValid() ? 
    bounds.getCenter() : 
    defaultCenter;

  const MapEffect = () => {
    const map = useMap();
    
    useEffect(() => {
      map.invalidateSize();
      
      if (items?.length > 1 && bounds?.isValid()) {
        map.fitBounds(bounds, {
          padding: [50, 50],
          maxZoom: 15
        });
      } else if (items?.length === 1 && items[0]?.lat && items[0]?.lon) {
        map.setView([items[0].lat, items[0].lon], 5);
      }
    }, [map, items]);
    
    return null;
  };



  return (
    <MapContainer 
      center={items.length === 1 ? [items[0].lat, items[0].lon] : center}
      scrollWheelZoom={true}
      className='w-full h-full rounded-md shadow-md'
    >
    <MapEffect />
    <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    {items.map((item) => (
      <Marker position={[item.lat, item.lon]} key={item.id}>
        <Popup>
          <div className='flex  gap-2'>
            <img src={item.images[0]} alt="" className='flex w-28 h-28 p-4   object-cover rounded-md' />
            <div className='flex flex-col'>
              <Link to={`/${item.id}`} className='font-bold text-xl'>{item.title}</Link>
              <p>{item.address}</p>
              <p >$ {item.price}</p>
            </div>
          </div>
        </Popup>
      </Marker>
    ))}
  </MapContainer>
  )
}

export default Map