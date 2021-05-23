import { FaGithub, FaTwitter } from 'react-icons/fa';
import styles from '../styles/General.module.css';

const TwitterSocial = () => (
  <a
    href="https://twitter.com/jamezrin"
    style={{
      ['--hover-color' as any]: '#00acee',
    }}>
    <FaTwitter />
  </a>
);

const GithubSocial = () => (
  <a
    href="https://github.com/jamezrin"
    style={{
      ['--hover-color' as any]: '#afb5bb',
    }}>
    <FaGithub />
  </a>
);

const SocialLinks = () => (
  <div className={styles.links}>
    <TwitterSocial />
    <GithubSocial />
  </div>
);

export default SocialLinks;
