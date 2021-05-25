import cx from 'clsx';
import { FaGithub, FaTwitter } from 'react-icons/fa';

const TwitterSocial = () => (
  <a href="https://twitter.com/jamezrin" className={cx('hover:text-blue-400')}>
    <FaTwitter />
  </a>
);

const GithubSocial = () => (
  <a href="https://github.com/jamezrin" className={cx('hover:text-gray-400')}>
    <FaGithub />
  </a>
);

const SocialLinks = () => (
  <div className={cx('p-2 flex bg-brand-primary gap-2')}>
    <TwitterSocial />
    <GithubSocial />
  </div>
);

export default SocialLinks;
