import { useState } from "react";

import { useQueryClient } from "@tanstack/react-query";

import { Pencil, Trash2 } from "lucide-react";

import { BottomSheet } from "../../../components/ui/BottomSheet";

import { deleteBathroomEntry } from "../../bathroom/bathroom.service";

import { BathroomEntryEditForm } from "../../bathroom/components/BathroomEntryEditForm";

import { deleteFoodEntry } from "../../foods/food.service";

import { FoodEntryEditForm } from "../../foods/components/FoodEntryEditForm";

import { deleteMedicineEntry } from "../../medicine/medicine.service";

import { MedicineEntryEditForm } from "../../medicine/components/MedicineEntryEditForm";

import type { TimelineEvent } from "../../timeline/timeline.types";

import {
  getDeleteQuestion,
  getEntryEditorTitle,
  getEntryKindLabel,
} from "../entryEditor.presentation";

import "./EntryEditorSheet.css";

type EditorMode = "actions" | "edit" | "delete";

interface EntryEditorSheetProps {
  open: boolean;

  event: TimelineEvent | null;

  userId: string;

  onClose: () => void;
}

export function EntryEditorSheet({
  open,
  event,
  userId,
  onClose,
}: EntryEditorSheetProps) {
  const queryClient = useQueryClient();

  const [mode, setMode] = useState<EditorMode>("actions");

  const [deleting, setDeleting] = useState(false);

  const [error, setError] = useState<string | null>(null);

  if (!event) {
    return null;
  }

  const resetLocalState = () => {
    setMode("actions");

    setDeleting(false);

    setError(null);
  };

  const close = () => {
    resetLocalState();

    onClose();
  };

  const invalidate = async () => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: ["timeline"],
      }),

      queryClient.invalidateQueries({
        queryKey: ["patterns"],
      }),

      queryClient.invalidateQueries({
        queryKey: ["daily-suggestions"],
      }),

      queryClient.invalidateQueries({
        queryKey: ["entry-editor"],
      }),
    ]);
  };

  const changed = async () => {
    await invalidate();

    close();
  };

  const deleteEntry = async () => {
    if (!event.id) {
      return;
    }

    setDeleting(true);

    setError(null);

    try {
      if (event.event_type === "food") {
        await deleteFoodEntry(userId, event.id);
      } else if (event.event_type === "bathroom") {
        await deleteBathroomEntry(userId, event.id);
      } else if (event.event_type === "medicine") {
        await deleteMedicineEntry(userId, event.id);
      } else {
        throw new Error("Tipo de registro no soportado.");
      }

      await changed();
    } catch (deleteError) {
      console.error(deleteError);

      setError("No pudimos eliminar este registro.");
    } finally {
      setDeleting(false);
    }
  };

  const title = getEntryEditorTitle(event, mode === "edit");

  return (
    <BottomSheet open={open} title={title} onClose={close}>
      {mode === "actions" ? (
        <div className="entry-editor-actions">
          <div className="entry-editor-summary">
            <strong>{getEntryKindLabel(event)}</strong>

            <span>
              Puede corregir el registro o eliminarlo si fue capturado por
              error.
            </span>
          </div>

          <button
            type="button"
            className="entry-editor-action"
            onClick={() => {
              setError(null);

              setMode("edit");
            }}
          >
            <Pencil size={20} />

            <span>
              <strong>Editar</strong>

              <small>Corregir datos, hora o contenido</small>
            </span>
          </button>

          <button
            type="button"
            className="entry-editor-action entry-editor-action--danger"
            onClick={() => {
              setError(null);

              setMode("delete");
            }}
          >
            <Trash2 size={20} />

            <span>
              <strong>Eliminar</strong>

              <small>Quitar este registro del historial</small>
            </span>
          </button>
        </div>
      ) : null}

      {mode === "edit" && event.id && event.event_type === "food" ? (
        <FoodEntryEditForm
          key={event.id}
          userId={userId}
          entryId={event.id}
          onSaved={() => void changed()}
          onCancel={() => setMode("actions")}
        />
      ) : null}

      {mode === "edit" && event.id && event.event_type === "bathroom" ? (
        <BathroomEntryEditForm
          key={event.id}
          userId={userId}
          entryId={event.id}
          onSaved={() => void changed()}
          onCancel={() => setMode("actions")}
        />
      ) : null}

      {mode === "edit" && event.id && event.event_type === "medicine" ? (
        <MedicineEntryEditForm
          key={event.id}
          userId={userId}
          entryId={event.id}
          onSaved={() => void changed()}
          onCancel={() => setMode("actions")}
        />
      ) : null}

      {mode === "delete" ? (
        <div className="entry-editor-delete">
          <span className="entry-editor-delete__icon">
            <Trash2 size={25} />
          </span>

          <div>
            <h3>{getDeleteQuestion(event)}</h3>

            <p>
              Esta acción elimina el registro histórico. Los alimentos o
              medicamentos reutilizables de su catálogo personal no se eliminan.
            </p>
          </div>

          {error ? (
            <p className="entry-form__error" role="alert">
              {error}
            </p>
          ) : null}

          <button
            type="button"
            className="entry-editor-delete__confirm"
            disabled={deleting}
            onClick={() => void deleteEntry()}
          >
            {deleting ? "Eliminando…" : "Sí, eliminar registro"}
          </button>

          <button
            type="button"
            className="entry-editor-delete__cancel"
            disabled={deleting}
            onClick={() => {
              setError(null);

              setMode("actions");
            }}
          >
            Cancelar
          </button>
        </div>
      ) : null}
    </BottomSheet>
  );
}
