"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { useSupabase } from "@/src/contexts/supabase-provider";
import { User } from "@/src/types/User";

export default function RankingComponent() {
  const { theme } = useTheme();
  const { supabase } = useSupabase();
  const [ranking, setRanking] = useState<User[]>([]);
  const currentUserName = "Você";

  const getTheme = (light: string, dark: string, opacity?: number) => {
    const color = theme === "dark" ? dark : light;
    if (opacity !== undefined) {
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }
    return color;
  };

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .order("points", { ascending: false });

      if (error) {
        console.error("Erro ao buscar usuários:", error);
        return;
      }

      setRanking(data || []);
    };

    fetchUsers();
  }, [supabase]);

  const podiumUsers = ranking.slice(0, 3);
  const tableUsers = ranking.filter((user) => !podiumUsers.includes(user));

  const PodiumBlock = ({
    place,
    user,
    height = 180,
    frontColor = "#06b6d4",
    topColor = "#0ea5a4",
  }: {
    place: number;
    user: User;
    height?: number;
    frontColor?: string;
    topColor?: string;
  }) => {
    const topHeight = 24;
    const avatarSize = 64;

    return (
      <div className="relative flex flex-col items-center mt-30 w-full">
        <div
          className="relative w-full rounded-t-md"
          style={{
            height: `${height}px`,
            backgroundColor: frontColor,
            boxShadow:
              "0 6px 0 rgba(0,0,0,0.18), inset 0 -3px 5px rgba(0,0,0,0.1)",
          }}
        >
          <div
            className="absolute top-2 left-1/2 -translate-x-1/2 text-white font-bold mt-4"
            style={{ fontSize: "3rem" }}
          >
            {place}
          </div>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-white text-sm font-semibold">
            {user.points ?? 0}xp
          </div>
        </div>

        <div
          className="absolute top-0 left-0 w-full rounded-t-md"
          style={{
            height: `${topHeight}px`,
            backgroundColor: topColor,
            boxShadow: "0 3px 6px rgba(0,0,0,0.25), inset 0 -2px 3px rgba()",
          }}
        />

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
                    src={user.profile_img || "/placeholder.svg"}
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
        <h1 className="text-[#010b62] dark:text-white text-2xl font-bold mb-4">
          Ranking
        </h1>

        <div className="w-full h-auto rounded-md overflow-hidden shadow-md mb-8">
          <Image
            src={"/hero-ranking.svg"}
            alt="Banner do prêmio"
            width={500}
            height={100}
            className="w-full h-auto object-cover"
          />
        </div>

        {ranking.length >= 3 && (
          <div className="grid grid-cols-3 gap-0 items-end mb-12">
            <PodiumBlock
              place={2}
              user={ranking[1]}
              height={leftHeight}
              frontColor={getTheme("#010B62", "#01BAEF", 0.7)}
              topColor={getTheme("#010B62", "#01BAEF", 0.2)}
            />
            <PodiumBlock
              place={1}
              user={ranking[0]}
              height={centerHeight}
              frontColor={getTheme("#010B62", "#01BAEF", 0.9)}
              topColor={getTheme("#010B62", "#01BAEF")}
            />
            <PodiumBlock
              place={3}
              user={ranking[2]}
              height={rightHeight}
              frontColor={getTheme("#010b62", "#01BAEF", 0.4)}
              topColor={getTheme("#010b62", "#01BAEF", 0.1)}
            />
          </div>
        )}

        <Table
          className="rounded-md border border-[#010b62] dark:border-white border-separate"
          style={{ borderSpacing: 0 }}
        >
          <TableHeader>
            <TableRow>
              <TableHead className="border-b border-[#010b62] dark:border-white text-[#010b62] dark:text-white">
                Rank
              </TableHead>
              <TableHead className="border-b border-[#010b62] dark:border-white text-[#010b62] dark:text-white">
                Foto
              </TableHead>
              <TableHead className="border-b border-[#010b62] dark:border-white text-[#010b62] dark:text-white">
                Usuário
              </TableHead>
              <TableHead className="border-b border-[#010b62] dark:border-white text-[#010b62] dark:text-white">
                Pontos
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tableUsers.map((user, i) => {
              const isCurrentUser = user.name === currentUserName;

              return (
                <TableRow
                  key={user.id}
                  className={`${
                    isCurrentUser
                      ? "bg-[#010b62]/40 dark:bg-bg-[#010b62]/90 font-semibold text-[#010b62] dark:text-white"
                      : "text-[#010b62] dark:text-white"
                  }`}
                >
                  <TableCell
                    className={
                      i === tableUsers.length - 1
                        ? "rounded-bl-md border-b border-[#010b62] dark:border-white dark:text-white"
                        : "border-b border-[#010b62] dark:border-white dark:text-white"
                    }
                  >
                    {i + 4}{" "}
                    {/* rank começa do 4, já que 1,2,3 estão no pódio */}
                  </TableCell>
                  <TableCell className="border-b border-[#010b62] dark:border-white">
                    <Image
                      src={user.profile_img || "/placeholder.svg"}
                      alt={user.name}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  </TableCell>
                  <TableCell className="border-b border-[#010b62] dark:border-white text-[#010b62] dark:text-white">
                    {user.name}
                  </TableCell>
                  <TableCell
                    className={
                      i === tableUsers.length - 1
                        ? "rounded-br-md border-b border-[#010b62] dark:border-white text-[#010b62] dark:text-white"
                        : "border-b border-[#010b62] dark:border-white text-[#010b62] dark:text-white"
                    }
                  >
                    {user.points ?? 0}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
