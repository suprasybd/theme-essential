import styles from './ui.module.scss';

/* eslint-disable-next-line */
export interface UiProps {}

export function Ui(props: UiProps) {
  return (
    <div className={styles['container']}>
      <h1 className="text-blue-400">Welcome to Ui!</h1>
    </div>
  );
}

export default Ui;
