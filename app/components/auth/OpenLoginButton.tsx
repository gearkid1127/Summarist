"use client";

import { useDispatch } from "react-redux";
import { openLogin } from "@/redux/authModalSlice";

type Props = {
  className?: string;
  children?: React.ReactNode;
};

export default function OpenLoginButton({ className, children }: Props) {
  const dispatch = useDispatch();

  return (
    <button
      type="button"
      className={className}
      onClick={() => dispatch(openLogin())}
    >Login
      {children}
    </button>
  );
}
