import { toast } from "sonner";

type ToastType = "success" | "error" | "info" | "warning";

const toastColors: Record<ToastType, string> = {
  success: "bg-green-600",
  error: "bg-red-600",
  info: "bg-blue-600",
  warning: "bg-yellow-500",
};

const toastIcons: Record<ToastType, string> = {
  success: "✅",
  error: "❌",
  info: "ℹ️",
  warning: "⚠️",
};

export const showToast = (message: string, type: ToastType = "info") => {
  toast(
    <div
      className={`flex items-center gap-2 border-2 text-white px-4 py-2 rounded-md shadow ${toastColors[type]}`}
    >
      <span>{toastIcons[type]}</span>
      <span className="font-medium">{message}</span>
    </div>,
    {
      unstyled: true, // ✅ removes the white Sonner container
    }
  );
};
