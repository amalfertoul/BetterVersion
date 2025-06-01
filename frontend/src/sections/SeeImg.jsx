import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchImageById } from '../slices/imagesSlice'; // adjust path if needed
import { useParams } from 'react-router-dom';

const SeeImg = () => {
    const dispatch = useDispatch();
    const { id } = useParams();
    const { image, status, error } = useSelector((state) => state.images);

    useEffect(() => {
        if (id) {
            dispatch(fetchImageById(id));
        }
    }, [dispatch, id]);

    if (status === 'loading') {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    if (!image) {
        return <div>No image found.</div>;
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
            <img
                src={`http://127.0.0.1:8000/storage/${image.url || image.path || image.image_url}`}
                alt={image.title || 'Image'}
                className="w-1/2 rounded-lg border shadow-lg"
                style={{ objectFit: 'contain' , width: '80%', height: 'auto' , justifySelf: 'center' }}
            />
        </div>
    );
};

export default SeeImg;