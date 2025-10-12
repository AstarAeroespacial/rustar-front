import React from 'react';

const Footer: React.FC = () => (
    <footer className='w-full border-t border-dark-700 bg-dark-800 text-dark-400 text-xs py-4 flex items-center justify-center'>
        <span>
            &copy; {new Date().getFullYear()} Rustar &mdash; Satellite Tracking
            Platform
        </span>
    </footer>
);

export default Footer;
