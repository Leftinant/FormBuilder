import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export default function FormPreview() {
  const { id } = useParams();
  const [form, setForm] = useState<any>(null);

  useEffect(() => {
    axios.get(`${API}/forms/${id}`).then((res) => setForm(res.data));
  }, [id]);

  if (!form) return <div className='p-4'>Loading form...</div>;

  return (
    <div className='p-6 max-w-3xl mx-auto'>
      {form.headerImage && (
        <img src={form.headerImage} alt='Header' className='mb-4' />
      )}
      <h1 className='text-3xl font-bold mb-2'>{form.title}</h1>
      <p className='mb-4 text-gray-600'>{form.description}</p>
      {form.questions.map((q: any, i: number) => (
        <div key={i} className='mb-4 border p-4 rounded'>
          <p className='font-semibold'>{q.text}</p>
          {q.image && <img src={q.image} alt='Question' className='mt-2' />}
          <input className='input input-bordered w-full mt-2' />
        </div>
      ))}
    </div>
  );
}
