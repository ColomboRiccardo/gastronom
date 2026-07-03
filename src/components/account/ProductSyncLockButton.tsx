"use client";

import { Lock, LockOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatLockedFields, hasEditorLocks } from "@/lib/products/editor-locks";

interface ProductSyncLockButtonProps {
  lockedFields: string[];
  onUnlock: () => void;
  disabled?: boolean;
}

const ProductSyncLockButton = ({
  lockedFields,
  onUnlock,
  disabled = false,
}: ProductSyncLockButtonProps) => {
  const locked = hasEditorLocks(lockedFields);

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={`h-8 w-8 ${
              locked
                ? "text-amber-700 hover:text-amber-800 hover:bg-amber-50"
                : "text-muted-foreground"
            }`}
            disabled={!locked || disabled}
            onClick={onUnlock}
            aria-label={locked ? "Unlock sync-protected fields" : "No sync-protected fields"}
          >
            {locked ? <Lock className="h-4 w-4" /> : <LockOpen className="h-4 w-4" />}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs text-xs">
          {locked ? (
            <>
              <p className="font-semibold mb-1">Sync-protected fields</p>
              <p>{formatLockedFields(lockedFields)}</p>
              <p className="mt-1 text-muted-foreground">Click to unlock all and allow Lackmann sync to update them.</p>
            </>
          ) : (
            <p>All fields follow Lackmann sync. Edits or publish changes will lock affected fields.</p>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ProductSyncLockButton;
