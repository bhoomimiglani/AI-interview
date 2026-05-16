import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data: Record<string, unknown>) => api.post('/auth/register', data),
  login: (email: string, password: string) => api.post('/auth/login', { email, password }),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data: Record<string, unknown>) => api.put('/auth/profile', data),
};

export const interviewAPI = {
  start: (data: {
    type: string;
    difficulty: string;
    questionsCount: number;
    isChallenge?: boolean;
  }) => api.post('/interviews/start', data),
  submitAnswer: (
    interviewId: string,
    data: {
      questionId: string;
      questionText: string;
      selectedOptionIndex: number;
      timeTaken: number;
    }
  ) => api.post(`/interviews/${interviewId}/answer`, data),
  complete: (interviewId: string, duration: number) =>
    api.post(`/interviews/${interviewId}/complete`, { duration }),
  getAll: (params?: Record<string, unknown>) => api.get('/interviews', { params }),
  getById: (id: string) => api.get(`/interviews/${id}`),
};

export const analyticsAPI = {
  getDashboard: () => api.get('/analytics/dashboard'),
  getProgress: () => api.get('/analytics/progress'),
};

export const leaderboardAPI = {
  get: () => api.get('/leaderboard'),
};

export const questionAPI = {
  getAll: (params?: Record<string, unknown>) => api.get('/questions', { params }),
  getCategories: () => api.get('/questions/categories'),
};

export default api;
