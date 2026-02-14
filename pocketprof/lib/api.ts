import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const uploadLecture = async (audioFile: File, slidesFile: File) => {
    const formData = new FormData();
    formData.append('audio', audioFile);
    formData.append('slides', slidesFile);

    const response = await api.post('/api/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    return response.data;
};

export const getSlide = (slideIndex: number) => {
    return `${API_BASE_URL}/api/slides/${slideIndex}`;
};
