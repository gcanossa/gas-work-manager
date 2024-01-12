import { useEffect, useState } from "react";

export type AsyncFunctionState<F extends (...params: any[]) => Promise<any>> = {
  executing: boolean;
  data: Awaited<ReturnType<F>> | null;
  error: any | null;
  invoke(...params: Parameters<F>): void;
};
export function useAsyncFunction<F extends (...params: any[]) => Promise<any>>(
  fn: F,
  inital?: Parameters<F>
): AsyncFunctionState<F> {
  const [state, set] = useState<AsyncFunctionState<Awaited<ReturnType<F>>>>({
    executing: false,
    data: null,
    error: null,
    invoke: (...params: any[]) => {
      set((state) => ({ ...state, executing: true }));
      fn(...params).then(
        (res) => set((state) => ({ ...state, executing: false, data: res })),
        (err) => set((state) => ({ ...state, executing: false, error: err }))
      );
    },
  });

  if (inital !== undefined) {
    useEffect(() => {
      state.invoke(...inital);
    }, inital);
  }

  return state;
}
