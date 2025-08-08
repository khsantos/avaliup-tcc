import Image from "next/image";
import { Card, CardContent } from "@/src/components/ui/card";

export default function RankingPage() {
  const ranking = [
    { name: "João", points: 450, avatar: "/avatar1.png" },
    { name: "Ana", points: 445, avatar: "/avatar2.png" },
    { name: "Luís", points: 350, avatar: "/avatar3.png" },
    { name: "Rafael Pereira", points: 200, avatar: "/avatar4.png" },
  ];

  const PodiumPlace = ({
    place,
    user,
    height,
  }: {
    place: 1 | 2 | 3;
    user: { name: string; points: number; avatar: string };
    height: string;
  }) => {
    const colors: Record<1 | 2 | 3, string> = {
      1: "bg-[#010b62]",
      2: "bg-[#010b62] opacity-70",
      3: "bg-[#010b62] opacity-50",
    };

    const medalha: Record<1 | 2 | 3, string> = {
      1: "🥇",
      2: "🥈",
      3: "🥉",
    };

    return (
      <div className="flex flex-col items-center w-28">
        <div className="relative mb-2">
          <div className="w-16 h-16 rounded-full border-4 border-white shadow-md overflow-hidden">
            <Image
              src={user.avatar}
              alt={user.name}
              width={64}
              height={64}
              className="object-cover w-full h-full"
            />
          </div>
          <div className="absolute -top-2 -right-2 text-xl">
            {medalha[place]}
          </div>
        </div>

        <Card
          className={`w-full ${height} ${colors[place]} rounded-t-xl text-center text-white flex flex-col justify-end`}
        >
          <CardContent className="flex flex-col items-center justify-end pb-3 pt-2">
            <div className="text-xl font-bold">{place}</div>
            <div className="text-sm font-semibold">{user.name}</div>
            <div className="text-xs">{user.points}xp</div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="relative w-full max-w-5xl mx-auto mb-12">
        <h1 className=" top-4 left-6 text-[#010b62] text-3xl font-bold drop-shadow-lg z-10 mb-3">
          Ranking
        </h1>
        <Image
          src="https://qjpnvzrmiibksdvxmzop.supabase.co/storage/v1/object/public/heros//hero-ranking.png"
          alt="Prêmio da semana"
          width={1200}
          height={300}
          className="rounded-xl w-full object-cover"
        />
      </div>

      <div className="flex justify-center items-end mb-12 flex-wrap gap-4">
        <PodiumPlace place={2} user={ranking[1]} height="h-40" />
        <PodiumPlace place={1} user={ranking[0]} height="h-48" />
        <PodiumPlace place={3} user={ranking[2]} height="h-36" />
      </div>

      <div className="overflow-x-auto max-w-4xl mx-auto">
        <table className="w-full text-sm border border-gray-300 rounded-lg overflow-hidden shadow-md">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-3 text-left">Rank</th>
              <th className="p-3 text-left">Foto</th>
              <th className="p-3 text-left">Usuário</th>
              <th className="p-3 text-left">Pontos</th>
            </tr>
          </thead>
          <tbody>
            {ranking.slice(3).map((user, i) => (
              <tr key={i} className="border-t hover:bg-gray-50">
                <td className="p-3">{i + 4}</td>
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
            <tr className="border-t font-semibold bg-yellow-50">
              <td className="p-3">200</td>
              <td className="p-3">
                <Image
                  src="/meu-avatar.png"
                  alt="Você"
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              </td>
              <td className="p-3">Você</td>
              <td className="p-3">200</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
