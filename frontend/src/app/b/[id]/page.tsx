import { getBoardById } from "@/actions/teams/getBoardById";
import Whiteboard from "@/components/WhiteBoard";
import WhiteboardProvider from "@/context/WhiteboardContext";
import { notFound } from "next/navigation";

type BoardPageProps = { params: Promise<{ id: string }> };

const BoardPage = async ({ params }: BoardPageProps) => {
  const { id } = await params;

  const board = await getBoardById(id);

  if (!board) notFound();

  return (
    <WhiteboardProvider>
      <Whiteboard />
    </WhiteboardProvider>
  );
};

export default BoardPage;
