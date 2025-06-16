"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { createTask } from "@/lib/actions";

interface AddTaskDialogProps {
  columnId: string;
  boardId: string;
}

export function AddTaskDialog({ columnId, boardId }: AddTaskDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [priority, setPriority] = useState("MEDIUM");

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);
    try {
      // priorityは状態から追加する
      formData.append("priority", priority);
      formData.append("columnId", columnId);
      formData.append("boardId", boardId);
      
      await createTask(formData);
      setOpen(false);
      // フォームをリセット
      setPriority("MEDIUM");
    } catch (error) {
      console.error("Failed to create task:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="w-full justify-start">
          <Plus className="mr-2 h-4 w-4" />
          タスクを追加
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>新規タスク作成</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">タイトル *</Label>
            <Input
              id="title"
              name="title"
              placeholder="タスクのタイトルを入力"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">説明</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="タスクの説明を入力（任意）"
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="priority">優先度</Label>
            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger>
                <SelectValue placeholder="優先度を選択" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LOW">低</SelectItem>
                <SelectItem value="MEDIUM">中</SelectItem>
                <SelectItem value="HIGH">高</SelectItem>
                <SelectItem value="URGENT">緊急</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="dueDate">期限</Label>
            <Input
              id="dueDate"
              name="dueDate"
              type="date"
              placeholder="期限を設定（任意）"
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              キャンセル
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "作成中..." : "作成"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}