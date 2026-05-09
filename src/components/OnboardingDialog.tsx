import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { updateSettings } from "@/lib/storage";
import { t } from "@/lib/i18n";
import type { Language } from "@/lib/types";
import { Heart } from "lucide-react";

export function OnboardingDialog({ lang }: { lang: Language }) {
  return (
    <Dialog open>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-primary/10">
            <Heart className="size-6 text-primary" />
          </div>
          <DialogTitle className="text-center">{t(lang, "onboardingTitle")}</DialogTitle>
          <DialogDescription className="text-center">
            {t(lang, "onboardingBody")}
          </DialogDescription>
        </DialogHeader>
        <div className="rounded-lg bg-muted p-3 text-xs text-muted-foreground">
          {t(lang, "disclaimer")}
        </div>
        <Button
          className="w-full"
          onClick={() => updateSettings({ onboardingDone: true })}
        >
          {t(lang, "getStarted")}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
