import { FormEvent, useRef, useState } from "react";
import { api } from './api';

interface UserModel {
    username: string;
    email: string;
    password: string;
    tasks?: [];
    id: string;
}

interface TaskModel {
    title: string;
    description: string;
    observation: string;
    user?: UserModel;
    id?: number;
    status: string;
}

interface LoginFormProps {
    setCurrentUser: (user: UserModel) => void;
    setScreen: (screen: 'login' | 'Dashboard' | 'mesa' | 'CreateTask' | 'register') => void;
}

export default function LoginForm({ setCurrentUser, setScreen }: LoginFormProps) {
    const userInputRef = useRef<HTMLInputElement | null>(null);
    const passwordInputRef = useRef<HTMLInputElement | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    async function loadUser(event: FormEvent) {
        event.preventDefault();

        const username = userInputRef.current?.value;
        const password = passwordInputRef.current?.value;

        if (!username || !password) {
            setMessage('Por favor, preencha todos os campos');
            return;
        }

        try {
            const response = await api.get<UserModel>(`/user/username/${username}`);
            const user = response.data;

            if (user.password === password) {
                setCurrentUser(user);

                const tasksResponse = await api.get<TaskModel[]>(`/task/user/${user.id}`);
                const tasks = tasksResponse.data;

                if (tasks.length === 0) {
                    setScreen('CreateTask');
                } else {
                    setScreen('Dashboard');
                }
            } else {
                setMessage('Username or password wrong');
            }
        } catch (error) {
            setMessage('Erro ao carregar o usuário');
        }
    }

    const togglePassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <form className="flex flex-col space-y-4 py-5" onSubmit={loadUser}>
            <h1 className="text-red-700 font-medium justify-center flex">{message}</h1>
            <input
                ref={userInputRef}
                type="text"
                placeholder="Username"
                className="text-customBrown bg-custombgpink3 rounded-md focus:outline-none py-1 text-lg px-2 font-brastika"
            />
            <div className="relative w-full">
                <input
                    ref={passwordInputRef}
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    className="text-customBrown bg-custombgpink3 focus:outline-none rounded-md py-1 px-2 font-brastika"
                />
                <button
                    type="button"
                    onClick={togglePassword}
                    className="absolute inset-y-0 right-0 flex items-center px-2 bg-custombgpink3 rounded-lg font-medium text-customBrown"
                >
                    {showPassword ? "Hide" : "Show"}
                </button>
            </div>
            <button
                type="submit"
                className="rounded-xl border-4 border-customBlackBlue bg-customAlternativeBlue text-white py-1 text-lg hover:bg-custombgBlue hover:duration-200 font-brastika font-bold"
            >
                Sign in
            </button>
        </form>
    );
}
