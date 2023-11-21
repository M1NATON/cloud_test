import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { uploadFile } from '../actions/file';

const FileUploadComponent = () => {
    const dispatch = useDispatch();
    const [selectedFile, setSelectedFile] = useState(null);
    const uploadedFile = useSelector((state) => state.uploadedFile);
    const error = useSelector((state) => state.error);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            console.log('Выбранный файл:', file);
            setSelectedFile(file);
        }
    };

    const handleUpload = () => {
        if (selectedFile) {
            dispatch(uploadFile(selectedFile));
        }
    };

    return (
        <div>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload</button>
            {uploadedFile && <p>File uploaded: {uploadedFile.name}</p>}
            {error && <p>Error: {error}</p>}
        </div>
    );
};

export default FileUploadComponent;