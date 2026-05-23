import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";

interface Props {
  open: boolean;
  secondsUntilLogout: number;
  onStayActive: () => void;
}

export function IdleLogoutWarning({ open, secondsUntilLogout, onStayActive }: Props) {
  const min = Math.floor(secondsUntilLogout / 60);
  const sec = secondsUntilLogout % 60;
  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-500" /> You're about to be signed out
          </DialogTitle>
          <DialogDescription>
            For your security, we'll sign you out after 30 minutes of inactivity.
            You'll be signed out in <span className="font-semibold text-foreground">{min}:{sec.toString().padStart(2, "0")}</span>.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={onStayActive} className="w-full">Stay signed in</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
