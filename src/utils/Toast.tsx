import { toast } from "sonner";
import { CheckCircle2, AlertTriangle, Info, XCircle } from "lucide-react";

interface IProps {
  message: string;
  title?: string;
  type: "success" | "error" | "warning" | "info";
}

export const Toast = ({ message, title, type }: IProps) => {
  // Cấu hình tiêu đề mặc định, icon và class CSS theo từng type
  const config = {
    success: {
      defaultTitle: "Thành công",
      titleClass: "text-emerald-500",
      borderClass: "border-emerald-500/20",
      icon: (
        <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5 shrink-0" />
      ),
    },
    error: {
      defaultTitle: "Thất bại",
      titleClass: "text-red-500",
      borderClass: "border-red-500/20",
      icon: <XCircle className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />,
    },
    warning: {
      defaultTitle: "Cảnh báo",
      titleClass: "text-amber-500",
      borderClass: "border-amber-500/20",
      icon: (
        <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 shrink-0" />
      ),
    },
    info: {
      defaultTitle: "Thông báo",
      titleClass: "text-blue-500",
      borderClass: "border-blue-500/20",
      icon: <Info className="h-5 w-5 text-blue-500 mt-0.5 shrink-0" />,
    },
  };

  const current = config[type] || config.info;
  const displayTitle = title || current.defaultTitle;

  toast.custom((id) => (
    <div
      className={`w-[400px] rounded-2xl border ${current.borderClass} bg-background/95 backdrop-blur-md`}
    >
      <div className="flex items-start gap-3 p-4">
        {current.icon}

        <div className="flex-1">
          <h4 className={`font-semibold ${current.titleClass}`}>
            {displayTitle}
          </h4>
          <p className="mt-1 text-sm text-muted-foreground">{message}</p>
        </div>

        <button
          onClick={() => toast.dismiss(id)}
          className="text-muted-foreground hover:text-foreground hover:bg-muted p-1 rounded-lg transition-colors cursor-pointer text-sm"
        >
          ✕
        </button>
      </div>
    </div>
  ));
};
