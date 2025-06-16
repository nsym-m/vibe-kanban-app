"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createColumn } from "@/lib/actions";
import { Plus, Check, X } from "lucide-react";

interface AddColumnProps {
  boardId: string;
}

const COLOR_OPTIONS = [
  "#ef4444", // red
  "#f59e0b", // amber
  "#10b981", // emerald
  "#3b82f6", // blue
  "#8b5cf6", // violet
  "#ec4899", // pink
  "#94a3b8", // slate
  "#6b7280", // gray
];

export function AddColumn({ boardId }: AddColumnProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [selectedColor, setSelectedColor] = useState(COLOR_OPTIONS[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) return;

    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("color", selectedColor);
      formData.append("boardId", boardId);
      
      await createColumn(formData);
      
      // リセット
      setTitle("");
      setSelectedColor(COLOR_OPTIONS[0]);
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to create column:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setTitle("");
    setSelectedColor(COLOR_OPTIONS[0]);
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit(e);
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  if (!isOpen) {
    return (
      <div className="bg-muted/30 rounded-lg p-4 border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors">
        <Button
          variant="ghost"
          className="w-full h-auto p-4 flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground"
          onClick={() => setIsOpen(true)}
        >
          <Plus className="h-4 w-4" />
          新しいカラムを追加
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-muted/30 rounded-lg p-4 border-2 border-primary/50">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="カラム名を入力..."
          autoFocus
          disabled={isSubmitting}
          className="border-none bg-background"
        />
        
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">カラー選択</p>
          <div className="flex gap-2">
            {COLOR_OPTIONS.map((color) => (
              <button
                key={color}
                type="button"
                className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${
                  selectedColor === color ? "border-foreground scale-110" : "border-muted-foreground/25"
                }`}
                style={{ backgroundColor: color }}
                onClick={() => setSelectedColor(color)}
                disabled={isSubmitting}
                aria-label={`Select color ${color}`}
              />
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            type="submit"
            size="sm"
            disabled={!title.trim() || isSubmitting}
            className="flex-1"
          >
            <Check className="h-4 w-4 mr-1" />
            追加
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}