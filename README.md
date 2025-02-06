# akenoai-js
### Install
`npm install akenoaijs`

### Code examples
```js
import { AkenoaiJs } from "akenoaijs";

async function main() {
    const api = new AkenoaiJs({
        key: "api-key-here"
    });
    const response = await api.requestGet("json/all");
    console.log(response);
}

main();
```

### akenoai-lib Python
- [`Source Code`](https://github.com/TeamKillerX/akenoai-lib/)
