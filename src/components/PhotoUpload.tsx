import React, { useState } from 'react';

const PhotoUpload: React.FC = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setSelectedFile(event.target.files[0]);
        }
    };

    const handleUpload = () => {
        if (selectedFile) {
            // Logic to upload the photo
            console.log('Uploading:', selectedFile.name);
            // You can add your upload logic here
        }
    };

    return (
        <div className="photo-upload">
            <input type="file" accept="image/*" onChange={handleFileChange} />
            <button onClick={handleUpload} disabled={!selectedFile}>
                Upload Photo
            </button>
            {selectedFile && <p>Selected file: {selectedFile.name}</p>}
        </div>
    );
};

export default PhotoUpload;