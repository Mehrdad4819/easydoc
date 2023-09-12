import * as esbuild from 'esbuild-wasm';
import { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { unpkgPathPlugin } from './plugins/unpkg-path-plugin';
import { fetchPlugin } from './plugins/fetch-plugin';
import './global.css';

const App = () => {
  const ref = useRef<any>();
  const [input, setInput] = useState('');
  const [code, setCode] = useState('');

  const startService = async () => {
    const service = await esbuild.initialize({
      // wasmURL: '/esbuild.wasm',
      wasmURL: 'https://unpkg.com/esbuild-wasm/esbuild.wasm',
    });
    ref.current = esbuild;
  };

  useEffect(() => {
    startService();
  }, []);

  const onClick = async () => {
    if (!ref.current) {
      return;
    }

    // const result = await ref.current.transform(input, {
    //   loader: 'jsx',
    //   target: 'es2015',
    // });

    const result = await ref.current.build({
      entryPoints: ['index.js'],
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin(), fetchPlugin(input)],
      define: {
        'process.env.NODE_ENV': '"production"',
        global: 'window',
      },
    });

    // console.log(result);

    setCode(result.outputFiles[0].text);
  };

  return (
    <div className='grid grid-rows-[1fr,_1fr] h-full px-4'>
      <div className='h-full flex flex-col'>
        <div className='flex flex-wrap gap-2 grow items-stretch py-4'>
          <textarea
            className='border border-slate-300 rounded-md basis-1/2 focus:outline-none p-3'
            value={input}
            onChange={(e) => setInput(e.target.value)}
          ></textarea>
          <iframe className='border rounded grow' src='/test.html' />
        </div>
        <div className='flex items-center gap-3 py-1'>
          <button onClick={onClick}>Submit</button>
          <button onClick={() => setInput("import 'tiny-test-pkg'")}>
            Import JS
          </button>
          <button onClick={() => setInput("import 'bulma/css/bulma.css'")}>
            Import CSS
          </button>
          <button
            onClick={() =>
              setInput(`import 'bulma/css/bulma.css' 
                      import 'tiny-test-pkg'`)
            }
          >
            Import JS & CSS
          </button>
        </div>
      </div>

      <div className='flex py-4 gap-2 flex-wrap items-stretchh-full'>
        <pre className='border bg-slate-50 min-w-[50%] rounded grow min-h-full'>
          {code}
        </pre>
      </div>
    </div>
  );
};

ReactDOM.render(<App />, document.querySelector('#root'));
