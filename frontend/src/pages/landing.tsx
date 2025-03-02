import React from 'react';

export const Landing: React.FC = () => {
    return (
        <div className="text-center p-12">
            <h1 className="text-4xl font-bold mb-4">Welcome to Our Website</h1>
            <p className="text-lg mb-6">This is a simple landing page.</p>
            <button className="bg-blue-500 text-white py-2 px-4 rounded cursor-pointer hover:bg-blue-700">Click Me</button>
        </div>
    );
};

export default Landing;