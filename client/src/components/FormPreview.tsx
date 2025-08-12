import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

export default function FormPreview() {
  const { id } = useParams();
  const [form, setForm] = useState<any>(null);
  const [answers, setAnswers] = useState<any>({});
  const base = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!id) return;
    axios.get(`${base}/forms/` + id).then((r) => setForm(r.data));
  }, [id]);

  const handleChange = (qid: string, value: any) => {
    setAnswers((s: any) => ({ ...s, [qid]: value }));
  };

  const submit = async () => {
    await axios.post(`${base}/responses`, {
      formId: id,
      answers,
      metadata: { submittedAt: new Date() },
    });
    alert("Submitted. Thanks!");
  };

  if (!form) return <div className='container'>Loading…</div>;
  return (
    <div className='container'>
      <div className='card'>
        <h2>{form.title}</h2>
        <p className='small'>{form.description}</p>
        {form.headerImage && (
          <img src={form.headerImage} alt='header' style={{ maxWidth: 400 }} />
        )}
        <div style={{ marginTop: 12 }}>
          {form.questions.map((q: any, i: number) => (
            <div key={q.id} className='card' style={{ marginBottom: 10 }}>
              <div>
                <strong>
                  {i + 1}. {q.title}
                </strong>
              </div>
              {q.imageUrl && <img src={q.imageUrl} style={{ maxWidth: 200 }} />}
              <div style={{ marginTop: 8 }}>
                {q.type === "categorize" && (
                  <CategorizeQuestion
                    q={q}
                    value={answers[q.id]}
                    onChange={(v: any) => handleChange(q.id, v)}
                  />
                )}
                {q.type === "cloze" && (
                  <ClozeQuestion
                    q={q}
                    value={answers[q.id]}
                    onChange={(v: any) => handleChange(q.id, v)}
                  />
                )}
                {q.type === "comprehension" && (
                  <ComprehensionQuestion
                    q={q}
                    value={answers[q.id]}
                    onChange={(v: any) => handleChange(q.id, v)}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 12 }}>
          <button className='btn' onClick={submit}>
            Submit
          </button>
          <Link to={"/responses/" + id} style={{ marginLeft: 10 }}>
            <button className='btn'>View Responses</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

function CategorizeQuestion({ q, value, onChange }: any) {
  const [selected, setSelected] = useState<any>(value || {});
  useEffect(() => {
    onChange && onChange(selected);
  }, [selected]);
  return (
    <div>
      <div className='small'>
        Drag & drop simulated — click to assign item to category
      </div>
      <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
        <div>
          <div className='small'>Items</div>
          {(q.data.items || []).map((it: string) => (
            <div
              key={it}
              style={{
                padding: 6,
                border: "1px dashed #ccc",
                marginBottom: 6,
                cursor: "pointer",
              }}
              onClick={() => {
                const cat = prompt("Assign to which category?", "") || "";
                if (!cat) return;
                setSelected((s: any) => ({ ...s, [it]: cat }));
              }}>
              {it}{" "}
              {selected[it] && (
                <span style={{ color: "#0a7" }}>→ {selected[it]}</span>
              )}
            </div>
          ))}
        </div>
        <div>
          <div className='small'>Categories</div>
          {(q.data.categories || []).map((c: string) => (
            <div
              key={c}
              style={{ padding: 6, border: "1px solid #eee", marginBottom: 6 }}>
              {c}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ClozeQuestion({ q, value, onChange }: any) {
  const text = q.data.text || "";
  const parts = text.split("___");
  const blanks = parts.length - 1;
  const vals = value || Array(blanks).fill("");
  const update = (i: number, v: string) => {
    const arr = [...vals];
    arr[i] = v;
    onChange(arr);
  };
  return (
    <div>
      <div>
        {parts.map((p: string, i: number) => (
          <span key={i}>
            {p}
            {i < blanks && (
              <input
                className='input'
                value={vals[i] || ""}
                onChange={(e) => update(i, e.target.value)}
                style={{
                  width: 120,
                  display: "inline-block",
                  marginLeft: 6,
                  marginRight: 6,
                }}
              />
            )}
          </span>
        ))}
      </div>
    </div>
  );
}

function ComprehensionQuestion({ q, value, onChange }: any) {
  const vals = value || {};
  const update = (id: string, v: any) => {
    onChange({ ...vals, [id]: v });
  };
  return (
    <div>
      <div className='small'>Passage</div>
      <div style={{ background: "#f7f7f7", padding: 10, borderRadius: 6 }}>
        {q.data.passage}
      </div>
      <div style={{ marginTop: 8 }}>
        {(q.data.questions || []).map((sub: any) => (
          <div key={sub.id} style={{ marginTop: 8 }}>
            <div>
              <strong>{sub.prompt}</strong>
            </div>
            {sub.type === "short" && (
              <input
                className='input'
                value={vals[sub.id] || ""}
                onChange={(e) => update(sub.id, e.target.value)}
              />
            )}
            {sub.type === "mcq" &&
              (sub.choices || []).map((c: any, i: number) => (
                <div key={i}>
                  <label>
                    <input
                      type='radio'
                      name={sub.id}
                      value={c}
                      onChange={() => update(sub.id, c)}
                    />{" "}
                    {c}
                  </label>
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}
