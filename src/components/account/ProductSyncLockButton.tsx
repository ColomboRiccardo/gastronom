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
import { useLanguage } from "@/context/LanguageContext";

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
  const { t } = useLanguage();
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
            aria-label={locked ? t("lock.unlock_aria") : t("lock.none_aria")}
          >
            {locked ? <Lock className="h-4 w-4" /> : <LockOpen className="h-4 w-4" />}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs text-xs">
          {locked ? (
            <>
              <p className="font-semibold mb-1">{t("lock.title")}</p>
              <p>{formatLockedFields(lockedFields)}</p>
              <p className="mt-1 text-muted-foreground">{t("lock.click_to_unlock")}</p>
            </>
          ) : (
            <p>{t("lock.all_synced")}</p>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ProductSyncLockButton;
