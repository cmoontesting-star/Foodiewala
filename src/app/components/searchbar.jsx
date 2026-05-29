"use client";


import { useState } from "react";


export default function SearchBar({ search, handleSearch }) {
    return (
        <div className="flex justify-center items-center gap-2">


            <div className="flex justify-center items-center gap-2">


                <input className=" cursor-pointer  border border-gray-300 rounded-2xl px-6 py-3 w-80" type="text" placeholder="SearchHere...." value={search} onChange={handleSearch}>

                </input>



            </div>

        </div>
    );
}