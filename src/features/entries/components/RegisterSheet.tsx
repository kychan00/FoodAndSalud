import { Activity, ChevronRight, Pill, Salad } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

import { BottomSheet } from "../../../components/ui/BottomSheet";
import { Button } from "../../../components/ui/Button";
import { BathroomRegistrationForm } from "../../bathroom/components/BathroomRegistrationForm";
import { FoodRegistrationForm } from "../../foods/components/FoodRegistrationForm";

import "./RegisterSheet.css";

export type RegisterMode = "choice" | "food" | "bathroom" | "medicine";

interface RegisterSheetProps {
  open: boolean;
  mode: RegisterMode;
  userId: string;
  onModeChange: (mode: RegisterMode) => void;
  onClose: () => void;
}

export function RegisterSheet({
  open,
  mode,
  userId,
  onModeChange,
  onClose,
}: RegisterSheetProps) {
  const queryClient = useQueryClient();

  const handleClose = () => {
    onModeChange("choice");

    onClose();
  };

  const handleSaved = async () => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: ["timeline"],
      }),

      queryClient.invalidateQueries({
        queryKey: ["patterns"],
      }),
    ]);

    handleClose();
  };

  const getTitle = () => {
    switch (mode) {
      case "food":
        return "Registrar comida";

      case "bathroom":
        return "Registrar Bristol";

      case "medicine":
        return "Medicina";

      default:
        return "Registrar";
    }
  };

  return (
    <BottomSheet open={open} title={getTitle()} onClose={handleClose}>
      {mode === "choice" ? (
        <div className="register-choice-list">
          <button
            type="button"
            className="register-choice register-choice--food"
            onClick={() => onModeChange("food")}
          >
            <span className="register-choice__icon">
              <Salad size={25} />
            </span>

            <span className="register-choice__body">
              <strong>Registrar comida</strong>

              <span>Agregue lo que comió</span>
            </span>

            <ChevronRight size={21} />
          </button>

          <button
            type="button"
            className="register-choice register-choice--bathroom"
            onClick={() => onModeChange("bathroom")}
          >
            <span className="register-choice__icon">
              <Activity size={25} />
            </span>

            <span className="register-choice__body">
              <strong>Registrar Bristol</strong>

              <span>Registre una evacuación</span>
            </span>

            <ChevronRight size={21} />
          </button>

          <button
            type="button"
            className="register-choice register-choice--medicine"
            onClick={() => onModeChange("medicine")}
          >
            <span className="register-choice__icon">
              <Pill size={25} />
            </span>

            <span className="register-choice__body">
              <strong>Medicina</strong>

              <span>Medicamentos y remedios</span>
            </span>

            <ChevronRight size={21} />
          </button>
        </div>
      ) : null}

      {mode === "food" ? (
        <FoodRegistrationForm
          userId={userId}
          onSaved={() => void handleSaved()}
          onCancel={() => onModeChange("choice")}
        />
      ) : null}

      {mode === "bathroom" ? (
        <BathroomRegistrationForm
          userId={userId}
          onSaved={() => void handleSaved()}
          onCancel={() => onModeChange("choice")}
        />
      ) : null}

      {mode === "medicine" ? (
        <div className="medicine-preview">
          <span className="medicine-preview__icon">
            <Pill size={30} />
          </span>

          <h3>Medicina</h3>

          <p>
            Este módulo quedará preparado para registrar medicamentos,
            suplementos y remedios.
          </p>

          <p className="medicine-preview__note">
            Primero terminaremos el núcleo Alimentos + Bristol + Calendario.
          </p>

          <Button
            type="button"
            variant="secondary"
            fullWidth
            onClick={() => onModeChange("choice")}
          >
            Volver
          </Button>
        </div>
      ) : null}
    </BottomSheet>
  );
}
