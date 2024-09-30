  import { FormEvent, useEffect, useRef, useState } from "react"
  import { api } from './services/api'
  import { RxDashboard } from "react-icons/rx"
  import { MdAddCircleOutline } from "react-icons/md";
  import LoginForm  from "./services/loginForm"
  import RegisterForm  from "./services/registerForm"
  import TasksList  from "./services/tasksList"
  import CreateTaskForm  from "./services/createTaskForm"



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

  export default function App() {
    const [screen, setscreen] = useState<'login' | 'Dashboard' | 'mesa' | 'CreateTask' | 'register' >('login')
    const [currentUser, setCurrentUser] = useState<UserModel | null>(null)
    const [tasks, setTasks] = useState<TaskModel[]>([])



    useEffect(()=>{
      async function loadTasks(){
        if ( screen === "Dashboard" && currentUser){
          try{
          const response = await api.get(`/task/user/${currentUser?.id}`)
        setTasks(response.data)

          } catch (error){
            console.error('Erro ao carregar tarefas')
          }  
        }       
      }
      
      loadTasks()
    })

    function sideBarOptions(x: number) {
      if (x === 2){
        setscreen('CreateTask')
      } else if (x === 1){
        setscreen('Dashboard')
      } else if (x === 3) {
        setscreen('mesa')
      }
    }

    return (

      <div>
        {screen === 'login' && (
          <div className="min-h-screen flex flex-col" style={{ backgroundImage: "url('cozy_background2.png')", backgroundSize: "100%" }}>
          <header className=" flex justify-between px-5">     
            <img src="tmlogo.png" alt="Logo task manager" className="h-16"/>   
          </header>   
          <main className=" w-full flex-grow">
              <div className=" justify-center flex py-8">
              <div className=" w-4/12 border-4 border-customBlackBlue rounded-xl bg-customGreyBrown flex  justify-center  ">
                <div>
                  <h1 className="text-5xl  text-customWhite  items-center flex flex-col pb-5 pt-10 font-medium font-brastika"> SING IN</h1>
                  <LoginForm setCurrentUser={setCurrentUser} setScreen={setscreen} />
                  <div className="flex justify-center mb-4">
                    <p className=""> Don't have an account? </p>
                    <button className=" ml-1  font-semibold" onClick={() =>setscreen('register')}> Sign Up</button>
                  </div>
                </div>         
              </div>
            </div>
          </main>
        </div>
        )}

        {screen === 'register' && (
          <div className="min-h-screen flex flex-col" style={{ backgroundImage: "url('cozy_background2.png')", backgroundSize: "100%" }}>
            <header className=" flex justify-between px-5">     
              <img src="tmlogo.png" alt="Logo task manager" className="h-16"/>   
            </header>   
            <main className=" w-full flex-grow">
              <div className=" justify-center flex py-8">
                <div className=" w-4/12 border-4 border-customBlackBlue rounded-xl bg-customGreyBrown flex  justify-center  ">
                  <div>
                    <h1 className="text-5xl  text-customWhite  items-center flex flex-col pb-5 pt-10 font-medium font-brastika"> SIGN UP</h1>
                    <RegisterForm setCurrentUser={setCurrentUser} setScreen={setscreen} />
                    <div className="flex justify-center mb-4">
                      <p> Have an account? </p>
                      <button className=" ml-1  font-semibold" onClick={() =>setscreen('login')}> Sign In</button>
                    </div>                 
                  </div>         
                </div>
              </div>
            </main>
          </div>
        )}

        {screen === 'Dashboard' && (
          <div className="min-h-screen flex  bg-custombgpink4">
            <div className=" flex-col w-2/12 flex-grow px-2 bg-custombgpink3 ">
              <img src="tmlogo2.png" alt="Logo task manager" className="h-12"/> 
              <button className="flex mt-20 my-5 pl-2 pr-6  hover:bg-custombgPink5 rounded-2xl items-center" onClick={() => sideBarOptions(1)}>
                <RxDashboard className="mr-1 text-customGrey"/>
                <h1 className="text-2xl font-thin text-customGrey"> Dashboard </h1>
              </button>
              <button className="flex  my-5 pl-2 pr-6  hover:bg-custombgPink5 rounded-2xl items-center" onClick={() => sideBarOptions(2)}>
                <MdAddCircleOutline className="mr-1  text-customGrey" />
                <h1 className="text-customGrey font-thin text-2xl"> Criar Tarefa </h1>
              </button>           
              
            </div>
            <div className="w-full items-center justify-center " style={{ backgroundImage: "url('HKbgpink2.png')", backgroundSize: "100%" }}>
              <div className=" pt-16 flex items-center justify-center">
                <h1 className="font-brastika text-customBrown text-4xl">Minhas Tarefas</h1>           
              </div>
              <TasksList currentUser={currentUser} tasks={tasks} />                      
            </div>
          </div>       
        )}  

        {screen === 'CreateTask' && (
          <div className="min-h-screen flex  bg-custombgpink4">
            <div className=" flex-col w-2/12 flex-grow px-2 bg-custombgpink3 ">
              <img src="tmlogo2.png" alt="Logo task manager" className="h-12"/> 
              <button className="flex mt-20 my-5 pl-2 pr-6  hover:bg-custombgPink5 rounded-2xl items-center" onClick={() => sideBarOptions(1)}>
                <RxDashboard className="mr-1 text-customGrey"/>
                <h1 className="text-2xl font-thin text-customGrey"> Dashboard </h1>
              </button>
              <button className="flex  my-5 pl-2 pr-6  hover:bg-custombgPink5 rounded-2xl items-center" onClick={() => sideBarOptions(2)}>
                <MdAddCircleOutline className="mr-1  text-customGrey" />
                <h1 className="text-customGrey font-thin text-2xl"> Criar Tarefa </h1>
              </button>           
              
            </div>
            <div className="w-full items-center justify-center " style={{ backgroundImage: "url('HKbgpink2.png')", backgroundSize: "100%" }}>
              <div className=" pt-16 flex items-center justify-center">
                <h1 className="font-brastika text-customBrown text-4xl">Criar Tarefa</h1>           
              </div>

              <div className=" rounded-xl flex items-center justify-center">
                  <div className="w-8/12 bg-custombgpink3 my-2 py-2 rounded-xl items-center justify-center ">
                    <CreateTaskForm currentUser={currentUser} setScreen={setscreen}/>                
                  </div>
              </div>
            </div>  
          </div>  
        )}   
      </div>    
    )
  }