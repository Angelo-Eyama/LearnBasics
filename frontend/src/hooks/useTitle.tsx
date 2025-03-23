import { useEffect } from 'react';

/**
 * Custom hook to manage the document title
 * @param initialTitle - The initial title for the document
 * @returns [title, setTitle] - Current title and function to update it
 */
const useTitle = (newTitle: string) => {
    useEffect(() => {
        document.title = newTitle;
    }, []);
};

export default useTitle;