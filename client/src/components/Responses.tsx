import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function Responses() {
  const { id } = useParams();
  const [list, setList] = useState<any[]>([]);
  const base = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!id) return;
    axios.get(`${base}/responses/` + id).then((r) => setList(r.data));
  }, [id]);
  return (
    <div className='container'>
      <h2>Responses for form {id}</h2>
      {list.map((r) => (
        <div key={r._id} className='card' style={{ marginBottom: 8 }}>
          <div className='small'>
            Submitted: {new Date(r.createdAt).toLocaleString()}
          </div>
          <pre style={{ whiteSpace: "pre-wrap" }}>
            {JSON.stringify(r.answers, null, 2)}
          </pre>
        </div>
      ))}
    </div>
  );
}
