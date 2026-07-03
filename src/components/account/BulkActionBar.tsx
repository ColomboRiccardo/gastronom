import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckSquare, X, Trash2 } from "lucide-react";

export interface BulkAction {
  label: string;
  icon?: React.ReactNode;
  variant?: "default" | "destructive" | "outline" | "ghost";
  onClick: () => void;
}

export interface BulkStatusAction {
  label: string;
  options: { value: string; label: string }[];
  onSelect: (value: string) => void;
}

interface BulkActionBarProps {
  selectedCount: number;
  totalCount: number;
  onSelectAll: () => void;
  onClearSelection: () => void;
  actions?: BulkAction[];
  statusAction?: BulkStatusAction;
  onBulkDelete?: () => void;
  disabled?: boolean;
}

const BulkActionBar = ({
  selectedCount,
  totalCount,
  onSelectAll,
  onClearSelection,
  actions = [],
  statusAction,
  onBulkDelete,
  disabled = false,
}: BulkActionBarProps) => {
  if (selectedCount === 0) return null;

  return (
    <div className="flex items-center gap-3 flex-wrap bg-primary/5 border border-primary/20 rounded-lg px-4 py-2.5 mb-4 animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="flex items-center gap-2">
        <CheckSquare className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium">
          <span className="text-primary font-semibold">{selectedCount}</span>
          <span className="text-muted-foreground"> of {totalCount} selected</span>
        </span>
      </div>

      <div className="h-4 w-px bg-border" />

      <Button variant="ghost" size="sm" className="text-xs h-7" onClick={onSelectAll} disabled={disabled}>
        Select All
      </Button>
      <Button variant="ghost" size="sm" className="text-xs h-7 gap-1" onClick={onClearSelection} disabled={disabled}>
        <X className="w-3 h-3" />
        Clear
      </Button>

      <div className="h-4 w-px bg-border" />

      {statusAction && (
        <Select onValueChange={statusAction.onSelect}>
          <SelectTrigger className="w-[170px] h-8 text-xs">
            <SelectValue placeholder={statusAction.label} />
          </SelectTrigger>
          <SelectContent>
            {statusAction.options.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {actions.map((action, i) => (
        <Button
          key={i}
          variant={action.variant || "outline"}
          size="sm"
          className="text-xs h-8 gap-1.5"
          onClick={action.onClick}
          disabled={disabled}
        >
          {action.icon}
          {action.label}
        </Button>
      ))}

      {onBulkDelete && (
        <Button
          variant="outline"
          size="sm"
          className="text-xs h-8 gap-1.5 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground ml-auto"
          onClick={onBulkDelete}
        >
          <Trash2 className="w-3 h-3" />
          Delete ({selectedCount})
        </Button>
      )}
    </div>
  );
};

export default BulkActionBar;
