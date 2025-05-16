import React, { useContext, useEffect, useState } from 'react'
import { userContext } from '../context/user.context'
import { useNavigate } from 'react-router-dom';
import axiosInstance from "../config/axios";
import projectBg from '/images/1.jpg';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import ShowProject from '@/components/projectComponents/ShowProject';
import { Loader2 } from 'lucide-react';

const Home = () => {
  const { user, } = useContext(userContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectName, setProjectName] = useState('')
  const [projects, setProjects] = useState([])
  const [refreshProjects, setRefreshProjects] = useState(false);
  const [showError, setShowError] = useState(false);
  const [isPending, setIsPending] = useState(false);


  


  function createProject(e) {
    e.preventDefault()
    // console.log({ projectName })
    setIsPending(true);
    axiosInstance.post('/project/create-project', {
      name: projectName,
    })
      .then((res) => {
        // console.log(res,"ooo")
        setIsPending(false)
        setProjectName("");
        setRefreshProjects((prev) => !prev);
        setShowError(false);
      })
      .catch((error) => {
        console.log(error)
        setShowError(true);
      })
  }




  useEffect(() => {
    axiosInstance.get('/project/get-projects').then((res) => {
      // console.log("API Response:", res.data);
      setProjects(res.data.Projects);
    }).catch(err => {
      console.error("Error fetching projects:", err);
    });

  }, [refreshProjects])

 

  return <>
    <main className=' bg-white h-[calc(100vh - 4.5rem - 4.5rem)]'>

      <div  className="min-h-[84vh] w-full bg-cover bg-center p-4 rounded-md  ">

      



        <div className='p-3 mt-2'  >
          <Dialog>
            <DialogTrigger className='bg-black text-white rounded  p-2 text-lg cursor-pointer'> Create New Project</DialogTrigger>
            <DialogContent >
              <DialogHeader >
                <form className='flex gap-5 flex-col' onSubmit={createProject}>
                  <DialogTitle className='text-xl'>Create New Project </DialogTitle>
                  <div>
                    <label className='p-1'>Project Name</label>
                    <Input
                      className={`mt-1 text-wrap border border-gray-400`}
                      placeholder='Enter Project Name'
                      onChange={(e) => setProjectName(e.target.value)}
                      value={projectName}
                    />
                  </div>


                  <Button className='w-full mt-2' type="submit" disabled={isPending}>
                    {
                      isPending ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Please Wait...</>) : ('Create')
                    }
                  </Button>

                </form>
                {showError && <p className='text-red-500 mt-3'>Project name must be at least 3 characters long</p>}
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>

        <div className="projects grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 mt-3 p-4  scroll-smooth">
          {
            projects?.map((project, id) => {
              return <ShowProject
               project={project} setRefreshProjects={setRefreshProjects} />
            })
          }
        </div>

        {/* {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-md shadow-md w-1/3">
              <h2 className="text-xl mb-4">Create New Project</h2>
              <form onSubmit={createProject}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Project Name</label>
                  <input
                    onChange={(e) => setProjectName(e.target.value)}
                    value={projectName}
                    type="text" className="mt-1 block w-full p-2 border border-gray-300 rounded-md" required />
                </div>
                <div className="flex justify-end">
                  <button type="button" className="mr-2 px-4 py-2 bg-gray-300 rounded-md" onClick={() => setIsModalOpen(false)}>Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md">Create</button>
                </div>
                {showError && <p className='text-red-500 mt-3'>Project name must be at least 3 characters long</p>}
              </form>
            </div>
          </div>
        )} */}

      </div>
    </main>
  </>

}

export default Home