import { Activity, ChevronRight, Pill, Salad } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

import { BottomSheet } from "../../../components/ui/BottomSheet";
import { BathroomRegistrationForm } from "../../bathroom/components/BathroomRegistrationForm";
import { FoodRegistrationForm } from "../../foods/components/FoodRegistrationForm";
import { MedicineRegistrationForm } from "../../medicine/components/MedicineRegistrationForm";

import "./RegisterSheet.css";

export type RegisterMode = "choice" | "food" | "bathroom" | "medicine";

interface RegisterSheetProps {
  open: boolean;
  mode: RegisterMode;
  userId: string;
  initialDate: Date;
  onModeChange: (mode: RegisterMode) => void;
  onClose: () => void;
}

export function RegisterSheet({
  open,
  mode,
  userId,
  initialDate,
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

              <span>Medicamento, suplemento o remedio</span>
            </span>

            <ChevronRight size={21} />
          </button>
        </div>
      ) : null}

      {mode === "food" ? (
        <FoodRegistrationForm
          userId={userId}
          initialDate={initialDate}
          onSaved={() => void handleSaved()}
          onCancel={() => onModeChange("choice")}
        />
      ) : null}

      {mode === "bathroom" ? (
        <BathroomRegistrationForm
          userId={userId}
          initialDate={initialDate}
          onSaved={() => void handleSaved()}
          onCancel={() => onModeChange("choice")}
        />
      ) : null}

      {mode === "medicine" ? (
        <MedicineRegistrationForm
          userId={userId}
          initialDate={initialDate}
          onSaved={() => void handleSaved()}
          onCancel={() => onModeChange("choice")}
        />
      ) : null}
    </BottomSheet>
  );
}
