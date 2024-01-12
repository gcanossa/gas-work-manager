import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import { useAsyncFunction } from "@/hooks/use-async-fn";
import bridge from "@/gas-client";
import { Button } from "@/components/ui/button";

function test() {
  console.log("fdfs");
  bridge.mul(2, 3).then(console.log);
}

function App() {
  const [count, setCount] = useState(0);

  // useEffect(() => {
  //   initMocks<{ test: (a: number, b: number) => number }>({
  //     test: async (a: number, b: number) => {
  //       return a + b;
  //     },
  //   });
  // }, []);

  //const { data, isLoading } = useSWR([2, count], (arg) => bridge.mul(...arg));

  const {
    data,
    error,
    executing: isLoading,
    invoke,
  } = useAsyncFunction((a: number, b: number) => bridge.mul(a, b), [2, count]);

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
        <Button onClick={() => test()}>Test</Button>
        <Button onClick={() => invoke(3, 5)} className="ml-2">
          Invoke
        </Button>
        {isLoading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>{error[0].message}</p>
        ) : !data ? (
          <p>No Data</p>
        ) : (
          <p>{data![0]}</p>
        )}
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
