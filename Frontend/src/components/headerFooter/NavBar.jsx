import {Search,} from "lucide-react"
import React from "react";

const Navbar = () => {
    return (
        <header>
            <nav>
                <div className="navbar items-center h-18 bg-zinc-100 shadow-sm">
                    <div className="flex-1">
                        <h1 className=" font-bold text-xl text-black
                        ">ThinkSync</h1>
                    </div>
                    <div className="flex gap-2 ">
                        <span className="flex gap-1 items-center">
                            <input
                                type="text"
                                placeholder="Search"
                                className="border-2 p-1 rounded bg-white border-gray-300  w-24 md:w-auto"
                            />
                            <button>
                            <Search className="text-gray-600 w-5 h-5" />

                                
                            
                            </button>
                        </span>
                        <div className="dropdown dropdown-end text-white">
                            <div
                                tabIndex={0}
                                role="button"
                                className="btn btn-ghost btn-circle avatar"
                            >
                                <div className="w-10 rounded-full">
                                    <img
                                        alt="Tailwind CSS Navbar component"
                                        src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                                    />
                                </div>
                            </div>
                            <ul
                                tabIndex={0}
                                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
                            >
                                <li>
                                    <a className="justify-between">
                                        Profile
                                    </a>
                                </li>
                                <li>
                                    <a>Settings</a>
                                </li>
                                <li>
                                    <a>Logout</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Navbar;
