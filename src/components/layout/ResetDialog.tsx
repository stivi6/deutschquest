import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { useGame } from "@/game/progress";
export function ResetDialog({ again = false }: { again?: boolean }) {
  const [open, setOpen] = useState(false);
  const { reset } = useGame();
  const navigate = useNavigate();
  return (
    <>
      <Button
        variant={again ? "gold" : "ghost"}
        size="quest"
        className={again ? "" : "reset-button"}
        onClick={() => setOpen(true)}
      >
        <RotateCcw />
        {again ? "Luaj përsëri" : "Rivendos përparimin"}
      </Button>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Fillo një aventurë të re?</AlertDialogTitle>
            <AlertDialogDescription>
              Piket e ruajtura dhe sfidat e plotësuara në këtë browser do të pastrohen. Ky veprim
              nuk mund të zhbëhet.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Mbaj përparimin tim</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                reset();
                setOpen(false);
                navigate({ to: "/play" });
              }}
            >
              Rivendos dhe fillo përsëri
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
