import { Search } from "lucide-react";


export default function SearchBar() {
    return (
        <div className="flex justify-center items-center gap-2">


            <div className="flex justify-center items-center gap-2">


                <input className=" cursor-pointer  border border-gray-300 rounded-2xl px-6 py-3 w-80" type="text" placeholder="SearchHere....">

                </input>



            </div>

        </div>
    );
}