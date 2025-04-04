import Board from './Board'

export default function BoardView({boardId}: {boardId: string}) {
  return (
    <div className='flex w-full h-5/6'>
        <Board boardId={boardId} />
    </div>
  )
}
