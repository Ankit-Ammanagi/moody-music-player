import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import axios from 'axios';

const FaceDetection = ({ setSongs }) => {
    const [detectingMood, setDetectingMood] = useState(true)
    const videoRef = useRef();

    // Load face-api models
    useEffect(() => {
        const loadModels = async () => {
            const MODEL_URL = '/models';
            await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL + '/tiny_face_detector');
            await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL + '/face_expression');
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

    async function detectExpression() {
        setDetectingMood(false)
        if (videoRef.current) {
            const detection = await faceapi
                .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
                .withFaceExpressions()

            if (detection) {
                const expressions = detection.expressions;
                const sorted = Object.entries(expressions).sort((a, b) => b[1] - a[1]);
                const topExpression = sorted[0];

                console.log(topExpression[0])

                axios.get(`http://localhost:3000/songs?mood=${topExpression[0]}`).then((res) => {
                    console.log(res.data.songs)
                    setSongs(res.data.songs)
                })
            } else {
                setSongs('no face detected')
            }
            setDetectingMood(true)
        }

        return () => clearInterval(interval);
    }

    return (
        <div className="">
            <h2 className="text-xl font-bold mb-2">Live Emotion Detection</h2>
            <div className='sm:flex sm:justify-evenly sm:items-center'>
                <video ref={videoRef} autoPlay muted className="w-full aspect-square sm:w-[45%] md:w-[30%] rounded" />
                <div className='w-[45%]'>
                    <p className='text-sm font-[Roboto_Mono] mb-5'>Your current mood is being analyzed in real-time. Enjoy music tailored to your feelings</p>
                    <button onClick={detectExpression} className={`border py-2 px-5 rounded-full text-sm font-bold ${detectingMood === false && "pointer-events-none"} `}>
                        {detectingMood ? "Detect Mood" : "Detecting Mood"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default FaceDetection;
