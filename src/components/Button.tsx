// src/components/Button.tsx
import styles from "./Button.module.css";
import cn from "classnames";

type ButtonProps = {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline";
  onClick?: () => void;
};

export default function Button({
  children,
  variant = "primary",
  onClick,
}: ButtonProps) {
  return (
    <button
      className={cn(styles.button, {
        [styles.primary]: variant === "primary",
        [styles.secondary]: variant === "secondary",
        [styles.outline]: variant === "outline",
      })}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
