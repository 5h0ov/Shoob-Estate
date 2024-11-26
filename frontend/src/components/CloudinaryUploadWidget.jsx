// extracted from https://cloudinary.com/documentation/react_image_and_video_upload
import { createContext, useEffect, useState, useRef } from "react";

// Create a context to manage the script loading state
const CloudinaryScriptContext = createContext();

function CloudinaryUploadWidget({ uwConfig, setImages, Tooltip }) {
  const [loaded, setLoaded] = useState(false);
  const widgetRef = useRef(null); // Reference to hold the Cloudinary widget instance
  const [widgetLoaded, setWidgetLoaded] = useState(false);

  useEffect(() => {
    // Check if the script is already loaded
    if (!loaded) {
      const uwScript = document.getElementById("uw");
      console.log(uwScript);

      if (!uwScript) {
        // If not loaded, create and load the script
        console.log("loading script");
        const script = document.createElement("script");
        script.setAttribute("async", "");
        script.setAttribute("id", "uw");
        script.src = "https://upload-widget.cloudinary.com/global/all.js";
        script.addEventListener("load", () => setLoaded(true));
        document.body.appendChild(script);
        console.log("script loaded");
      } else {
        setLoaded(true);
      }
    }
  }, [loaded]);

  // Initialize Cloudinary widget only once
  const initializeCloudinaryWidget = () => {
    setWidgetLoaded(true);

    if(localStorage.getItem("imageURLs") === null) {
      localStorage.setItem("imageURLs", JSON.stringify([]));
    }

    if (!widgetRef.current && loaded) {
      widgetRef.current = window.cloudinary.createUploadWidget(
        uwConfig,
        (error, result) => {
          if (!error && result && result.event === "success") {
            console.log("Done! Here is the image info: ", result.info);
            
            const imageURLs = JSON.parse(localStorage.getItem("imageURLs"));
            imageURLs.push(result.info.secure_url);
            localStorage.setItem("imageURLs", JSON.stringify(imageURLs));


            setImages((prev) => [...prev, result.info.secure_url]); // For multiple images
          }
          if (result.event === "close") {
            setWidgetLoaded(false); // Stop loading when widget closes
          }
        }
      );
    }
    widgetRef.current.open(); // Open widget on each button click
  };

  return (
    <CloudinaryScriptContext.Provider value={{ loaded }}>
      <button
        aria-label="Upload Images"
        id="upload_widget"
        className={`px-6 py-3 font-semibold text-white rounded-lg shadow-md 
          ${widgetLoaded ? "bg-gray-400 cursor-not-allowed" : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-indigo-600 hover:to-blue-500"}
          transition-all transform hover:scale-110 active:scale-95 ease-in-out`}
        onClick={initializeCloudinaryWidget}
      >
        {widgetLoaded ? "Loading..." : "Upload Images Here"}
      </button>
      <Tooltip anchorSelect="#upload_widget" place="right" type="dark" className="z-10" delayShow={500}>
          <img src="./assests/image.webp" />
      </Tooltip>

    </CloudinaryScriptContext.Provider>
  );
}

export default CloudinaryUploadWidget;
export { CloudinaryScriptContext };
