import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { verifyMFA } from '../../services/auth';
import jsQR from 'jsqr';
import { URI } from 'otpauth';

const MFAQRScanner = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const canvasRef = useRef(null);
  const navigate = useNavigate();
  const { login, setMfaCompleted } = useAuth();
  const scanningRef = useRef(false);

  // Initialize camera for QR scanning
  useEffect(() => {
    const initCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' } 
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error('Camera access denied:', err);
        setError('Camera access denied. Please allow camera access to scan QR codes.');
      }
    };

    initCamera();

    return () => {
      // Cleanup camera stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Start scanning for QR codes
  useEffect(() => {
    const scanQRCode = () => {
      if (!videoRef.current || videoRef.current.readyState !== 4) {
        // Video not ready yet
        requestAnimationFrame(scanQRCode);
        return;
      }

      if (!canvasRef.current) {
        canvasRef.current = document.createElement('canvas');
      }

      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext('2d');

      if (context && video.videoWidth > 0 && video.videoHeight > 0) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        if (code) {
          // QR code detected
          handleQRCodeDetected(code.data);
          return;
        }
      }

      // Continue scanning
      if (scanningRef.current) {
        requestAnimationFrame(scanQRCode);
      }
    };

    scanningRef.current = true;
    scanQRCode();

    return () => {
      scanningRef.current = false;
    };
  }, []);

  const handleQRCodeDetected = async (qrData) => {
    if (loading) return; // Prevent multiple scans
    
    setLoading(true);
    setMessage('QR code detected. Generating TOTP token...');
    setError('');

    try {
      // Parse the QR code data to extract TOTP configuration
      const totp = URI.parse(qrData);
      
      if (!totp) {
        throw new Error('Invalid QR code format');
      }

      // Generate the current TOTP token
      const token = totp.generate();
      
      // Verify the token with the backend
      const res = await verifyMFA(token);
      
      // Update auth context with new tokens
      login(res.data);
      
      // Mark MFA as completed
      setMfaCompleted();
      
      setMessage('MFA verification successful!');
      
      // Navigate to architect dashboard
      setTimeout(() => navigate('/architect/dashboard'), 1500);
    } catch (err) {
      console.error('MFA verification failed:', err);
      setError(err.message || err.response?.data?.message || 'MFA verification failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          QR Code MFA Verification
        </h2>
        
        <p className="text-gray-600 mb-6 text-center">
          Scan the QR code from your Google Authenticator app
        </p>

        {/* Camera Preview for QR Scanning */}
        <div className="mb-6">
          <div className="relative bg-gray-200 rounded-lg overflow-hidden aspect-square flex items-center justify-center">
            <video 
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="border-2 border-blue-500 rounded-lg w-48 h-48"></div>
            </div>
            <div className="absolute bottom-4 text-white bg-black bg-opacity-50 px-3 py-1 rounded">
              Position QR code in frame
            </div>
          </div>
        </div>

        {message && (
          <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-lg">
            {message}
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <div className="mt-6 text-center text-gray-600 text-sm">
          <p>Point your camera at the QR code displayed in Google Authenticator</p>
        </div>

        <p className="mt-4 text-center text-gray-600">
          <a href="/dashboard" className="text-blue-600 font-medium hover:underline">
            Skip for now
          </a>
        </p>
      </div>
    </div>
  );
};

export default MFAQRScanner;