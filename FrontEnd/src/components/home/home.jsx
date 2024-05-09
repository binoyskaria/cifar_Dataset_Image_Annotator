import * as React from 'react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SendIcon from '@mui/icons-material/Send';
import CancelIcon from '@mui/icons-material/Cancel';
import "./home.css";
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';


function LinearDeterminate({ total, completed }) {
    const [progress, setProgress] = React.useState(0);

    React.useEffect(() => {
        if (total > 0) {
            setProgress((completed / total) * 100);
        }
    }, [total, completed]);

    return (
        <Box sx={{ width: '100%' }}>
            <LinearProgress variant="determinate" value={progress} />
        </Box>
    );
}

function getToken() {
    console.log("token is:    " + localStorage.getItem('token'));
    return localStorage.getItem('token');
}

function Home() {
    const handleLogout = () => {
        Cookies.remove('token');
        navigate('/login');
    };

    const navigate = useNavigate();
    useEffect(() => {
        const token = Cookies.get('token');
        if (!token) {
            navigate('/login');
            return;
        }
    }, []);






    const [images, setImages] = useState([]);
    const [uploadsCompleted, setUploadsCompleted] = useState(0);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    const categories = ["Airplane", "Automobile", "Bird", "Cat", "Deer", "Dog", "Frog", "Horse", "Ship", "Truck"];

    const handleImageUpload = (event) => {
        const files = Array.from(event.target.files);
        addImages(files);
    };

    const handleDrop = (event) => {
        event.preventDefault();
        event.stopPropagation();
        const files = Array.from(event.dataTransfer.files);
        addImages(files);
        setIsDragging(false);
    };

    const handleDragOver = (event) => {
        event.preventDefault();
        if (!isDragging) {
            setIsDragging(true);
        }
    };

    const handleDragLeave = (event) => {
        event.preventDefault();
        setIsDragging(false);
    };

    const addImages = (files) => {
        const newImages = files.map(file => ({
            file,
            annotation: null,
            src: URL.createObjectURL(file)
        }));
        setImages(prev => [...prev, ...newImages]);
        setUploadsCompleted(0);
    };

    const handleAnnotationSelect = (index, annotation) => {
        const updatedImages = [...images];
        updatedImages[index].annotation = annotation;
        setImages(updatedImages);
    };

    const handleRemoveImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleRemoveAllImages = () => {
        setImages([]);
    };

    const handleSelectAll = (category) => {
        const updatedImages = images.map(img => ({ ...img, annotation: category.toLowerCase() }));
        setImages(updatedImages);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (images.some(image => !image.annotation)) {
            alert("Please annotate all images.");
            return;
        }

        let completed = 1;
        for (const image of images) {
            const formData = new FormData();
            formData.append('image', image.file);
            formData.append('annotation', image.annotation);
            formData.append('user', 'dummyUser');

            try {
                const response = await fetch('http://localhost:3000/api/cifarImage/storeCifarImage', {
                    method: 'POST',
                    headers: {
                        'Authorization': 'Bearer ' + getToken(),
                        
                    },
                    body: formData,
                });


                if (!response.ok) {
                    throw new Error(`Failed to upload image: ${image.file.name}`);
                } else {
                    const data = await response.json();
                    console.log(`Success for ${image.file.name}: `, data);
                    completed++;
                    setUploadsCompleted(completed);
                    if (completed - 1 === images.length) {
                        setOpenSnackbar(true);
                        setTimeout(() => setOpenSnackbar(false), 3000);
                    }
                }
            } catch (error) {
                console.error('Error uploading image:', error.message);
                alert(`Error uploading image ${image.file.name}: ${error.message}`);
                break;
            }
        }
        setImages([]);
    };

    const hasAnnotatedImages = () => images.some(img => img.annotation !== null);

    return (
        <div className="top-controls">
            <Button variant="contained" onClick={handleLogout} style={{ backgroundColor: 'red', position: 'absolute', top: 10, right: 10 }}>Logout</Button>
            <Link className="link1" to="/retrieve"><Button variant="contained">Search Annotated Images</Button></Link>


            <form onSubmit={handleSubmit}>
                <div className={`upload1 ${isDragging ? 'dragging' : ''}`}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}>
                    <p>Drag and drop images here or click to upload images to Annotate. Minimum expected size : 800 x 600</p>
                    <input
                        type="file"
                        id="imageUpload"
                        style={{ display: 'none' }}
                        onChange={handleImageUpload}
                        accept="image/*"
                        multiple
                    />
                    <Button onClick={() => document.getElementById('imageUpload').click()}
                        variant="contained"
                        startIcon={<CloudUploadIcon />}>
                        Upload Image(s)
                    </Button>
                </div>
                <div className='cancelAllButton'>
                    {images.length > 0 && (

                        <Button onClick={handleRemoveAllImages} variant="outlined" startIcon={<CancelIcon />} color="error">
                            Cancel All
                        </Button>
                    )}
                </div>

                {images.length > 0 && (
                    <div className="category-buttons">
                        {categories.map(category => (
                            <Button key={category}
                                size="small"
                                sx={{ fontSize: '0.75rem' }} // Smaller font size
                                variant="contained"
                                onClick={() => handleSelectAll(category)}>
                                {category}
                            </Button>
                        ))}
                    </div>
                )};
                {images.map((img, index) => (
                    <div key={index} className="image-preview">
                        <img src={img.src} alt="Preview" className="thumbnail" />
                        <div className="button-group">
                            {categories.map(option => (
                                <Button variant="outlined"
                                    key={option}
                                    className={img.annotation === option.toLowerCase() ? "selected" : ""}
                                    onClick={(event) => {
                                        event.preventDefault();
                                        handleAnnotationSelect(index, option.toLowerCase());
                                    }}
                                >
                                    {option}
                                </Button>
                            ))}
                            <Button onClick={() => handleRemoveImage(index)} variant="outlined" color="error" startIcon={<CancelIcon />}>
                                Cancel
                            </Button>
                        </div>
                    </div>
                ))}
                {hasAnnotatedImages() && (
                    <div className='submitButton'>
                        <Button variant="contained" endIcon={<SendIcon />} type="submit">Submit All</Button>
                    </div>
                )}
            </form>
            <LinearDeterminate total={images.length} completed={uploadsCompleted} />
            <Snackbar open={openSnackbar} autoHideDuration={3000}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
                <Alert severity="success" sx={{ width: '100%' }}>
                    All images uploaded successfully!
                </Alert>
            </Snackbar>
        </div>
    );
}

export default Home;
