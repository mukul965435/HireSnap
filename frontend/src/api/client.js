import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://hiresnap.onrender.com';

const api = axios.create({
    baseURL: `${BASE_URL}/api`,
    timeout: 300000, 
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = localStorage.getItem('refreshToken');
                const res = await axios.post(`${BASE_URL}/api/auth/refresh-token`, { refreshToken });
                if (res.status === 200) {
                    localStorage.setItem('accessToken', res.data.accessToken);
                    localStorage.setItem('refreshToken', res.data.refreshToken);
                    api.defaults.headers.common['Authorization'] = `Bearer ${res.data.accessToken}`;
                    return api(originalRequest);
                }
            } catch (err) {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('user');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
