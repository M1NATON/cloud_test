// import React, {useEffect} from 'react';
// import {useDispatch, useSelector} from "react-redux";
// import dirLogo from '../../../../assets/img/dir.svg'
// import fileLogo from '../../../../assets/img/file.svg'
// import basket from "../../../../assets/img/basket.png"
// import s from './file.module.css'
// import {deleteFileRequest, getFile} from "../../../../actions/file";
//
// const File = ({file}) => {
//
//     const dispatch = useDispatch()
//     const currentDir = useSelector(state => state.files.currentDir)
//     const user = useSelector(state => state.user.currentUser);
//
//     const handleDeleteFile = async  (e) => {
//         await dispatch(deleteFileRequest(user.id, file.id))
//         dispatch(getFile())
//     }
//     return (
//         <div className="container">
//             <div className='file'>
//                 <img src={file.type === 'dir' ? dirLogo : fileLogo} alt="" className="file__img"/>
//                 <div className="file__name">{file.name}</div>
//                 <div className="file__date">{file.date.slice(0, 10)}</div>
//                 <div className="file__size">{Math.round(file.size)} байт</div>
//                 <div>
//                     <button onClick={handleDeleteFile}><img src={basket} alt="Delete"/></button>
//                 </div>
//             </div>
//         </div>
//     );
// };
//
// export default File;


import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import dirLogo from '../../../../assets/img/dir.svg';
import fileLogo from '../../../../assets/img/file.svg';
import basket from '../../../../assets/img/basket.png';
import s from './file.module.css';
import {deleteFileRequest, downloadFile, getFile} from '../../../../actions/file';

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
                <div className="file__size">{Math.round(file.size)} байт</div>
                <div>
                    <button onClick={handleDeleteFile}>
                        <img src={basket} alt="Delete" />
                    </button>
                    <button onClick={handleDownloadFile}>Download</button>
                </div>
            </div>
        </div>
    );
};

export default File;
