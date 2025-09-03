"use client";

import Image from "next/image";

export default function RankingComponent() {
  const ranking = [
    { name: "João", points: 450, avatar: "/masculine-avatar.png" },
    { name: "Ana", points: 445, avatar: "/diverse-female-avatars.png" },
    { name: "Lívia", points: 350, avatar: "/masculine-avatar.png" },
    { name: "Rafael Pereira", points: 200, avatar: "/masculine-avatar.png" },
    { name: "Maria Silva", points: 200, avatar: "/diverse-female-avatars.png" },
    { name: "Carlos Santos", points: 200, avatar: "/masculine-avatar.png" },
    { name: "Ana Costa", points: 200, avatar: "/diverse-female-avatars.png" },
    { name: "Pedro Lima", points: 200, avatar: "/masculine-avatar.png" },
    {
      name: "Julia Oliveira",
      points: 200,
      avatar: "/diverse-female-avatars.png",
    },
    { name: "Você", points: 200, avatar: "/avatar-usuario.jpg" },
  ];

  const PodiumBlock = ({
    place,
    user,
    height = 180,
    frontColor = "#06b6d4",
    topColor = "#0ea5a4",
  }: {
    place: number;
    user: { name: string; points: number; avatar: string };
    height?: number;
    frontColor?: string;
    topColor?: string;
  }) => {
    const topHeight = 24;
    const avatarSize = 64;

    return (
      <div className="relative flex flex-col items-center mt-30">
        {/* Bloco com topo integrado */}
        <div
          className="flex flex-col justify-end items-center text-white relative w-full rounded-t-md"
          style={{
            height: `${height + topHeight}px`,
            background: frontColor,
            boxShadow: "0 6px 0 rgba(0,0,0,0.18)",
          }}
        >
          {/* Topo colorido */}
          <div
            className="w-full rounded-t-md"
            style={{
              height: `${topHeight}px`,
              background: topColor,
              boxShadow: "0 3px 6px rgba(0,0,0,0.25)",
            }}
          />
          <div className="flex flex-col items-center justify-end mt-auto mb-4">
            <div className="text-4xl font-bold">{place}</div>
            <div className="text-sm font-semibold">{user.points}xp</div>
          </div>
        </div>

        {/* Avatar */}
        <div
          className="absolute flex flex-col items-center"
          style={{ bottom: height + topHeight - avatarSize / 2 }}
        >
          <div className="relative">
            <div
              className="rounded-full p-1"
              style={{ background: "linear-gradient(180deg,#ffd86b,#f7b844)" }}
            >
              <div className="rounded-full bg-white p-[2px]">
                <div className="rounded-full overflow-hidden w-16 h-16">
                  <Image
                    src={user.avatar || "/placeholder.svg"}
                    alt={user.name}
                    width={64}
                    height={64}
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
            </div>
            <div className="absolute -right-2 -top-1 w-5 h-5 rounded-full bg-yellow-400 flex items-center justify-center text-[10px] font-bold shadow-md">
              ★
            </div>
          </div>
          <div className="mt-2 px-2 py-1 bg-white text-black text-xs rounded-md shadow-sm font-medium -translate-y-1">
            {user.name}
          </div>
        </div>
      </div>
    );
  };

  const centerHeight = 240;
  const leftHeight = 190;
  const rightHeight = 150;

  return (
    <div className="min-h-screen px-4 py-8 flex flex-col items-center">
      <div className="w-[80%]">
        <h1 className="text-gray-900 text-2xl font-bold mb-4">Ranking</h1>

        {/* Card prêmio */}
        <div className="relative bg-gradient-to-r from-blue-200 to-blue-400 rounded-md p-6 overflow-hidden mb-8 shadow-md">
          <div className="relative z-10">
            <h2 className="text-orange-600 text-2xl font-bold mb-2">
              Prêmio da semana
            </h2>
            <p className="text-gray-800 text-sm mb-1">
              Participe e concorra a um
            </p>
            <p className="text-gray-900 text-lg font-semibold mb-1">
              Mouse Logitech G203
            </p>
            <p className="text-gray-600 text-xs">
              A cada jogada, você ganha a chance.
            </p>
          </div>
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <Image
              src="/mouse-gamer-logitech.jpg"
              alt="Mouse Logitech G203"
              width={120}
              height={120}
              className="object-contain"
            />
          </div>
        </div>

        {/* Pódio */}
        <div className="grid grid-cols-3 gap-0 items-end mb-12">
          <PodiumBlock
            place={2}
            user={ranking[1]}
            height={leftHeight}
            frontColor="#3b82f6"
            topColor="#60a5fa"
          />
          <PodiumBlock
            place={1}
            user={ranking[0]}
            height={centerHeight}
            frontColor="#2563eb"
            topColor="#3b82f6"
          />
          <PodiumBlock
            place={3}
            user={ranking[2]}
            height={rightHeight}
            frontColor="#1e40af"
            topColor="#1d4ed8"
          />
        </div>

        {/* Tabela */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm bg-white text-gray-900 rounded-lg overflow-hidden shadow-md">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Rank</th>
                <th className="p-3 text-left">Foto</th>
                <th className="p-3 text-left">Usuário</th>
                <th className="p-3 text-left">Pontos</th>
              </tr>
            </thead>
            <tbody>
              {ranking.slice(3, -1).map((user, i) => (
                <tr
                  key={i}
                  className="border-t border-gray-200 hover:bg-gray-50"
                >
                  <td className="p-3">{i + 4}</td>
                  <td className="p-3">
                    <Image
                      src={user.avatar || "/placeholder.svg"}
                      alt={user.name}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  </td>
                  <td className="p-3">{user.name}</td>
                  <td className="p-3">{user.points}</td>
                </tr>
              ))}
              <tr className="border-t border-gray-200 bg-blue-100">
                <td className="p-3">—</td>
                <td className="p-3">
                  <Image
                    src={
                      ranking[ranking.length - 1].avatar || "/placeholder.svg"
                    }
                    alt="Você"
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                </td>
                <td className="p-3 font-semibold text-blue-700">Você</td>
                <td className="p-3 font-semibold text-blue-700">200</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
