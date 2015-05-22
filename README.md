# Repovault
> Store your keys or passwords in software repository with security

### To install
```bash
npm install -g repovault
```

### To encrypt data
```bash
repovault [PASSWORD] [DATA]
```

### To decrypt data
```bash
repovault [PASSWORD]
```

### Example
```bash
$ repovault 123456 "The password of money vault is: 42"

$ repovault 123456
The password of money vault is: 42
```

## License

Repovault is released under the [MIT License](https://github.com/felipefdl/repovault/blob/master/LICENSE).
