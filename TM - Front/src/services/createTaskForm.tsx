import { FormEvent, useRef, useState } from "react";
import { api } from './api';

interface UserModel {
    username: string;
    email: string;
    password: string;
    tasks?: [];
    id: string;
}

interface CreateTaskFormProps{
    currentUser: UserModel | null;
    setScreen: (screen: 'login' | 'Dashboard' | 'mesa' | 'CreateTask' | 'register') => void;
}

export default function CreateTaskForm({ currentUser, setScreen}:CreateTaskFormProps){
    const titleInputRef = useRef<HTMLInputElement | null>(null)
    const descInputRef = useRef<HTMLInputElement | null>(null)
    const obsInputRef = useRef<HTMLInputElement | null>(null)
    const [clickBottom, setclickBottom] = useState(false)

    async function createNewTaskButtom(){
        const titulo = titleInputRef.current?.value;
        const description = descInputRef.current?.value;       
        setclickBottom(!!titulo && !!description);
      }

    async function createNewTask(event: FormEvent){
        event.preventDefault();
        const titulo = titleInputRef.current?.value
        const description = descInputRef.current?.value
        const obs = obsInputRef.current?.value
  
        await api.post('/task', {
          title: titulo,
          description: description,
          observation: obs || '',
          userId: currentUser?.id
        }) 

        titleInputRef.current!.value = ''
        descInputRef.current!.value =''
        obsInputRef.current!.value =''
  
        setScreen('Dashboard')      
      }


    return(
        <form className=" w-full my-4 px-5" onSubmit={createNewTask}>
            <input
            ref = {titleInputRef}
            type="text"
            placeholder="Nome da tarefa"
            className="w-full rounded-t-xl text-customDarkBlue  focus:outline-none py-2 font-semibold px-3"
            />       
            <input
            ref = {descInputRef}
            type="text"
            placeholder="Descrição"
            className="w-full text-sm focus:outline-none text-customDarkBlue  py-2 font-semibold px-3"
            onChange={() => createNewTaskButtom()}
            />   
            <input
            ref = {obsInputRef}
            type="text"
            placeholder="obs"
            className="w-full rounded-b-xl text-sm focus:outline-none text-customDarkBlue  py-2 px-3"
            onChange={() => createNewTaskButtom()}
            />     
            <div className="justify-end flex px-8">
            <button className={`bg-customAlternativeBlue border-2  border-customGrey mt-2 font-semibold text-white hover:bg-custombgBlue2 duration-300  rounded-xl px-2 py-1 ${!clickBottom && 'opacity-50 cursor-not-allowed'}`}
            type="submit"                 
            disabled = {!clickBottom} > Criar Tarefa </button> 
            </div>                                         
      </form>    
    )
}