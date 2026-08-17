import process from 'node:process';
import { spawn } from 'node:child_process';

const port = process.env.PORT ?? '3000';

const child = spawn(
  process.execPath,
  ['./node_modules/serve/build/main.js', '-s', 'dist', '-l', `tcp://0.0.0.0:${port}`],
  { stdio: 'inherit' },
);

child.on('exit', (code) => {
  process.exit(code ?? 0);
});
