import { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import apiRequest from "../utils/apiRequest.js";
import CloudinaryUploadWidget from "../components/CloudinaryUploadWidget.jsx";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useStore } from "../store/store.js";
import { MapContainer, TileLayer, Marker, useMapEvents, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import axios from "axios";
import { Tooltip } from "react-tooltip";

const API_URL = import.meta.env.VITE_API_URL;

function CreatePost() {
  const { user } = useStore();
  const location = useLocation();
  const [postId, setPostId] = useState(null);
  const [title , setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [bedroom, setBedroom] = useState("");
  const [bathroom, setBathroom] = useState("");
  const [propertyType, setPropertyType] = useState("apartment");
  const [type, setType] = useState("rent");
  const [furniture, setFurniture] = useState("owner");
  const [petPolicy, setPetPolicy] = useState("allowed");
  const [rentPolicy, setRentPolicy] = useState("");
  const [city , setCity] = useState("");
  const [size, setSize] = useState("");
  const [school, setSchool] = useState("");
  const [bus, setBus] = useState("");
  const [restaurant, setRestaurant] = useState("");
  const [descValue, setDescValue] = useState("");
  const [images, setImages] = useState([]);
  const [error, setError] = useState("");
  const [isImagePreviewVisible, setIsImagePreviewVisible] = useState(true);
  const [address, setAddress] = useState('');
  const [searchAddress, setSearchAddress] = useState('');
  const [lat, setLat] = useState('');
  const [lon, setLon] = useState('');
  const [mapPosition, setMapPosition] = useState([22.521437, 88.425290]);
  const [markerPosition, setMarkerPosition] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [postData, setPostData] = useState({});
  const [postDetails, setPostDetails] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isCreating, setIsCreating] = useState(false);


  const navigate = useNavigate();
  
  useEffect(() => {
    if (user.role !== "SELLER" || user.role === "ADMIN") {
      toast.error("You need to be a seller to create a listing!")
      navigate("/profile");
    }
  }, [user, navigate]);

  useEffect(() => {
    // Get post ID from URL
    setIsLoading(true);
  
    const fetchPostData = async (id) => {
      try {
        const token = localStorage.getItem('jwt-shoobestate');
  
        const res = await apiRequest.get(`${API_URL}/api/posts/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (res.data.post === null || res.status === 404) {
          navigate('/create-post');
          return;
        }
  
        // console.log('res.data: ', res.data);
  
        // Destructure the response
        const { PostDetails, ...postWithoutDetails } = res.data.post;
  
        // Set states
        setPostData(postWithoutDetails);
        setPostDetails(PostDetails);
  
        // Check if the current user is the owner
        if (postWithoutDetails.userID !== user.id) {
          toast.error('You are not authorized to edit this post.');
          navigate(`/${id}`);
          return;
        }
  
        // Populate form fields
        setTitle(postWithoutDetails.title);
        setPrice(postWithoutDetails.price);
        setBedroom(postWithoutDetails.bedroom);
        setBathroom(postWithoutDetails.bathroom);
        setPropertyType(postWithoutDetails.propertyType);
        setType(postWithoutDetails.type);
        setFurniture(PostDetails.furnitures);
        setPetPolicy(PostDetails.petPolicy);
        setRentPolicy(PostDetails.rentPolicy);
        setSize(PostDetails.size);
        setSchool(PostDetails.schoolDist);
        setBus(PostDetails.busStopDist);
        setRestaurant(PostDetails.restaurantDist);
        setCity(postWithoutDetails.city);
        setAddress(postWithoutDetails.address);
        setDescValue(PostDetails.description);
        setImages(postWithoutDetails.images);
        setLat(postWithoutDetails.lat);
        setLon(postWithoutDetails.lon);
        setMapPosition([parseFloat(postWithoutDetails.lat), parseFloat(postWithoutDetails.lon)]);
        setMarkerPosition([parseFloat(postWithoutDetails.lat), parseFloat(postWithoutDetails.lon)]);
        setSearchAddress(postWithoutDetails.address);

  
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        toast.error('Failed to fetch post data.');
        setIsLoading(false);
      }
    };
  
    const searchParams = new URLSearchParams(location.search);
    const id = searchParams.get('id');
    if (id) {
      setPostId(id);
      fetchPostData(id);
    } else {
      setIsLoading(false);
    }
  }, [location.search, user]);


  
  // useEffect(() => {
  //   const deleteExistingImages = async () => {
  //     try {
  //       const imageURLs = localStorage.getItem("imageURLs");
  //       if (imageURLs.length > 0) {
  //         console.log("Existing images found. Deleting...");
  //       } else {
  //         console.log("No existing images found.");
  //         return;
  //       }

  //       const res = await apiRequest.post(`${API_URL}/api/util/existing-images`, {
  //         imageURLs: JSON.parse(imageURLs),
  //       });
  //       // console.log(res.data);
  //       localStorage.removeItem("imageURLs");
  //       console.log("Existing images deleted.");
  //       return;
        
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };

  //   deleteExistingImages();
  // }, []);


  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const inputs = Object.fromEntries(formData);
    // console.log(inputs);

    if (images.length < 2) {
      setError("Please upload at least two images.");
      toast.error("Please upload at least two images.");
      return;
    }

    if(postData) {
      const toastId = toast.loading("Updating post...", { autoClose: false });
      setIsUpdating(true);
      try {
        const res = await apiRequest.put(`${API_URL}/api/posts/${postId}`, {
          postData: {
            title: inputs.title,
            price: parseInt(inputs.price),
            address: inputs.address,
            city: inputs.city,
            images: images,
            bedroom: parseInt(inputs.bedroom),
            bathroom: parseInt(inputs.bathroom),
            lat: inputs.latitude,
            lon: inputs.longitude,
            propertyType: inputs.propertyType,
            type: inputs.type,
          },
          postDetails: {
            description: descValue,
            furnitures: inputs.furniture,
            petPolicy: inputs.petPolicy,
            rentPolicy: inputs.rentPolicy,
            size: parseInt(inputs.size),
            schoolDist: parseInt(inputs.school),
            busStopDist: parseInt(inputs.bus),
            restaurantDist: parseInt(inputs.restaurant),
          },
        });

        localStorage.removeItem("imageURLs");
        toast.dismiss(toastId);
        toast.success(res.data.message);
        setIsUpdating(false);
        navigate("/" + res.data.id);
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || "An error occurred. Please try again.";
        console.log(errorMessage);
        toast.dismiss(toastId);
        toast.error(errorMessage);
        setIsUpdating(false);
        setError(errorMessage);
      }
      return;
    }

    const toastId = toast.loading("Creating post...", { autoClose: false });
    setIsCreating(true);
    try {
      const res = await apiRequest.post(`${API_URL}/api/posts/create-post`, {
        postData: {
          title: inputs.title,
          price: parseInt(inputs.price),
          address: inputs.address,
          city: inputs.city,
          images: images,
          bedroom: parseInt(inputs.bedroom),
          bathroom: parseInt(inputs.bathroom),
          lat: inputs.latitude,
          lon: inputs.longitude,
          propertyType: inputs.propertyType,
          type: inputs.type,
        },
        postDetails: {
          description: descValue,
          furnitures: inputs.furniture,
          petPolicy: inputs.petPolicy,
          rentPolicy: inputs.rentPolicy,
          size: parseInt(inputs.size),
          schoolDist: parseInt(inputs.school),
          busStopDist: parseInt(inputs.bus),
          restaurantDist: parseInt(inputs.restaurant),
        },
      });

      localStorage.removeItem("imageURLs");
      toast.dismiss(toastId);
      toast.success(res.data.message);
      setIsCreating(false);
      navigate("/" + res.data.id);
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "An error occurred. Please try again.";
      console.log(errorMessage);
      toast.dismiss(toastId);
      toast.error(errorMessage);
      setIsCreating(false);
      setError(errorMessage);
    }
  };

  // getting latitude and longitude from address using OpenStreetMap API
  const handleAddressSearch = async () => {
    const toastId = toast.loading("Fetching coords...", { autoClose: false });
    try {
      const response = await axios.get('https://nominatim.openstreetmap.org/search', {
        params: {
          q: searchAddress,
          format: 'json',
        },
      });
      console.log("response data: ",response.data);

      const uniqueResults = response.data.filter((item, index, self) =>
        index === self.findIndex((t) => t.display_name === item.display_name)
      );

      console.log("uniqueResults: ",uniqueResults);

      if (uniqueResults.length === 1) {
        const { lat, lon } = uniqueResults[0];
        setLat(lat);
        setLon(lon);
        setSearchAddress(uniqueResults[0].display_name);

        toast.dismiss(toastId); 
        toast.success('Latitude: ' + lat + ', Longitude: ' + lon);

        setMapPosition([parseFloat(lat), parseFloat(lon)]);
        setMarkerPosition([parseFloat(lat), parseFloat(lon)]);
      } 
      else if(uniqueResults.length > 1) {
        toast.dismiss(toastId); 
        toast.success('Multiple addresses found. Please select one.');
        setSearchResults(uniqueResults);
      }
        else {
        toast.dismiss(toastId);
        toast.error(response.data.message || 'Address not found.');
      }
    } catch (error) { 
      toast.dismiss(toastId);
      toast.error(error || 'An error occurred. Please try again.');
    }
  };

  const handleSelectAddress = (result) => {
    const { lat, lon } = result;
    setLat(lat);
    setLon(lon);
    setSearchAddress(result.display_name);

    setMapPosition([parseFloat(lat), parseFloat(lon)]);
    setMarkerPosition([parseFloat(lat), parseFloat(lon)]);
    setSearchResults([]); // Clear results after selection
    toast.success('Location selected.');
  };
  
  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        console.log(e.latlng);

        const { lat, lng } = e.latlng;
        setMarkerPosition([lat, lng]);
        setLat(lat);
        setLon(lng);
      },
    });

    const customIcon = new Icon({
      iconUrl: markerIcon,
      iconRetinaUrl: markerIcon2x,
      shadowUrl: markerShadow,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
  

    return markerPosition === null ? null : (
      <Marker position={markerPosition} icon={customIcon}>
        <Popup>
          <div className="flex flex-col">
            <span className="font-semibold text-base">Latitude: {lat}</span>
            <span className="font-semibold text-base">Longitude: {lon}</span>
          </div>
        </Popup>
      </Marker>
    );
  };


  if (isLoading) {
    return <div className="flex justify-center items-center bg-white h-screen">
      <span className="loader" />
    </div> 
  }

  return (
    <div className="flex h-full flex-col lg:flex-row">
    <div className="flex-1 overflow-scroll p-8">
      <h1 className="text-2xl font-bold mb-6">Add New Post</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label htmlFor="title" className="block font-medium mb-1">Title</label>
            <input
              id="title"
              name="title"
              type="text"
              required
              min={1}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="p-4 w-full border border-gray-300 rounded"
            />
            <Tooltip anchorSelect="#title" place="top" type="dark" className="z-10" delayShow={450}>
              <img src="./assests/title.webp" className="px-1 py-2 h-72 w-72 md:h-96 md:w-96 "/>
            </Tooltip>
          </div>

          <div>
            <label htmlFor="price" className="block font-medium mb-1">Price</label>
            <input
              id="price"  
              name="price"
              type="number"
              required
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="p-4 w-full border border-gray-300 rounded"
            />
            <Tooltip anchorSelect="#price" place="top" type="dark" className="z-10" delayShow={450}> 
              <img src="./assests/price.webp" className="px-1 py-2 h-72 w-72 md:h-96 md:w-96"/>
            </Tooltip>
          </div>

          <div className="col-span-1 md:col-span-2 lg:col-span-3">
            <label htmlFor="address" className="block font-medium mb-1">Address</label>
            <input
              id="address"
              name="address"
              type="text"
              required
              min={6}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="p-4 w-full border border-gray-300 rounded"
            />
            <Tooltip anchorSelect="#address" place="top" type="dark" className="z-10" delayShow={450}> 
              <img src="./assests/address.webp" className="px-1 py-2 h-72 w-72 md:h-96 md:w-96"/>
            </Tooltip>
          </div>

          <div className="col-span-1 md:col-span-2 lg:col-span-3 mb-10">
            <label htmlFor="desc" className="block font-medium mb-1">Description</label>
            <ReactQuill
              theme="snow"
              value={descValue}
              onChange={setDescValue}
              className="h-52"
              min={1}
              id="desc"
            />
            <Tooltip anchorSelect="#desc" place="top" type="dark" className="z-10" delayShow={450}> 
              <img src="./assests/description.webp" className="px-1 py-2 h-72 w-72 md:h-96 md:w-96"/>
            </Tooltip>
          </div>

          <div>
            <label htmlFor="city" className="block font-medium mb-1">Location</label>
            <input
              id="city"
              name="city"
              type="text"
              min={1}
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="p-4 w-full border border-gray-300 rounded"
            />
            <Tooltip anchorSelect="#city" place="top" type="dark" className="z-10 ">
              This is used for searching purposes, Write comma separated values, eg. "Kolkata, West Bengal"
            </Tooltip>
          </div>

          <div>
            <label htmlFor="bedroom" className="block font-medium mb-1">No. of Bedrooms</label>
            <input
              id="bedroom"
              name="bedroom"
              type="number"
              min={1}
              value={bedroom}
              onChange={(e) => setBedroom(e.target.value)}
              className="p-4 w-full border border-gray-300 rounded"
            />
            <Tooltip anchorSelect="#bedroom" place="top" type="dark" className="z-10" delayShow={450}> 
              <img src="./assests/bedroom.webp" className="px-1 py-2 h-72 w-72 md:h-96 md:w-96"/>
            </Tooltip>
          </div>

          <div>
            <label htmlFor="bathroom" className="block font-medium mb-1">No. of Bathrooms</label>
            <input
              id="bathroom"
              name="bathroom"
              type="number"
              min={1}
              value={bathroom}
              onChange={(e) => setBathroom(e.target.value)}
              className="p-4 w-full border border-gray-300 rounded"
            />
            <Tooltip anchorSelect="#bathroom" place="top" type="dark" className="z-10" delayShow={450}> 
              <img src="./assests/bathroom.webp" className="px-1 py-2 h-72 w-72 md:h-96 md:w-96"/>
            </Tooltip>
          </div>

          <div>
            <label htmlFor="latitude" className="block font-medium mb-1">Latitude</label>
            <input
              id="latitude"
              name="latitude"
              type="text"
              required
              value={lat}
              onChange={(e) => setLat(e.target.value)}
              className="p-4 w-full border border-gray-300 rounded"
            />
            <Tooltip anchorSelect="#latitude" place="top" type="dark" className="z-10">
              Used to plot on map
            </Tooltip>
          </div>

          <div>
            <label htmlFor="longitude" className="block font-medium mb-1">Longitude</label>
            <input
              id="longitude"
              name="longitude"
              type="text"
              required
              value={lon}
              onChange={(e) => setLon(e.target.value)}
              className="p-4 w-full border border-gray-300 rounded"
            />
            <Tooltip anchorSelect="#longitude" place="top" type="dark" className="z-10">
              Used to plot on map
            </Tooltip>
          </div>

          <div>
            <label htmlFor="type" className="block font-medium mb-1">Type</label>
            <select name="type" id="type" className="p-4 w-full border border-gray-300 rounded"
            value={type}
            onChange={(e) => setType(e.target.value)}
            >
              <option value="rent" defaultChecked>Rent</option>
              <option value="buy">Buy</option>
            </select>
            <Tooltip anchorSelect="#type" place="top" type="dark" className="z-10">
              Used for searching
            </Tooltip>
          </div>

          <div>
            <label htmlFor="propertyType" className="block font-medium mb-1">Property Type</label>
            <select name="propertyType" id="propertyType" className="p-4 w-full border border-gray-300 rounded"
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
            >
              <option value="apartment">Apartment</option>
              <option value="house">House</option>
              <option value="condo">Condo</option>
              <option value="land">Land</option>
            </select>
            <Tooltip anchorSelect="#propertyType" place="top" type="dark" className="z-10" delayShow={450}> 
              <img src="./assests/propertyType.webp" className="px-1 py-2 h-72 w-72 md:h-96 md:w-96"/>
            </Tooltip>
          </div>

          <div>
            <label htmlFor="furniture" className="block font-medium mb-1">Furniture Policy</label>
            <select name="furniture" id="furniture" className="p-4 w-full border border-gray-300 rounded"
            value={furniture}
            onChange={(e) => setFurniture(e.target.value)}
            >
              <option value="owner">Owner is responsible</option>
              <option value="tenant">Tenant is responsible</option>
              <option value="shared">Shared</option>
            </select>
            <Tooltip anchorSelect="#furniture" place="top" type="dark" className="z-10" delayShow={450}> 
              <img src="./assests/furniture.webp" className="px-1 py-2 h-72 w-72 md:h-96 md:w-96"/>
            </Tooltip>
          </div>

          <div>
            <label htmlFor="petPolicy" className="block font-medium mb-1">Pet Policy</label>
            <select name="petPolicy" id="pet" className="p-4 w-full border border-gray-300 rounded"
            value={petPolicy}
            onChange={(e) => setPetPolicy(e.target.value)}
            >
              <option value="allowed">Allowed</option>
              <option value="not-allowed">Not Allowed</option>
            </select>
            <Tooltip anchorSelect="#pet" place="top" type="dark" className="z-10" delayShow={450}> 
              <img src="./assests/pet.webp" className="px-1 py-2 h-72 w-72 md:h-96 md:w-96"/>
            </Tooltip>
          </div>

          <div>
            <label htmlFor="rentPolicy" className="block font-medium mb-1">Rent Policy</label>
            <input
              id="rentPolicy"
              name="rentPolicy"
              type="text"
              placeholder="Rent Policy"
              value={rentPolicy}
              onChange={(e) => setRentPolicy(e.target.value)}
              className="p-4 w-full border border-gray-300 rounded"
            />
            <Tooltip anchorSelect="#rentPolicy" place="top" type="dark" className="z-10" delayShow={450}> 
              <img src="./assests/rent.webp" className="px-1 py-2 h-72 w-72 md:h-96 md:w-96"/>
            </Tooltip>
          </div>

          <div>
            <label htmlFor="size" className="block font-medium mb-1">Total Size (sqft)</label>
            <input
              id="size"
              name="size"
              type="number"
              min={0}
              value={size}
              onChange={(e) => setSize(e.target.value)}
              className="p-4 w-full border border-gray-300 rounded"
            />
            <Tooltip anchorSelect="#size" place="top" type="dark" className="z-10" delayShow={450}> 
              <img src="./assests/area.webp" className="px-1 py-2 h-72 w-72 md:h-96 md:w-96"/>
            </Tooltip>
          </div>

          <div>
            <label htmlFor="school" className="block font-medium mb-1">School Distance (in m)</label>
            <input
              id="school"
              name="school"
              type="number"
              min={0}
              value={school}
              onChange={(e) => setSchool(e.target.value)}
              className="p-4 w-full border border-gray-300 rounded"
            />
            <Tooltip anchorSelect="#school" place="top" type="dark" className="z-10" delayShow={450}> 
              <img src="./assests/schoolDist.webp" className="px-1 py-2 h-72 w-72 md:h-96 md:w-96"/>
            </Tooltip>
          </div>
          <div>
            <label htmlFor="bus" className="block font-medium mb-1">Bus Distance (in m)</label>
            <input
              id="bus"
              name="bus"
              type="number"
              min={0}
              value={bus}
              onChange={(e) => setBus(e.target.value)}
              className="p-4 w-full border border-gray-300 rounded"
            />
            <Tooltip anchorSelect="#bus" place="top" type="dark" className="z-10" delayShow={450}> 
              <img src="./assests/busDist.webp" className="px-1 py-2 h-72 w-72 md:h-96 md:w-96"/>
            </Tooltip>
          </div>
          <div>
            <label htmlFor="restaurant" className="block font-medium mb-1">Restaurant Distance (in m)</label>
            <input
              id="restaurant"
              name="restaurant"
              type="number"
              min={0}
              value={restaurant}
              onChange={(e) => setRestaurant(e.target.value)}
              className="p-4 w-full border border-gray-300 rounded"
            />
            <Tooltip anchorSelect="#restaurant" place="top" type="dark" className="z-10" delayShow={450}> 
              <img src="./assests/restaurantDist.webp" className="px-1 py-2 h-72 w-72 md:h-96 md:w-96"/>
            </Tooltip>
          </div>
        </div>

      <div className="mt-6">
        <h2 className="text-xl font-bold mb-4">Get Location Coords</h2>
        {/* Method 1: Via Address */}
        <div className="mb-4">
          <label className="block font-semibold mb-2">Enter location of address to get latitude and longitude:</label>
          <input
            type="text"
            className="p-2 w-full border border-gray-300 rounded"
            placeholder="Enter location address"
            value={searchAddress}
            onChange={(e) => setSearchAddress(e.target.value)}
          />
          <button
            aria-label="Get Latitude and Longitude"
            type="button"
            className="mt-2 p-2 bg-yellow-500 text-black font-bold hover:bg-yellow-600 transition-all rounded"
            onClick={handleAddressSearch}
          >
            Get Latitude and Longitude
          </button>
        </div>
        {searchResults.length > 1 && (
        <div className="mb-4">
          <label className="block font-semibold mb-2">Multiple Found, Select an address:</label>
          <ul className="border border-gray-300 rounded max-h-60 overflow-y-auto">
          {searchResults.map((result, index) => (
              <li
                key={index}
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSelectAddress(result)}
              >
                {result.display_name}
              </li>
            ))}
          </ul>
        </div>
      )}
        {/* Method 2: via Map */}
        <div className="mb-4">
          <label className="block font-semibold mb-2">Or select location from the map:</label>
          <MapContainer
            center={mapPosition}
            zoom={4}
            style={{ height: '300px', width: '100%' }}
          >
            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationMarker />
          </MapContainer>
        </div>
      </div>

      {Object.keys(postData).length === 0 ? (
        <button
          aria-label="Create Listing"
          type="submit"
          className="w-full md:w-1/2 lg:w-1/3 p-4 mt-6 text-lg text-white font-semibold bg-teal-600 rounded hover:bg-teal-700 "
          disabled={isLoading && isCreating}
        >
          Create Listing
        </button>
      ) : (
        <button
          aria-label="Edit Listing"
          type="submit"
          className="w-full md:w-1/2 lg:w-1/3 p-4 mt-6 text-lg text-white font-semibold bg-teal-600 rounded hover:bg-teal-700"
          disabled={isLoading && isUpdating}
        >
          Edit Listing
        </button>
      )}
      {error && <span className="text-red-500">{error}</span>}
      </form>
    </div>
``
      <button
        aria-label="Toggle Image Preview"
        className="lg:hidden block bg-yellow-800 text-white py-2 px-4 rounded-md"
        onClick={() => setIsImagePreviewVisible(!isImagePreviewVisible)}
      > 
        {isImagePreviewVisible ? 'Click to Hide Image Preview' : 'Click to Preview/Add Images'}
      </button>

      <div className={`lg:flex-1 lg:flex ${isImagePreviewVisible ? "" : `hidden`} flex flex-row flex-wrap overflow-y-auto items-center justify-center bg-[#fcf5f3] p-6 gap-4`}>
        
      <div className="flex flex-col items-center w-full">
        {images.length === 0 && (
          <p className="text-lg text-gray-600 mb-4">No images uploaded yet.</p>
        )}
        <CloudinaryUploadWidget
            uwConfig={{
              cloudName: "dzow5xpbx",
              uploadPreset: "shoob-estate",
              multiple: true,
              resourceType: "image",
              allowedFormats: ["png", "jpg", "jpeg", "bmp", "tiff", "heif", "heic"],
              folder: "posts",
              maxFileSize: 2097152 // 2MB
              // apiKey: `${import.meta.env.VITE_CLOUDINARY_API_KEY}`,
              // uploadSignature: cloudinarySignature,
            }}
            setImages={setImages}
            Tooltip={Tooltip}
          />

        </div>
        
        <div className="flex  flex-wrap gap-2 ">
        {images.map((image, index) => (
          <img
          src={image}
          key={index}
          alt={`picture-${index}`}
          className="w-full h-full object-cover rounded-md"
          />
        ))}
        </div>

      </div>
    </div>
  );
}

export default CreatePost;
