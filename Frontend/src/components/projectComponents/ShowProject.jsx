import React, { useState } from 'react'

import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from '@/components/ui/button'
import { Loader, Trash2 } from 'lucide-react'
import axiosInstance from '@/config/axios'
import { useNavigate } from 'react-router-dom'








const ShowProject = ({ project, setRefreshProjects }) => {

  const [isPending, setIsPending] = useState(false)
  const navigate = useNavigate();





  const deleteProjectHandle = async (projectId) => {
    setIsPending(true)
    axiosInstance.delete(`/project/delete-project/${projectId}`)
      .then((response) => {
        console.log(response.data, "---")
        setIsPending(false)
        setRefreshProjects((prev) => !prev);
      }).catch((error) => {
        console.log(error)
      })
  }

  console.log(project, '--')

  return (

    <div
      onClick={() => {
        navigate(`/project`, {
          state: { project }
        })
      }}
      className='projects h-full w-full hover:scale-110 transition-all duration-200 ease-in-out '>
      <Card className='h-full' key={project._id}>
        <CardHeader>
          <CardTitle>{project.name}</CardTitle>
        </CardHeader>


        <div className="flex justify-between ">

          <div className='gap-2 px-3 flex font-semibold'>
            <p> <small> <i className="ri-user-line"></i> Collaborators</small> :</p>
            {project.users.length}
          </div>

          <CardFooter className='flex justify-end'>
            <Button onClick={(e) => {e.stopPropagation(); deleteProjectHandle(project._id)}}> {isPending ? <Loader className='animate-spin' /> : <Trash2 />} </Button>
          </CardFooter>
        </div>

      </Card>

    </div>




  )
}

export default ShowProject