// src/components/Card.tsx
import styles from "./Card.module.css";
import cn from "classnames";

export default function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn(styles.card, className)}>{children}</div>;
}
