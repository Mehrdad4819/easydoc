import * as esbuild from 'esbuild-wasm';


export const unpkgPathPlugin = () => {
  return {
    name: 'unpkg-path-plugin',
    // for debugging

    //  setup is being called automatically by esbuild, starts bundling process
    setup(build: esbuild.PluginBuild) {
      //  Handle Root entry file index.js
      build.onResolve({ filter: /(^index\.js$)/ }, () => {
        console.log('onResolve root');
        
        return { path: 'index.js', namespace: 'a' };
      });

       // handle relative paths Inner file module s ./  ../
      build.onResolve({ filter: /^\.+\// }, (args: any) => {
        return {
          namespace: 'a',
          path: new URL(args.path, 'https://unpkg.com' + args.resolveDir + '/')
            .href,
        };
      });

      // Handle main file of module
      build.onResolve({ filter: /.*/ }, async (args: any) => {
        // { filter: /.*/ }, کمک می کند تا این ایونت ها را کنترل کنیم
        console.log('onResolve main modules', args);

        //  main file modules
        return { namespace: 'a', path: `https://unpkg.com/${args.path}` };
        // namespace: namespace a به ما اجازه میدهد که این ایونت ها را فقط به فابل هایی خاص اختصاص دخد مثلا با
      });



      
    },
  };
};
