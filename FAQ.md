# FAQ (Frequently Asked Questions)

- [How can I get support?](#how-can-i-get-support)
- [Can I use this with ___?](#can-i-use-this-with-___)
- [What does this error mean?](#what-does-this-error-mean)
- [How can I sign and verify messages?](#how-can-i-sign-and-verify-messages)

## How can I get support?

Please ask questions in the #developer-support channel on the Solana Discord: https://discord.com/invite/solana

After reading this FAQ, if you've found a bug or you'd like to request a feature, please [open an issue](https://github.com/fractalwagmi/wallet-adapter/issues/new).

## Can I use this with ___?

### React
Yes, see the [react-ui-starter](https://github.com/fractalwagmi/wallet-adapter/tree/master/packages/starter/react-ui-starter) package.

### Anchor
Yes, use the [`useAnchorWallet()`](https://github.com/fractalwagmi/wallet-adapter/blob/master/packages/core/react/src/useAnchorWallet.ts) hook in the React package to easily get an [Anchor-compatible Wallet interface](https://github.com/project-serum/anchor/blob/0faed886002a9b01ad0513c860e19d7570cb0221/ts/src/provider.ts#L220-L224).

### Next.js (with React)
Yes, see the [nextjs-starter](https://github.com/fractalwagmi/wallet-adapter/tree/master/packages/starter/nextjs-starter) package for very basic configuration, or the [example](https://github.com/fractalwagmi/wallet-adapter/tree/master/packages/starter/example) package for more complete configuration.

If you're using one of the [react-ui](https://github.com/fractalwagmi/wallet-adapter/tree/master/packages/ui/react-ui), [material-ui](https://github.com/fractalwagmi/wallet-adapter/tree/master/packages/ui/material-ui), or [ant-design](https://github.com/fractalwagmi/wallet-adapter/tree/master/packages/ui/ant-design) packages too, make sure to configure the `WalletModalProvider` or `WalletDialogProvider` context [as shown here](https://github.com/fractalwagmi/wallet-adapter#setup).

### Material UI (with React)
Yes, see the [material-ui-starter](https://github.com/fractalwagmi/wallet-adapter/tree/master/packages/starter/material-ui-starter) package.

### Ant Design (with React)
Yes, see the [ant-design](https://github.com/fractalwagmi/wallet-adapter/tree/master/packages/core/ant-design) package.

### Vue
Yes, see the [vue](https://github.com/fractalwagmi/wallet-adapter/tree/master/packages/core/vue) package.

### Angular / RxJS
Yes, see the [angular](https://github.com/heavy-duty/platform/tree/master/libs/wallet-adapter) package.

### Webpack / Gatsby
Yes, but you may need to set up polyfills for certain imported modules.

For example, you may need to install `buffer`:
```shell
yarn add buffer
```

And configure `webpack.config.js`:
```js
const webpack = require('webpack');

module.exports = {
    plugins: [
        new webpack.ProvidePlugin({
            Buffer: ['buffer', 'Buffer']
        })
    ],
    resolve: {
        fallback: {
            crypto: false
        }
    }
};
```

### Babel / Rollup / Vite / Snowpack / esbuild
Yes, but you may need to provide custom build configuration.
Most of the packages are built using the TypeScript compiler, which outputs modular ES6 with `import`/`export` statements.

If you're using Create React App, craco, or one of the React-based starter projects using them, this should be handled automatically.

If you're using Next.js, this requires configuration, which is provided in the [nextjs-starter](https://github.com/fractalwagmi/wallet-adapter/tree/master/packages/starter/nextjs-starter) package.

If you're using something else, you may have to configure your build tool to transpile the packages similarly to how it's done in the Next.js config.
Please open an issue or pull request to document your solution!

## What does this error mean?

### `Failed to compile. [...] Module not found: Can't resolve [...]`

This can happen if you're cloning the project and [building it from the source](https://github.com/fractalwagmi/wallet-adapter/blob/master/README.md#build-from-source) and you missed a step.

If this doesn't fix the problem, please [open an issue](https://github.com/fractalwagmi/wallet-adapter/issues/new).

### `[...] is not a function` / `[...] is undefined` / `Uncaught TypeError: Cannot destructure property` / `Uncaught (in promise) WalletNotConnectedError`

This can happen if you don't wrap your dApp with the `WalletContext` and `ConnectionContext` provided by the [react](https://github.com/fractalwagmi/wallet-adapter/tree/master/packages/core/react) package.
See issues [#62](https://github.com/fractalwagmi/wallet-adapter/issues/62#issuecomment-916421795), [#73](https://github.com/fractalwagmi/wallet-adapter/issues/73#issuecomment-919237687), and [#85](https://github.com/fractalwagmi/wallet-adapter/issues/85).

This shouldn't happen if you're using one of the starter projects, since they set up the contexts for you.

### `[...] is not a function`

This can happen if you try to use `signTransaction`, `signAllTransactions`, or `signMessage` without checking if they are defined first.

`sendTransaction` is the primary method that all wallets support, and it signs transactions.
The other methods are optional APIs, so you have to feature-detect them before using them.

Please see [issue #72](https://github.com/fractalwagmi/wallet-adapter/issues/72#issuecomment-919232595).

## How can I sign and verify messages?

Some wallet adapters provide a `signMessage` method for signing arbitrary bytes:

- [Phantom](https://github.com/fractalwagmi/wallet-adapter/tree/master/packages/wallets/phantom)
- [Solflare](https://github.com/fractalwagmi/wallet-adapter/tree/master/packages/wallets/solflare)
- [Slope](https://github.com/fractalwagmi/wallet-adapter/tree/master/packages/wallets/slope)
- [TokenPocket](https://github.com/fractalwagmi/wallet-adapter/tree/master/packages/wallets/tokenpocket)

The signature string returned by this method can be verified using [tweetnacl-js](https://github.com/dchest/tweetnacl-js/blob/master/README.md#naclsigndetachedverifymessage-signature-publickey) using the public key from the adapter.

This can be used to sign offline -- without sending a transaction -- and prove a user controls a given private key.

```tsx
import { useWallet } from '@solana/wallet-adapter-react';
import bs58 from 'bs58';
import React, { FC, useCallback } from 'react';
import { sign } from 'tweetnacl';

export const SignMessageButton: FC = () => {
    const { publicKey, signMessage } = useWallet();

    const onClick = useCallback(async () => {
        try {
            // `publicKey` will be null if the wallet isn't connected
            if (!publicKey) throw new Error('Wallet not connected!');
            // `signMessage` will be undefined if the wallet doesn't support it
            if (!signMessage) throw new Error('Wallet does not support message signing!');

            // Encode anything as bytes
            const message = new TextEncoder().encode('Hello, world!');
            // Sign the bytes using the wallet
            const signature = await signMessage(message);
            // Verify that the bytes were signed using the private key that matches the known public key
            if (!sign.detached.verify(message, signature, publicKey.toBytes())) throw new Error('Invalid signature!');

            alert(`Message signature: ${bs58.encode(signature)}`);
        } catch (error: any) {
            alert(`Signing failed: ${error?.message}`);
        }
    }, [publicKey, signMessage]);

    return signMessage ? (<button onClick={onClick} disabled={!publicKey}>Sign Message</button>) : null;
};
```
