import { FormEvent, useRef, useState } from "react";
import { api } from './api';
import { BsChevronUp, BsChevronDown } from 'react-icons/bs';
import { FiEdit3 } from 'react-icons/fi';
import { PiClockClockwiseFill } from 'react-icons/pi';
import { FaTrash } from "react-icons/fa6";
import { FaCheck } from "react-icons/fa";


interface UserModel {
    username: string,
    email: string,
    password: string,
    tasks?: [],
    id: string
  }

interface TaskModel {
    title: string,
    description: string,
    observation: string,
    user?: UserModel,
    id?: number,
    status: string
}

interface TasksListProps{
    tasks: TaskModel[];
    currentUser: UserModel | null
}


export default function TasksList({ tasks }: TasksListProps){
    const [subScreen, setSubScreen] = useState< 'none' | 'update' >('none')
    const [detailsVisible, setDetailsVisible] = useState<boolean[]>([]);
    const [editTask, setEditTask] = useState<TaskModel | null>(null);
    const titleInputRef = useRef<HTMLInputElement | null>(null)
    const descInputRef = useRef<HTMLTextAreaElement | null>(null);
    const obsInputRef = useRef<HTMLInputElement | null>(null)


    const toggleDetails = (index: number) => {
        setDetailsVisible((prevState) => {
          const newState = [...prevState];
          newState[index] = !newState[index];
          return newState;
        });
      }

    function updateScreen(task: TaskModel) {
        setEditTask(task)
        setSubScreen('update')
    }

    async function updateTask(event: FormEvent){
        event.preventDefault();
        const titulo = titleInputRef.current?.value
        const description = descInputRef.current?.value
        const obs = obsInputRef.current?.value
        if (editTask && editTask.id) {
          await api.put(`/task/${editTask.id}`, {
            title: titulo,
            description: description,
            observation: obs || '',
          })
          setEditTask(null)
          setSubScreen('none')
        }
      }

      function autoResize(event: React.FormEvent<HTMLTextAreaElement>) {
        const textarea = event.currentTarget;
        textarea.style.height = 'auto'; // Reseta a altura para recalcular
        textarea.style.height = `${textarea.scrollHeight}px`; // Ajusta a altura com base na altura de rolagem do conteúdo
      }

      async function completeTask (task : TaskModel){
          await api.put(`/task/${task.id}`, {
            status: 'Concluído'
          })
      }

      async function deleteTask(task : TaskModel){
        
        await api.delete(`/task/${task.id}`)
        }
      

    return(
        <div>
          {tasks.map( (task, x) => (
            <div className=" rounded-xl flex items-center justify-center">  
              <div className="w-8/12 bg-customWhite my-2 py-2 rounded-xl items-center justify-center ">                   
                <div className="flex justify-between">                   
                  <div className="flex">
                        <h1 className="text-xl font-semibold pl-5 text-customBrown">{task.title}</h1>
                  
                    <button className='text-3xl' onClick={() => toggleDetails(x)}>
                      {detailsVisible[x] ? <BsChevronUp className="text-customDarkBlue h-5" /> : <BsChevronDown className="text-customDarkBlue h-5" /> }
                    </button>
                    </div>  
                    <div>
                        <button className="mx-3 py-2 px-2 rounded-full bg-yellow-100"
                            onClick={() => updateScreen(task)}>
                            <FiEdit3 className="text-customDarkBlue" />  
                        </button>
                        <button className="mx-3 py-2 px-2 rounded-full bg-red-300"> 
                            <FaTrash className="text-customDarkBlue"
                            onClick={() => deleteTask(task)} />
                        </button>                       
                      <button className="mx-3 py-2 px-2 bg-green-200 rounded-full">
                        <FaCheck className="text-customBlackBlue"
                        onClick={() => completeTask(task)} />
                      </button>                       
                    </div>
                                                                                           
                  </div>

                  {subScreen === 'update' && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-10">
                      <div className="bg-customWhite w-5/12 p-5 mb-80 rounded-2xl">
                        <h2 className="text-2xl font-semibold text-customDarkBlue mb-4">Editar Tarefa</h2>
                        <form className="w-full px-2" onSubmit={updateTask}>
                          <div className="flex justify-center items-center bg-white rounded-t-xl px-2">
                            <p className="font-semibold text-customDarkBlue">Nome:</p>
                            <input
                              ref={titleInputRef}
                              type="text"
                              defaultValue={editTask?.title}
                              placeholder="Nome da tarefa"
                              className="w-full rounded-t-xl text-base text-customDarkBlue focus:text-customDarkBlue focus:outline-none py-2 px-3"
                            />
                          </div>
                          
                          <div className="flex justify-center items-center bg-white px-2">
                            <p className="font-semibold text-customDarkBlue">Descrição:</p>
                            <textarea
                              ref={descInputRef}
                              defaultValue={editTask?.description}
                              placeholder="Descrição"
                              className="w-full text-base focus:outline-none focus:text-customDarkBlue text-customDarkBlue py-2 px-3"
                              rows={1} 
                              onInput={autoResize}
                              style={{ minHeight: '70px' }}   
                            />
                          </div>
                          
                          <div className="flex justify-center items-center bg-white rounded-b-xl px-2">
                            <p className="font-semibold text-customDarkBlue">Obs:</p>
                            <input
                              ref={obsInputRef}
                              type="text"
                              defaultValue={editTask?.observation}
                              placeholder="Obs"
                              className="w-full rounded-b-xl focus:outline-none focus:text-customDarkBlue text-customDarkBlue py-2 px-3"
                            />
                          </div>
                          <div className="flex justify-end mt-4">
                            <button type="button" className="mr-2 bg-rose-600 text-white px-3 py-1 rounded-lg" onClick={() => setSubScreen('none')}>Cancelar</button>
                            <button type="submit" className="bg-emerald-600 text-white px-3 py-1 rounded-lg" >Salvar</button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}

                              
                    {detailsVisible[x] && (
                    <>
                        <p className=" font-medium px-5 text-customGrey">{task.description} </p>
                        {task.observation !== null && (
                        <p className=" font-normal px-5 text-customGrey"> Obs: {task.observation}</p>
                        )}                                               
                    </>       
                    )}
                {task.status === "Pendente" && (
                  <div className="flex items-center px-5">
                    <PiClockClockwiseFill className="text-yellow-600"/>
                    <p className=" px-1 text-yellow-600"> {task.status} </p>
                  </div>
                )} 
                {task.status === "Concluído" && (
                  <div className="flex items-center px-5">
                    <FaCheck className="text-emerald-600 "/>
                    <p className=" px-1 text-emerald-600"> {task.status} </p>
                  </div>
                )}                    
              </div>
            </div>   
          ))}               
        </div>   
      )
    }

    

      

