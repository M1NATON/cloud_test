// Disk.jsx (React компонент)
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import FileUploadComponent from "../FileUploadComponent";

function Disk() {
    const [selectedFile, setSelectedFile] = useState(null);
    const dispatch = useDispatch();
    const user = useSelector(state => state.user.currentUser);





    return (
        <div>
            <h1>Username: {user.email}</h1>
            <FileUploadComponent/>
        </div>
    );
}

export default Disk;
