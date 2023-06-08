import { useRef } from 'react'
import face from 'face-api.js'

const MediaPage = () => {
  const videoRef = useRef<HTMLVideoElement>(null)

  async function getCamera() {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true
      })
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
    } catch (error) {
      console.error(error)
    }
  }

  async function loadModels() {
    await face.loadTinyFaceDetectorModel()
    // 面部68点位识别模型
    await face.loadFaceLandmarkTinyModel()
    // 表情识别模型
    await face.loadFaceExpressionModel()
    // 性别年龄识别模型
    await face.loadAgeGenderModel()
    getCamera()
  }

  function detectFaces() {
    const { width, height } = videoRef.current!
    const canvas = face.createCanvasFromMedia(videoRef.current!)
    const ctx = canvas.getContext('2d')

    setInterval(async () => {
      const detections = await face
        .detectAllFaces(videoRef.current!, new face.TinyFaceDetectorOptions())
        .withFaceLandmarks(true)
        .withFaceExpressions()
        .withAgeAndGender()
      const resizedDetections = face.resizeResults(detections, { width, height})

      ctx?.clearRect(0, 0, width, height)
      face.draw.drawFaceLandmarks(canvas, resizedDetections)
    }, 300)
  }

  videoRef.current?.addEventListener('play', detectFaces)
  loadModels()

  return (
    <div>
      <video src="" autoPlay muted ref={videoRef}></video>
    </div>
  )
}

export default MediaPage
