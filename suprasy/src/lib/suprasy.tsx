import styles from './suprasy.module.scss';

/* eslint-disable-next-line */
export interface SuprasyProps {}

export function Suprasy(props: SuprasyProps) {
  return (
    <div className={styles['container']}>
      <h1>Welcome to Suprasy!</h1>
    </div>
  );
}

export default Suprasy;
