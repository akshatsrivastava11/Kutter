import React, { useState, useRef } from 'react';

function DragAndDrop({ onImageChange }) {
  const [img, setImg] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleImgInput = (files) => {
    console.log(files);
    const file = files[0];
    console.log(file);
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        setImg(reader.result);
        onImageChange && onImageChange(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please upload a valid image file');
    }
  };

  // Rest of your component remains the same
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleImgInput(files);
    }
  };

  const handleFileInputClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div
      className={`
        w-full
        h-[70vh]
        flex
        items-center
        justify-center
        border-2
        ${isDragOver ? 'border-blue-500 bg-blue-50' : 'border-dashed border-gray-400'}
        rounded-lg
        relative
        cursor-pointer
        transition-all
        duration-300
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleFileInputClick}
    >
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        className="hidden"
        onChange={(e) => handleImgInput(e.target.files)}
      />
      {img ? (
        <img
          src={img}
          alt="Uploaded"
          className="max-w-full max-h-full object-contain"
        />
      ) : (
        <div className="text-center">
          <p className="text-gray-500">
            Drag and drop your image here or click to select
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Supported formats: JPEG, PNG, GIF
          </p>
        </div>
      )}
    </div>
  );
}

export default DragAndDrop;