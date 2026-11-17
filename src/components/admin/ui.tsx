"use client";

/* eslint-disable @next/next/no-img-element */
import { AnimatePresence, motion } from "motion/react";
import { CheckCircle2, ImagePlus, Loader2, XCircle } from "lucide-react";
import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import type { ActionState } from "@/lib/actions";
import { cn } from "@/lib/utils";

/** Formulário ligado a uma Server Action que mostra um aviso (toast) com o resultado. */
export function ActionForm({
  action,
  children,
  className,
  resetOnSuccess,
}: {
  action: (prev: ActionState, fd: FormData) => Promise<ActionState>;
  children: React.ReactNode;
  className?: string;
  resetOnSuccess?: boolean;
}) {
  const [state, formAction] = useActionState(action, null);
  const formRef = useRef<HTMLFormElement>(null);
  const [toast, setToast] = useState<ActionState>(null);

  useEffect(() => {
    if (!state) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- exibe o resultado da action como toast
    setToast(state);
    if (state.ok && resetOnSuccess) formRef.current?.reset();
    const t = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(t);
  }, [state, resetOnSuccess]);

  return (
    <>
      <form ref={formRef} action={formAction} className={className}>
        {children}
      </form>
      <Toast state={toast} />
    </>
  );
}

export function Toast({ state }: { state: ActionState }) {
  return (
    <AnimatePresence>
      {state && (
        <motion.div
          key={state.at}
          initial={{ y: 80, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 80, opacity: 0 }}
          className={cn(
            "fixed bottom-6 left-1/2 z-[100] flex -translate-x-1/2 items-center gap-2 rounded-2xl border-2 px-5 py-3 font-bold shadow-xl",
            state.ok ? "border-emerald-700 bg-emerald-50 text-emerald-800" : "border-red-700 bg-red-50 text-red-800",
          )}
        >
          {state.ok ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
          {state.message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function SubmitButton({ children, className }: { children: React.ReactNode; className?: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl border-2 border-cocoa-800 bg-cocoa-700 px-5 py-2.5 font-bold text-cream shadow-[3px_3px_0_var(--color-cocoa-900)] transition-all hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none disabled:opacity-60",
        className,
      )}
    >
      {pending && <Loader2 size={18} className="animate-spin" />}
      {children}
    </button>
  );
}

const inputCls =
  "w-full rounded-xl border-2 border-cocoa-100 bg-white px-3 py-2.5 text-cocoa-900 outline-none transition placeholder:text-cocoa-300 focus:border-mustard-500 focus:ring-4 focus:ring-mustard-200";

export function Field({
  label,
  hint,
  textarea,
  className,
  ...props
}: {
  label: string;
  hint?: string;
  textarea?: boolean;
  className?: string;
} & React.InputHTMLAttributes<HTMLInputElement> &
  React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-1.5 block text-sm font-bold text-cocoa-700">{label}</span>
      {textarea ? (
        <textarea {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)} className={cn(inputCls, "min-h-28 resize-y")} />
      ) : (
        <input {...(props as React.InputHTMLAttributes<HTMLInputElement>)} className={inputCls} />
      )}
      {hint && <span className="mt-1 block text-xs text-cocoa-500/80">{hint}</span>}
    </label>
  );
}

export function Select({ label, children, ...props }: { label: string } & React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-bold text-cocoa-700">{label}</span>
      <select {...props} className={inputCls}>
        {children}
      </select>
    </label>
  );
}

export function Toggle({ name, label, defaultChecked, hint }: { name: string; label: string; defaultChecked?: boolean; hint?: string }) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-xl border-2 border-cocoa-100 bg-white p-3 transition hover:border-mustard-400">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="peer sr-only" />
      <span className="relative mt-0.5 h-6 w-11 shrink-0 rounded-full bg-cocoa-100 transition peer-checked:bg-emerald-500 after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition peer-checked:after:translate-x-5" />
      <span>
        <span className="block font-bold text-cocoa-800">{label}</span>
        {hint && <span className="block text-xs text-cocoa-500">{hint}</span>}
      </span>
    </label>
  );
}

/** Campo de imagem com pré-visualização, arrastar-e-soltar e opção de remover. */
export function ImageInput({
  name,
  removeName,
  current,
  label,
  fallbackEmoji = "🍽️",
  urlName,
}: {
  name: string;
  removeName: string;
  urlName?: string;
  current?: string;
  label: string;
  fallbackEmoji?: string;
}) {
  const [preview, setPreview] = useState<string | null>(current || null);
  const [removed, setRemoved] = useState(false);
  const [drag, setDrag] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const pick = (file?: File) => {
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setRemoved(false);
  };

  return (
    <div>
      <span className="mb-1.5 block text-sm font-bold text-cocoa-700">{label}</span>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          const file = e.dataTransfer.files?.[0];
          if (file && inputRef.current) {
            const dt = new DataTransfer();
            dt.items.add(file);
            inputRef.current.files = dt.files;
            pick(file);
          }
        }}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "group relative grid aspect-[4/3] cursor-pointer place-items-center overflow-hidden rounded-2xl border-2 border-dashed transition",
          drag ? "border-mustard-500 bg-mustard-50" : "border-cocoa-100 bg-white hover:border-mustard-400",
        )}
      >
        {preview && !removed ? (
          <img src={preview} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="text-center text-cocoa-500">
            <span className="block text-5xl">{fallbackEmoji}</span>
            <span className="mt-2 flex items-center justify-center gap-1 text-sm font-bold">
              <ImagePlus size={16} /> Clique ou arraste uma foto
            </span>
          </div>
        )}
        {preview && !removed && (
          <span className="absolute inset-0 grid place-items-center bg-cocoa-900/50 font-bold text-white opacity-0 transition group-hover:opacity-100">
            Trocar foto
          </span>
        )}
        <input
          ref={inputRef}
          type="file"
          name={name}
          accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
          className="hidden"
          onChange={(e) => pick(e.target.files?.[0])}
        />
      </div>
      {preview && !removed && (
        <button
          type="button"
          onClick={() => {
            setRemoved(true);
            if (inputRef.current) inputRef.current.value = "";
          }}
          className="mt-2 text-sm font-bold text-red-700 hover:underline"
        >
          Remover foto
        </button>
      )}
      {removed && <input type="hidden" name={removeName} value="1" />}
      {urlName && (
        <input
          name={urlName}
          type="url"
          placeholder="…ou cole o link de uma imagem (https://…)"
          onChange={(e) => {
            const v = e.target.value.trim();
            if (/^https?:\/\/.+/.test(v)) {
              setPreview(v);
              setRemoved(false);
            }
          }}
          className="mt-2 w-full rounded-xl border-2 border-cocoa-100 bg-white px-3 py-2 text-sm outline-none focus:border-mustard-500"
        />
      )}
      <p className="mt-1 text-xs text-cocoa-500/80">JPG, PNG ou WEBP até 7MB. Sem foto, usamos o emoji num prato ilustrado.</p>
    </div>
  );
}

/** Botão que pede confirmação antes de enviar o formulário. */
export function ConfirmSubmit({ message, children, className }: { message: string; children: React.ReactNode; className?: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      onClick={(e) => {
        if (!confirm(message)) e.preventDefault();
      }}
      className={className}
    >
      {pending ? <Loader2 size={16} className="animate-spin" /> : children}
    </button>
  );
}

export function PendingButton({ children, className, title }: { children: React.ReactNode; className?: string; title?: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={cn(className, pending && "opacity-50")} title={title} aria-label={title}>
      {pending ? <Loader2 size={16} className="animate-spin" /> : children}
    </button>
  );
}

export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("rounded-3xl border-2 border-cocoa-100 bg-white p-6 shadow-sm", className)}>{children}</div>;
}
