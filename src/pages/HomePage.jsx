import React, { useState } from 'react';
// import DragAndDrop from './DragAndDrop';
import DragAndDrop from '../components/DragAndDrop';
import ImageCropperPage from './ImageCropperPage';
// import NavBar from './NavBar';
import NavBar from '../components/NavBar'

function HomePage() {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [croppedImageUrl, setCroppedImageUrl] = useState(null);

  const handleImageCropComplete = (croppedImage) => {
    setCroppedImageUrl(croppedImage);
  };

  // Modified DragAndDrop component to pass the image back to parent
  const CustomDragAndDrop = () => {
    const onImageUpload = (imageUrl) => {
      setUploadedImage(imageUrl);
    };

    return <DragAndDrop onImageChange={onImageUpload} />;
  };

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      
      <div className="container mx-auto px-4 py-8 flex-1">
        {!uploadedImage ? (
          <CustomDragAndDrop />
        ) : (
          <div className="flex flex-col gap-4">
            <ImageCropperPage 
              imageUrl={uploadedImage} 
              onImageCropComplete={handleImageCropComplete} 
            />
            
            {croppedImageUrl && (
              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Cropped Result</h2>
                <img 
                  src={croppedImageUrl} 
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
  );
}

export default HomePage;