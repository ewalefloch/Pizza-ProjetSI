import React from 'react';

const PizzaImage = ({ photo, nom }) => {
    const handleImageError = (e) => {
        e.target.onerror = null;
        e.target.src = "/image/pizza.jpg";
    };

    return (
        <div className="relative h-48">
            <img
                src={photo}
                alt={nom}
                className="w-full h-full object-cover"
                onError={handleImageError}
            />
        </div>
    );
};

export default PizzaImage;
