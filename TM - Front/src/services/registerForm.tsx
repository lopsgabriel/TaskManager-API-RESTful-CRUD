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

interface RegisterFormProps{
    setCurrentUser: (user: UserModel) => void;
    setScreen: (screen: 'login' | 'Dashboard' | 'mesa' | 'CreateTask' | 'register') => void;
}


export default function RegisterForm({ setCurrentUser, setScreen }:RegisterFormProps){
    const userInputRef = useRef<HTMLInputElement | null>(null);
    const emailInputRef = useRef<HTMLInputElement | null>(null)
    const passwordInputRef = useRef<HTMLInputElement | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    async function createNewUser(event: FormEvent){
        event.preventDefault();
        const username = userInputRef.current?.value
        const password = passwordInputRef.current?.value
        const email = emailInputRef.current?.value
        const findusername = await api.get<UserModel>(`/user/username/${username}`);
        const findemail = await api.get<UserModel>(`/user/email/${email}`);

        if(findemail.data && findusername.data){
            setMessage('Usarname and Email unavaiable')
            return;

        } else if (findemail.data){
            setMessage('Email unavaiable')
            return; 

        } else if (findusername.data){
            setMessage('Username unavaiable')
            return;

        } else {
            await api.post('/user', {
            username: username,
            password: password,
            email: email 
            })

            const response = await api.get<UserModel>(`/user/username/${username}`);
            const user = response.data;
            setCurrentUser(user);

            const tasksResponse = await api.get<TaskModel[]>(`/task/user/${user.id}`);
            const tasks = tasksResponse.data;

            if (tasks.length === 0) {
                setScreen('CreateTask');
            } else {
                setScreen('Dashboard');
            }
        }    
    }

    const togglePassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <form className="flex flex-col space-y-4 py-5 " onSubmit={createNewUser}>
            <h1 className="text-red-700 font-medium justify-center flex">{message}</h1>
            <input
            ref={emailInputRef}
            type="email"
            placeholder="Email"
            className="text-customBrown bg-customWhite rounded-md py-1 px-2 font-brastika focus:outline-none w-full"
            />
            
            <input 
            ref={userInputRef}
            type="text"
            placeholder="Username"
            className="text-customBrown bg-customWhite rounded-md py-1 text-lg px-2 font-brastika focus:outline-none w-full"
            />

            <div className="relative w-full">   
                <input
                ref={passwordInputRef}
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="text-customBrown bg-customWhite rounded-md py-1 px-2 font-brastika focus:outline-none w-full"
                />

                <button
                    type="button"
                    onClick={togglePassword}
                    className="absolute inset-y-0 right-0 flex items-center px-2 bg-customWhite rounded-lg font-medium text-customBrown"
                >
                    {showPassword ? "Hide" : "Show"}
                </button>
            </div>

            <button  type="submit" className="rounded-xl border-4 border-customBlackBlue bg-customAlternativeBlue text-white py-1 text-lg hover:bg-custombgBlue hover:duration-200 font-brastika font-bold"> Sign Up </button>                 
        </form>
    )
}