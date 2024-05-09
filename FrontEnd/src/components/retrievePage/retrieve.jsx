import { useState, useEffect } from 'react';
import axios from 'axios';
import "./retrieve.css";
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

function getToken() {
    console.log("token is:    " + localStorage.getItem('token'));
    return localStorage.getItem('token');
}

function Retrieve() {
    const navigate = useNavigate();
    const handleLogout = () => {
        Cookies.remove('token');
        navigate('/login');
    };
    useEffect(() => {
        const token = Cookies.get('token');
        if (!token) {
            navigate('/login');
            return;
        }
    }, []);

    const [images, setImages] = useState([]);
    const [selectedAnnotation, setSelectedAnnotation] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 25;

    const fetchImagesByAnnotation = async (annotation, page = 1) => {
        setSelectedAnnotation(annotation);
        setCurrentPage(page);
        try {
            const response = await axios.post('http://localhost:3000/api/cifarImage/fetchCifarImage', {
                annotation,
                page,
                pageSize,
            }, {
                headers: {
                    'Authorization': 'Bearer ' + getToken(),
                    'Content-Type': 'application/json',
                }
            });
            setImages(response.data.images);
        } catch (error) {
            if (error.response && error.response.status === 400) {
                console.error('<< Images not found for annotation:', error, ' >>');
                alert('<< Images not found for annotation >>');
                setImages([]);

            } else {
                console.error('<< Error fetching images:', error, ' >>');
                alert('<< Failed to fetch images >>');
                setImages([]);
            }
        }
    };

    const totalPages = Math.ceil(images.length / pageSize);

    const renderPageNumbers = () => {
        const pages = [];
        for (let i = 1; i <= totalPages; i++) {
            pages.push(
                <Button
                    key={i}
                    variant="outlined"
                    className={currentPage === i ? 'selectedPage' : ''}
                    onClick={() => setCurrentPage(i)}
                >
                    {i}
                </Button>
            );
        }
        return pages;
    };

    return (
        <div>
            <Button variant="contained" onClick={handleLogout} style={{ backgroundColor: 'red', position: 'absolute', top: 10, right: 10 }}>Logout</Button>

            <Link className="link1" to="/home"><Button variant="contained">Go Back to Annotate Images</Button></Link>
            <div className='retrieve-button-group'>
                {["Airplane", "Automobile", "Bird", "Cat", "Deer", "Dog", "Frog", "Horse", "Ship", "Truck"].map(option => (
                    <Button
                        key={option}
                        onClick={() => fetchImagesByAnnotation(option.toLowerCase())}
                        variant="outlined"
                        className={selectedAnnotation === option.toLowerCase() ? 'selected' : ''}
                    >
                        {option}
                    </Button>
                ))}
            </div>



            <div className="pagination">
                {currentPage > 1 && (
                    <Button className="previousPageButton" variant="contained" onClick={() => setCurrentPage(currentPage - 1)}>
                        &lt;&lt;
                    </Button>
                )}

                {images.length > 0 && (
                    <div className="images-container">
                        {images.slice((currentPage - 1) * 25, currentPage * 25).map((image, index) => (
                            <div key={index} className="image-card">
                                <img src={`data:image/jpeg;base64,${image.image}`} alt={`Cifar Image ${image.imageUrl}`} />
                            </div>
                        ))}
                    </div>
                )}

                {Math.ceil(images.length / 25) > currentPage && (
                    <Button className="nextPageButton" variant="contained" onClick={() => setCurrentPage(currentPage + 1)}>
                        &gt;&gt;
                    </Button>
                )}
            </div>
            <div className='pageNumbers' >
                {renderPageNumbers()}
            </div>
        </div>
    );
}

export default Retrieve;
