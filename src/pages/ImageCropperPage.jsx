import React, { useState, useCallback, useEffect } from 'react';
import Cropper from 'react-easy-crop';

function ImageCropperPage({ imageUrl, onImageCropComplete }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [isCropping, setIsCropping] = useState(false);

  const CROP_PRESETS = [
    { name: '1:1', aspect: 1 },
    { name: '4:3', aspect: 4 / 3 },
    { name: '16:9', aspect: 16 / 9 },
    { name: 'Instagram', aspect: 1 },
    { name: 'Facebook Cover', aspect: 1640 / 856 }
  ];
  const [aspect, setAspect] = useState(1);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const getCroppedImg = async (imageUrl, croppedAreaPixels, rotation = 0) => {
    try {
      if (!croppedAreaPixels) {
        console.warn('No crop area defined');
        return null;
      }

      const image = await new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'Anonymous'; // Add this if dealing with cross-origin images
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = imageUrl;
      });

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;

      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
      );

      return new Promise((resolve) => {
        canvas.toBlob((blob) => {
          if (!blob) return resolve(null);
          const croppedImageUrl = URL.createObjectURL(blob);
          resolve({
            blob,
            url: croppedImageUrl
          });
        }, 'image/jpeg', 1);
      });
    } catch (error) {
      console.error('Error cropping image:', error);
      return null;
    }
  };

  const handleImageCropComplete = async () => {
    if (!croppedAreaPixels) return;
    try {
      setIsCropping(true);
      const croppedImg = await getCroppedImg(imageUrl, croppedAreaPixels);
      if (croppedImg) {
        setCroppedImage(croppedImg.url);
        onImageCropComplete(croppedImg.url);
      }
    } catch (error) {
      console.error('Crop completion error:', error);
    } finally {
      setIsCropping(false);
    }
  };

  const handleDownload = () => {
    if (!croppedImage) return;
    const link = document.createElement('a');
    link.download = 'cropped-image.jpg';
    link.href = croppedImage;
    link.click();
  };

  // Cleanup
  useEffect(() => {
    return () => {
      if (croppedImage) {
        URL.revokeObjectURL(croppedImage);
      }
    };
  }, [croppedImage]);

  return (
    <div className="h-screen w-full flex flex-col">
      <div className="relative h-3/4 w-full bg-gray-100">
        <Cropper
          image={imageUrl}
          crop={crop}
          zoom={zoom}
          aspect={aspect}
          onCropChange={setCrop}
          onCropComplete={onCropComplete} // Fixed: Using the callback
          onZoomChange={setZoom}
        />
      </div>

      <div className="h-1/4 p-4 bg-white">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Zoom: {zoom.toFixed(1)}x
          </label>
          <input
            type="range"
            min={1}
            max={3}
            step={0.1}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div className="flex space-x-2 mb-4">
          {CROP_PRESETS.map((preset) => (
            <button
              key={preset.name}
              onClick={() => setAspect(preset.aspect)}
              className={`
                px-3 py-1 rounded 
                ${aspect === preset.aspect 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-700'}
              `}
            >
              {preset.name}
            </button>
          ))}
        </div>

        <div className="flex space-x-4">
          <button
            onClick={handleImageCropComplete}
            disabled={isCropping || !croppedAreaPixels}
            className={`px-4 py-2 rounded ${
              isCropping || !croppedAreaPixels
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-green-500 text-white'
            }`}
          >
            {isCropping ? 'Cropping...' : 'Crop Image'}
          </button>
          <button
            onClick={handleDownload}
            disabled={!croppedImage}
            className={`px-4 py-2 rounded ${
              croppedImage
                ? 'bg-blue-500 text-white'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            Download
          </button>
        </div>
      </div>
    </div>
  );
}

export default ImageCropperPage;