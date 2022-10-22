import React, {useEffect, useState} from 'react';
import {useDropzone} from 'react-dropzone';
import './style.css';

interface T extends File {
	preview: string;
}

const Dropzone = () =>  {
	const [files, setFiles] = useState<T[]>([]);
	console.log(files);
	const {getRootProps, getInputProps} = useDropzone({
		accept: {
		'image/*': []
		},
		maxFiles:1,
        onDrop: (acceptedFiles) => {
            setFiles(
                acceptedFiles.map((file) =>
                    Object.assign(file, {
                        preview: URL.createObjectURL(file),
                    })
                )
            );
        },
	});
	
	const thumbs = files.map(file => (
		<div className='thumb' key={file.name}>
		<div className='thumbInner'>
			<img
			className='img-preview'
			src={file.preview}
			// Revoke data uri after image is loaded
			onLoad={() => { URL.revokeObjectURL(file.preview) }}
			/>
		</div>
		</div>
	));

	useEffect(() => {
		// Make sure to revoke the data uris to avoid memory leaks, will run on unmount
		return () => files.forEach(file => URL.revokeObjectURL(file.preview));
	}, []);

	return (
		<section className='outer-dropzone'>
			<div {...getRootProps({className: 'dropzone'})}>
				<input {...getInputProps()} />
				<p>Drag 'n' drop your file here, or click to select file</p>
			</div>
			<div className='thumbs-container'>
				{thumbs}
			</div>
		</section>
	);
}

export default Dropzone;