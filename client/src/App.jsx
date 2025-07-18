import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';

export default function EmotionDetector() {
  const videoRef = useRef();
  const [expression, setExpression] = useState('No face detected');
  const [ageGender, setAgeGender] = useState('');

  // Load face-api models
  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = '/models';
      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL + '/tiny_face_detector');
      await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL + '/face_expression');
      await faceapi.nets.ageGenderNet.loadFromUri(MODEL_URL + '/age_gender_model');
      startVideo();
    };

    loadModels();
  }, []);

  // Start webcam stream
  const startVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;
      })
      .catch((err) => {
        console.error('Error accessing webcam:', err);
      });
  };

  // Detect face every 1 second
  useEffect(() => {
    const interval = setInterval(async () => {
      if (videoRef.current) {
        const detection = await faceapi
          .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
          .withFaceExpressions()
          .withAgeAndGender();

        if (detection) {
          const expressions = detection.expressions;
          const sorted = Object.entries(expressions).sort((a, b) => b[1] - a[1]);
          const topExpression = sorted[0];

          const age = detection.age?.toFixed(1);
          const gender = detection.gender;

          setExpression(`${topExpression[0]} (${(topExpression[1] * 100).toFixed(1)}%)`);
          setAgeGender(`Age: ${age} | Gender: ${gender}`);
        } else {
          setExpression("No face detected");
          setAgeGender("");
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-center">
      <h2 className="text-xl font-bold mb-4">Live Emotion Detection</h2>
      <video ref={videoRef} autoPlay muted width="480" height="360" className="mx-auto rounded shadow-lg" />
      <p className="mt-4 text-lg font-semibold text-white">Detected Emotion: {expression}</p>
      <p className="mt-1 text-md text-gray-300">{ageGender}</p>
    </div>
  );
}
