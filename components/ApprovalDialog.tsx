"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

interface ApprovalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: "approve" | "reject";
  onConfirm: (comentario?: string) => Promise<void>;
  inspecaoId: number;
}

export default function ApprovalDialog({
  open,
  onOpenChange,
  type,
  onConfirm,
  inspecaoId,
}: ApprovalDialogProps) {
  const [comentario, setComentario] = useState("");
  const [loading, setLoading] = useState(false);

  const isApprove = type === "approve";
  const requiresComment = type === "reject";

  const handleConfirm = async () => {
    if (requiresComment && !comentario.trim()) {
      return;
    }

    setLoading(true);
    try {
      await onConfirm(comentario.trim() || undefined);
      setComentario("");
      onOpenChange(false);
    } catch (error) {
      console.error("Erro ao processar:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setComentario("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isApprove ? (
              <>
                <CheckCircle className="w-5 h-5 text-green-600" />
                Aprovar Inspeção
              </>
            ) : (
              <>
                <XCircle className="w-5 h-5 text-red-600" />
                Reprovar Inspeção
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {isApprove
              ? `Você está prestes a aprovar a inspeção #${inspecaoId}. Esta ação não poderá ser desfeita.`
              : `Você está prestes a reprovar a inspeção #${inspecaoId}. Por favor, informe o motivo da reprovação.`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="comentario">
              {isApprove ? "Comentário (opcional)" : "Motivo da reprovação *"}
            </Label>
            <Textarea
              id="comentario"
              placeholder={
                isApprove
                  ? "Adicione um comentário sobre a inspeção..."
                  : "Descreva os itens não conformes ou problemas identificados..."
              }
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              rows={4}
              className={requiresComment && !comentario.trim() ? "border-red-300" : ""}
            />
            {requiresComment && !comentario.trim() && (
              <p className="text-sm text-red-600">O motivo da reprovação é obrigatório</p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel} disabled={loading}>
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={loading || (requiresComment && !comentario.trim())}
            variant={isApprove ? "default" : "destructive"}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processando...
              </>
            ) : isApprove ? (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Aprovar
              </>
            ) : (
              <>
                <XCircle className="w-4 h-4 mr-2" />
                Reprovar
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
