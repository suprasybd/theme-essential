// eslint-disable-next-line @typescript-eslint/no-unused-vars
import styles from './app.module.scss';

import { Button } from '@/components/ui';
import NxWelcome from './nx-welcome';

export function App() {
  return (
    <div>
      <Button variant={'destructive'}> Submit Form</Button>
      <NxWelcome title="web" />
    </div>
  );
}

export default App;
