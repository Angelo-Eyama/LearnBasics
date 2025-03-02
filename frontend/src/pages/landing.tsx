import React from 'react';

export const Landing: React.FC = () => {
    return (
        <div className="text-center p-12">
            <h1 className="text-4xl font-bold mb-4">Bienvenido a la pagina principal!</h1>
            <p className="text-lg mb-6">Esta será la pagina de bienvenida general</p>
            <button className="bg-blue-500 text-white py-2 px-4 rounded cursor-pointer hover:bg-blue-700">Haz clic 👀</button>
        </div>
    );
};

export default Landing;