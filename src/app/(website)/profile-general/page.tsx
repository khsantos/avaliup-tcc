export default function ProfilePage() {
  return (
    <div>
      <h1>Tela de perfil</h1>


      <a href="/profile-edit" className="inline-block mt-4">

        <button
          type="button"
          className="px-4 py-2 text-white bg-[#010B62] rounded-md hover:bg-[#010B62]/90"
        >
          Editar perfil
        </button>
      </a>
    </div>
  );
}
