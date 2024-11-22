// DIDN'T GO FORWARD WITH THIS

const API_URL = import.meta.env.VITE_API_URL;
import apiRequest from "./apiRequest.js";


export function cloudinarySignature(callback, paramsToSign) {
  console.log("Signing params:", paramsToSign);
    fetch(`${API_URL}/api/sign`, {
      method: "POST",
      body: JSON.stringify({
        paramsToSign,
      }),
    })
      .then((r) => r.json())
      .then(({ signature }) => {
        callback(signature);
      });
  }