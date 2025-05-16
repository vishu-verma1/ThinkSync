import React, { useContext, useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import axiosInstance from "../config/axios";
import { initializeSocket, receiveMessage, sendMessage } from '../config/socket';
import { userContext } from '../context/user.context';
import Markdown from 'markdown-to-jsx'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';



function SyntaxHighlightedCode({ className, children }) {
    const ref = useRef(null);

    useEffect(() => {
        if (ref.current && className?.includes('lang-') && window.hljs) {
            window.hljs.highlightElement(ref.current);
        }
    }, [className, children]);

    return (
        <pre>
            <code ref={ref} className={className}>
                {children}
            </code>
        </pre>
    );
}





const Project = () => {
    const location = useLocation();
    const { project } = location.state || {}
    const [isSidePanelOpen, setIsidePanelOpen] = useState(false);
    const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
    const [selectUserId, setSelectUserId] = useState([]);
    const [users, setUsers] = useState([]);
    const [getProject, setGetProject] = useState(location.state?.project);
    const [collaboratorsRefresh, setCollaboratorsRefresh] = useState(false)
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const { user } = useContext(userContext)
    const messageBox = useRef()
    const codeEditorRef = useRef();
    const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 768);
    // const [fileTree, setFileTree] = useState({})
    // const [currentFile, setCurrentFile] = useState(null)
    // const [openFiles, setOpenFiles] = useState([])
    // const messageBox = React.createRef()

    const sendMessageHandle = () => {
        if (!user) {
            console.error("User not logged in");
            return;
        }

        const messageObject = {
            message,
            sender: { _id: user._id, email: user.email },
        };

        sendMessage('project-message', messageObject);

        // appendoutgoingMessages(messageObject);

        setMessages(prevMessages => [...prevMessages, { sender: user, message }])

        setMessage('');
    };

    const addcollaborators = () => {
        axiosInstance.put(`project/add-user`, {
            projectId: location.state.project._id,
            users: Array.from(selectUserId)
        }).then((res) => {
            setIsAddUserModalOpen(false)
            setCollaboratorsRefresh((prev) => !prev);
        }).catch((error) => {
            console.log(error)
        })
    }


    function WriteAiMessage(message) {
        let messageObject;
        try {
            messageObject = JSON.parse(message);
        } catch (error) {
            // If parsing fails, fallback to plain text
            messageObject = { text: message };
        }
        return (
            <div className="overflow-auto bg-slate-700 m-5 text-white shadow-md rounded-sm p-2">
                <Markdown
                    children={messageObject.text}
                    options={{
                        overrides: {
                            code: SyntaxHighlightedCode,
                        },
                    }}
                />
            </div>
        );
    }



    useEffect(() => {
        const handleResize = () => {
            setIsLargeScreen(window.innerWidth >= 768);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);


    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await axiosInstance.get(`/api/messages/${project._id}`);
                setMessages(response.data); // Update the messages state with fetched data
            } catch (error) {
                console.error("Error fetching messages:", error);
            }
        };

        fetchMessages(); // Fetch messages when the component loads
    }, [project._id, isAddUserModalOpen]);


    useEffect(() => {

        const socketInstance = initializeSocket(project._id); // use the project id from state

        socketInstance.on("connect", () => {
            console.log("Socket connected with id:", socketInstance.id);
        });

        socketInstance.on("connect_error", (error) => {
            console.error("Socket connection error:", error);
        });

        receiveMessage('project-message', data => {
            try {
                const message = data.sender._id === 'ai'
                    ? data.message
                    : data.message;

                console.log(message, "------")
                setMessages(prevMessages => [...prevMessages, { ...data, message }]); // Update messages state
            } catch (error) {
                console.error("Failed to parse message:", error);
            }
        });

        axiosInstance.get(`project/get-project/${location.state.project._id}`).then((res) => {
            setGetProject(res.data.project)
            // console.log(res.data.project, '-----')
        }).catch((error) => { console.log(error) })



        axiosInstance.get(`users/all`).then((res) => {
            // console.log(res.data.users)
            setUsers(res.data.users)
        }).catch((error) => {
            console.log(error)
        })

        return () => {
            socketInstance.off("project-message", receiveMessage);
        };

    }, [collaboratorsRefresh])


    const handleUserClick = (id) => {
        if (selectUserId.includes(id)) {
            // If the user is already selected, remove them
            setSelectUserId(selectUserId.filter((userId) => userId !== id));
        } else {
            // If the user is not selected, add them
            setSelectUserId([...selectUserId, id]);
        }
    }

    function scrollToBottom() {
        if (messageBox.current) {
            messageBox.current.scrollTop = messageBox.current.scrollHeight;
        }
    }

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (codeEditorRef.current) {
            codeEditorRef.current.scrollTop = codeEditorRef.current.scrollHeight;
        }
    }, [messages]);

    // console.log(isAddUserModalOpen, "----")


    return (
        <main className='h-screen w-screen flex bg-white'>


            <section className="left relative flex flex-col h-screen md:w-1/3 min-w-96 w-full bg-slate-300">
                <header className='flex justify-between items-center p-3 w-full bg-slate-200 absolute top-0 '>

                    <button
                        onClick={() => { setIsAddUserModalOpen(!isAddUserModalOpen); }}
                        className='flex gap-1 hover:bg-slate-300 px-2 py-1 rounded cursor-pointer '><i className="ri-add-fill "></i> <span>Add Collaborators</span></button>

                    <button className='shadow-md px-2 bg-slate-400 rounded-md cursor-pointer'
                        onClick={() => { setIsidePanelOpen(!isSidePanelOpen) }}
                    >
                        <i className="ri-team-fill text-2xl "></i>
                    </button>
                </header>


                <div className="conversation-area mt-14 flex-grow flex flex-col  relative"

                >

                    <div
                        ref={messageBox}
                        className="message-box flex-1 flex flex-col gap-2 p-2 overflow-y-auto max-h-[calc(100vh-120px)] scrollbar-hide scroll-smooth"
                    >
                        {messages.map((msg, index) => {
                            // Check if the message is from AI
                            const isAiMessage = msg.sender._id === 'ai';

                            // Render AI messages only in the right section for large screens
                            if (isAiMessage && isLargeScreen) {
                                return <div className='message flex flex-col p-2 bg-slate-500 text-white w-fit rounded-md'>
                                    <small className="opacity-65 text-xs">{msg.sender.email}</small>
                                    <p className='text-sm'>i have given what you asked on the right side</p></div>; // Skip rendering in the left section
                            }

                            return (
                                <div
                                    key={index}
                                    className={`${isAiMessage ? 'max-w-80' : 'max-w-52'} ${msg.sender._id === user._id.toString() && 'ml-auto'
                                        } message flex flex-col p-2 bg-slate-50 w-fit rounded-md shadow-md`}

                                >
                                    <small className="opacity-65 text-xs">{msg.sender.email}</small>
                                    <div className="text-sm ">
                                        {isAiMessage ? (
                                            // Render AI message in a user-friendly format for smaller screens
                                            !isLargeScreen ? WriteAiMessage(msg.message) : null
                                        ) : (
                                            <p>{msg.message}</p>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>



                    <div className="input-field p-2  w-full flex items-center gap-1 absolute bottom-0  ">
                        <input
                            value={message}
                            onChange={(e) => { setMessage(e.target.value) }}
                            className='p-2 px-4 flex-grow rounded border-none outline-none bg-white' type="text" placeholder='Type message here ' />
                        <button
                            onClick={sendMessageHandle}
                            className='shadow-md px-2 py-1 bg-slate-900 rounded-md '><i className="ri-send-plane-fill text-2xl text-white"></i> </button>
                    </div>
                </div>

                <div className={`side-panel w-full h-full flex flex-col gap-2  bg-slate-50 absolute top-0 transition-all duration-500 ease-in-out  ${isSidePanelOpen ? "-translate-x-0" : "-translate-x-full"}`}>
                    <header className='flex justify-between p-4 w-full bg-slate-200'>
                        <h1 className='font-semibold text-lg'>Collaborators</h1>
                        <button className='shadow-md px-2 bg-slate-400 rounded-md' onClick={() => { setIsidePanelOpen(prev => !prev) }}>
                        <i className="ri-close-large-fill text-xl"></i></button>
                    </header>

                    <div className="users cursor-pointer flex flex-col gap-2">
                        {getProject.users.map((user, index) => (
                            <div className="user flex gap-2 items-center hover:bg-slate-200 p-1">
                                <div className='bg-slate-400 aspect-square flex w-fit h-fit items-center justify-center p-5  rounded-full' >
                                    <i className="ri-user-2-fill absolute text-white text-xl"></i>
                                </div>
                                <h1 className='font-semibold text-lg'>{user.email}</h1>
                            </div>
                        ))}
                    </div>

                </div>

                

            </section>



            {isLargeScreen && (
                <section className="right bg-zinc-300  h-full w-[70vw] p-2 hidden md:flex">
                    <div ref={codeEditorRef} className="code-editor overflow-auto scrollbar-hide  ">
                        <div className='text-sm'>
                            {messages.map((msg, index) => (
                                msg.sender._id === 'ai' && WriteAiMessage(msg.message)
                            ))}
                        </div>
                    </div>
                </section>
            )}



            {/* colaborator Modal  */}
            {isAddUserModalOpen && (
                    <div className="modaal fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                        <div className="bg-white  w-11/12 max-w-md p-4 rounded-lg shadow-lg">
                            <header className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold">Select User</h2>
                                <button
                                    className="text-gray-500 hover:text-gray-700"
                                    onClick={() => setIsAddUserModalOpen(!isAddUserModalOpen)}
                                >
                                    <i className="ri-close-line text-2xl"></i>
                                </button>
                            </header>
                            <div className="user-list flex flex-col gap-2 max-h-96 overflow-auto">
                                {users.map((user, index) => (
                                    <div
                                        key={user._id}
                                        className={`user-tile flex items-center gap-2 p-2 bg-gray-100 hover:bg-gray-200 rounded cursor-pointer ${selectUserId.indexOf(user._id) != -1 ? "bg-gray-300" : ""}`}
                                        onClick={() => handleUserClick(user._id)}
                                    >
                                        <div className="bg-gray-400 aspect-square w-10 h-10 flex items-center justify-center rounded-full">
                                            <i className="ri-user-2-fill text-white text-lg"></i>
                                        </div>
                                        <span className="font-medium">{user.email}</span>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={addcollaborators}
                                className='bg-black hover:bg-gray-800 p-2 mt-5 text-white  '>Add Collaborators <i className="ri-user-add-fill"></i></button>
                        </div>
                    </div>

                    // <div className='h-10 w-20 fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 bg-red-200'>hlo</div>
                )}


        </main>
    )
}

export default Project