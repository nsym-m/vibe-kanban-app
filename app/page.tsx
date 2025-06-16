import { CreateBoardDialog } from "@/components/create-board-dialog";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">カンバンボード</h1>
        <CreateBoardDialog />
      </div>
      
      <div className="text-center py-16">
        <p className="text-muted-foreground mb-4">まだボードがありません</p>
        <p className="text-sm text-muted-foreground">新規ボード作成ボタンをクリックして、最初のボードを作成しましょう</p>
      </div>
    </div>
  );
}
