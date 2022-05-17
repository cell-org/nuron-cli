const prompts = require('prompts');
const Nuron = require('nuronjs');
const nuron = new Nuron({ })
const nftstorage = async () => {
  let config = await nuron.config()
  console.log("current nft.storage key: " + (config.ipfs.key.length>0 ? config.ipfs.key : "<empty>"))
  const options = [
    { title: "set API key", value: "set" },
    { title: "cancel", value: "cancel" },
  ]
  const response = await prompts({
    type: 'select',
    name: 'value',
    hint: " ",
    message: "IPFS settings",
    choices: options,
    onState: (state) => {
      if (state.aborted) {
        process.nextTick(() => {
          process.exit(0);
        })
      }
    }
  });
  if (response.value === "set") {
    const response = await prompts({
      type: 'text',
      name: 'value',
      message: 'enter NFT.STORAGE API key',
      onState: (state) => {
        if (state.aborted) {
          process.nextTick(() => {
            process.exit(0);
          })
        }
      }
    });
    await nuron.configure({
      ipfs: { key: response.value }
    })
    return response.value
  }
}
const pass = async () => {
  const response = await prompts({
    type: 'password',
    name: 'value',
    message: 'enter wallet encryption password',
    onState: (state) => {
      if (state.aborted) {
        process.nextTick(() => {
          process.exit(0);
        })
      }
    }
  });
  return response.value
}
const walletpath = async () => {
  const response = await prompts({
    type: 'text',
    name: "value",
    message: 'enter wallet BIP44 derivation path',
    onState: (state) => {
      if (state.aborted) {
        process.nextTick(() => {
          process.exit(0);
        })
      }
    }
  });
  return response.value
}
const walletseed = async () => {
  const response = await prompts({
    type: 'text',
    name: "value",
    message: 'enter wallet seed phrase',
    onState: (state) => {
      if (state.aborted) {
        process.nextTick(() => {
          process.exit(0);
        })
      }
    }
  });
  return response.value
}
const walletusername = async () => {
  const response = await prompts({
    type: 'text',
    name: "value",
    message: 'enter username',
    onState: (state) => {
      if (state.aborted) {
        process.nextTick(() => {
          process.exit(0);
        })
      }
    }
  });
  return response.value
}
const exporter = async (account) => {
  const response = await prompts({
    type: 'select',
    name: 'value',
    hint: " ",
    message: `${account} what do you want to do?`,
    choices: [
      { title: "export seed", description: "export the seed phrase for the entire wallet", value: "all" },
      { title: "export private key", description: "export a single private key at a specific BIP44 derivation path", value: "path" },
      { title: "cancel", value: null }
    ],
    onState: (state) => {
      if (state.aborted) {
        process.nextTick(() => {
          process.exit(0);
        })
      }
    }
  });
  if (response.value === "all") {
    let password = await pass()
    try {
      let res = await nuron.wallet.export(password)
      console.log(res)
    } catch (e) {
      console.log("⚠️  " + e.message)
    }
  } else if (response.value === "path") {
    try {
      let path = await walletpath()
      let password = await pass()
      let res = await nuron.wallet.export(password, path)
      console.log(res)
    } catch (e) {
      console.log("⚠️  " + e.message)
    }
  }
}
const connector = async (account) => {
  const accounts = await nuron.wallet.accounts()
  const response = await prompts({
    type: 'select',
    name: 'value',
    hint: " ",
    message: `${account} what do you want to do?`,
    choices: accounts.map((x) => {
      return {
        title: x,
        value: x
      }
    }),
    onState: (state) => {
      if (state.aborted) {
        process.nextTick(() => {
          process.exit(0);
        })
      }
    }
  });
  let username = response.value
  try {
    let password = await pass()
    await nuron.wallet.connect(password, username)
    console.log("🟩 logged in!")
  } catch (e) {
    console.log("⚠️  " + e.message)
  }
}
// - when logged out
//  - login
//  - import seed
//  - generate seed
// - when logged in
//  - logout
//  - delete seed
//  - export seed
const menu = async () => {
  let session = await nuron.wallet.session()
  let options;
  if (session && session.username) {
    options = [
      { title: "logout wallet", description: "log out of this wallet", value: "disconnect" },
      { title: "export wallet", description: "export this wallet", value: "export" },
      { title: "delete wallet", description: "delete the " + session.username + " wallet (warning: can't be reverted)", value: "delete" },
      { title: "IPFS config", description: "set the API key for nft.storage", value: "nftstorage" },
      { title: "exit", description: "exit to terminal", value: "exit" },
    ]
  } else {
    options = [
      { title: "login wallet", description: "connect to an account", value: "connect" },
      { title: "import wallet", description: "import a wallet", value: "import" },
      { title: "generate wallet", description: "generate a new wallet", value: "generate" },
      { title: "IPFS config", description: "set the API key for nft.storage", value: "nftstorage" },
      { title: "exit", description: "exit to terminal", value: "exit" },
    ]
  }
  let account = (session && session.username ? "[" + session.username + "]" : "[logged out]")
  const response = await prompts({
    type: 'select',
    name: 'value',
    hint: " ",
    message: `${account} what do you want to do?`,
    choices: options,
    onState: (state) => {
      if (state.aborted) {
        process.nextTick(() => {
          process.exit(0);
        })
      }
    }
  });

  if (response.value === "connect") {
    await connector()
  } else if (response.value === "delete") {
    let password = await pass()
    await nuron.wallet.delete(password)
    console.log("🟩 delete success")
  } else if (response.value === "export") {
    await exporter(account)
  } else if (response.value === "import") {
    let seed = await walletseed()
    let username = await walletusername()
    let password = await pass()
    await nuron.wallet.import(password, seed, username)
    console.log("🟩 wallet imported!")
  } else if (response.value === "generate") {
    let username = await walletusername()
    let password = await pass()
    let { generated } = await nuron.wallet.generate(password, username)
    console.log("🟩 wallet generated!")
    console.log(generated)
  } else if (response.value === "disconnect") {
    await nuron.wallet.disconnect()
    console.log("🟩 logged out!")
  } else if (response.value === "nftstorage") {
    let key = await nftstorage()
    if (key) {
      console.log("API KEY set: " + key)
    }
  } else if (response.value === "exit") {
    process.exit(0);
  }

  session = await nuron.wallet.session()
  if (!session.username || session.username.error) {
    account = "[logged out]"
  } else {
    account = (session.username ? "[" + session.username + "]" : "[logged out]")
  }
  const response2 = await prompts({
    type: 'toggle',
    name: 'value',
    message: `${account} run another command?`,
    initial: true,
    active: "no",
    inactive: "yes",
    onState: (state) => {
      if (state.aborted) {
        process.nextTick(() => {
          process.exit(0);
        })
      }
    }
  });

  if (!response2.value) {
    await menu()
  }

}
const config = () => {
  console.clear()
  menu()
}
module.exports = config
