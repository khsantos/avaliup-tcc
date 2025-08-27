import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProfileGeneral from './profile_general/ProfileGeneral';
import ProfileEdit from './profile_edit/ProfileEdit';

function App() {
  return (
    <Routes>
      {/* ...existing routes... */}
      <Route path="/perfil/geral" element={<ProfileGeneral />} />
      <Route path="/perfil/editar" element={<ProfileEdit />} />
    </Routes>
  );
}

export default App;