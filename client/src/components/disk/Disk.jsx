// Disk.jsx (React компонент)
import React, {useEffect, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import FileUploadComponent from "../FileUploadComponent";
import {pushToStack, setCurrentDir} from "../../reducers/fileReducer";
import FileList from "./fileList/FileList";
import {getFile} from "../../actions/file";

function Disk() {
    const [selectedFile, setSelectedFile] = useState(null);
    const dispatch = useDispatch();
    const user = useSelector(state => state.user.currentUser);
    const currentDir = useSelector(state => state.user.currentDir);





    useEffect(() => {
        dispatch(getFile(currentDir))
    }, [currentDir])

    return (
        <div className='container'>
            <FileUploadComponent/>
            <FileList/>
        </div>
    );
}

export default Disk;
