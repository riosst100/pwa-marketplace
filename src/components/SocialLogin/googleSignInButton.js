import { useEffect, useCallback, useRef } from "react";
import React from 'react';

export default function GoogleSignInButton(props) {
  const { setToken } = props;

  const buttonRef = useRef(null);

  // callback ketika user berhasil login
  const handleCredentialResponse = useCallback((response) => {
    console.log("JWT:", response.credential);

    setToken(response.credential);
  }, [setToken]);
      
  //     (response) => {
    
    
  //   // simpan token atau kirim ke backend
  // };

  useEffect(() => {
    // pastikan script Google sudah ada
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      // inisialisasi GIS
      google.accounts.id.initialize({
        client_id: "541495182998-oig1ed7n9a5g7e60pu3fcdoek8cnhpo2.apps.googleusercontent.com",
        callback: handleCredentialResponse,
      });

      // render button di div
      google.accounts.id.renderButton(buttonRef.current, {
        theme: "outline",
        size: "large",
      });
    };

    return () => {
      // bersihin script jika perlu
      document.body.removeChild(script);
    };
  }, []);

  return <div ref={buttonRef}></div>;
}
