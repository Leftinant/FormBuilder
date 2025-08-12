import { Link } from "react-router-dom";
import Navbar from "./components/Navbar";

export default function App() {
  return (
    <>
      <Navbar />
      <div className='w-full md:px-100 px-5 pt-10 text-center flex flex-col items-center'>
        <h1 className='text-[5em] font-bold'>
          Create online forms effortlessly
        </h1>
        <p className='text-lg md:mx-30 mb-30'>
          Create forms with Categorize, Cloze and Comprehension questions. Save
          forms, upload images, preview and collect responses.
        </p>

        <div>
          <Link to='/forms'>
            <button className='btn bg-black text-white text-xl rounded-xl p-7'>
              Create for Free
            </button>
          </Link>
        </div>
      </div>
    </>
  );
}
