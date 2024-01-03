import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import dirLogo from '../../../../assets/img/dir.svg';
import fileLogo from '../../../../assets/img/file.svg';
import basket from '../../../../assets/img/icon/basket.png';
import download from '../../../../assets/img/icon/download.png';
import s from './file.module.css';
import {deleteFileRequest, downloadFile, getFile} from '../../../../actions/file';
import {convert} from "../../../../context/convert";

const File = ({ file }) => {
    const dispatch = useDispatch();
    const currentDir = useSelector((state) => state.files.currentDir);
    const user = useSelector((state) => state.user.currentUser);

    const handleDeleteFile = async (e) => {
        await dispatch(deleteFileRequest(user.id, file.id));
        dispatch(getFile());
    };

    const handleDownloadFile = async (e) => {
        await dispatch(downloadFile(user.id, file.id, file.name))
    }




    return (
        <div className="container">
            <div className="file">
                <img src={file.type === 'dir' ? dirLogo : fileLogo} alt="" className="file__img" />
                <div className="file__name">{file.name}</div>
                <div className="file__date">{file.date.slice(0, 10)}</div>
                <div className="file__size">{convert(file.size)}</div>
                <div className='func'>
                    <button className='btn__basket' onClick={handleDownloadFile}>
                        <img src={download} className='img__basket' alt="Delete" />
                    </button>
                    <button className='btn__basket' onClick={handleDeleteFile}>
                        <img src={basket} className='img__basket' alt="Delete" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default File;
