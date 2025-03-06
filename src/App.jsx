import DragAndDrop from './components/DragAndDrop'
import NavBar from './components/NavBar'
import HomePage from './pages/HomePage'
import ImageCropperPage from './pages/ImageCropperPage'
import { useState } from 'react'

function App() {
  const [uploadedImage, setUploadedImage] = useState(null)
  const [croppedImage, setCroppedImage] = useState(null)
  
  const handleImageUpload = (imageUrl) => {
    setUploadedImage(imageUrl)
  }
  
  const handleCropComplete = (croppedImg) => {
    setCroppedImage(croppedImg)
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <div className="container mx-auto px-4 py-8 flex-1">
        {!uploadedImage ? (
          <DragAndDrop onImageChange={handleImageUpload} />
        ) : (
          <div className="flex flex-col gap-4">
            <ImageCropperPage
              imageUrl={uploadedImage}
              onImageCropComplete={handleCropComplete}
            />
            
            {croppedImage && (
              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Cropped Result</h2>
                <img 
                  src={croppedImage} 
                  alt="Cropped" 
                  className="max-w-md border rounded" 
                />
              </div>
            )}
            
            <button 
              onClick={() => setUploadedImage(null)}
              className="mt-4 px-4 py-2 bg-gray-200 rounded"
            >
              Upload New Image
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default App