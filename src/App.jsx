import React, { useState } from 'react';
import './App.css';

async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export default function App() {
  const [rows, setRows] = useState([{ key: '', value: '' }]);
  const [modalOpen, setModalOpen] = useState(false);
  const [hash, setHash] = useState('');

  const addRow = () => setRows([...rows, { key: '', value: '' }]);
  const removeRow = (index) =>
    setRows(rows.filter((_, i) => i !== index));
  const updateRow = (index, field, value) => {
    const newRows = rows.slice();
    newRows[index][field] = value;
    setRows(newRows);
  };

  const handleHash = async () => {
    const obj = rows.reduce((acc, { key, value }) => {
      if (key) acc[key] = value;
      return acc;
    }, {});
    const json = JSON.stringify(obj);
    const h = await sha256(json);
    setHash(h);
    setModalOpen(true);
  };

  return (
    <div className="container">
      <h1>BCVision Hasher</h1>
      {rows.map((row, index) => (
        <div className="row" key={index}>
          <input
            type="text"
            placeholder="clé"
            value={row.key}
            onChange={(e) => updateRow(index, 'key', e.target.value)}
          />
          <input
            type="text"
            placeholder="valeur"
            value={row.value}
            onChange={(e) => updateRow(index, 'value', e.target.value)}
          />
          <button className="remove" onClick={() => removeRow(index)}>×</button>
        </div>
      ))}
      <button onClick={addRow}>Ajouter une ligne</button>
      <button className="hash" onClick={handleHash}>Hasher</button>

      {modalOpen && (
        <div className="modal">
          <div className="modal-content">
            <p><strong>Hash SHA-256 :</strong></p>
            <p>{hash}</p>
            <button onClick={() => setModalOpen(false)}>Fermer</button>
          </div>
        </div>
      )}
    </div>
  );
}
