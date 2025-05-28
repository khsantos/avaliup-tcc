// pages/ranking.tsx ou src/pages/ranking/index.tsx
import Image from "next/image";
import { Card, CardContent } from "@/src/components/ui/card";

export default function RankingPage() {
  const ranking = [
    { name: "João", points: 450, avatar: "/avatar1.png" },
    { name: "Ana", points: 445, avatar: "/avatar2.png" },
    { name: "Luís", points: 350, avatar: "/avatar3.png" },
    // outros usuários...
  ];

  return (
    <div className="min-h-screen bg-white px-4 py-8">
      {/* Banner */}
      <div className="w-full max-w-5xl mx-auto mb-8">
        <Image
          src="/banner-rtx.png"
          alt="Prêmio da semana"
          width={1200}
          height={300}
          className="rounded-xl"
        />
      </div>

      {/* Pódio */}
      <div className="flex justify-center items-end gap-4 mb-12">
        <PodiumPlace place={2} user={ranking[1]} height="h-40" />
        <PodiumPlace place={1} user={ranking[0]} height="h-48" highlight />
        <PodiumPlace place={3} user={ranking[2]} height="h-36" />
      </div>

      {/* Tabela */}
      <div className="max-w-4xl mx-auto">
        <table className="w-full text-sm border border-gray-300 rounded-lg overflow-hidden">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-3 text-left">Rank</th>
              <th className="p-3 text-left">Foto</th>
              <th className="p-3 text-left">Usuário</th>
              <th className="p-3 text-left">Pontos</th>
            </tr>
          </thead>
          <tbody>
            {ranking.map((user, i) => (
              <tr key={i} className="border-t">
                <td className="p-3">{i + 1}</td>
                <td className="p-3">
                  <Image
                    src={user.avatar}
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
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PodiumPlace({ place, user, height, highlight = false }: any) {
  const colors = {
    1: "bg-blue-800",
    2: "bg-gray-300",
    3: "bg-yellow-400",
  };

  return (
    <Card
      className={`w-24 ${height} flex flex-col justify-end items-center ${
        colors[place as 1 | 2 | 3]
      } text-white rounded-t-xl`}
    >
      <CardContent className="flex flex-col items-center justify-center py-2">
        <Image
          src={user.avatar}
          alt={user.name}
          width={40}
          height={40}
          className="rounded-full mb-2 border-2 border-white"
        />
        <div className="font-semibold">{user.name}</div>
        <div className="text-sm">{user.points}xp</div>
      </CardContent>
    </Card>
  );
}
