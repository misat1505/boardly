import { Team } from "@/types/Team";
import { Board } from "@/types/Board";
import TeamBoardsContent from "./TeamBoardsContent";
import CreateBoard from "./CreateBoard";

type TeamBoardsProps = { team: Team; boards: Board[] };

const TeamBoards = async ({ team, boards }: TeamBoardsProps) => {
  return (
    <div>
      <div className="mb-4">
        <h2 className="text-xl">Boards</h2>

        <p className="text-xs text-muted-foreground/50">
          View and manage your team's boards. Browse, open, filter, or create a
          new board.
        </p>
      </div>

      {boards.length > 0 ? (
        <TeamBoardsContent boards={boards} />
      ) : (
        <NoBoards team={team} />
      )}
    </div>
  );
};

type NoBoardsProps = { team: Team };

const NoBoards = ({ team }: NoBoardsProps) => {
  return (
    <div className="flex flex-col justify-center items-center gap-4">
      <h2>
        {team.name} hasn&apos;t created any boards yet. Let&apos;s change that!
      </h2>

      <CreateBoard />
    </div>
  );
};

export default TeamBoards;
