import type { AuthProvider } from "@refinedev/core";
import axios from "axios";
import { IUser, UserRole } from "../types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

// Настройка axios
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const authProvider: AuthProvider = {
  login: async ({ email, password }) => {
    try {
      // Отправляем как form-data для OAuth2
      const formData = new URLSearchParams();
      formData.append("username", email);
      formData.append("password", password);

      const loginResponse = await axios.post(
        `${API_URL}/auth/login`,
        formData,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      const { access_token } = loginResponse.data;
      
      // Сохраняем токен
      localStorage.setItem("token", access_token);

      // Получаем данные пользователя
      const userResponse = await axios.get<IUser>(`${API_URL}/users/me`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      const user = userResponse.data;

      // Проверяем что пользователь - админ
      if (user.role !== UserRole.ADMIN) {
        localStorage.removeItem("token");
        return {
          success: false,
          error: {
            name: "Доступ запрещён",
            message: "Только администраторы могут войти в панель управления",
          },
        };
      }

      localStorage.setItem("user", JSON.stringify(user));

      return {
        success: true,
        redirectTo: "/",
      };
    } catch (error: unknown) {
      localStorage.removeItem("token");
      const axiosError = error as { response?: { data?: { detail?: string } } };
      return {
        success: false,
        error: {
          name: "Ошибка входа",
          message: axiosError.response?.data?.detail || "Неверный email или пароль",
        },
      };
    }
  },

  logout: async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return {
      success: true,
      redirectTo: "/login",
    };
  },

  check: async () => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (token && user) {
      try {
        const parsedUser: IUser = JSON.parse(user);
        if (parsedUser.role === UserRole.ADMIN) {
          return { authenticated: true };
        }
      } catch {
        // Invalid user data
      }
    }

    return {
      authenticated: false,
      redirectTo: "/login",
      error: {
        name: "Не авторизован",
        message: "Требуется вход в систему",
      },
    };
  },

  getIdentity: async () => {
    const user = localStorage.getItem("user");
    if (user) {
      try {
        const parsed: IUser = JSON.parse(user);
        return {
          id: parsed.id,
          name: `${parsed.first_name} ${parsed.last_name}`,
          email: parsed.email,
          avatar: parsed.avatar_url,
        };
      } catch {
        return null;
      }
    }
    return null;
  },

  getPermissions: async () => {
    const user = localStorage.getItem("user");
    if (user) {
      try {
        const parsed: IUser = JSON.parse(user);
        return parsed.role;
      } catch {
        return null;
      }
    }
    return null;
  },

  onError: async (error) => {
    const status = (error as { status?: number }).status;
    if (status === 401 || status === 403) {
      return { logout: true };
    }
    return { error };
  },
};
