import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { nanoid } from "nanoid";

interface Form {
  _id: string;
  title: string;
  createdAt: string;
}

type ViewType = "list" | "create";

type Question = any;

function CategorizeEditor({
  q,
  onChange,
}: {
  q: Question;
  onChange: (q: Question) => void;
}) {
  const addCategory = () => {
    const categories = [
      ...(q.data.categories || []),
      `Category ${(q.data.categories || []).length + 1}`,
    ];
    onChange({ ...q, data: { ...q.data, categories } });
  };
  const addItem = () => {
    const items = [
      ...(q.data.items || []),
      `Item ${(q.data.items || []).length + 1}`,
    ];
    onChange({ ...q, data: { ...q.data, items } });
  };
  return (
    <div>
      <div className='small'>Categories:</div>
      {(q.data.categories || []).map((c: string, i: number) => (
        <input
          key={i}
          value={c}
          onChange={(e) => {
            const categories = [...q.data.categories];
            categories[i] = e.target.value;
            onChange({ ...q, data: { ...q.data, categories } });
          }}
          className='input'
          style={{ marginBottom: 6 }}
        />
      ))}
      <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
        <button className='btn' onClick={addCategory}>
          + Category
        </button>
        <button className='btn' onClick={addItem}>
          + Item
        </button>
      </div>
      <div style={{ marginTop: 8 }}>
        <div className='small'>Items:</div>
        {(q.data.items || []).map((it: string, i: number) => (
          <input
            key={i}
            value={it}
            onChange={(e) => {
              const items = [...q.data.items];
              items[i] = e.target.value;
              onChange({ ...q, data: { ...q.data, items } });
            }}
            className='input'
            style={{ marginBottom: 6 }}
          />
        ))}
      </div>
    </div>
  );
}

function ClozeEditor({
  q,
  onChange,
}: {
  q: Question;
  onChange: (q: Question) => void;
}) {
  return (
    <div>
      <div className='small'>Cloze text (use ___ for blanks)</div>
      <textarea
        value={q.data.text || ""}
        onChange={(e) =>
          onChange({ ...q, data: { ...q.data, text: e.target.value } })
        }
        className='input'
        style={{ height: 120 }}
      />
    </div>
  );
}

function ComprehensionEditor({
  q,
  onChange,
}: {
  q: Question;
  onChange: (q: Question) => void;
}) {
  const addQ = () => {
    const qs = [
      ...(q.data.questions || []),
      { id: nanoid(), type: "short", prompt: "New question" },
    ];
    onChange({ ...q, data: { ...q.data, questions: qs } });
  };
  return (
    <div>
      <div className='small'>Passage</div>
      <textarea
        value={q.data.passage || ""}
        onChange={(e) =>
          onChange({ ...q, data: { ...q.data, passage: e.target.value } })
        }
        className='input'
        style={{ height: 120 }}
      />
      <div style={{ marginTop: 8 }}>
        {(q.data.questions || []).map((qq: any, i: number) => (
          <div key={qq.id} style={{ marginBottom: 6 }}>
            <input
              value={qq.prompt}
              onChange={(e) => {
                const qs = [...q.data.questions];
                qs[i].prompt = e.target.value;
                onChange({ ...q, data: { ...q.data, questions: qs } });
              }}
              className='input'
            />
            <select
              value={qq.type}
              onChange={(e) => {
                const qs = [...q.data.questions];
                qs[i].type = e.target.value;
                onChange({ ...q, data: { ...q.data, questions: qs } });
              }}
              style={{ marginTop: 4 }}
              className='input'>
              <option value='short'>Short answer</option>
              <option value='mcq'>Multiple choice</option>
            </select>
            {qq.type === "mcq" && (
              <textarea
                value={qq.choices?.join("\n") || ""}
                onChange={(e) => {
                  const qs = [...q.data.questions];
                  qs[i].choices = e.target.value.split("\n");
                  onChange({ ...q, data: { ...q.data, questions: qs } });
                }}
                className='input'
                style={{ marginTop: 4 }}
                placeholder='One choice per line'
              />
            )}
          </div>
        ))}
        <button className='btn' onClick={addQ}>
          + Add sub-question
        </button>
      </div>
    </div>
  );
}

export default function MyForms() {
  const [forms, setForms] = useState<Form[]>([]);
  const [view, setView] = useState<ViewType>("list");
  const [title, setTitle] = useState("Untitled form");
  const [description, setDescription] = useState("");
  const [headerImage, setHeaderImage] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const base = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const res = await axios.get(`${base}/forms`);
        setForms(res.data);
      } catch (error) {
        console.error("Error fetching forms:", error);
      }
    };
    fetchForms();
  }, []);

  const addQuestion = (type: string) => {
    const q = {
      id: nanoid(),
      type,
      title: type.charAt(0).toUpperCase() + type.slice(1) + " question",
      imageUrl: "",
      data:
        type === "categorize"
          ? { categories: ["A", "B"], items: ["a", "b"] }
          : type === "cloze"
          ? { text: "Fill this blank: ___ and ___" }
          : { passage: "", questions: [] },
    };
    setQuestions((s) => [...s, q]);
  };

  const updateQuestion = (idx: number, q: Question) => {
    const arr = [...questions];
    arr[idx] = q;
    setQuestions(arr);
  };

  const uploadImage = async (file: File) => {
    const fd = new FormData();
    fd.append("file", file);
    const res = await axios.post(`${base}/forms/upload-image`, fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.url;
  };

  const onHeaderFile = async (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await uploadImage(file);
    setHeaderImage(url);
  };

  const onQImage = async (file: File, idx: number) => {
    const url = await uploadImage(file);
    const q = { ...questions[idx], imageUrl: url };
    updateQuestion(idx, q);
  };

  const saveForm = async () => {
    const body = { title, description, headerImage, questions };
    const res = await axios.post(`${base}/forms`, body);
    alert("Form saved. ID: " + res.data._id);
  };

  return (
    <div className='flex h-screen'>
      <aside className='w-64 bg-gray-700 text-white p-6 flex flex-col'>
        <h2 className=' font-bold text-2xl mb-6'>Form Builder</h2>
        <nav className='flex flex-col gap-3'>
          <button
            className='hover:text-gray-300 text-left'
            onClick={() => setView("list")}>
            📄 My Forms
          </button>
          <button
            className='hover:text-gray-300 text-left'
            onClick={() => setView("create")}>
            📁 Create new folder
          </button>
        </nav>
      </aside>

      {view === "list" && (
        <main className='flex-1 p-8'>
          <div className='flex justify-between items-center mb-6'>
            <h1 className='text-2xl font-semibold'>My Forms</h1>
            <Link
              to='/create-form'
              className='bg-black hover:bg-gray-900 text-white px-4 py-2 rounded-lg font-medium'>
              + Create a new form
            </Link>
          </div>

          {forms.length === 0 ? (
            <div className='flex flex-col items-center justify-center h-64 text-gray-400'>
              <p className='text-lg'>✨ Something great is brewing!</p>
              <p>Create your first form and see it listed here.</p>
            </div>
          ) : (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
              {forms.map((form) => (
                <div
                  key={form._id}
                  className='bg-gray-900 p-4 rounded-lg shadow hover:shadow-purple-500/20 transition'>
                  <h2 className='text-lg font-medium mb-2'>{form.title}</h2>
                  <p className='text-sm text-gray-400'>
                    Created: {new Date(form.createdAt).toLocaleDateString()}
                  </p>
                  <Link
                    to={`/edit-form/${form._id}`}
                    className='mt-4 inline-block text-purple-400 hover:underline'>
                    Edit Form →
                  </Link>
                </div>
              ))}
            </div>
          )}
        </main>
      )}
      {view === "create" && (
        <div className='container p-8'>
          <div className='card'>
            <h2 className='text-2xl font-semibold'>Create Form</h2>
            <div style={{ marginTop: 8 }}>
              <input
                className='input'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder='Form title'
              />
            </div>
            <div style={{ marginTop: 8 }}>
              <input
                className='input'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder='Description'
              />
            </div>
            <div style={{ marginTop: 8 }}>
              <div className='small'>Header Image</div>
              {headerImage && (
                <img
                  src={headerImage}
                  alt='header'
                  style={{
                    maxWidth: 200,
                    display: "block",
                    marginTop: 6,
                    marginBottom: 6,
                  }}
                />
              )}
              <input type='file' onChange={onHeaderFile} />
            </div>

            <div style={{ marginTop: 12 }}>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  className='btn'
                  onClick={() => addQuestion("categorize")}>
                  Add Categorize
                </button>
                <button className='btn' onClick={() => addQuestion("cloze")}>
                  Add Cloze
                </button>
                <button
                  className='btn'
                  onClick={() => addQuestion("comprehension")}>
                  Add Comprehension
                </button>
              </div>
            </div>

            <div style={{ marginTop: 12 }}>
              {questions.map((q, idx) => (
                <div key={q.id} className='card' style={{ marginBottom: 10 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}>
                    <strong>
                      {idx + 1}. {q.title}
                    </strong>
                    <div>
                      <button
                        className='btn'
                        onClick={() => {
                          const arr = [...questions];
                          arr.splice(idx, 1);
                          setQuestions(arr);
                        }}>
                        Delete
                      </button>
                    </div>
                  </div>
                  <div style={{ marginTop: 8 }}>
                    <input
                      className='input'
                      value={q.title}
                      onChange={(e) => {
                        const arr = [...questions];
                        arr[idx].title = e.target.value;
                        setQuestions(arr);
                      }}
                    />
                  </div>
                  <div style={{ marginTop: 8 }}>
                    <div className='small'>Question Image</div>
                    {q.imageUrl && (
                      <img
                        src={q.imageUrl}
                        alt=''
                        style={{
                          maxWidth: 150,
                          display: "block",
                          marginTop: 6,
                        }}
                      />
                    )}
                    <input
                      type='file'
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) await onQImage(file, idx);
                      }}
                    />
                  </div>
                  <div style={{ marginTop: 8 }}>
                    {q.type === "categorize" && (
                      <CategorizeEditor
                        q={q}
                        onChange={(newQ) => updateQuestion(idx, newQ)}
                      />
                    )}
                    {q.type === "cloze" && (
                      <ClozeEditor
                        q={q}
                        onChange={(newQ) => updateQuestion(idx, newQ)}
                      />
                    )}
                    {q.type === "comprehension" && (
                      <ComprehensionEditor
                        q={q}
                        onChange={(newQ) => updateQuestion(idx, newQ)}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 12 }}>
              <button className='btn' onClick={saveForm}>
                Save Form
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
