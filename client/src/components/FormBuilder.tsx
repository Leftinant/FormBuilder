import { useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

interface Question {
  type: string;
  text: string;
  image?: string;
  metadata: any;
  [key: string]: any;
}

export default function FormBuilder() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [headerImage, setHeaderImage] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);

  const addQuestion = (type: string) => {
    const newQuestion: Question = {
      type,
      text: "",
      metadata: {},
    };
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (index: number, key: string, value: any) => {
    const updated = [...questions];
    updated[index][key] = value;
    setQuestions(updated);
  };

  const uploadBase64 = async (file: File) => {
    const base64 = await toBase64(file);
    const res = await axios.post(`${API}/forms`, { dummy: true });
    return base64;
  };

  const toBase64 = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
    });

  const submitForm = async () => {
    const form = { title, description, headerImage, questions };
    const res = await axios.post(`${API}/forms`, form);
    alert(`Form saved! Preview it at /preview/${res.data._id}`);
  };

  return (
    <div className='space-y-4'>
      <input
        className='input input-bordered w-full'
        placeholder='Form Title'
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        className='textarea textarea-bordered w-full'
        placeholder='Form Description'
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input
        type='file'
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (file) {
            const base64 = await toBase64(file);
            setHeaderImage(base64);
          }
        }}
      />
      <div>
        <h2 className='font-bold text-lg mb-2'>Questions</h2>
        {questions.map((q, i) => (
          <div key={i} className='border p-4 mb-2 rounded'>
            <select
              className='select select-bordered mb-2'
              value={q.type}
              onChange={(e) => updateQuestion(i, "type", e.target.value)}>
              <option value='categorize'>Categorize</option>
              <option value='cloze'>Cloze</option>
              <option value='comprehension'>Comprehension</option>
            </select>
            <textarea
              className='textarea textarea-bordered w-full mb-2'
              placeholder='Question Text'
              value={q.text}
              onChange={(e) => updateQuestion(i, "text", e.target.value)}
            />
            <input
              type='file'
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const base64 = await toBase64(file);
                  updateQuestion(i, "image", base64);
                }
              }}
            />
          </div>
        ))}
        <div className='flex gap-2 mt-4'>
          <button onClick={() => addQuestion("categorize")} className='btn'>
            Add Categorize
          </button>
          <button onClick={() => addQuestion("cloze")} className='btn'>
            Add Cloze
          </button>
          <button onClick={() => addQuestion("comprehension")} className='btn'>
            Add Comprehension
          </button>
        </div>
      </div>
      <button onClick={submitForm} className='btn btn-primary'>
        Submit Form
      </button>
    </div>
  );
}
