import { getBoardById } from "@/actions/teams/getBoardById";
import { notFound } from "next/navigation";

type BoardPageProps = { params: Promise<{ id: string }> };

const BoardPage = async ({ params }: BoardPageProps) => {
  const { id } = await params;

  const board = await getBoardById(id);

  if (!board) notFound();

  return <div>Board {JSON.stringify(board)}</div>;
};

export default BoardPage;
