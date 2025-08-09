// src/components/Input.tsx
import { InputHTMLAttributes } from "react";
import styles from "./Input.module.css";

export default function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={styles.input} />;
}
