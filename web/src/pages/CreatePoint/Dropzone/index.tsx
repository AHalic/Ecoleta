import React, {useEffect, useState} from 'react';
import {useDropzone} from 'react-dropzone';
import './style.css';
import {FiUpload} from 'react-icons/fi';

interface T extends File {
	preview: string;
}

interface Props {
	onFileUploaded: (file: File) => void;
}
// para passar uma função como parametro
const Dropzone: React.FC<Props> = ({onFileUploaded}) =>  {
	const [files, setFiles] = useState<T[]>([]);

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
			onFileUploaded(acceptedFiles[0]);
        },
	});

	useEffect(() => {
		// Make sure to revoke the data uris to avoid memory leaks, will run on unmount
		return () => files.forEach(file => URL.revokeObjectURL(file.preview));
	}, [files]);

	return (
		<section className='outer-dropzone'>
			<div {...getRootProps({className: 'dropzone'})}>
				<input {...getInputProps()} />
				{
					files.length > 0 ?
					<img src={files[0].preview} alt={files[0].name} />
					: (
						<p>
							<FiUpload />
							Arraste seu arquivo ou clique para selecionar
						</p>
					)
				}
			</div>
		</section>
	);
}

export default Dropzone;